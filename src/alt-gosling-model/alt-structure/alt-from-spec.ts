import type { GoslingSpec, Mark, Track, SingleTrack, DataDeep, OverlaidTrack, OverlaidTracks } from '@alt-gosling/schema/gosling.schema';
import type {
    AltGoslingSpec, AltTrack, AltTrackSingle,
    AltTrackOverlaid, AltTrackOverlaidByMark, AltTrackOverlaidByData,
    AltSpecComposition, AltCounter, AltParentValues, AltTrackPosition, AltTrackPositionDetails,
    AltTrackAppearance, AltTrackAppearanceDetails, AltTrackAppearanceOverlaid,  AltTrackAppearanceDetailsOverlaid,
    AltTrackData, AltTrackDataDetails, AltTrackOverlaidByDataInd, AltTrackDataFields,
    AltEncodingSeparated, EncodingValueSingle, EncodingDeepSingle } from '@alt-gosling/schema/alt-gosling-schema';
import { IsOverlaidTracks, IsChannelDeep, IsChannelValue } from '@alt-gosling/schema/gosling.schema.guard';
import { SUPPORTED_CHANNELS } from '@alt-gosling/schema/supported_channels';

import { attributeExists } from '../util';
import { determineSpecialCases } from './chart-types';
// @ts-expect-error no ktype definition
import { _convertToFlatTracks, _spreadTracksByData } from 'gosling.js/utils';


export function getAltSpec(
    spec: GoslingSpec
): AltGoslingSpec {
    const altSpec = {} as AltGoslingSpec;
    altSpec.tracks = {} as (AltTrack)[];

    altSpec.title =  spec.title;
    altSpec.subtitle =  spec.subtitle;

    const counter = {'nTracks' : 0, 'rowViews' : 0, 'colViews' : 0, 'allPositions': [[0,0]] as number[][], 'totalRows': 0, 'totalCols': 0, 'matrix': {} as number[][]};
    const altParentValues = {} as AltParentValues;
    altParentValues.arrangement = 'vertical';
    altParentValues.layout = 'linear';

    determineStructure(spec, altSpec, altParentValues, counter);

    getPositionMatrix(counter);

    const composition: AltSpecComposition = { description: '', nTracks: counter.nTracks, parentValues: altParentValues, counter: counter };
    altSpec.composition = composition;

    altSpec.alt = '';
    altSpec.longDescription = '';

    return altSpec;
}


function determineStructure(
    specPart: GoslingSpec,
    altSpec: AltGoslingSpec,
    altParentValues: AltParentValues,
    counter: AltCounter,
) {
    // singleview
    if ('tracks' in specPart) {

        const altParentValuesCopy = altUpdateParentValues(specPart, altParentValues);

        // multiple tracks
        if (specPart.tracks.length > 1) {

            // check if overlaid
            if (IsOverlaidTracks(specPart)) {
                const track =  specPart as OverlaidTracks;
                altSpec.tracks[counter.nTracks] = altOverlaidTracks(track, altParentValuesCopy, counter);
                if (counter.nTracks > 0) {
                    counter.allPositions = [...counter.allPositions, [counter.rowViews, counter.colViews]];
                }
                counter.nTracks ++;

            } else {
                // otherwise treat every track as a single track
                for (const i in specPart.tracks) {
                    const track =  specPart.tracks[i] as SingleTrack;
                    altSpec.tracks[counter.nTracks] = altSingleTrack(track, altParentValuesCopy, counter);
                    if (counter.nTracks > 0) {
                        counter.allPositions = [...counter.allPositions, [counter.rowViews, counter.colViews]];
                    }
                    counter.nTracks ++;
                }
            }
         
        // if only one track is present, it has to be a single track
        } else {
            const track = specPart.tracks[0] as SingleTrack;
            altSpec.tracks[counter.nTracks] = altSingleTrack(track, altParentValues, counter);
            if (counter.nTracks > 0) {
                counter.allPositions = [...counter.allPositions, [counter.rowViews, counter.colViews]];
            }
            counter.nTracks ++;
        }
    }
    // multiview
    else if ('views' in specPart) {
        const currRow = counter.rowViews;
        const currCol = counter.colViews;

        specPart.views.forEach((view, i) => {
            if (i !== 0) {
                if (altParentValues.arrangement === 'vertical' || altParentValues.arrangement === 'parallel') {
                    counter.rowViews ++;
                } else {
                    counter.colViews ++;
                }
            }
            const altParentValuesCopy = altUpdateParentValues(view, altParentValues);
            determineStructure(view, altSpec, altParentValuesCopy, counter);
        });

        if (altParentValues.arrangement === 'vertical' || altParentValues.arrangement === 'parallel') {
            counter.rowViews = currRow;
        } else {
            counter.colViews = currCol;
        }
    }
}

