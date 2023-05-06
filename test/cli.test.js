const { execSync } = require('child_process');
const { test } = require('node:test');
const assert = require('assert');
const path = require('path');

const CLI_PATH = path.join(__dirname, '..', 'svgs-to-icons.js');

test('CLI smoke test - help flag', () => {
  const result = execSync(`node "${CLI_PATH}" --help`, { encoding: 'utf8' });
  assert(result.includes('Convert SVG files to CSS classes'));
  assert(result.includes('Usage:'));
  assert(result.includes('--output'));
  assert(result.includes('--prefix'));
  assert(result.includes('--postfix'));
});

test('CLI smoke test - version flag', () => {
  const result = execSync(`node "${CLI_PATH}" --version`, { encoding: 'utf8' });
  assert(result.includes('0.1.0'));
});

test('CLI smoke test - missing input directory', () => {
  try {
    execSync(`node "${CLI_PATH}"`, { encoding: 'utf8', stdio: 'pipe' });
    assert.fail('Should have thrown an error');
  } catch (error) {
    assert(error.status === 1);
    assert(error.stderr.includes('error: missing required argument'));
  }
});

test('CLI smoke test - nonexistent input directory', () => {
  try {
    execSync(`node "${CLI_PATH}" /nonexistent/path`, { encoding: 'utf8', stdio: 'pipe' });
    assert.fail('Should have thrown an error');
  } catch (error) {
    assert(error.status === 1);
    assert(error.stderr.includes('does not exist'));
  }
});