#!/usr/bin/env node
// Measurable quality gate — checks the numbers in openspec/project.md against
// the actual build output. Run after `next build` (see harness/verify.sh).
import { readFileSync, existsSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { join } from 'node:path';

const ROOT = new URL('../..', import.meta.url).pathname;
const BUNDLE_THRESHOLD_KB = 250;

function fail(message) {
  console.error(`✘ ${message}`);
  process.exitCode = 1;
}

const manifestPath = join(ROOT, '.next/build-manifest.json');
if (!existsSync(manifestPath)) {
  fail(`missing ${manifestPath} — run \`next build\` before verify:quality`);
  process.exit(1);
}

const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const sharedFiles = [...(manifest.rootMainFiles ?? []), ...(manifest.polyfillFiles ?? [])];
if (sharedFiles.length === 0) {
  fail('no shared JS files found in build-manifest.json (rootMainFiles/polyfillFiles)');
  process.exit(1);
}

let totalGzipBytes = 0;
for (const file of sharedFiles) {
  const filePath = join(ROOT, '.next', file);
  if (existsSync(filePath)) {
    totalGzipBytes += gzipSync(readFileSync(filePath)).length;
  }
}

const totalKb = totalGzipBytes / 1024;
console.log(`Shared JS bundle (gzip): ${totalKb.toFixed(1)} kB (threshold: ${BUNDLE_THRESHOLD_KB} kB)`);

if (totalKb > BUNDLE_THRESHOLD_KB) {
  fail(`shared JS bundle ${totalKb.toFixed(1)} kB (gzip) exceeds ${BUNDLE_THRESHOLD_KB} kB threshold`);
  process.exit(1);
}

console.log('✔ quality thresholds met');