function altUpdateParentValues(
    specPart: any,
    altParentValues: AltParentValues
) {
    const altParentValuesCopy = JSON.parse(JSON.stringify(altParentValues));

    if (attributeExists(specPart, 'arrangement')) {
        altParentValuesCopy.arrangement = specPart.arrangement;
    }
    if (attributeExists(specPart, 'layout')) {
        altParentValuesCopy.layout = specPart.layout;
    }
    return altParentValuesCopy;
}

// function altTrackBase(
//     track: SingleTrack | OverlaidTracks,
//     altParentValues: AltParentValues,
//     counter: AltCounter
// ) {

//     // position
//     var positionDetails: AltTrackPositionDetails = {trackNumber: counter.nTracks, rowNumber: counter.rowViews, colNumber: counter.colViews}



// }

function altSingleTrack(
    track: SingleTrack,
    altParentValues: AltParentValues,
    counter: AltCounter
): AltTrackSingle {
    const altTrack = {} as AltTrackSingle;
    altTrack.alttype = 'single';

    // uid
    let uid;
    if (track.id !== 'unknown') {
        uid = track.id as string;
    } else {
        // figure out how to get the uid.
        uid = '';
    }
    
    
    // position
    const positionDetails: AltTrackPositionDetails = {trackNumber: counter.nTracks, rowNumber: counter.rowViews, colNumber: counter.colViews};

    // appearance (anything from mark to layout to encodings)
    const appearanceDetails = {} as AltTrackAppearanceDetails;

    appearanceDetails.assembly = track.assembly;
    appearanceDetails.layout = altParentValues.layout;
    appearanceDetails.overlaid = false;
    appearanceDetails.mark = track.mark;
    appearanceDetails.encodings = getSeparatedEncodings(track);

    // data
    // add genomic_field, value_field, category_field for data retrieval
    const dataFields = determineFields(track.data, appearanceDetails.encodings);
    const dataDetails: AltTrackDataDetails = {data: track.data, fields: dataFields};
   
    // add temporary empty descriptions
    const position: AltTrackPosition = {description: '', details: positionDetails};
    const appearance: AltTrackAppearance = {description: '', details: appearanceDetails};
    const data: AltTrackData = {description: '', details: dataDetails};
    
    // add to altTrack
    altTrack.uid = uid;
    altTrack.position = position;
    altTrack.appearance = appearance;
    altTrack.title = track.title;
    altTrack.data = data;
    
    // determine type if possible
    altTrack.charttype = determineSpecialCases(altTrack);

    // empty description, to be filled in.
    altTrack.description = '';

    return altTrack;
    
}


function altOverlaidTracks(
    specPart: OverlaidTracks,
    altParentValues: AltParentValues,
    counter: AltCounter
): AltTrackOverlaid {
    let tracks: Track[] = _convertToFlatTracks(specPart);
    tracks = _spreadTracksByData(tracks);

    // test if overlaid track has multiple data sources
    if (tracks.length > 1) {
        return altOverlaidByData(specPart, tracks, altParentValues, counter);
    } else {
        // if (IsOverlaidTrack(specPart)) {}
        return altOverlaidByMark(specPart, altParentValues, counter);
    }
}

