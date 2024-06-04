import type { AltEncodingDesc, AltEncodingSeparated, AltGoslingSpec, AltTrackOverlaidByDataInd, AltTrackOverlaidByMark, AltTrackSingle } from '@alt-gosling/schema/alt-gosling-schema';
import { arrayToString, markToText, channelToText, capDesc } from '../util';

import { GetColorName } from 'hex-color-to-color-name';

export function addTreeDescriptions(altGoslingSpec: AltGoslingSpec) {
    addTrackPositionDescriptions(altGoslingSpec);
    addTrackAppearanceDescriptions(altGoslingSpec);
}

function addTrackPositionDescriptions(altGoslingSpec: AltGoslingSpec) {
    if (altGoslingSpec.composition.nTracks == 1) {
        altGoslingSpec.tracks[0].position.description = 'There is only one view.';
        if (altGoslingSpec.tracks[0].alttype === 'single') {
            altGoslingSpec.composition.description = 'There is one (' + altGoslingSpec.tracks[0].appearance.details.layout + ') track.';
        } else {
            altGoslingSpec.composition.description = 'There is one (overlaid) track.';
        }
    } else if (altGoslingSpec.composition.nTracks == 2) {
        addTrackPositionDescriptionsTwo(altGoslingSpec);
    } else {
        addTrackPositionDescriptionsMulti(altGoslingSpec);
    }
}


function addTrackPositionDescriptionsTwo(altGoslingSpec: AltGoslingSpec) {
    let firstPlace = '';
    let secondPlace = '';
    let desc = '';
    
    let nCircular = 0;
    if (altGoslingSpec.tracks[0].appearance.details.layout === 'circular') {
        nCircular += 1;
    }
    if (altGoslingSpec.tracks[1].appearance.details.layout === 'circular') {
        nCircular += 1;
    }

    if (nCircular == 2) {
        if (JSON.stringify(altGoslingSpec.composition.counter.serialCircular).indexOf(JSON.stringify([0,1])) !== -1 ) {
            firstPlace = 'left half of ring';
            secondPlace = 'right half of ring';
            desc = 'Two circular tracks form one ring, with both the half of the ring.';
        } else if (JSON.stringify(altGoslingSpec.composition.counter.parallelCircular).indexOf(JSON.stringify([0,1])) !== -1 ) {
            firstPlace = 'outer ring';
            secondPlace = 'inner ring';
            desc = 'Two circular tracks form two rings, one around the other.';
        }
        else if (altGoslingSpec.composition.counter.totalRows < 2) {
            firstPlace = 'left';
            secondPlace = 'right';
            desc = 'Two circular tracks are shown next to each other.';
        }
        else {
            firstPlace = 'top';
            secondPlace = 'bottom';
            desc = 'Two circular tracks are shown below each other.';
        }
    }
   else {
        if (altGoslingSpec.composition.counter.totalRows < 2) {
            firstPlace = 'left';
            secondPlace = 'right';
            desc = ' are shown next to each other.';
        }
        else {
            firstPlace = 'top';
            secondPlace = 'bottom';
            desc = 'are shown below each other.';
        }
    }
    altGoslingSpec.tracks[0].position.description = firstPlace;
    altGoslingSpec.tracks[1].position.description = secondPlace;
    altGoslingSpec.composition.description = desc;
}


