import type { GoslingSpec, Mark, Track, SingleTrack, DataDeep, Encoding, OverlaidTrack, OverlaidTracks, DataTransform } from '@alt-gosling/schema/gosling.schema';
import type {
    AltGoslingSpec, AltTrack, AltTrackSingle,
    AltTrackOverlaid, AltTrackOverlaidByMark, AltTrackOverlaidByData,
    AltSpecComposition, AltCounter, AltParentValues, AltTrackPosition, AltTrackPositionDetails,
    AltTrackAppearance, AltTrackAppearanceDetails, AltTrackAppearanceOverlaid,  AltTrackAppearanceDetailsOverlaid,
    AltTrackData, AltTrackDataDetails, AltTrackOverlaidByDataInd, AltTrackDataFields,
    AltEncodingSeparated, EncodingValueSingle, EncodingDeepSingle } from '@alt-gosling/schema/alt-gosling-schema';
import { IsOverlaidTracks, IsOverlaidTrack, IsChannelDeep, IsChannelValue } from '@alt-gosling/schema/gosling.schema.guard';
import { SUPPORTED_CHANNELS } from '@alt-gosling/schema/supported_channels';

import { attributeExists, attributeExistsReturn } from '../util';
import { determineSpecialCases } from './chart-types';
// @ts-expect-error no type definition
import { _convertToFlatTracks, _spreadTracksByData } from 'gosling.js/utils';
import { spec } from 'node:test/reporters';