function altOverlaidByMark(
    track: OverlaidTracks,
    altParentValues: AltParentValues,
    counter: AltCounter
): AltTrackOverlaidByMark {
    const altTrack = {} as AltTrackOverlaidByMark;
    altTrack.alttype = 'ov-mark';

    // uid
    let uid;
    if (track.id !== 'unknown') {
        uid = track.id as string;
    } else {
        // figure out how to get the uid.
        uid = '';
    }

    // position
    const positionDetails: AltTrackPositionDetails = {trackNumber: counter.nTracks, rowNumber: counter.rowViews, colNumber: counter.colViews};

    // appearance (anything from mark to layout to encodings)
    const appearanceDetails = {} as AltTrackAppearanceDetailsOverlaid;
    
    appearanceDetails.assembly = track.assembly;
    appearanceDetails.layout = altParentValues.layout;
    appearanceDetails.overlaid = true;
    appearanceDetails.encodings = getSeparatedEncodings(track);
    
    const marks = [] as Mark[];
    const encodingsByMark = [] as AltEncodingSeparated[];
    if (track.mark) {
        marks.push(track.mark);
    }
    for (const o of track.tracks) {
        const partialOverlaidTrack = o as Partial<OverlaidTrack>;
        if (partialOverlaidTrack.mark) {
            marks.push(partialOverlaidTrack.mark);
        }
        encodingsByMark.push(getSeparatedEncodings(partialOverlaidTrack));
        
    }
    appearanceDetails.mark = marks;
    appearanceDetails.encodingsByMark = encodingsByMark;
    
    // data
    if (track.data) {
        const dataFields = determineFields(track.data, appearanceDetails.encodings);
        const dataDetails: AltTrackDataDetails = {data: track.data, fields: dataFields};
        const data: AltTrackData = {description: '', details: dataDetails};
        altTrack.data = data;
    }

    // add temporary empty descriptions
    const position: AltTrackPosition = {description: '', details: positionDetails};
    const appearance: AltTrackAppearanceOverlaid = {description: '', details: appearanceDetails};
   
    // add to altTrack
    altTrack.uid = uid;
    altTrack.position = position;
    altTrack.appearance = appearance;
    altTrack.title = track.title;
   
    
    // determine type if possible
    const charttypes = [] as string[];
    for (let i = 0; i < marks.length; i++) {
        const charttype = determineSpecialCases(altTrack, i);
        if (charttype) {
            charttypes.push(charttype);
        }
    }
    altTrack.charttype = charttypes;

    // empty description, to be filled in.
    altTrack.description = '';

    return altTrack;
}

function altOverlaidByData(
    specPart: OverlaidTracks,
    tracks: Track[],
    altParentValues: AltParentValues,
    counter: AltCounter
): AltTrackOverlaidByData {
    const altTrack = {} as AltTrackOverlaidByData;
    altTrack.alttype = 'ov-data';

    // position
    const positionDetails: AltTrackPositionDetails = {trackNumber: counter.nTracks, rowNumber: counter.rowViews, colNumber: counter.colViews};

    const uids = [] as string[];
    const altTrackInd = [] as AltTrackOverlaidByDataInd[];
    for (const t of tracks) {
        const track = t as SingleTrack;
        // uid
        let uid;
        if (track.id !== 'unknown') {
            uid = track.id as string;
        } else {
            // figure out how to get the uid.
            uid = '';
        }
        uids.push(uid);
        altTrackInd.push(altOverlaidByDataSingleTrack(track, altParentValues, counter));
    }

    const position: AltTrackPosition = {description: '', details: positionDetails};
    altTrack.position = position;
    
    altTrack.title = specPart.title;

    altTrack.appearance = {details: {layout: 'linear'}}; // only linear is supported at this time

    altTrack.tracks = altTrackInd;
    altTrack.uids = uids;
    altTrack.description = '';

    return altTrack;
}



