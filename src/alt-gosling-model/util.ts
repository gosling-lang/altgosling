/**
 * Returns whether the attribute is an attribute of the object
 * @param object 
 * @param attribute 
 * @returns true is attribute is attribute in object, false otherwise
 */
export function attributeExists(object: any, attribute: any): boolean {
    return(attribute in object);
}

/**
 * Returns the attribute in the object.
 * The function of this function is to override the TS errors thrown if attribute is not always present in object
 * This function should be used with care
 * @param object 
 * @param attribute 
 * @returns value of attribute
 */
export function attributeExistsReturn(object: any, attribute: any) {
    return(object[attribute]);
}

// export function attributeExistsDefaultString(field: any, defaultValue: string) {
//     if(field !== 'unknown')
//         return field as string;
//     else {
//         return defaultValue;
//     }
// }

// export function attributeHasChildValue(object: any, attribute: any, attributeChild: any, value: any) {
//     return(object[attribute][attributeChild] === value);
// };

// export function attributeExistsAndChildHasValue(object: any, attribute: any, attributeChild: any, value: any) {
//     return(attributeExists(object, attribute) && attributeHasChildValue(object, attribute, attributeChild, value));
// };

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
 * Function for capitalising the first letter of the string.
 * @param desc string
 * @returns string with first letter capitalized.
 * E.g., if string is 'hello world', this will return 'Hello world'
 */
export function capDesc(desc: string): string {
    return desc[0].toUpperCase() + desc.slice(1);
}

/**
 * Mapping from mark name to a natural language description of said mark
 */
export const markToText = new Map([['point', 'points'], ['line', 'lines'], ['bar', 'bars'], ['rect', 'rectangles'], ['area', 'area displayed'], ['withinLink', 'connections'], ['betweenLink', 'connections'], ['triangleLeft', 'triangles'], ['triangleRight', 'triangles'], ['triangleBottom', 'triangles'], ['text', 'text'], ['rule', 'lines'], ['brush', 'with linked view']]);

/**
 * Mapping of channel name to a natural language description of said channel
 */
export const channelToText = new Map([['y', 'height'], ['color', 'color'], ['strokeWidth', 'stroke width'], ['opacity', 'opacity'], ['text', 'text'], ['size', 'size']]);

/**
 * Function to remove the suffix 'chr' from a string if present
 * @param chr string with chromosome information
 * @returns string without 'chr'
 * E.g., if string is 'chr3', it will return '3'. If string is '3', it will also return '3'.
 */
export function chrNumberOnly(chr: string): string {
    if (chr.includes('chr')) {
        chr = chr.replace('chr', '');
        return chr;
    } else {
        return chr;
    }
}

/**
 * Count the occurence of a string in an array of string
 * @param array array with string to be searched
 * @param value string to be matched in the array
 * @returns number of occurences
 */
export function countOccurences(array: string[], value: string) {
    return array.filter((v) => (v === value)).length;
}

/**
 * Use exponential notation for numbers with more than 3 characters.
 * @param n number
 * @returns the number as exponential notation with 2 decimals.
 */
export function summarizeValueNumber(n: number | string) {
    if (typeof n === 'string') {
        n = Number.parseFloat(n);
    }
    if (n.toString().length < 3) {
        return n;
    }
    return n.toExponential(2);
}
