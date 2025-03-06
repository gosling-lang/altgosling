import { GetColorName } from 'hex-color-to-color-name';

// Converting colors to names

export function getColorName(color: string, simple?: boolean): string {
    console.log("color", "simple", color, simple);
    color = color.replace('#', '');
    if (simple === undefined || simple === false) {
        return GetColorName(color).toLowerCase();
    } else {
        return findClosestColor(color);
    }
}

function hexToRgb(hex: string) {
    if (hex.length === 3) {
        hex = hex.split('').map(c => c + c).join('');
    }
    if (hex.length !== 6) {
        throw new Error(`Invalid hex color: ${hex}`);
    }

    let rgb = [0, 0, 0];
    rgb = rgb.map((_, i) => parseInt(hex.slice(i * 2, i * 2 + 2), 16));
    return rgb;
}

const colors = {
    "black": [0, 0, 0],
    "green": [0, 128, 0],
    "silver": [192, 192, 192],
    "lime": [0, 255, 0],
    "gray": [128, 128, 128],
    "olive": [128, 128, 0],
    "white": [255, 255, 255],
    "yellow": [255, 255, 0],
    "maroon": [128, 0, 0],
    "navy": [0, 0, 128],
    "red": [255, 0, 0],
    "blue": [0, 0, 255],
    "purple": [128, 0, 128],
    "teal": [0, 128, 128],
    "fuchsia": [255, 0, 255],
    "aqua": [0, 255, 255]
};


function colorDistance(c1: number[], c2: number[]) {
    return Math.sqrt((c1[0] - c2[0]) ** 2 + (c1[1] - c2[1]) ** 2 + (c1[2] - c2[2]) ** 2);
}

function findClosestColor(hex: string) {
    const targetRgb = hexToRgb(hex);
    if (!targetRgb) return "unknown color";

    let closestColor = "";
    let minDistance = Number.MAX_VALUE;

    for (const [name, rgb] of Object.entries(colors)) {
        const distance = colorDistance(rgb, targetRgb);
        if (distance < minDistance) {
            minDistance = distance;
            closestColor = name;
        }
    }
    return closestColor;
}


