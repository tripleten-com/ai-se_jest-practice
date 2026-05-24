import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import { check, printResults, PROJECT_ROOT } from './utils.js';

async function main() {
  console.log('Lesson 04 — Writing a Simple Test File\n');

  const results = [];

  const testFilePath = path.join(PROJECT_ROOT, '__tests__/isValidPost.test.ts');
  const testFileSrc = fs.existsSync(testFilePath)
    ? fs.readFileSync(testFilePath, 'utf8')
    : '';

  results.push(
    check(
      '__tests__/isValidPost.test.ts exists',
      fs.existsSync(testFilePath),
      'Create __tests__/isValidPost.test.ts for your tests.',
    ),
  );

  results.push(
    check(
      'test file imports isValidPost',
      testFileSrc.includes('isValidPost'),
      'Import isValidPost from ../src/utils/validate.js at the top of your test file.',
    ),
  );

  const testCount = (testFileSrc.match(/\btest\s*\(/g) || []).length;
  results.push(
    check(
      'test file has at least 3 tests',
      testCount >= 3,
      'Write at least three tests as described in the coding task.',
    ),
  );

  results.push(
    check(
      'expect(isValidPost(...)) is used in tests',
      /expect\s*\(\s*isValidPost\s*\(/.test(testFileSrc),
      'Call isValidPost() inside expect(): expect(isValidPost({ title: ..., content: ... })).',
    ),
  );

  results.push(
    check(
      'has a .toBe(true) assertion',
      testFileSrc.includes('toBe(true)'),
      'Add a test where isValidPost returns true for valid input: expect(...).toBe(true).',
    ),
  );

  results.push(
    check(
      'has a .toBe(false) assertion',
      testFileSrc.includes('toBe(false)'),
      'Add a test where isValidPost returns false for invalid input: expect(...).toBe(false).',
    ),
  );

  let testError = false;
  if (fs.existsSync(testFilePath)) {
    const result = spawnSync(
      'npm',
      ['test', '--', '--testPathPatterns=isValidPost', '--passWithNoTests'],
      { cwd: PROJECT_ROOT, encoding: 'utf8' },
    );
    testError = result.status !== 0;
  }

  results.push(
    check(
      'npm test passes for isValidPost',
      !testError,
      'Run npm test and fix any failing tests.',
    ),
  );

  printResults(results, 'TESTS');
}

main().catch((err) => {
  console.log('');
  console.log(`❌ Test runner error: ${err.message}`);
  console.log('');
  process.exit(1);
});
