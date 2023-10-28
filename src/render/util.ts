export function arrayToString(arr: string[] | number[]): string {
    if (arr.length === 1) {
        return arr[0] as string;
    } else {
        return arr.slice(0, -1).join(', ') + ' and ' + arr.slice(-1);
    } 
}