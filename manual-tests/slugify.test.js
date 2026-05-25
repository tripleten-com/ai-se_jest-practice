import { slugify } from '../src/utils/slugify.js';
function test(description, fn) {
  try {
    fn();
    console.log(`✓ ${description}`);
  } catch (err) {
    console.error(`✗ ${description}: ${err.message}`);
  }
}
function expect(actual) {
  return {
    toBe(expected) {
      if (actual !== expected) {
        throw new Error(`Expected ${String(expected)}, got ${String(actual)}`);
      }
    },
  };
}
test('converts spaces to hyphens', () => {
  expect(slugify('Hello World')).toBe('hello-world');
});
test('lowercases the title', () => {
  expect(slugify('My Post')).toBe('my-post');
});
test('removes special characters', () => {
  expect(slugify('My Post!')).toBe('my-post');
});
test('returns an empty string for empty input', () => {
  expect(slugify('')).toBe('');
});
//# sourceMappingURL=slugify.test.js.map
