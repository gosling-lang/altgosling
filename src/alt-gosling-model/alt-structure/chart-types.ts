import type { AltTrackSingle, AltTrackOverlaidByMark, AltTrackOverlaidByData, AltTrackOverlaidByDataInd } from '@altgosling/schema/alt-gosling-schema';
import { arrayToString, callMarkToText } from './../util';

export function determineSpecialCases(altTrack: AltTrackSingle | AltTrackOverlaidByMark | AltTrackOverlaidByDataInd, markIndex?: number): string {
    let _mark;
    if (Array.isArray(altTrack.appearance.details.mark)) {
        _mark = altTrack.appearance.details.mark[markIndex as number];
    } else {
        _mark = altTrack.appearance.details.mark;
    }
    let _dataType = altTrack.data.details.data?.type;
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
    if (_mark === 'point' && _genomicEncodings.includes('x') && _quantitativeEncodings.includes('y')) {
        return `${layoutDesc}scatter plot`;
    }
    if (_mark === 'point' && _quantitativeEncodings.includes('x') && _genomicEncodings.includes('y')) {
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
    if (_mark === 'rect' && ['csv', 'json'].includes(_dataType) && _genomicEncodings.includes('x') && _genomicEncodings.includes('xe') && _nominalEncodings.includes('color')) {
        return `${layoutDesc}ideogram`;
    }
    if (_mark === 'rect' && _genomicEncodings.includes('x') && _genomicEncodings.includes('xe') && _dataType === 'beddb') {
        return `${layoutDesc}genomic range annotation track`;
    }
    if (_mark === 'triangleRight' && _genomicEncodings.includes('x') && !_genomicEncodings.includes('y') && _dataType === 'beddb') {
        return `${layoutDesc}genomic position annotation track`;
    }
    if (_mark === 'triangleLeft' && _genomicEncodings.includes('x') && !_genomicEncodings.includes('y') && _dataType === 'beddb') {
        return `${layoutDesc}genomic position annotation track`;
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
    if (callMarkToText(_mark)) {
        return `${layoutDesc}chart with ${callMarkToText(_mark)}`;
    }
    
    return `unknown chart`;
}

export function determineOverlaidByMarkCases(specialCases: string[]): string[] {
    specialCases = [...new Set(specialCases)];

    // special case: genome annotation track with text
    if (specialCases.includes('genomic range annotation track') && specialCases.includes('genomic position annotation track')) {
        specialCases = specialCases.filter(caseType => caseType !== 'genomic position annotation track');
    }

    if (specialCases.includes('genomic range annotation track') || specialCases.includes('genomic position annotation track')) {
        if (specialCases.includes('chart with text')) {
            specialCases = specialCases.filter(caseType => caseType !== 'chart with text'
            ).map(caseType => 
                caseType === 'genomic range annotation track' ? 'genomic range annotation track with text' : caseType
            ).map(caseType => 
                caseType === 'genomic position annotation track' ? 'genomic position annotation track with text' : caseType
            );
        }
        if (specialCases.includes('chart with vertical lines')) {
            specialCases = specialCases.filter(caseType => caseType !== 'chart with vertical lines');
        }
    }

    // special case: both left and right triangles
    if (specialCases.includes('chart with left triangles') && specialCases.includes('chart with right triangles')) {
        specialCases = specialCases.filter(caseType => caseType !== 'chart with left triangles');
        specialCases = specialCases.filter(caseType => caseType !== 'chart with right triangles');
        specialCases.push('chart with left and right triangles');
    }

    // concatenate all the 'chart with <mark>' cases
    // split out circular charts
    const linearChartsWithMark = [] as string[];
    const circularChartsWithMark = [] as string[];
    for (const chart of specialCases) {
        if (chart.includes('chart with')) {
            specialCases = specialCases.filter(caseType => caseType !== chart);
            const mark = chart.split('chart with ')[1];
            if (chart.includes('circular')) {
                circularChartsWithMark.push(mark);
            } else {
                linearChartsWithMark.push(mark);
            }
        }
    }
    if (linearChartsWithMark.length > 0) {
        specialCases.push(`chart with ${arrayToString(linearChartsWithMark)}`);
    }
    if (circularChartsWithMark.length > 0) {
        specialCases.push(`circular chart with ${arrayToString(circularChartsWithMark)}`);
    }

    return specialCases;
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