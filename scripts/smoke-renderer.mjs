import assert from 'node:assert/strict';
import { createJiti } from 'jiti';

const jiti = createJiti(import.meta.url);
const extension = await jiti.import(new URL('../index.ts', import.meta.url).pathname, { default: true });

const renderers = new Map();
const commands = new Map();
const handlers = new Map();

extension({
  registerMessageRenderer: (type, renderer) => renderers.set(type, renderer),
  registerCommand: (name, command) => commands.set(name, command),
  on: (event, handler) => handlers.set(event, handler),
  sendMessage: () => {},
});

assert.equal(typeof renderers.get('pi-mermaid'), 'function');
assert.equal(typeof commands.get('pi-mermaid')?.handler, 'function');
assert.equal(typeof handlers.get('input'), 'function');
assert.equal(typeof handlers.get('agent_end'), 'function');

const renderer = renderers.get('pi-mermaid');
const theme = {
  fg: (_key, text) => text,
  bg: (_key, text) => text,
  bold: (text) => text,
};
const message = {
  content: '',
  details: {
    ascii: Array.from({ length: 12 }, (_, index) => `line-${index + 1}`).join('\n'),
    lineCount: 12,
    source: 'graph TD\n  A --> B',
  },
};

for (const expanded of [false, true]) {
  const component = renderer(message, { expanded }, theme);
  assert.equal(typeof component.render, 'function');
  const rendered = component.render(80).join('\n');
  assert.match(rendered, /Mermaid \(ASCII\)/);
  assert.match(rendered, /line-1/);
  if (expanded) {
    assert.match(rendered, /```mermaid/);
    assert.match(rendered, /A --> B/);
  } else {
    assert.match(rendered, /more lines/);
  }
}

console.log('Renderer smoke test passed.');
