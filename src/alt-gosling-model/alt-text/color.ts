import { GetColorName } from 'hex-color-to-color-name';

// Converting colors to names

export function getColorName(color: string, simple?: boolean): string {
    color = color.replace('#', '');
    if (!simple) {
        return GetColorName(color).toLowerCase();
    } else {
        return findClosestColorName(color);
    }
}

function hexToRgb(hex: string) {
    if (hex.length === 3) {
        hex = hex.split('').map(c => c + c).join('');
    }
    if (hex.length !== 6) {
        throw new Error(`Invalid hex color: ${hex}`);
    }

    const rgb = [0, 0, 0];
    return rgb.map((_, i) => parseInt(hex.slice(i * 2, i * 2 + 2), 16));
}

const colors = [
    { name: 'black', hex: '#000000', rgb: [0, 0, 0] },
    { name: 'dark green', hex: '#008000', rgb: [0, 128, 0] },
    { name: 'silver', hex: '#C0C0C0', rgb: [192, 192, 192] },
    { name: 'bright green', hex: '#00FF00', rgb: [0, 255, 0] },
    { name: 'gray', hex: '#808080', rgb: [128, 128, 128] },
    { name: 'olive', hex: '#808000', rgb: [128, 128, 0] },
    { name: 'white', hex: '#FFFFFF', rgb: [255, 255, 255] },
    { name: 'yellow', hex: '#FFFF00', rgb: [255, 255, 0] },
    { name: 'maroon', hex: '#800000', rgb: [128, 0, 0] },
    { name: 'navy', hex: '#000080', rgb: [0, 0, 128] },
    { name: 'red', hex: '#FF0000', rgb: [255, 0, 0] },
    { name: 'dark blue', hex: '#0000FF', rgb: [0, 0, 255] },
    { name: 'purple', hex: '#800080', rgb: [128, 0, 128] },
    { name: 'teal', hex: '#008080', rgb: [0, 128, 128] },
    { name: 'pink', hex: '#FF00FF', rgb: [255, 0, 255] },
    { name: 'light blue', hex: '#00FFFF', rgb: [0, 255, 255] },

    // gosling colors
    { name: 'orange', hex: '#E79F00', rgb: [231, 159, 0] },
    { name: 'green', hex: '#029F73', rgb: [2, 159, 115] },
    { name: 'navy blue', hex: '#0072B2', rgb: [0, 114, 178] },
    { name: 'pink', hex: '#CB7AA7', rgb: [203, 122, 167] },
    { name: 'dark orange', hex: '#D45E00', rgb: [212, 94, 0] },
    { name: 'sky blue', hex: '#57B4E9', rgb: [87, 180, 233] },
    { name: 'yellow', hex: '#EFE441', rgb: [239, 228, 65] },
];


function colorDistance(c1: number[], c2: number[]) {
    return Math.sqrt((c1[0] - c2[0]) ** 2 + (c1[1] - c2[1]) ** 2 + (c1[2] - c2[2]) ** 2);
}

function findClosestColorName(hex: string) {
    const exactColor = colors.find(color => color.hex.toLowerCase().slice(0) === hex.toLowerCase());
    if (exactColor) {
        return exactColor.name;
    }

    const targetRgb = hexToRgb(hex);
    if (!targetRgb) return "unknown color";

    let closestColor = "";
    let minDistance = Number.MAX_VALUE;

    for (const color of colors) {
        const distance = colorDistance(color.rgb, targetRgb);
        if (distance < minDistance) {
            minDistance = distance;
            closestColor = color.name;
        }
    }
    return closestColor;
}