function addTrackPositionDescriptionsMulti(altGoslingSpec: AltGoslingSpec) {
    const positionWords = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth'];

    let desc = '';
    if (altGoslingSpec.composition.counter.totalRows === 1) {
        // all horizontal
        desc = desc.concat('There are ' + (altGoslingSpec.composition.counter.nTracks) + ' tracks, displayed next to each other.');

    } else if (altGoslingSpec.composition.counter.totalCols === 1) {
        // all vertical
        desc = desc.concat('There are ' + (altGoslingSpec.composition.counter.nTracks) + ' tracks, displayed below each other.');
    }

    else {
        desc = desc.concat('There are ' + (altGoslingSpec.composition.counter.nTracks) + ' tracks.');
        desc = desc.concat(' There are ' + (altGoslingSpec.composition.counter.totalRows) + ' rows.');

        const rowLengths = Object.keys(altGoslingSpec.composition.counter.matrix).map(t => Object.keys(altGoslingSpec.composition.counter.matrix[t as unknown as number]).length);
        const rowLengthsUnique = [...new Set(rowLengths)];
   
        if (rowLengthsUnique.length == 1) {
            desc = desc.concat(' Each row has ' + rowLengthsUnique[0] + ' tracks next to each other.');
        } else if (rowLengthsUnique.length == 2) {
            const rowsWithFirstLength = [] as number[];
            const rowsWithSecondLength = [] as number[];
            for(let i = 0; i < rowLengths.length; i++) {
                if (rowLengths[i] === rowLengthsUnique[0]) {
                    rowsWithFirstLength.push(i);
                } else {
                    rowsWithSecondLength.push(i);
                }
            }
            if (0 in rowsWithFirstLength) {
                desc = desc.concat(' Row(s) ' + arrayToString(rowsWithFirstLength.map(t => t+1)) + ' have ' + rowLengthsUnique[0] + ' column(s) each.');
                desc = desc.concat(' The other rows have ' + rowLengthsUnique[1] + ' column(s) each.');
            } else {
                desc = desc.concat(' Row(s) ' + arrayToString(rowsWithSecondLength.map(t => t+1)) + ' have ' + rowLengthsUnique[1] + ' column(s) each.');
                desc = desc.concat(' The other rows have ' + rowLengthsUnique[0] + ' column(s) each.');
            }
        }
        else {
            for (let i = 0; i < altGoslingSpec.composition.counter.totalRows; i++) {
                if (i > 9) {
                    desc = desc.concat(' Row number ' + i + ' has ' + altGoslingSpec.composition.counter.matrix[i].length + ' track(s) next to each other.');
                } else {
                    desc = desc.concat(' The ' + positionWords[i] + ' row has ' + altGoslingSpec.composition.counter.matrix[i].length + ' track(s) next to each other.');
                }
            }
        }
    }

    // add the description to altGoslingSpec
    altGoslingSpec.composition.description = desc;

    // if only 1 row / 1 column, dont do this
    for (const i in altGoslingSpec.tracks) {
        let descTrack = '';
        const trackPosition = altGoslingSpec.tracks[i].position.details;
        const counter = altGoslingSpec.composition.counter;

        // indication of row is only useful if there is more than 1 row
        if (altGoslingSpec.composition.counter.totalRows > 1) {
            if (trackPosition.rowNumber === 0) {
                descTrack = descTrack.concat('top row');
            } else if (trackPosition.rowNumber === counter.totalRows - 1) {
                descTrack = descTrack.concat('bottom row');
            } else if (trackPosition.rowNumber < 10) {
                descTrack = descTrack.concat(positionWords[trackPosition.rowNumber] + ' row');
            } else {
                descTrack = descTrack.concat('row ' + trackPosition.rowNumber + 1);
            }
        }
        // indication of column is only useful if there is more than 1 column
        if (altGoslingSpec.composition.counter.totalCols > 1) {
            // there can still be rows with only 1 column, so for each track, check if there is more than 1 column
            if (Object.keys(counter.matrix[trackPosition.colNumber]).length > 1) {
                // add a comma and space if there is already a row description
                if (descTrack.length > 1) {
                    descTrack = descTrack.concat(', ');
                }
                if (trackPosition.colNumber === 0) {
                    descTrack = descTrack.concat('left');
                } else if (trackPosition.colNumber === Object.keys(counter.matrix[trackPosition.rowNumber]).length - 1) {
                    descTrack = descTrack.concat('right');
                } else if (trackPosition.colNumber === 2 && Object.keys(counter.matrix[trackPosition.rowNumber]).length === 2) {
                    descTrack = descTrack.concat('middle');
                } else {
                    descTrack = descTrack.concat(positionWords[trackPosition.colNumber] + ' from left');
                }
            }
        }
        altGoslingSpec.tracks[i].position.description = descTrack;
    }
}




