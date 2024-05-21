import type { AltTrackSingle, AltTrackOverlaidByMark, AltTrackOverlaidByData, AltTrackOverlaidByDataInd } from '@alt-gosling/schema/alt-gosling-schema';
import { arrayToString, markToText } from './../util';

export function determineSpecialCases(altTrack: AltTrackSingle | AltTrackOverlaidByMark | AltTrackOverlaidByDataInd, markIndex?: number): string {
    let _mark;
    if (Array.isArray(altTrack.appearance.details.mark)) {
        _mark = altTrack.appearance.details.mark[markIndex as number];
    } else {
        _mark = altTrack.appearance.details.mark;
    }
    const _genomicEncodings = altTrack.appearance.details.encodings.encodingDeepGenomic.map(o => o.name);
    const _quantitativeEncodings = altTrack.appearance.details.encodings.encodingDeepQuantitative.map(o => o.name);
    const _nominalEncodings = altTrack.appearance.details.encodings.encodingDeepNominal.map(o => o.name);
    const _valueEncodings = altTrack.appearance.details.encodings.encodingValue.map(o => o.name);
    const _allEncodings = [..._genomicEncodings, ..._quantitativeEncodings, ..._nominalEncodings, ..._valueEncodings];

    const _layout = altTrack.appearance.details.layout;
    let layoutDesc = '';
    if (_layout === 'circular') {
        layoutDesc = 'circular ';
    }
    
    if (_mark === 'point' && _quantitativeEncodings.includes('x') && _quantitativeEncodings.includes('y')) {
        return `${layoutDesc}scatter plot`;
    }
    if (_mark === 'line' && _genomicEncodings.includes('x') && _quantitativeEncodings.includes('y')) {
        return `${layoutDesc}line chart`;
    }
    if (_mark === 'line' && _quantitativeEncodings.includes('x') && _genomicEncodings.includes('y')) {
        return `${layoutDesc}line chart`;
    }
    if (_mark === 'bar' && _genomicEncodings.includes('x') && _quantitativeEncodings.includes('y')) {
        return `${layoutDesc}bar chart`;
    }
    if (_mark === 'bar' && _genomicEncodings.includes('x') && _genomicEncodings.includes('xe') && _genomicEncodings.includes('y') && _genomicEncodings.includes('ye') && _quantitativeEncodings.includes('color')) {
        return `${layoutDesc}matrix`;
    }
    if (_mark === 'rect' && _genomicEncodings.includes('x') && _genomicEncodings.includes('xe') && _quantitativeEncodings.includes('color')) {
        return `${layoutDesc}heat map`;
    }
    if (_mark === 'rect' && _genomicEncodings.includes('x') && _genomicEncodings.includes('xe') && _nominalEncodings.includes('color')) {
        return `${layoutDesc}ideogram`;
    }
    if (_mark === 'rule' && _allEncodings.includes('x') && _allEncodings.includes('y')) {
        return `${layoutDesc}chart with horizontal and vertical lines`;
    }
    if (_mark === 'rule' && _allEncodings.includes('x')) {
        return `${layoutDesc}chart with vertical lines`;
    }
    if (_mark === 'rule' && _allEncodings.includes('y')) {
        return `${layoutDesc}chart with horizontal lines`;
    }
    if (markToText.get(_mark)) {
        return `${layoutDesc}chart with ${markToText.get(_mark)}`;
    }
    
    return `unknown chart`;
}

export function determineOverlaidByDataCases(altTrack: AltTrackOverlaidByData): string {
    const charttypes = [] as string[];
    const charttypesWithAnnotations = [] as string[];
    const charttypesWithoutAnnotations = [] as string[];
    const annotations = ['chart with horizontal and vertical lines', 'circular chart with horizontal and vertical lines', 'chart with vertical lines', 'circular chart with vertical lines', 'chart with horizontal lines', 'circular chart with horizontal lines'];
    for (const ti of altTrack.tracks) {
        charttypes.push(ti.charttype);
        if (annotations.includes(ti.charttype)) {
            charttypesWithAnnotations.push(ti.charttype);
        } else {
            charttypesWithoutAnnotations.push(ti.charttype);
        }
    }
    if (charttypesWithAnnotations.length > 0 && charttypesWithoutAnnotations.length > 0) {
        if (charttypesWithoutAnnotations.length == 1) {
            return `annotated ${charttypesWithoutAnnotations}`;
        }
        return `overlaid ${arrayToString(charttypesWithoutAnnotations)} with annotation`;
    } else {
        return `overlaid ${arrayToString(charttypes)}`;
    }
}