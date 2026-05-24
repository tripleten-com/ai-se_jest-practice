import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { check, printResults, PROJECT_ROOT } from './utils.js';

async function main() {
  console.log('Lesson 02 — Manual Testing\n');

  const results = [];

  const testFilePath = path.join(
    PROJECT_ROOT,
    'manual-tests/calculateReadTime.test.ts',
  );
  const testFileSrc = fs.existsSync(testFilePath)
    ? fs.readFileSync(testFilePath, 'utf8')
    : '';

  results.push(
    check(
      'manual-tests/calculateReadTime.test.ts exists',
      fs.existsSync(testFilePath),
      'Create manual-tests/calculateReadTime.test.ts for your manual tests.',
    ),
  );

  results.push(
    check(
      'test file imports calculateReadTime',
      testFileSrc.includes('calculateReadTime'),
      'Import calculateReadTime from ../src/utils/readTime.js at the top of your test file.',
    ),
  );

  results.push(
    check(
      'test file defines a test() helper function',
      testFileSrc.includes('function test('),
      'Define a test() helper function in your test file, as shown in the lesson.',
    ),
  );

  results.push(
    check(
      'test file defines an expect() helper function',
      testFileSrc.includes('function expect('),
      'Define an expect() helper function in your test file, as shown in the lesson.',
    ),
  );

  // Run the student's test file and capture output
  let output = '';
  let runError = false;
  let runCrashed = false;
  if (fs.existsSync(testFilePath)) {
    try {
      output = execSync('npx tsx manual-tests/calculateReadTime.test.ts', {
        cwd: PROJECT_ROOT,
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe'],
      });
    } catch (err) {
      output = (err.stdout ?? '') + (err.stderr ?? '');
      runError = true;
      // Stderr output indicates a crash (uncaught exception, import error, etc.)
      // rather than a deliberate process.exit(1) from failing tests.
      runCrashed = !!(err.stderr && err.stderr.trim().length > 0);
    }
  }

  results.push(
    check(
      'test file runs without errors',
      fs.existsSync(testFilePath) && !runCrashed,
      'Running npx tsx manual-tests/calculateReadTime.test.ts should complete without throwing an unhandled error.',
    ),
  );

  results.push(
    check(
      'output includes: "returns 0 for an empty string"',
      output.includes('returns 0 for an empty string'),
      'Write a test with the description "returns 0 for an empty string".',
    ),
  );

  results.push(
    check(
      'output includes: "returns 1 for a 200-word text"',
      output.includes('returns 1 for a 200-word text'),
      'Write a test with the description "returns 1 for a 200-word text".',
    ),
  );

  results.push(
    check(
      'output includes: "rounds up for partial minutes"',
      output.includes('rounds up for partial minutes'),
      'Write a test with the description "rounds up for partial minutes".',
    ),
  );

  results.push(
    check(
      'all tests pass (exit code 0)',
      fs.existsSync(testFilePath) && !runError,
      'All your tests should pass. Make sure your test() helper tracks failures and calls process.exit(1) if any fail. Also check that calculateReadTime returns the expected values.',
    ),
  );

  printResults(results, 'MANUAL');
}

main().catch((err) => {
  console.log('');
  console.log(`❌ Test runner error: ${err.message}`);
  console.log('');
  process.exit(1);
});