function addTrackAppearanceDescriptions(altGoslingSpec: AltGoslingSpec) {
    for (const i in altGoslingSpec.tracks) {
        const track = altGoslingSpec.tracks[i];

        if (track.alttype === 'single') {
            let desc = '';

            desc = desc.concat(`${capDesc(track.charttype)}.`);

            if (track.title) {
                desc = desc.concat(` Chart is titled '${track.title}'.`);
            }
    
            const encodingDescriptions = addEncodingDescriptions(track);

            desc = desc.concat(` ${encodingDescriptions.desc}`);

            if (track.appearance.details.linked && track.appearance.details.linked.length > 0) {
                const linkChannels = track.appearance.details.linked.map(l => l.channel);
                if (linkChannels.length === 1) {
                    desc = desc.concat(` The ${linkChannels[0]}-axis has a brush, linking to the other chart.`);
                } else {
                    desc = desc.concat(` The x and y-axes have brushes, linking to the other charts.`);
                }
            }
        
            track.appearance.description = desc;
            track.appearance.details.encodingsDescList = encodingDescriptions.descList;
        } else if (track.alttype === 'ov-mark') {
            let desc = '';

            desc = desc.concat(`${capDesc(arrayToString(track.charttype))}.`);

            if (track.title) {
                desc = desc.concat(` Chart is titled '${track.title}'.`);
            }

            const encodingDescriptions = addEncodingDescriptions(track);

            desc = desc.concat(' ' + encodingDescriptions.desc);

            if (track.appearance.details.linked && track.appearance.details.linked.length > 0) {
                const linkChannels = track.appearance.details.linked.map(l => l.channel);
                if (linkChannels.length === 1) {
                    desc = desc.concat(` The ${linkChannels[0]}-axis has a brush, linking to one of the other charts.`);
                } else {
                    desc = desc.concat(` The x and y-axes have brushes, linking to one of the other charts.`);
                }
            }

            track.appearance.description = desc;
            track.appearance.details.encodingsDescList = encodingDescriptions.descList;
        } else if (track.alttype === 'ov-data') {
            for (let i = 0; i < Object.keys(track.tracks).length; i++) {
                const overlaidDataTrack = track.tracks[i];
                let descTrack = '';
                descTrack = descTrack.concat(`${capDesc(overlaidDataTrack.charttype)}.`);

                const encodingDescriptions = addEncodingDescriptions(overlaidDataTrack);

                descTrack = descTrack.concat(' ' + encodingDescriptions.desc);
            
                overlaidDataTrack.appearance.description = descTrack;
                overlaidDataTrack.appearance.details.encodingsDescList = encodingDescriptions.descList;
            }
        }
    }
}

function addEncodingDescriptions(track: AltTrackSingle | AltTrackOverlaidByMark | AltTrackOverlaidByDataInd) {
    let mark;
    let marks;
    let markText;
    
    if (track.alttype === 'single' || (track.alttype === 'ov-mark' && track.appearance.details.mark) || track.alttype === 'ov-data-ind') {
        mark = track.appearance.details.mark as string;
        markText = markToText.get(mark) as string;
        const {descGenomic, descQuantitative, descNominal, descValue, descList} = addEncodingDescriptionsAll(markText, track.appearance.details.encodings);
        const desc = [descGenomic, descQuantitative, descNominal, descValue].join(' ');
        return {desc: desc, descList: descList};
    } else {
        marks = track.appearance.details.markByTrack as string[];
        const descriptionsList = [];

        markText = arrayToString(marks.filter(m => m !== undefined).map(m => markToText.get(m)).filter(m => m !== undefined));
        descriptionsList.push(addEncodingDescriptionsAll(markText, track.appearance.details.encodings));

        for (let i = 0; i < marks.length; i++) {
            if (marks[i]) {
                markText = markToText.get(marks[i]) as string;
                descriptionsList.push(addEncodingDescriptionsAll(markText, track.appearance.details.encodingsByTrack[i]));
            }
        }
        
        const descGenomicAll = descriptionsList.map(d => d.descGenomic).filter(d => d !== '').join(' ');
        const descQuantitativeAll = descriptionsList.map(d => d.descQuantitative).filter(d => d !== '').join(' ');
        const descNominalAll = descriptionsList.map(d => d.descNominal).filter(d => d !== '').join(' ');
        const descValueAll = descriptionsList.map(d => d.descValue).filter(d => d !== '').join(' ');
        const desc = [descGenomicAll, descQuantitativeAll, descNominalAll, descValueAll].join(' ');

        const descListAll = descriptionsList.map(d => d.descList);
        let descListAllFlat = descListAll[0].concat(...descListAll.slice(1));

        // collapse duplicates
        const descListAllFlatNames = descListAllFlat.map(d => d.channel);
        const descListDuplicates = descListAllFlatNames.filter((item, index) => descListAllFlatNames.indexOf(item) !== index);
        for (const descListDuplicate of descListDuplicates) {
            const duplicateItems = descListAllFlat.filter(item => item.channel === descListDuplicate).map(item => item.desc).join(' ');
            descListAllFlat = descListAllFlat.filter(item => item.channel !== descListDuplicate);
            descListAllFlat.push({
                channel: descListDuplicate,
                desc: duplicateItems,
                channelType: descListAllFlat.filter(item => item.channel === descListDuplicate).map(item => item.channelType).join(' ')
            } as AltEncodingDesc);
        }
        return {desc: desc, descList: descListAllFlat};
    }
}

