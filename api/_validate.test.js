import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isValidBreakdownResponse } from './_validate.js';

test('accepts a well-formed breakdown response', () => {
  assert.equal(
    isValidBreakdownResponse({
      missions: [{ title: 'Open the file', action_text: 'Just open it.', drafted_content: null }],
      panda_dialogue: 'Okay. One thing.',
      energy_cost: 20,
      refusal: false,
    }),
    true
  );
});

test('accepts a valid refusal response with empty missions', () => {
  assert.equal(
    isValidBreakdownResponse({
      missions: [],
      panda_dialogue: "That's it for today. Go rest.",
      energy_cost: 0,
      refusal: true,
    }),
    true
  );
});

test('rejects more than 4 missions', () => {
  const missions = Array.from({ length: 5 }, (_, i) => ({
    title: `Mission ${i}`,
    action_text: 'Do it',
    drafted_content: null,
  }));
  assert.equal(
    isValidBreakdownResponse({ missions, panda_dialogue: 'Too many.', energy_cost: 40, refusal: false }),
    false
  );
});

test('rejects missing panda_dialogue', () => {
  assert.equal(
    isValidBreakdownResponse({ missions: [], panda_dialogue: '', energy_cost: 0, refusal: true }),
    false
  );
});

test('rejects a mission missing required fields', () => {
  assert.equal(
    isValidBreakdownResponse({
      missions: [{ title: 'Only a title' }],
      panda_dialogue: 'Hm.',
      energy_cost: 10,
      refusal: false,
    }),
    false
  );
});

test('rejects non-object input', () => {
  assert.equal(isValidBreakdownResponse(null), false);
  assert.equal(isValidBreakdownResponse('not json'), false);
});