export function getAltSpec(
    spec: GoslingSpec
): AltGoslingSpec {
    const altSpec = {} as AltGoslingSpec;
    altSpec.tracks = {} as (AltTrack)[];

    altSpec.title =  spec.title;
    altSpec.subtitle =  spec.subtitle;

    const counter = {'nTracks' : 0, 'rowViews' : 0, 'colViews' : 0, 'allPositions': [[0,0]] as number[][], 'totalRows': 0, 'totalCols': 0, 'matrix': {} as number[][]};
    const altParentValues = {} as AltParentValues;

    if (attributeExists(spec, 'arrangement') && attributeExistsReturn(spec, 'arrangement')) {
        altParentValues.arrangement = attributeExistsReturn(spec, 'arrangement');
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
            console.log('multiple tracks');

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
         
        // if only one track is present, it is either a single track or an overlaid track with the same data
        // (as this is all performed on the _specProcessed which has already been convertToFlatTracks and spreadByData)
        } else {
            console.log('only 1 track');
            if (IsOverlaidTrack(specPart.tracks[0])) {
                console.log('is overlaid track');
                const track = specPart.tracks[0] as OverlaidTrack;
                altSpec.tracks[counter.nTracks] = altOverlaidTrack(track, altParentValues, counter);
            } else {
                const track = specPart.tracks[0] as SingleTrack;
                altSpec.tracks[counter.nTracks] = altSingleTrack(track, altParentValues, counter);
            }
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
        console.warn('ID not found?')
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

function convertToSingleTrack(
    specPart: OverlaidTrack,
    altParentValues: AltParentValues,
    counter: AltCounter
) {
    let newTrack = {...specPart, ...specPart._overlay[0]} as any;
    delete newTrack._overlay;
    delete newTrack.overlayOnPreviousTrack;
    newTrack = newTrack as SingleTrack;
    const altTrack = altSingleTrack(newTrack, altParentValues, counter);
    return [altTrack, specPart._overlay];
}

type altOverlayPart = {
    mark?: Mark,
    dataTransform?: DataTransform,
} & any;

function convertToSingleTrack2(
    specPart: OverlaidTrack,
    altOverlay: altOverlayPart,
    altParentValues: AltParentValues,
    counter: AltCounter
) {
    // console.log('h', specPart)
    // console.log('h', altOverlay)
    let newTrack = {...specPart, ...altOverlay} as any;
    delete newTrack._overlay;
    delete newTrack.overlayOnPreviousTrack;
    newTrack = newTrack as SingleTrack;
    // console.log('new track', newTrack)
    const altTrack = altSingleTrack(newTrack, altParentValues, counter);
    // console.log('new alttrack', altTrack)
    return altTrack;
}

function altOverlaidTrack(
    specPart: OverlaidTrack,
    altParentValues: AltParentValues,
    counter: AltCounter
) {
    // const [singleTrack, _overlay] = convertToSingleTrack(specPart, altParentValues, counter);

    let altOverlay = [] as altOverlayPart[];

    
    for (let i = 0; i < specPart._overlay.length; i++) {
        // console.log('here', i, specPart._overlay[i])
        altOverlay.push({} as altOverlayPart);
    }
   
    for (let i = 0; i < specPart._overlay.length; i++) {
        if (specPart._overlay[i].mark) {
            altOverlay[i].mark = specPart._overlay[i].mark;
        } else {
            if (specPart.mark) {
                altOverlay[i].mark = specPart.mark;
            }
        }

        SUPPORTED_CHANNELS.forEach(k => {
            if (k === 'text') {
                return
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

    
    let includeInTop = {} as any;
    let excludeInTop = {} as any;

    // if no undefined and only 1 unique item, include in top
    if (altOverlay.filter(e => e.mark === undefined).length === 0 && [...new Set(altOverlay.map(e => e.mark))].length === 1) {
        includeInTop.mark = altOverlay[0].mark;
        altOverlay.map(e => delete e.mark);
    } else {
        excludeInTop.mark = true;
    }


    SUPPORTED_CHANNELS.forEach(k => {
        if (k === 'text') {
            return
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
            return
        }
        if (excludeInTop[k]) {
            delete specPart[k];
        }

        if (includeInTop[k]) {
            specPart[k] = includeInTop[k];
        }
    });


    console.log(specPart);
    console.log(altOverlay)
    const singleTracks = [] as AltTrackSingle[];
     // const [singleTrack, _overlay] = convertToSingleTrack(specPart, altParentValues, counter);
    for (let i = 0; i < specPart._overlay.length; i++) {
        singleTracks.push(convertToSingleTrack2(specPart, altOverlay[i], altParentValues, counter));
    }
    

    [specPart, altOverlay, singleTracks]
    console.log(singleTracks)

    



    
    let singleTrack = singleTracks[1]


    // console.log(theMarks);
    // console.log(undefined in ['bar', 'point', undefined])

    // let skdjfslk = new Set(['bar', 'point', undefined]);
    // console.log(skdjfslk)
    
    // SUPPORTED_CHANNELS.forEach(k => {
    //     if (k === 'text') {
    //         return
    //     }

    //     let theChannel = altOverlay.map(e => e[k]);
        
    // });
    
    // for (let i = 0; i < specPart._overlay.length; i++) {
        
    //     // if (specPart._overlay[i].mark) {
    //     //     altOverlay[i].mark = specPart._overlay[i].mark;
    //     // } else {
    //     //     if (specPart.mark) {
    //     //         altOverlay[i].mark = specPart.mark;
    //     //     }
    //     // }

    //     // SUPPORTED_CHANNELS.forEach(k => {
    //     //     if (k === 'text') {
    //     //         return
    //     //     }

    //     //     if (specPart._overlay[i][k]) {
    //     //         altOverlay[i][k] = specPart._overlay[i][k];
    //     //     } else {
    //     //         if (specPart[k]) {
    //     //             altOverlay[i][k] = specPart[k];
    //     //         }
    //     //     }
    //     // });

    //     // if (specPart._overlay[i].dataTransform) {
    //     //     altOverlay[i].dataTransform = specPart._overlay[i].dataTransform;
    //     // } else {
    //     //     if (specPart.dataTransform) {
    //     //         altOverlay[i].dataTransform = specPart.dataTransform;
    //     //     }
    //     // }
    // }





    // if (specPart.mark) {
    //     for (let i = 0; i < specPart._overlay.length; i++) {



    //         if (specPart._overlay[i].mark) {
    //             altOverlay[i].mark = specPart._overlay[i].mark;
    //         } else {
    //             altOverlay[i].mark = ;
    //         }
    //     }
    // }

    // SUPPORTED_CHANNELS.forEach(k => {
    //     if

    //     if (k === 'text') {
    //         return
    //     }
    //     const c = specPart[k];
    //     if (c) {
    //         for (let i = 0; i < specPart._overlay.length; i++) {
    //             if (specPart._overlay[i][k]) {
    //                 altOverlay[i][k] = specPart._overlay[i][k];
    //             } else {
    //                 altOverlay[i][k] = c;
    //             }
    //         }
    //     }
    // });


    
    // let markAllSame = true;
    // for (let i = 1; i < specPart._overlay.length; i++) {
    //     if (specPart._overlay[0].mark && specPart._overlay[i].mark) {

    //     }
    //     // console.log(i, specPart._overlay[i])
    //     // determineDifference(specPart._overlay[0], specPart._overlay[i]);
    // }
    

    // everything: 
    // - mark
    // - encodings
    // - data transforms
    // first check that everything in the top is not overwritten in the bottom ones

    // first put everything that is the same in all overlays in the top one
    
    // then delete everything that is in the top one from the bottom one
    
    // for (let i = 0; i < specPart._overlay.length; i++) {
    //     console.log(i, specPart._overlay[i])
    //     // determineDifference(specPart._overlay[0], specPart._overlay[i]);
    // }
    // for (const t of specPart._overlay) {
    //     specPart._overlay[0];
    // }
    // // console.log('overlay', _overlay);
    
    // console.log(typeof(_overlay))
    // for (let i = 1; i < Object.keys(_overlay).length; i++) {
    //     // const j = Object.keys(_overlay)[i];

    //     // determineDifference(_overlay[j], _overlay[0])
    //     console.log('ov', i)
    // }

    

    return singleTrack;
}

// first put everything that is the same in all overlays in the top one
// then



// function determineDifference(
//     overlay1: Partial<Omit<SingleTrack, "title" | "subtitle" | "width" | "height" | "layout">>, 
//     overlay2: Partial<Omit<SingleTrack, "title" | "subtitle" | "width" | "height" | "layout">>
// ) {
//     const difference = {} as any;

//     if (overlay1.dataTransform && overlay2.dataTransform) {
//         if (overlay1.dataTransform !== overlay2.dataTransform) {
//             difference.dataTransform = [overlay1.dataTransform, overlay2.dataTransform]
//         }
//     }
//     if (overlay1.mark && overlay2.mark) {
//         if (overlay1.mark !== overlay2.mark) {
//             difference.dataTransform = [overlay1.mark, overlay2.mark]
//         }
//     }

//     SUPPORTED_CHANNELS.forEach(k => {
//         const c1 = overlay1[k];
//         const c2 = overlay2[k];
//     });

// }



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

function altOverlaidByMark(
    track: OverlaidTrack,
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
    for (const o of track._overlay) {
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