function addEncodingDescriptionsAll(markText: string, encodings: AltEncodingSeparated) {
    let descGenomic = '';
    let descQuantitative = '';
    let descNominal = '';
    let descValue = '';

    const descList = [] as AltEncodingDesc[];

    // genomic encodings
    const genomicEncodingsI = encodings.encodingDeepGenomic.map(o => o.name);
    if (genomicEncodingsI.includes('x') && genomicEncodingsI.includes('y')) {
        descGenomic = descGenomic.concat(`The genome is shown on both the x- and y-axes.`);
        if (genomicEncodingsI.includes('xe') && genomicEncodingsI.includes('ye')) {
            descGenomic = descGenomic.concat(` Both axes show intervals.`);
            descList.push({
                channel: 'x',
                desc: `The x-axis show genomic intervals.`,
                channelType: 'genomic'
            } as AltEncodingDesc);
            descList.push({
                channel: 'y',
                desc: `The y-axis show genomic intervals.`,
                channelType: 'genomic'
            } as AltEncodingDesc);
        } else if (genomicEncodingsI.includes('xe')) {
            descGenomic = descGenomic.concat(` The genome on the x-axis displays genomic intervals.`);
            descList.push({
                channel: 'x',
                desc: `The x-axis show genomic intervals.`,
                channelType: 'genomic'
            } as AltEncodingDesc);
            descList.push({
                channel: 'y',
                desc: `The y-axis shows the genome.`,
                channelType: 'genomic'
            } as AltEncodingDesc);
        } else if (genomicEncodingsI.includes('ye')) {
            descGenomic = descGenomic.concat(` The genome on the y-axis displays genomic intervals.`);
            descList.push({
                channel: 'x',
                desc: `The x-axis shows the genome.`,
                channelType: 'genomic'
            } as AltEncodingDesc);
            descList.push({
                channel: 'y',
                desc: `The y-axis show genomic intervals.`,
                channelType: 'genomic'
            } as AltEncodingDesc);
        } else {
            descList.push({
                channel: 'x',
                desc: `The x-axis shows the genome.`,
                channelType: 'genomic'
            } as AltEncodingDesc);
            descList.push({
                channel: 'y',
                desc: `The y-axis shows the genome.`,
                channelType: 'genomic'
            } as AltEncodingDesc);
        }
    } else {
        if (genomicEncodingsI.includes('x')) {
            let add = '';
            if (genomicEncodingsI.includes('xe')) {
                add = 'in intervals ';
                descList.push({
                    channel: 'x',
                    desc: `The x-axis show genomic intervals.`,
                    channelType: 'genomic'
                } as AltEncodingDesc);
            } else {
                descList.push({
                    channel: 'x',
                    desc: `The x-axis shows the genome.`,
                    channelType: 'genomic'
                } as AltEncodingDesc);
            }
            descGenomic = descGenomic.concat(`The genome is shown ${add}on the x-axis.`);
        }

        if (genomicEncodingsI.includes('y')) {
            let add = '';
            if (genomicEncodingsI.includes('ye')) {
                add = 'in intervals ';
                descList.push({
                    channel: 'y',
                    desc: `The y-axis show genomic intervals.`,
                    channelType: 'genomic'
                } as AltEncodingDesc);
            } else {
                descList.push({
                    channel: 'y',
                    desc: `The y-axis shows the genome.`,
                    channelType: 'genomic'
                } as AltEncodingDesc);
            }
            descGenomic = descGenomic.concat(`The genome is shown ${add}on the y-axis.`);
        }
    }
    // if (attributeExists(track.data.details.data, 'binSize')) {
    //     let bin = attributeExistsReturn(track.data.details.data, 'binSize') * 256;
    //     if (typeof bin === 'number') {
    //         descGenomic = descGenomic.concat(' Data is binned in intervals of ' +  + ' basepairs.');
    //     }
    // }

    // expression encodings
    const quantitativeEncodingsI = encodings.encodingDeepQuantitative.map(o => o.name);

    if (quantitativeEncodingsI.length > 1) {
        descQuantitative = descQuantitative.concat(`The expression values are shown with ${markText} on the ${arrayToString(quantitativeEncodingsI)}-axes.`);
        for (const q of quantitativeEncodingsI) {
            descList.push({
                channel: q,
                desc: `The ${channelToText.get(q)} of the ${markText} shows the expression values.`,
                channelType: 'quantitative'
            } as AltEncodingDesc);
        }
    } else if (quantitativeEncodingsI.length === 1) {
        if (quantitativeEncodingsI.includes('y')) {
            descQuantitative = descQuantitative.concat(`The expression is shown on the y-axis with ${markText}.`);
            descList.push({
                channel: 'y',
                desc: `The y-axis shows the expression with ${markText}.`,
                channelType: 'quantitative'
            } as AltEncodingDesc);
        }
        else if (quantitativeEncodingsI.includes('color')) {
            descQuantitative = descQuantitative.concat('The height of the expression values is shown with color.');
            descList.push({
                channel: 'color',
                desc: `The color of the ${markText} shows the expression values.`,
                channelType: 'quantitative'
            } as AltEncodingDesc);
        }
        else {
            descQuantitative = descQuantitative.concat(`The height of the expression values is shown with the ${quantitativeEncodingsI[0]}-axis.`);
            descList.push({
                channel: channelToText.get(quantitativeEncodingsI[0]) as string,
                desc: `The ${channelToText.get(quantitativeEncodingsI[0])} of the ${markText} shows the expression values.`,
                channelType: 'quantitative'
            } as AltEncodingDesc);
        }
    }

    // nominal encodings
    let nominalEncodingsI = encodings.encodingDeepNominal.map(o => o.name);
    nominalEncodingsI = nominalEncodingsI.filter(e => e !== 'text');

    if (nominalEncodingsI.length > 1) {
        if (nominalEncodingsI.includes('row')) {
            descNominal = descNominal.concat(`The chart is stratified by rows for the categories.`);
            const nominalEncodingsINames = nominalEncodingsI.filter(e => e !== 'row').map(e => channelToText.get(e)) as string[];
            descNominal = descNominal.concat(` The categories are also shown with the ${arrayToString(nominalEncodingsINames)} of the ${markText}.`);
            descList.push({
                channel: 'row',
                desc: `The chart is stratified by rows for the categories.`,
                channelType: 'nominal'
            } as AltEncodingDesc);
            for (const q of nominalEncodingsINames) {
                descList.push({
                    channel: channelToText.get(q) as string,
                    desc: `The ${channelToText.get(q)} of the ${markText} show the different categories.`,
                    channelType: 'nominal'
                } as AltEncodingDesc);
            }
        }
        else {
            const nominalEncodingsINames = nominalEncodingsI.map(e => channelToText.get(e)) as string[];
            descNominal = descNominal.concat(`The categories are shown with the ${arrayToString(nominalEncodingsINames)} of the ${markText}.`);
            for (const q of nominalEncodingsI) {
                descList.push({
                    channel: channelToText.get(q) as string,
                    desc: `The ${channelToText.get(q)} of the ${markText} show the different categories.`,
                    channelType: 'nominal'
                } as AltEncodingDesc);
            }
        }
    }
    else if (nominalEncodingsI.length == 1) {
        if (nominalEncodingsI.includes('row')) {
            descNominal = descNominal.concat(`The chart is stratified by rows for the categories.`);
            descList.push({
                channel: 'row',
                desc: `The chart is stratified by rows for the categories.`,
                channelType: 'nominal'
            } as AltEncodingDesc);
        }
        else {
            descNominal = descNominal.concat(`The ${channelToText.get(nominalEncodingsI[0])} of the ${markText} indicates the different categories.`);
            descList.push({
                channel: channelToText.get(nominalEncodingsI[0]) as string,
                desc: `The ${channelToText.get(nominalEncodingsI[0])} of the ${markText} show the different categories.`,
                channelType: 'nominal'
            } as AltEncodingDesc);
        }
    }

    // value encodings
    for (let i = 0; i < encodings.encodingValue.length; i++) {
        const e = encodings.encodingValue[i];
        if (e.name === 'color') {
            // if the color is denoted as a hex code, get the name of the color value
            if (typeof e.details.value === 'string') {
                if (e.details.value[0] === '#') {
                    e.details.value = GetColorName(e.details.value.slice(0)).toLowerCase();
                }
            }
            descValue = descValue.concat(`The color of the ${markText} is ${e.details.value}.`);
            descList.push({
                channel: 'color',
                desc: `The color of the ${markText} is ${e.details.value}.`,
                channelType: 'nominal'
            } as AltEncodingDesc);
        }
    }

    // const desc = ''.concat(descGenomic + ' ' + descQuantitative + ' ' + descNominal + ' ' + descValue);

    return {descGenomic: descGenomic, descQuantitative: descQuantitative, descNominal: descNominal, descValue: descValue, descList: descList};
}





