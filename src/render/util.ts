/**
 * Function for concatination an array into a natural language sentence
 * @param arr array with elements of string or number
 * @returns string with elements concatenated with commas and 'and'
 * E.g., if arr is ['first', 'second', 'third'], this will return 'first, second and third'
 */
export function arrayToString(arr: (string | number | undefined)[]): string {
    arr = arr.filter(a => a !== undefined);
    if (arr.length === 0) {
        return '';
    }

    if (arr.length === 1) {
        return arr[0] as string;
    }

    return `${arr.slice(0, -1).join(', ')} and ${arr.slice(-1)}`;
}