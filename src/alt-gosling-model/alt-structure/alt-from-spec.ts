import type { GoslingSpec, Mark, Track, SingleTrack, DataDeep, Encoding, ChannelTypes, OverlaidTrack, OverlaidTracks, DataTransform } from '@alt-gosling/schema/gosling.schema';
import type {
    AltGoslingSpec, AltTrack, AltTrackSingle,
    AltTrackOverlaid, AltTrackOverlaidByMark, AltTrackOverlaidByData,
    AltSpecComposition, AltCounter, AltParentValues, AltTrackPosition, AltTrackPositionDetails,
    AltTrackAppearance, AltTrackAppearanceDetails, AltTrackAppearanceOverlaid, AltOverlayPart, AltLinked, AltLinkedTrack,
    AltTrackData, AltTrackDataDetails, AltTrackOverlaidByDataInd, AltTrackDataFields,
    AltEncodingSeparated, EncodingValueSingle, EncodingDeepSingle, AltTrackAppearanceDetailsOverlaid } from '@alt-gosling/schema/alt-gosling-schema';
import { IsOverlaidTracks, IsOverlaidTrack, IsChannelDeep, IsChannelValue } from '@alt-gosling/schema/gosling.schema.guard';
import { SUPPORTED_CHANNELS } from '@alt-gosling/schema/supported_channels';

import { attributeExists, attributeExistsReturn } from '../util';
import { determineSpecialCases, determineOverlaidByDataCases } from './chart-types';
// @ts-expect-error no type definition
import { _convertToFlatTracks, _spreadTracksByData } from 'gosling.js/utils';