// function addEncodingDescriptions(track: AltTrackSingle) {
//     const mark = track.appearance.details.mark as string;
    
//     let descGenomic = '';
//     let descQuantitative = '';
//     let descNominal = '';
//     let descValue = '';

//     const descList = [] as string[][];

//     // genomic encodings
//     const genomicEncodingsI = track.appearance.details.encodings.encodingDeepGenomic.map(o => o.name);
//     if (genomicEncodingsI.includes('x') && genomicEncodingsI.includes('y')) {
//         descGenomic = descGenomic.concat('The genome is shown on both the x- and y-axes.');
//         if (genomicEncodingsI.includes('xe') && genomicEncodingsI.includes('ye')) {
//             descGenomic = descGenomic.concat(' Each displays genomic intervals.');
//             descList.push(['x', 'The x-axis show genomic intervals.']);
//             descList.push(['y', 'The y-axis show genomic intervals.']);
//         } else if (genomicEncodingsI.includes('xe')) {
//             descGenomic = descGenomic.concat(' The genome on the x-axis displays genomic intervals.');
//             descList.push(['x', 'The x-axis show genomic intervals.']);
//             descList.push(['y', 'The y-axis shows the genome.']);

//         } else if (genomicEncodingsI.includes('ye')) {
//             descGenomic = descGenomic.concat(' The genome on the y-axis displays genomic intervals.');
//             descList.push(['x', 'The x-axis shows the genome.']);
//             descList.push(['y', 'The y-axis show genomic intervals.']);
//         } else {
//             descList.push(['x', 'The x-axis shows the genome.']);
//             descList.push(['y', 'The y-axis shows the genome.']);
//         }
//     } else {
//         if (genomicEncodingsI.includes('x')) {
//             let add = '';
//             if (genomicEncodingsI.includes('xe')) {
//                 add = 'in intervals';
//                 descList.push(['x', 'The x-axis show genomic intervals.']);
//             } else {
//                 descList.push(['x', 'The x-axis shows the genome.']);
//             }
//             descGenomic = descGenomic.concat('The genome is shown ' + add + ' on the x-axis.');
//         }

