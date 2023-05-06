const { test, describe } = require('node:test');
const assert = require('node:assert');
const { SvgIconProcessor } = require('../svgs-to-icons-core.js');

describe('createSafeCssClassName', () => {
  test('removes file extension', () => {
    const processor = new SvgIconProcessor({});
    assert.strictEqual(processor.createSafeCssClassName('home.svg'), 'home');
    assert.strictEqual(processor.createSafeCssClassName('user-profile.svg'), 'user-profile');
    assert.strictEqual(processor.createSafeCssClassName('icon.file.svg'), 'icon-file');
  });

  test('converts to lowercase', () => {
    const processor = new SvgIconProcessor({});
    assert.strictEqual(processor.createSafeCssClassName('HOME.svg'), 'home');
    assert.strictEqual(processor.createSafeCssClassName('UserIcon.svg'), 'usericon');
  });

  test('replaces special characters with hyphens', () => {
    const processor = new SvgIconProcessor({});
    assert.strictEqual(processor.createSafeCssClassName('user@home.svg'), 'user-home');
    assert.strictEqual(processor.createSafeCssClassName('icon with spaces.svg'), 'icon-with-spaces');
    assert.strictEqual(processor.createSafeCssClassName('my_icon!.svg'), 'my_icon');
  });

  test('removes leading hyphens', () => {
    const processor = new SvgIconProcessor({});
    assert.strictEqual(processor.createSafeCssClassName('-home.svg'), 'home');
    assert.strictEqual(processor.createSafeCssClassName('---user.svg'), 'user');
  });

  test('removes trailing hyphens', () => {
    const processor = new SvgIconProcessor({});
    assert.strictEqual(processor.createSafeCssClassName('home-.svg'), 'home');
    assert.strictEqual(processor.createSafeCssClassName('user---.svg'), 'user');
  });

  test('collapses multiple hyphens', () => {
    const processor = new SvgIconProcessor({});
    assert.strictEqual(processor.createSafeCssClassName('user---home.svg'), 'user-home');
    assert.strictEqual(processor.createSafeCssClassName('icon--with--dashes.svg'), 'icon-with-dashes');
  });

  test('prefixes numbers with "i"', () => {
    const processor = new SvgIconProcessor({});
    assert.strictEqual(processor.createSafeCssClassName('123.svg'), 'i123');
    assert.strictEqual(processor.createSafeCssClassName('9home.svg'), 'i9home');
  });

  test('handles empty or whitespace filenames', () => {
    const processor = new SvgIconProcessor({});
    assert.strictEqual(processor.createSafeCssClassName(''), 'unnamed');
    assert.strictEqual(processor.createSafeCssClassName('.svg'), 'unnamed-1');
    assert.strictEqual(processor.createSafeCssClassName('   .svg'), 'unnamed-2');
  });

  test('handles edge cases that result in empty strings', () => {
    const processor = new SvgIconProcessor({});
    assert.strictEqual(processor.createSafeCssClassName('-.svg'), 'unnamed');
    assert.strictEqual(processor.createSafeCssClassName('_.svg'), 'unnamed-1');
    assert.strictEqual(processor.createSafeCssClassName('@#$.svg'), 'unnamed-2');
  });

  test('preserves underscores and hyphens', () => {
    const processor = new SvgIconProcessor({});
    assert.strictEqual(processor.createSafeCssClassName('my_icon-home.svg'), 'my_icon-home');
    assert.strictEqual(processor.createSafeCssClassName('icon_test-case.svg'), 'icon_test-case');
  });

  test('handles collisions with numeric suffixes', () => {
    // Create new processor for clean state
    const collisionProcessor = new SvgIconProcessor({});
    
    // First occurrence gets no suffix
    assert.strictEqual(collisionProcessor.createSafeCssClassName('home.svg'), 'home');
    
    // Second occurrence gets -1 suffix (uppercase version)
    assert.strictEqual(collisionProcessor.createSafeCssClassName('HOME.svg'), 'home-1');
    
    // Third occurrence gets -2 suffix (mixed case with punctuation becomes 'home')
    assert.strictEqual(collisionProcessor.createSafeCssClassName('Home@.svg'), 'home-2');
    
    // Different base name starts fresh
    assert.strictEqual(collisionProcessor.createSafeCssClassName('user.svg'), 'user');
    assert.strictEqual(collisionProcessor.createSafeCssClassName('USER.svg'), 'user-1');
  });

  test('handles unnamed collisions', () => {
    const unnamedProcessor = new SvgIconProcessor({});
    
    // Multiple files that become "unnamed"
    assert.strictEqual(unnamedProcessor.createSafeCssClassName('.svg'), 'unnamed');
    assert.strictEqual(unnamedProcessor.createSafeCssClassName('@#$.svg'), 'unnamed-1');
    assert.strictEqual(unnamedProcessor.createSafeCssClassName('-.svg'), 'unnamed-2');
  });
});