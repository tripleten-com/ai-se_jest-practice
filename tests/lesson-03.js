import fs from 'fs';
import path from 'path';
import { check, printResults, PROJECT_ROOT } from './utils.js';

async function main() {
  console.log('Lesson 03 — Installing and Configuring Jest\n');

  const results = [];

  const pkg = JSON.parse(
    fs.readFileSync(path.join(PROJECT_ROOT, 'package.json'), 'utf8'),
  );
  const devDeps = pkg.devDependencies || {};

  results.push(
    check(
      'jest is installed',
      'jest' in devDeps,
      'Install jest with: npm install --save-dev jest ts-jest @types/jest',
    ),
  );

  results.push(
    check(
      'ts-jest is installed',
      'ts-jest' in devDeps,
      'Install ts-jest with: npm install --save-dev jest ts-jest @types/jest',
    ),
  );

  results.push(
    check(
      '@types/jest is installed',
      '@types/jest' in devDeps,
      'Install @types/jest with: npm install --save-dev jest ts-jest @types/jest',
    ),
  );

  results.push(
    check(
      'jest.config.js exists',
      fs.existsSync(path.join(PROJECT_ROOT, 'jest.config.js')),
      'Create jest.config.js in the project root as shown in the lesson.',
    ),
  );

  const hasTestScript = pkg.scripts?.test?.includes('jest') ?? false;
  results.push(
    check(
      'package.json has a test script running jest',
      hasTestScript,
      'Add a "test" script to package.json that runs jest, as shown in the lesson.',
    ),
  );

  const tsconfigPath = path.join(PROJECT_ROOT, 'tsconfig.json');
  let tsTypes = [];
  if (fs.existsSync(tsconfigPath)) {
    const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
    tsTypes = tsconfig.compilerOptions?.types ?? [];
  }
  results.push(
    check(
      'tsconfig.json includes "jest" and "node" in types',
      tsTypes.includes('jest') && tsTypes.includes('node'),
      'Add "types": ["jest", "node"] to compilerOptions in tsconfig.json.',
    ),
  );

  printResults(results, 'WRFG');
}

main().catch((err) => {
  console.log('');
  console.log(`❌ Test runner error: ${err.message}`);
  console.log('');
  process.exit(1);
});
