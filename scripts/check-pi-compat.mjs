import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const source = readFileSync(new URL('../index.ts', import.meta.url), 'utf8');

assert.equal(pkg.peerDependencies?.['@earendil-works/pi-coding-agent'], '*');
assert.equal(pkg.peerDependencies?.['@earendil-works/pi-tui'], '*');
assert.equal(pkg.peerDependencies?.['@mariozechner/pi-coding-agent'], undefined);
assert.equal(pkg.peerDependencies?.['@mariozechner/pi-tui'], undefined);
assert.match(source, /from\s+["']@earendil-works\/pi-coding-agent["']/);
assert.match(source, /from\s+["']@earendil-works\/pi-tui["']/);
assert.doesNotMatch(source, /@mariozechner\//);
assert.doesNotMatch(source, /keyHint\(["']expandTools["']/);

console.log('Pi compatibility metadata is current.');
