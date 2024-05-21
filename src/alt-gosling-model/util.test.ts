import { expect, test } from 'vitest';
import { attributeExists, attributeExistsReturn, arrayToString, capDesc, chrNumberOnly, countOccurences } from './util';

// attributeExists
const obj = {
    name: "test",
    value: 1,
    2: 2
}

test('attributeExists returns false if attribute is not on object', () => {
    expect(attributeExists(obj, 'doesnotexist')).toBe(false);
});

test('attributeExists returns true if attribute is on object', () => {
    expect(attributeExists(obj, 'name')).toBe(true);
});

test('attributeExists returns true if attribute is on object and attribute is number', () => {
    expect(attributeExists(obj, '2')).toBe(true);
});

// attributeExistsReturn
test('attributeExistsReturn returns value of attribute', () => {
    expect(attributeExistsReturn(obj, 'value')).toBe(1);
});

test('attributeExistsReturn returns undefined if attribute not on object', () => {
    expect(attributeExistsReturn(obj, 'doesnotexist')).toBe(undefined);
});

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

// capDesc
test('capDesc capitalizes words', () => {
    expect(capDesc('one two three')).toBe('One two three');
});

test('capDesc doesn\'t affect numbers', () => {
    expect(capDesc(`${1} one two three`)).toBe('1 one two three');
});

// chrNumbersOnly
test('chrNumbersOnly removes chr from strings', () => {
    expect(chrNumberOnly('chr1')).toBe('1');
});

test('chrNumbersOnly doesn\'t affect strings without chr', () => {
    expect(chrNumberOnly('1')).toBe('1');
});

// countOccurences
test('countOccurences returns 0 if no match', () => {
    expect(countOccurences(['one', 'two'], 'no')).toBe(0);
});

test('countOccurences returns number of matches', () => {
    expect(countOccurences(['one', 'two', 'no', 'three', 'no'], 'no')).toBe(2);
});

test('countOccurences doesn\'t pick up partial matches', () => {
    expect(countOccurences(['one', 'two', 'no', 'three', 'no'], 'n')).toBe(0);
});