//         if (genomicEncodingsI.includes('y')) {
//             let add = '';
//             if (genomicEncodingsI.includes('ye')) {
//                 add = 'in intervals';
//                 descList.push(['y', 'The y-axis show genomic intervals.']);
//             } else {
//                 descList.push(['y', 'The y-axis shows the genome.']);
//             }
//             descGenomic = descGenomic.concat('The genome is shown ' + add + ' on the y-axis.');
//         }
//     }
//     // if (attributeExists(track.data.details.data, 'binSize')) {
//     //     let bin = attributeExistsReturn(track.data.details.data, 'binSize') * 256;
//     //     if (typeof bin === 'number') {
//     //         descGenomic = descGenomic.concat(' Data is binned in intervals of ' +  + ' basepairs.');
//     //     }
//     // }

//     // expression encodings
//     const quantitativeEncodingsI = track.appearance.details.encodings.encodingDeepQuantitative.map(o => o.name);

//     if (quantitativeEncodingsI.length > 1) {
//         descQuantitative = descQuantitative.concat('The expression values are shown with ' + markToText.get(mark) + ' on the ' + arrayToString(quantitativeEncodingsI) + '-axes.');
//         for (const q of quantitativeEncodingsI) {
//             descList.push([q, 'The ' + q + ' of the ' + markToText.get(mark) + ' shows the expression values.']);
//         }
//     } else if (quantitativeEncodingsI.length === 1) {
//         if (quantitativeEncodingsI.includes('y')) {
//             descQuantitative = descQuantitative.concat('The expression is shown on the y-axis with ' + markToText.get(mark) + '.');
//             descList.push(['y', 'The y-axis shows the expression with' + markToText.get(mark) + '.']);
//         }
//         else if (quantitativeEncodingsI.includes('color')) {
//             descQuantitative = descQuantitative.concat('The height of the expression values is shown with color.');
//             descList.push(['color', 'The color of the ' + markToText.get(mark) + ' shows the expression values.']);
//         }
//         else {
//             descQuantitative = descQuantitative.concat('The height of the expression values is shown with the ' + quantitativeEncodingsI[0] + '-axis.');
//             descList.push([channelToText.get(quantitativeEncodingsI[0]) as string, 'The ' + channelToText.get(quantitativeEncodingsI[0]) + ' of the ' + markToText.get(mark) + ' shows the expression values.']);
//         }
//     }