function altOverlaidByDataSingleTrack(
    track: SingleTrack,
    altParentValues: AltParentValues,
    counter: AltCounter
): AltTrackOverlaidByDataInd {
    const altTrack = {} as AltTrackOverlaidByDataInd;

    // appearance (anything from mark to layout to encodings)
    const appearanceDetails = {} as AltTrackAppearanceDetails;

    appearanceDetails.assembly = track.assembly;
    appearanceDetails.layout = altParentValues.layout;
    appearanceDetails.overlaid = false;
    appearanceDetails.mark = track.mark;
    appearanceDetails.encodings = getSeparatedEncodings(track);

    // data
    // add genomic_field, value_field, category_field for data retrieval
    const dataFields = determineFields(track.data, appearanceDetails.encodings);
    const dataDetails: AltTrackDataDetails = {data: track.data, fields: dataFields};
   
    // add temporary empty descriptions
    const appearance: AltTrackAppearance = {description: '', details: appearanceDetails};
    const data: AltTrackData = {description: '', details: dataDetails};
    
    // add to altTrack
    altTrack.appearance = appearance;
    altTrack.data = data;
    
    // determine type if possible
    altTrack.charttype = determineSpecialCases(altTrack);

    // empty description, to be filled in.
    altTrack.description = '';

    return altTrack;
}



function determineFields(
    data: DataDeep,
    AltEncodingSeparated: AltEncodingSeparated
): AltTrackDataFields {
    const fields = {} as AltTrackDataFields;

    // retrieve genomicField
    if (AltEncodingSeparated.encodingDeepGenomic.length > 0) {
        if (AltEncodingSeparated.encodingDeepGenomic[0].details.field) {
            fields.genomicField = AltEncodingSeparated.encodingDeepGenomic[0].details.field;
        } else {
            fields.genomicField === 'position';
        }
    }

    // retrieve valueField
    if (AltEncodingSeparated.encodingDeepQuantitative.length > 0) {
        if (AltEncodingSeparated.encodingDeepQuantitative[0].details.field) {
            fields.valueField = AltEncodingSeparated.encodingDeepQuantitative[0].details.field;
        } else {
            fields.valueField === 'value';
        }
    }

    // retrieve categoryField
    if (AltEncodingSeparated.encodingDeepNominal.length > 0) {
        if (AltEncodingSeparated.encodingDeepNominal[0].details.field) {
            fields.categoryField = AltEncodingSeparated.encodingDeepNominal[0].details.field;
        } else {
            fields.categoryField === 'sample';
        }
    }

    return fields;
}

export function getSeparatedEncodings(track: SingleTrack | OverlaidTracks | Partial<OverlaidTrack>): AltEncodingSeparated {
    const encodingDeepGenomic: EncodingDeepSingle[] = [];
    const encodingDeepQuantitative: EncodingDeepSingle[] = [];
    const encodingDeepNominal: EncodingDeepSingle[] = [];
    const encodingValue: EncodingValueSingle[] = [];
    SUPPORTED_CHANNELS.forEach(k => {
        const c = track[k];
        if (IsChannelDeep(c)) {
            if (c.type === 'genomic') {
                encodingDeepGenomic.push({name: k, description: '', details: c});
            } else if (c.type === 'quantitative') {
                encodingDeepQuantitative.push({name: k, description: '', details: c});
            } else {
                encodingDeepNominal.push({name: k, description: '', details: c});
            }
        } else if (IsChannelValue(c)) {
            encodingValue.push({name: k, description: '', details: c});
        }
    });
    // bundle together
    const encodingSeparated: AltEncodingSeparated = {encodingDeepGenomic: encodingDeepGenomic, encodingDeepQuantitative: encodingDeepQuantitative, encodingDeepNominal: encodingDeepNominal, encodingValue: encodingValue};
    return encodingSeparated;
}


function getPositionMatrix(counter: AltCounter) {
    counter.totalRows = Math.max(...counter.allPositions.map(t => t[0])) + 1;
    counter.totalCols = Math.max(...counter.allPositions.map(t => t[1])) + 1;

    const matrix = {} as number[][];
    for (let i = 0; i < counter.totalRows; i++) {
        const colValsI  = counter.allPositions.filter(t => t[0] === i).map(t => t[1]);
        const colValsIStructured = {} as number[];
        for (const j of colValsI) {
            if (colValsIStructured[j]) {
                colValsIStructured[j] = colValsIStructured[j] + 1;
            } else {
                colValsIStructured[j] = 1;
            }
        }
        matrix[i] = colValsIStructured;
    }
    counter.matrix = matrix;
}