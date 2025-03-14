/**
 * Function for concatination an array into a natural language sentence
 * @param arr string or array with elements of string or number
 * @returns string with elements concatenated with commas and 'and'
 * E.g., if arr is ['first', 'second', 'third'], this will return 'first, second and third'
 */
export function arrayToString(arr: string | (string | number | undefined)[]): string {
    if (typeof arr === 'string') {
        return arr;
    }
    arr = arr.filter(a => a !== undefined);
    if (arr.length === 0) {
        return '';
    }

    if (arr.length === 1) {
        return arr[0] as string;
    }

    return `${arr.slice(0, -1).join(', ')} and ${arr.slice(-1)}`;
}


/**
 * Use exponential notation for numbers with more than 3 characters.
 * @param n number or string
 * @returns 
 * If a string, returns the string. 
 * If a number:
 * - If between 1 and 10000, returns rounded number.
 * - If outside of this, and less than 4 characters, returns the same number.
 * - Otherwise, returns the number with scientific / exponential notation with 3 digits.
 */
export function summarizeValueDataTable(n: number | string) {
    if (typeof n === 'string') {
        return n;
    }
    if (n > 1 && n < 10000) {
        return Math.round(n);
    }
    if (n.toString().length < 4) {
        return n;
    }
    if (n < 1) {
        return n.toExponential(2);
    }
    return n;
}