//     // nominal encodings
//     let nominalEncodingsI = track.appearance.details.encodings.encodingDeepNominal.map(o => o.name);
//     nominalEncodingsI = nominalEncodingsI.filter(e => e !== 'text');

//     if (nominalEncodingsI.length > 1) {
//         if (nominalEncodingsI.includes('row')) {
//             descNominal = descNominal.concat('The chart is stratified by rows for the categories.');
//             const nominalEncodingsINames = nominalEncodingsI.filter(e => e !== 'row').map(e => channelToText.get(e)) as string[];
//             descNominal = descNominal.concat(' The categories are also shown with the ' + arrayToString(nominalEncodingsINames) + ' of the ' + markToText.get(mark) + '.');
//             descList.push(['row', 'The chart is stratified by rows for the categories.']);
//             for (const q of nominalEncodingsINames) {
//                 descList.push([channelToText.get(q) as string, 'The ' + q + ' of the ' + markToText.get(mark) + ' show the different categories.']);
//             }
//         }
//         else {
//             const nominalEncodingsINames = nominalEncodingsI.map(e => channelToText.get(e)) as string[];
//             descNominal = descNominal.concat('The categories are shown with the ' + arrayToString(nominalEncodingsINames) + ' of the ' + markToText.get(mark) + '.');
//             for (const q of nominalEncodingsI) {
//                 descList.push([channelToText.get(q) as string, 'The ' + q + ' of the ' + markToText.get(mark) + ' show the different categories.']);
//             }
//         }
//     }
//     else if (nominalEncodingsI.length == 1) {
//         if (nominalEncodingsI.includes('row')) {
//             descNominal = descNominal.concat('The chart is stratified by rows for the categories.');
//             descList.push(['row', 'The chart is stratified by rows for the categories.']);
//         }
//         else {
//             descNominal = descNominal.concat('The ' + channelToText.get(nominalEncodingsI[0]) + ' of the ' + markToText.get(mark) + ' indicates the different categories.');
//             descList.push([channelToText.get(nominalEncodingsI[0]) as string, 'The ' + channelToText.get(nominalEncodingsI[0]) + ' of the ' + markToText.get(mark) + ' show the different categories.']);
//         }
//     }

//     // value encodings
//     for (let i = 0; i < track.appearance.details.encodings.encodingValue.length; i++) {
//         const e = track.appearance.details.encodings.encodingValue[i];
//         if (e.name === 'color') {
//             // if the color is denoted as a hex code, get the name of the color value
//             if (typeof e.details.value === 'string') {
//                 if (e.details.value[0] === '#') {
//                     e.details.value = GetColorName(e.details.value.slice(0)).toLowerCase();
//                 }
//             }
//             descValue = descValue.concat('The color of the ' + markToText.get(mark) + ' is ' + e.details.value + '.');
//             descList.push(['color', 'The color of the ' + markToText.get(mark) + ' is ' + e.details.value + '.']);
//         }
//     }

//     const desc = ''.concat(descGenomic + ' ' + descQuantitative + ' ' + descNominal + ' ' + descValue);

//     return {desc: desc, descList: descList};
// }
