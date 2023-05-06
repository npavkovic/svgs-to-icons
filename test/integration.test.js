const { test, describe, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

describe('CLI Integration Tests', () => {
  const testDir = path.join(__dirname, 'temp-test-dir');
  const svgContent = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>';

  beforeEach(() => {
    // Create test directory with sample SVG
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
    fs.mkdirSync(testDir, { recursive: true });
    fs.writeFileSync(path.join(testDir, 'home.svg'), svgContent);
  });

  afterEach(() => {
    // Clean up test directory
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  function runCLI(args) {
    return new Promise((resolve, reject) => {
      const child = spawn('node', [path.join(__dirname, '../svgs-to-icons.js'), ...args], {
        stdio: 'pipe'
      });

      let stdout = '';
      let stderr = '';

      child.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('close', (code) => {
        resolve({ code, stdout, stderr });
      });

      child.on('error', (error) => {
        reject(error);
      });
    });
  }

  test('processes valid input directory successfully', async () => {
    const result = await runCLI([testDir]);
    
    assert.strictEqual(result.code, 0, `CLI failed with stderr: ${result.stderr}`);
    assert.match(result.stdout, /Successfully processed SVG icons/);
    assert.match(result.stdout, /Processed 1 SVG files/);
    
    // Verify output files were created
    const outputDir = path.join('dist', path.basename(testDir));
    assert.ok(fs.existsSync(outputDir), 'Output directory should exist');
    assert.ok(fs.existsSync(path.join(outputDir, 'embedded-icons')), 'Embedded icons directory should exist');
    assert.ok(fs.existsSync(path.join(outputDir, 'referenced-icons')), 'Referenced icons directory should exist');
    
    // Clean up
    fs.rmSync('dist', { recursive: true, force: true });
  });

  test('fails with non-existent input directory', async () => {
    const result = await runCLI(['/non/existent/path']);
    
    assert.notStrictEqual(result.code, 0);
    assert.match(result.stderr, /Input directory does not exist/);
  });

  test('fails with missing input argument', async () => {
    const result = await runCLI([]);
    
    assert.notStrictEqual(result.code, 0);
    assert.match(result.stderr, /error: missing required argument 'input'/);
  });

  test('accepts custom output directory', async () => {
    const customOutput = path.join(__dirname, 'custom-output');
    const result = await runCLI([testDir, '--output', customOutput]);
    
    assert.strictEqual(result.code, 0, `CLI failed with stderr: ${result.stderr}`);
    
    // Verify output was created in custom location
    const expectedOutput = path.join(customOutput, path.basename(testDir));
    assert.ok(fs.existsSync(expectedOutput), 'Custom output directory should exist');
    
    // Clean up
    fs.rmSync(customOutput, { recursive: true, force: true });
  });

  test('fails with invalid output directory', async () => {
    // Try to use a file as output directory (should fail)
    const invalidOutput = path.join(__dirname, 'invalid-output-file');
    fs.writeFileSync(invalidOutput, 'this is a file, not a directory');
    
    const result = await runCLI([testDir, '--output', invalidOutput]);
    
    assert.notStrictEqual(result.code, 0);
    assert.match(result.stderr, /ENOTDIR: not a directory|Cannot create output directory|not writable/);
    
    // Clean up
    fs.unlinkSync(invalidOutput);
  });

  test('accepts prefix and postfix options', async () => {
    const result = await runCLI([testDir, '--prefix', 'ui', '--postfix', 'btn']);
    
    assert.strictEqual(result.code, 0, `CLI failed with stderr: ${result.stderr}`);
    
    // Check that CSS file contains prefixed/postfixed class names
    const outputDir = path.join('dist', path.basename(testDir));
    const cssFile = path.join(outputDir, 'embedded-icons', 'icons.css');
    const cssContent = fs.readFileSync(cssFile, 'utf8');
    assert.match(cssContent, /\.ui-home-btn/, 'CSS should contain prefixed and postfixed class name');
    
    // Clean up
    fs.rmSync('dist', { recursive: true, force: true });
  });

  test('fails with invalid prefix', async () => {
    const result = await runCLI([testDir, '--prefix', '123invalid']);
    
    assert.notStrictEqual(result.code, 0);
    assert.match(result.stderr, /prefix must be a valid CSS identifier/);
  });

  test('shows version information', async () => {
    const result = await runCLI(['--version']);
    
    assert.strictEqual(result.code, 0);
    assert.match(result.stdout, /\d+\.\d+\.\d+/); // Should show version number
  });

  test('shows help information', async () => {
    const result = await runCLI(['--help']);
    
    assert.strictEqual(result.code, 0);
    assert.match(result.stdout, /Convert SVG files to CSS classes/);
    assert.match(result.stdout, /Examples:/);
  });
});