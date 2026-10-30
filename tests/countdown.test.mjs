import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getState, secondsToLondonMidnight, TAGLINES } from '../lib/countdown.js';

const days = (iso) => getState(new Date(iso)).days;

test('op-ed day is 1000, ticking at London midnight (BST)', () => {
  assert.equal(days('2026-10-24T22:59:59Z'), 1001);
  assert.equal(days('2026-10-24T23:00:00Z'), 1000);
});

test('clocks go back on 25 Oct 2026: 01:30 BST and 01:30 GMT are the same day', () => {
  assert.equal(days('2026-10-25T00:30:00Z'), 1000);
  assert.equal(days('2026-10-25T01:30:00Z'), 1000);
  assert.equal(days('2026-10-25T23:59:59Z'), 1000);
  assert.equal(days('2026-10-26T00:00:00Z'), 999);
});

test('30 Oct 2026 is 995', () => {
  assert.equal(days('2026-10-30T12:00:00Z'), 995);
});

test('clocks go forward on 28 Mar 2027: no jump, ticks at 23:00Z', () => {
  const d = days('2027-03-28T00:59:00Z');
  assert.equal(days('2027-03-28T01:00:00Z'), d);
  assert.equal(days('2027-03-28T22:59:59Z'), d);
  assert.equal(days('2027-03-28T23:00:00Z'), d - 1);
});

test('target day switches to ready at 00:00 BST', () => {
  assert.deepEqual(
    [getState(new Date('2029-07-20T22:59:59Z')).days, getState(new Date('2029-07-20T22:59:59Z')).ready],
    [1, false]
  );
  const s = getState(new Date('2029-07-20T23:00:00Z'));
  assert.equal(s.days, 0);
  assert.equal(s.ready, true);
  const after = getState(new Date('2030-01-01T12:00:00Z'));
  assert.ok(after.days < 0 && after.ready);
  assert.ok(TAGLINES.includes(after.tagline));
});

test('isoDate is the London date', () => {
  assert.equal(getState(new Date('2026-10-24T23:30:00Z')).isoDate, '2026-10-25');
});

test('taglines: 30, short, and stable across a London day', () => {
  assert.equal(TAGLINES.length, 30);
  for (const t of TAGLINES) assert.ok(t.length <= 30, t);
  assert.equal(
    getState(new Date('2027-01-10T00:00:00Z')).tagline,
    getState(new Date('2027-01-10T23:59:59Z')).tagline
  );
  assert.notEqual(
    getState(new Date('2027-01-10T12:00:00Z')).tagline,
    getState(new Date('2027-01-11T12:00:00Z')).tagline
  );
});

test('seconds to London midnight', () => {
  assert.equal(secondsToLondonMidnight(new Date('2026-10-24T22:59:00Z')), 60); // BST
  assert.equal(secondsToLondonMidnight(new Date('2026-12-01T23:00:00Z')), 3600); // GMT
});
