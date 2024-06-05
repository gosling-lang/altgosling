import type { ChannelDeep, ChannelValue, ChannelTypes, DataDeep, Mark, Assembly, Layout, Orientation, DataTransform } from './gosling.schema';

/**
 * Values in the form of JSON.
 * Same as in gosling.js
*/
export interface Datum {
    [k: string]: number | string;
}

export type AltCounter = {
    nTracks: number;
    rowViews: number;
    colViews: number;
    allPositions: number[][];
    totalRows: number;
    totalCols: number;
    matrix: number[][];
    serialView: number;
    serialCircular: number[][];
    parallelView: number;
    parallelCircular: number[][];
}

export type AltParentValues = {
    layout: 'linear' | 'circular';
    arrangement: 'parallel' | 'serial' | 'horizontal' | 'vertical';
    alignment: 'singular' | 'stack' | 'overlay';
    data?: DataDeep;
    mark?: Mark;
}

export type AltEncodingSeparated = {
    encodingDeepGenomic: EncodingDeepSingle[];
    encodingDeepQuantitative: EncodingDeepSingle[];
    encodingDeepNominal: EncodingDeepSingle[];
    encodingValue: EncodingValueSingle[];
}

export type EncodingDeepSingle = {
    name: keyof typeof ChannelTypes;
    description: string;
    details: ChannelDeep;
}

export type EncodingValueSingle = {
    name: keyof typeof ChannelTypes;
    description: string;
    details: ChannelValue;
}

export type AltTrackPositionDetails = {
    trackNumber: number;
    rowNumber: number;
    colNumber: number;
}

export type AltLinked = {
    channel: string;
    linkingId: string
}

export type AltLinkedTrack = {
    trackNumber: number;
    positionDesc: string
}

export type AltEncodingDesc = {
    channel: string,
    channelType: string,
    desc: string,
    dataDesc?: string[][]
}

export type AltTrackAppearanceDetails = {
    overlaid: false;
    layout: Layout;
    mark: Mark;
    encodings: AltEncodingSeparated;
    encodingsDescList: AltEncodingDesc[];
    orientation?: Orientation;
    assembly?: Assembly;
    linkingId?: string;
    linked?: AltLinked[];
}

export type AltTrackAppearanceDetailsOverlaid = {
    overlaid: true;
    layout: Layout;
    mark?: Mark,
    markByTrack: Mark[];
    encodings: AltEncodingSeparated;
    encodingsByTrack: AltEncodingSeparated[];
    encodingsDescList: AltEncodingDesc[];
    orientation?: Orientation;
    assembly?: Assembly;
    linkingId?: string;
    linked?: AltLinked[];
    altOverlay: AltOverlayPart[]
}

export interface AltTrackDataFields {
    genomicField?: string;
    valueField?: string;
    categoryField?: string;
}

export interface AltTrackDataDetails {
    data: DataDeep;
    fields: AltTrackDataFields;
    transforms?: DataTransform[];
    dataStatistics?: AltDataStatistics;
}

export interface AltTrackPosition {
    description: string;
    details: AltTrackPositionDetails;
}

export interface AltTrackAppearance {
    description: string;
    details: AltTrackAppearanceDetails;
}

export interface AltTrackAppearanceOverlaid {
    description: string;
    details: AltTrackAppearanceDetailsOverlaid;
}

export interface AltTrackData {
    description: string;
    details: AltTrackDataDetails;
}

// export interface AltTrackOverlaidByDataInd {
//         uid: string,
//         description: string;
//         charttype: string;
//         appearance: AltTrackAppearance;
//         data: AltTrackData;
//     }

export interface AltTrackBase {
    alttype: 'single' | 'ov-mark' | 'ov-data' | 'ov-data-ind';
    description: string;
    title?: string;
}


export interface AltTrackSingle extends AltTrackBase {
    alttype: 'single';
    uid: string,
    charttype: string;
    appearance: AltTrackAppearance;
    data: AltTrackData;
    position: AltTrackPosition;
}

export interface AltTrackOverlaidByMark extends AltTrackBase {
    alttype: 'ov-mark';
    uid: string,
    charttype: string[];
    appearance: AltTrackAppearanceOverlaid;
    data: AltTrackData;
    position: AltTrackPosition;
}

export interface AltTrackOverlaidByDataInd extends AltTrackBase {
    alttype: 'ov-data-ind'
    uid: string,
    charttype: string;
    appearance: AltTrackAppearance;
    data: AltTrackData;
}

export interface AltTrackOverlaidByData extends AltTrackBase {
    alttype: 'ov-data';
    uids: string[];
    appearance: {description: string, details: {layout: Layout, charttype: string}};
    tracks: AltTrackOverlaidByDataInd[];
    position: AltTrackPosition;
}

export type AltTrackOverlaid = AltTrackOverlaidByMark | AltTrackOverlaidByData;

export type AltTrack = AltTrackSingle | AltTrackOverlaid;

export interface AltDataStatistics {
    id: string;
    flatTileData: Datum[];
    genomicMin?: number;
    genomicMax?: number;
    genomicDescList?: string[][]
    valueMin?: number;
    valueMax?: number;
    valueMinGenomic?: number[];
    valueMaxGenomic?: number[];
    valueDescList?: string[][]
    categories?: string[];
    categoryMinMaxWG?: { [key: string]: (number | number[])[] };
    highestCategory?: string[];
}

export type compositionTracker = {
    nRows: number;
    nCols: number;
    allVertical: boolean;
    allHorizontal: boolean;
    everyRowSameCols: boolean;
    RowsCols: number[]
}

export type AltSpecComposition = {
    description: string;
    nTracks: number;
    parentValues: AltParentValues;
    counter: AltCounter;
}

export type AltGoslingSpec = {
    title?: string;
    subtitle?: string;
    alt: string;
    longDescription: string;
    fullDescription: string;
    composition: AltSpecComposition;
    tracks: Array<AltTrack>
}

export interface PreviewAlt {
    id: string;
    data: AltGoslingSpec;
}

export interface DataPanelInformation {
    altTrack: AltTrack,
    altDataStatistics: AltDataStatistics
}

export type AltOverlayPart = {
    mark?: Mark,
    dataTransform?: DataTransform,
} & any;
