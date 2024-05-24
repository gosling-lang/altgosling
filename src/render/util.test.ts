import { expect, test } from 'vitest';
import { arrayToString } from './util';

// arrayToString
test('arrayToString returns empty string if no elements', () => {
    expect(arrayToString([])).toBe('');
});

test('arrayToString returns element as string if only one element', () => {
    expect(arrayToString(['one'])).toBe('one');
});

test('arrayToString returns elements concatenated with "and" if two elements', () => {
    expect(arrayToString(['one', 'two'])).toBe('one and two');
});

test('arrayToString returns elements concatenated with commas and "and" if more than two elements', () => {
    expect(arrayToString(['one', 'two', 'three'])).toBe('one, two and three');
});

test('arrayToString converts numbers to strings', () => {
    expect(arrayToString(['one', 2, 'three'])).toBe('one, 2 and three');
});
