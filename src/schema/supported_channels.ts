import type { ChannelTypes } from './gosling.schema';

export const SUPPORTED_CHANNELS: (keyof typeof ChannelTypes)[] = [
    'x',
    'xe',
    'x1',
    'x1e',

    'y',
    'ye',
    'y1',
    'y1e',

    'color',
    'size',
    'row',
    'stroke',
    'strokeWidth',
    'opacity',
    'text'
    // ...
];