export function getAltSpec(
    spec: GoslingSpec
): AltGoslingSpec {
    // console.log('spec', spec)
    const altSpec = {} as AltGoslingSpec;
    altSpec.tracks = {} as (AltTrack)[];

    altSpec.title =  spec.title;
    altSpec.subtitle =  spec.subtitle;

    const counter = {
        'nTracks' : 0, 'rowViews' : 0, 'colViews' : 0,
        'allPositions': [[0,0]] as number[][], 'totalRows': 0, 'totalCols': 0, 'matrix': {} as number[][],
        'serialView': -1, 'parallelView': -1, 'serialCircular': [] as number[][], 'parallelCircular': [] as number[][]};
    const altParentValues = {} as AltParentValues;

    if (attributeExists(spec, 'arrangement') && attributeExistsReturn(spec, 'arrangement')) {
        altParentValues.arrangement = attributeExistsReturn(spec, 'arrangement');
        if (altParentValues.arrangement === 'serial') {
            counter.serialView += 1;
            counter.serialCircular.push([]);
        } else if (altParentValues.arrangement === 'parallel') {
            counter.parallelView += 1;
            counter.parallelCircular.push([]);
        }
    } else {
        altParentValues.arrangement = 'vertical';
    }

    if (spec.layout) {
        altParentValues.layout = spec.layout;
    } else {
        altParentValues.layout = 'linear';
    }

    determineStructure(spec, altSpec, altParentValues, counter);

    getPositionMatrix(counter);

    // getLinking(altSpec);

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
                checkCircular(altSpec, altParentValues, counter);
                counter.nTracks ++;
            } else {
                // otherwise treat every track as a single track
                for (const i in specPart.tracks) {
                    const track =  specPart.tracks[i] as SingleTrack;
                    altSpec.tracks[counter.nTracks] = altSingleTrack(track, altParentValuesCopy, counter);
                    if (counter.nTracks > 0) {
                        counter.allPositions = [...counter.allPositions, [counter.rowViews, counter.colViews]];
                    }
                    checkCircular(altSpec, altParentValues, counter);
                    counter.nTracks ++;
                }
            }
         
        // if only one track is present, it is either a single track or an overlaid track with the same data
        // (as this is all performed on the _specProcessed which has already been convertToFlatTracks and spreadByData)
        } else {
            if (IsOverlaidTrack(specPart.tracks[0])) {
                const track = specPart.tracks[0] as OverlaidTrack;
                altSpec.tracks[counter.nTracks] = altOverlaidTrack(track, altParentValues, counter);
            } else {
                const track = specPart.tracks[0] as SingleTrack;
                altSpec.tracks[counter.nTracks] = altSingleTrack(track, altParentValues, counter);
            }
            if (counter.nTracks > 0) {
                counter.allPositions = [...counter.allPositions, [counter.rowViews, counter.colViews]];
            }
            checkCircular(altSpec, altParentValues, counter);
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
            if (altParentValuesCopy.arrangement === 'serial' && altParentValues.arrangement !== 'serial') {
                counter.serialView += 1;
                counter.serialCircular.push([]);
            }
            if (altParentValuesCopy.arrangement === 'parallel' && altParentValues.arrangement !== 'parallel') {
                counter.parallelView += 1;
                counter.parallelCircular.push([]);
            }
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

function checkCircular(
    altSpec: AltGoslingSpec,
    altParentValues: AltParentValues,
    counter: AltCounter
) {
    if (altSpec.tracks[counter.nTracks].appearance.details.layout == 'circular') {
        if (altParentValues.arrangement === 'serial') {
            counter.serialCircular[counter.serialView].push(counter.nTracks);
        } else if (altParentValues.arrangement === 'parallel') {
            counter.parallelCircular[counter.parallelView].push(counter.nTracks);
        }
    }
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
        console.warn('ID not found?');
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
    appearanceDetails.linkingId = track.linkingId;

    // data
    // add genomic_field, value_field, category_field for data retrieval
    const dataFields = determineFields(track.data, appearanceDetails.encodings);
    const dataDetails: AltTrackDataDetails = {data: track.data, fields: dataFields};

    // data transforms
    if (track.dataTransform) {
        dataDetails.transforms = track.dataTransform;
    }
   
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

// function convertToSingleTrackOld(
//     specPart: OverlaidTrack,
//     altParentValues: AltParentValues,
//     counter: AltCounter
// ) {
//     let newTrack = {...specPart, ...specPart._overlay[0]} as any;
//     delete newTrack._overlay;
//     delete newTrack.overlayOnPreviousTrack;
//     newTrack = newTrack as SingleTrack;
//     const altTrack = altSingleTrack(newTrack, altParentValues, counter);
//     return [altTrack, specPart._overlay];
// }


function convertToSingleTrack(
    specPart: OverlaidTrack,
    altOverlay: AltOverlayPart,
    altParentValues: AltParentValues,
    counter: AltCounter
) {
    let newTrack = {...specPart, ...altOverlay} as any;
    delete newTrack._overlay;
    delete newTrack.overlayOnPreviousTrack;
    newTrack = newTrack as SingleTrack;
    const altTrack = altSingleTrack(newTrack, altParentValues, counter);
    return altTrack;
}

function altOverlaidTrackGetStructure(
    specPart: OverlaidTrack,
    altParentValues: AltParentValues,
    counter: AltCounter
): [OverlaidTrack, AltOverlayPart[], AltTrackSingle[]] {
    const altOverlay = [] as AltOverlayPart[];

    // collect the mark, channels and data transform of each overlay
    for (let i = 0; i < specPart._overlay.length; i++) {
        altOverlay.push({} as AltOverlayPart);

        if (specPart._overlay[i].mark) {
            altOverlay[i].mark = specPart._overlay[i].mark;
        } else {
            if (specPart.mark) {
                altOverlay[i].mark = specPart.mark;
            }
        }

        SUPPORTED_CHANNELS.forEach(k => {
            if (k === 'text') {
                return;
            }

            if (specPart._overlay[i][k]) {
                altOverlay[i][k] = specPart._overlay[i][k];
            } else {
                if (specPart[k]) {
                    altOverlay[i][k] = specPart[k];
                }
            }
        });

        if (specPart._overlay[i].dataTransform) {
            altOverlay[i].dataTransform = specPart._overlay[i].dataTransform;
        } else {
            if (specPart.dataTransform) {
                altOverlay[i].dataTransform = specPart.dataTransform;
            }
        }
    }

    // determine which to include and exclude in top
    const includeInTop = {} as any;
    const excludeInTop = {} as any;

    // if no undefined and only 1 unique item, include in top
    if (altOverlay.filter(e => e.mark === undefined).length === 0 && [...new Set(altOverlay.map(e => e.mark))].length === 1) {
        includeInTop.mark = altOverlay[0].mark;
        altOverlay.map(e => delete e.mark);
    } else {
        excludeInTop.mark = true;
    }


    SUPPORTED_CHANNELS.forEach(k => {
        if (k === 'text') {
            return;
        }
        if (altOverlay.filter(e => e[k] === undefined).length === 0 && [...new Set(altOverlay.map(e => e[k]))].length === 1) {
            includeInTop[k] = altOverlay[0][k];
            altOverlay.map(e => delete e[k]);
        } else {
            excludeInTop[k] = true;
        }
    });

    if (altOverlay.filter(e => e.dataTransform === undefined).length === 0 && [...new Set(altOverlay.map(e => e.dataTransform))].length === 1) {
        includeInTop.dataTransform = altOverlay[0].dataTransform;
        altOverlay.map(e => delete e.dataTransform);
    } else {
        excludeInTop.dataTransform = true;
    }


    if (excludeInTop.mark) {
        delete specPart.mark;
    }

    if (includeInTop.mark) {
        specPart.mark = includeInTop.mark;
    }

    if (excludeInTop.dataTransform) {
        delete specPart.dataTransform;
    }

    if (includeInTop.dataTransform) {
        specPart.dataTransform = includeInTop.dataTransform;
    }

    SUPPORTED_CHANNELS.forEach(k => {
        if (k === 'text') {
            return;
        }
        if (excludeInTop[k]) {
            delete specPart[k];
        }

        if (includeInTop[k]) {
            specPart[k] = includeInTop[k];
        }
    });


    // get the single track representation from each overlay
    const singleTracks = [] as AltTrackSingle[];
     // const [singleTrack, _overlay] = convertToSingleTrack(specPart, altParentValues, counter);
    for (let i = 0; i < specPart._overlay.length; i++) {
        singleTracks.push(convertToSingleTrack(specPart, altOverlay[i], altParentValues, counter));
    }

    return [specPart, altOverlay, singleTracks];
}

function altOverlaidTrack(
    specPart: OverlaidTrack,
    altParentValues: AltParentValues,
    counter: AltCounter
) {
    // uid
    let uid;
    if (specPart.id !== 'unknown') {
        uid = specPart.id as string;
    } else {
        // figure out how to get the uid.
        uid = '';
        console.warn('ID not found?');
    }
    
    // position
    const positionDetails: AltTrackPositionDetails = {trackNumber: counter.nTracks, rowNumber: counter.rowViews, colNumber: counter.colViews};

    // check if overlaid just because there is a brush
    const brush = [];
    const nonBrush = [];
    for (const overlay of specPart._overlay) {
        if (overlay.mark) {
            if (overlay.mark === 'brush') {
                brush.push(overlay);
            } else {
                nonBrush.push(overlay);
            }
        } else {
            nonBrush.push(overlay);
        }
    }
    const linked = [] as AltLinked[];
    if (brush.length > 0) {
        for (const b of brush) {
            let linkingId;
            let channel;
            if (b.x) {
                channel = 'x';
                if (IsChannelDeep(b.x)) {
                    linkingId = b.x.linkingId;
                }
            }
            if (b.y) {
                channel = 'y';
                if (IsChannelDeep(b.y)) {
                    linkingId = b.y.linkingId;
                }
            }
            linkingId = 'temp'; // temporary as specProcessed doesn't catch linkingIds
            if (channel !== undefined && linkingId !== undefined) {
                linked.push({channel: channel, linkingId: linkingId});
            }
        }
        if (nonBrush.length === 1) {
            // then it's just a SingleTrack with a brush
            // we create the SingleTrack to get the AltSingleTrack
            const altTrack = convertToSingleTrack(specPart, nonBrush[0], altParentValues, counter);
            
            altTrack.appearance.details.linked = linked;
            return altTrack;

        } else {
            // then it's still an OverlaidTrack, but also with a brush
            // remove the brush, add it later
            specPart._overlay = nonBrush;
        }
    }
   
    const [specPartNew, altOverlay, singleTracks] = altOverlaidTrackGetStructure(specPart, altParentValues, counter);

    // appearance (anything from mark to layout to encodings)
    const appearanceDetails = {} as AltTrackAppearanceDetailsOverlaid;
    appearanceDetails.assembly = singleTracks[0].appearance.details.assembly;
    appearanceDetails.layout = singleTracks[0].appearance.details.layout;
    appearanceDetails.overlaid = true;
    
    if (specPartNew.mark) {
        appearanceDetails.mark = specPartNew.mark;
        const specPartNewWithAllEncodings = {...specPartNew} as OverlaidTrack;
        for (let i = 0; i < altOverlay.length; i++) {
            SUPPORTED_CHANNELS.forEach(k => {
                if (k === 'text') {
                    return;
                }
                if (!specPartNewWithAllEncodings[k]) {
                    if (altOverlay[i][k]) {
                        specPartNewWithAllEncodings[k] = altOverlay[i][k];
                    }
                }
            });
        }
        appearanceDetails.encodings = getSeparatedEncodings(specPartNewWithAllEncodings);
    } else {
        appearanceDetails.markByTrack = singleTracks.map(t => t.appearance.details.mark);
        appearanceDetails.encodings = getSeparatedEncodings(specPartNew);
        appearanceDetails.encodingsByTrack = altOverlay.map(t => getSeparatedEncodings(t));
        // appearanceDetails.encodingsByTrack = singleTracks.map(t => t.appearance.details.encodings);
    }

    if (brush.length > 0) {
        appearanceDetails.linked = linked;
    }
    
    const altTrack = {} as AltTrackOverlaidByMark;
    altTrack.alttype = 'ov-mark';

    // data
    const dataDetails = singleTracks[0].data.details;
   
    // add temporary empty descriptions
    const position: AltTrackPosition = {description: '', details: positionDetails};
    const appearance: AltTrackAppearanceOverlaid = {description: '', details: appearanceDetails};
    const data: AltTrackData = {description: '', details: dataDetails};
    
    // add to altTrack
    altTrack.uid = uid;
    altTrack.position = position;
    altTrack.appearance = appearance;
    altTrack.title = specPart.title;
    altTrack.data = data;
    
    // determine type if possible
    altTrack.charttype = singleTracks.map(t => t.charttype);

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
    return altOverlaidByData(specPart, tracks, altParentValues, counter);
    // let tracks: Track[] = _convertToFlatTracks(specPart);
    // tracks = _spreadTracksByData(tracks);

    // // test if overlaid track has multiple data sources
    // if (tracks.length > 1) {
    //     return altOverlaidByData(specPart, tracks, altParentValues, counter);
    // } else {
    //     return altOverlaidByMark(specPart, altParentValues, counter);
    // }
}

// function altOverlaidByMark(
//     track: OverlaidTrack,
//     altParentValues: AltParentValues,
//     counter: AltCounter
// ): AltTrackOverlaidByMark {
//     const altTrack = {} as AltTrackOverlaidByMark;
//     altTrack.alttype = 'ov-mark';

//     // uid
//     let uid;
//     if (track.id !== 'unknown') {
//         uid = track.id as string;
//     } else {
//         // figure out how to get the uid.
//         uid = '';
//     }

//     // position
//     const positionDetails: AltTrackPositionDetails = {trackNumber: counter.nTracks, rowNumber: counter.rowViews, colNumber: counter.colViews};

//     // appearance (anything from mark to layout to encodings)
//     const appearanceDetails = {} as AltTrackAppearanceDetailsOverlaid;
    
//     appearanceDetails.assembly = track.assembly;
//     appearanceDetails.layout = altParentValues.layout;
//     appearanceDetails.overlaid = true;
//     appearanceDetails.encodings = getSeparatedEncodings(track);
    
//     const marks = [] as Mark[];
//     const encodingsByMark = [] as AltEncodingSeparated[];
//     if (track.mark) {
//         marks.push(track.mark);
//     }
//     for (const o of track._overlay) {
//         const partialOverlaidTrack = o as Partial<OverlaidTrack>;
//         if (partialOverlaidTrack.mark) {
//             marks.push(partialOverlaidTrack.mark);
//         }
//         encodingsByMark.push(getSeparatedEncodings(partialOverlaidTrack));
        
//     }
//     appearanceDetails.mark = marks;
//     appearanceDetails.encodingsByMark = encodingsByMark;
    
//     // data
//     if (track.data) {
//         const dataFields = determineFields(track.data, appearanceDetails.encodings);
//         const dataDetails: AltTrackDataDetails = {data: track.data, fields: dataFields};
//         const data: AltTrackData = {description: '', details: dataDetails};
//         altTrack.data = data;
//     }

//     // add temporary empty descriptions
//     const position: AltTrackPosition = {description: '', details: positionDetails};
//     const appearance: AltTrackAppearanceOverlaid = {description: '', details: appearanceDetails};
   
//     // add to altTrack
//     altTrack.uid = uid;
//     altTrack.position = position;
//     altTrack.appearance = appearance;
//     altTrack.title = track.title;
   
    
//     // determine type if possible
//     const charttypes = [] as string[];
//     for (let i = 0; i < marks.length; i++) {
//         const charttype = determineSpecialCases(altTrack, i);
//         if (charttype) {
//             charttypes.push(charttype);
//         }
//     }
//     altTrack.charttype = charttypes;

//     // empty description, to be filled in.
//     altTrack.description = '';

//     return altTrack;
// }

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
    for (let t of tracks) {
        if (IsOverlaidTrack(t)) {
            let newTrack;
            if (IsOverlaidTrack(t._overlay[0])) {
                newTrack = {...t, ...t._overlay[0]._overlay[0]} as any;
            } else {
                newTrack = {...t, ...t._overlay[0]} as any;
            }
            delete newTrack._overlay;
            delete newTrack.overlayOnPreviousTrack;
            t = newTrack as SingleTrack;
        }
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

    altTrack.tracks = altTrackInd;
    altTrack.uids = uids;

    const position: AltTrackPosition = {description: '', details: positionDetails};
    altTrack.position = position;
    
    altTrack.title = specPart.title;

    const combinedChartType = determineOverlaidByDataCases(altTrack);
    altTrack.appearance = {description: '', details: {layout: 'linear', charttype: combinedChartType}}; // only linear is supported at this time

    altTrack.description = '';

    return altTrack;
}



function altOverlaidByDataSingleTrack(
    track: SingleTrack,
    altParentValues: AltParentValues,
    counter: AltCounter
): AltTrackOverlaidByDataInd {
    const altTrack = {} as AltTrackOverlaidByDataInd;
    altTrack.alttype = 'ov-data-ind';

    // uid
    let uid;
    if (track.id !== 'unknown') {
        uid = track.id as string;
    } else {
        // figure out how to get the uid.
        uid = '';
    }

    altTrack.uid = uid;

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


// function getLinking(altSpec: AltGoslingSpec) {
//     let linkingMapping = [] as {linkingId: string; brushTrack: AltLinkedTrack, linkedTracks: AltLinkedTrack[]; channel: string}[];
//     let allLinkChilds = [] as {linkingId: string; trackNumber: number; positionDesc: string}[];
//     let allLinkParents = [] as {linked: AltLinked; trackNumber: number; positionDesc: string}[];
    
//     for (const i in altSpec.tracks) {
//         const track = altSpec.tracks[i]
//         if (track.alttype === 'single' || track.alttype === 'ov-mark') {
//             if (track.appearance.details.linkingId) {
//                 allLinkChilds.push({linkingId: track.appearance.details.linkingId, trackNumber: track.position.details.trackNumber, positionDesc: track.position.description});
//             }
//             if (track.appearance.details.linked && track.appearance.details.linked.length > 0) {
//                 for (const linkedInner of track.appearance.details.linked) {
//                     allLinkParents.push({linked: linkedInner, trackNumber: track.position.details.trackNumber, positionDesc: track.position.description});
//                 }
//             }
//         } else {
//             for (const t of track.tracks) {
//                 if (t.appearance.details.linkingId) {
//                     allLinkChilds.push({linkingId: t.appearance.details.linkingId, trackNumber: track.position.details.trackNumber, positionDesc: track.position.description});
//                 }
//                 if (t.appearance.details.linked && t.appearance.details.linked.length > 0) {
//                     for (const linkedInner of t.appearance.details.linked) {
//                         allLinkParents.push({linked: linkedInner, trackNumber: track.position.details.trackNumber, positionDesc: track.position.description});
//                     }
//                 }
//             }
//         }
//     }

//     console.log('all parents', allLinkParents)
//     for (const lParent of allLinkParents) {
//         linkingMapping.push({
//             linkingId: lParent.linked.linkingId,
//             brushTrack: {
//                 trackNumber: lParent.trackNumber,
//                 positionDesc: lParent.positionDesc
//             },
//             linkedTracks: [],
//             channel: lParent.linked.channel
//         })
//     }
//     for (const lChild of allLinkChilds) {
//         for (const lMap of linkingMapping) {
//             if (lChild.linkingId === lMap.linkingId) {
//                 lMap.linkedTracks.push({
//                     trackNumber: lChild.trackNumber,
//                     positionDesc: lChild.positionDesc
//                 })
//             }
//         }
//     }
//     return linkingMapping;
// }