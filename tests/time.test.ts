import { test } from 'node:test';
import assert from 'node:assert/strict';
import { to24h } from '../src/data/time.ts';

test('converts menu-board times to 24h', () => {
  assert.equal(to24h('11 AM'), '11:00');
  assert.equal(to24h('9 PM'), '21:00');
  assert.equal(to24h('10 pm'), '22:00');
  assert.equal(to24h('12 AM'), '00:00');
  assert.equal(to24h('12 PM'), '12:00');
  assert.equal(to24h('9:30 PM'), '21:30');
});

test('returns null for text it cannot read', () => {
  assert.equal(to24h('Closed'), null);
  assert.equal(to24h('13 PM'), null);
  assert.equal(to24h(''), null);
});
