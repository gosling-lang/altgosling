export function arrayToString(arr: string[] | number[]): string {
    if (arr.length === 1) {
        return arr[0] as string;
    } else {
        return arr.slice(0, -1).join(', ') + ' and ' + arr.slice(-1);
    } 
}

export function booleanToString(b: boolean): string {
    if (b) {
        return 'true';
    } else {
        return 'false';
    }
}