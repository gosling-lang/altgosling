import { Assembly, GenomicPosition } from '@alt-gosling/schema/gosling.schema';
import { Theme } from 'gosling.js';
import type { AltEncodingDesc, AltGoslingSpec, AltTrack, AltTrackOverlaidByDataInd, AltTrackOverlaidByMark, AltTrackSingle } from '@alt-gosling/schema/alt-gosling-schema';

import { arrayToString, markToText, chrNumberOnly } from '../util';

// @ts-expect-error no type definition
import { getRelativeGenomicPosition } from 'gosling.js/utils';

import { getThemeColors } from '@alt-gosling/schema/gosling-theme';
import { GetColorName } from 'hex-color-to-color-name';


export function addTrackDataDescriptions(altGoslingSpec: AltGoslingSpec) {
    for (const i in altGoslingSpec.tracks) {
        const track = altGoslingSpec.tracks[i];
        addTrackDataDescriptionsTrack(track);
    }
}

// used in addTrackDataDescriptions
function addMinMaxDescription(values: number[], key: 'minimum' | 'maximum', assembly?: Assembly) {
    let descMinMax = '';
    if (values.length === 1 ) {
        descMinMax = descMinMax.concat(` The ${key} value is shown at ${getOnePositionText(values[0], assembly)}.`);
    } else if (values.length < 6 ) {
        descMinMax = descMinMax.concat(` The ${key} value is shown at ${values.length} different genomic positions: ${arrayToString(values.map(p => getOnePositionText(p, assembly)))}.`);
    } else {
        descMinMax = descMinMax.concat(` The ${key} value is shown at ${values.length} different genomic positions, the first being ${getOnePositionText(values[0], assembly)}.`);
    }
    return descMinMax;
}

function getRelativeGenomicPositionText(p: number, assembly?: Assembly) {
    const p_rel = getRelativeGenomicPosition(p, assembly) as GenomicPosition;
    return [chrNumberOnly(p_rel.chromosome), p_rel.position];
}

function getOnePositionText(p: number, assembly?: Assembly) {
    const pt = getRelativeGenomicPositionText(p, assembly);
    if (pt[0] === 'unknown') {
        return `absolute position ${pt[1]} (on the unmapped part of the genome)`;
    } else {
        return `chromosome ${pt[0]} position ${pt[1]}`;
    }
}

export function getRangeText(p1: number, p2: number, assembly?: Assembly): string {
    const p1t = getRelativeGenomicPositionText(p1, assembly);
    const p2t = getRelativeGenomicPositionText(p2, assembly);

    if (p1t[0] === 'unknown' && p2t[0] == 'unknown') {
        return ` The genomic range is shown from from absolute position ${p1t[1]} to ${p2t[1]} on an unmapped part of the genome.`;
    }
    
    if (p2t[0] === 'unknown') {
        if ((p1t[0] === 'chr1' || p1t[0] === 1) && p1t[1] === 0) {
            return ` The full genome is shown.`;
        }

        if ((p1t[0] === 'chrX' || p1t[0] === 'X')) {
            return ` The genomic range shown is chromomosome X (from position ${p1t[1]}), Y and an unmapped part of the genome at the end.`;
        }

        if ((p1t[0] === 'chrY' || p1t[0] === 'Y')) {
            return ` The genomic range shown is chromomosome Y (from position ${p1t[1]}) and an unmapped part of the genome at the end.`;
        }

        return ` The genomic range is shown from chromosome ${p1t[0]} to chromosome 22 and the X and Y chromosomes, as well as an unmapped part of the genome at the end.`;
    }
    
    if (p1t === p2t) {
        return ` The genomic range is shown from position ${p1t[1]} to position ${p2t[1]} on chromosome ${p1t[0]}.`;
    }

    return ` The genomic range is shown from chromosome ${p1t[0]} position ${p1t[1]} to chromosome ${p2t[0]} position ${p2t[1]}.`;
}

export function addTrackDataDescriptionsTrack(track: AltTrack, theme?: Theme) {
    if (track.alttype === 'single' || track.alttype === 'ov-mark') {
        addTrackDataDescriptionsTrackInd(track, theme);
    }
    if (track.alttype === 'ov-data') {
        for (let i = 0; i < Object.keys(track.tracks).length; i++) {
            const overlaidDataTrack = track.tracks[i];
            addTrackDataDescriptionsTrackInd(overlaidDataTrack, theme);
        }
    }
}

export function addTrackDataDescriptionsTrackInd(track: AltTrackSingle | AltTrackOverlaidByMark | AltTrackOverlaidByDataInd, theme?: Theme) {
    if (track.data.details.dataStatistics) {
        let desc = '';
        const assembly = track.appearance.details.assembly;
        // genomic and expression ranges
        if (track.data.details.dataStatistics?.genomicMin !== undefined &&  track.data.details.dataStatistics?.genomicMax !== undefined) {
            // get text for min and max
            const rangeText = getRangeText(track.data.details.dataStatistics.genomicMin, track.data.details.dataStatistics.genomicMax, assembly);
            const genmin = getOnePositionText(track.data.details.dataStatistics?.genomicMin, assembly);
            const genmax = getOnePositionText(track.data.details.dataStatistics?.genomicMax , assembly);
            track.data.details.dataStatistics.genomicDescList = [['Minimum', genmin], ['Maximum', genmax]];
            linkDataToChannels(track, 'genomic', [['Minimum', `The minimum shown is ${genmin}.`], ['Maximum', `The maximum shown is ${genmax}.`]]);
            desc = desc.concat(rangeText);
        }
        if (track.data.details.dataStatistics?.valueMin !== undefined && track.data.details.dataStatistics?.valueMax !== undefined) {
            const valmin = track.data.details.dataStatistics?.valueMin;
            const valmax = track.data.details.dataStatistics?.valueMax;
            desc = desc.concat(` The expression values range from ${valmin} to ${valmax}.`);

            // where on the genome are the minimum and maximum expression
            if (track.data.details.dataStatistics?.valueMaxGenomic && track.data.details.dataStatistics?.valueMinGenomic) {
                const valmingen = addMinMaxDescription(track.data.details.dataStatistics?.valueMinGenomic, 'minimum', assembly);
                const valmaxgen = addMinMaxDescription(track.data.details.dataStatistics?.valueMaxGenomic, 'maximum', assembly);
                desc = desc.concat(valmaxgen, valmingen);
                track.data.details.dataStatistics.valueDescList = [['Minimum', `${valmin}. ${valmingen}`], ['Maximum', `${valmax}. ${valmaxgen}`]];
                linkDataToChannels(track, 'quantitative', [['Minimum', `The minimum value shown is ${valmin}.`, `${valmingen}`], ['Maximum', `The maximum value shown is ${valmax}.`, `${valmaxgen}`]]);
            } else {
                track.data.details.dataStatistics.valueDescList = [['Minimum', `${valmin}`], ['Maximum', `${valmax}`]];
                linkDataToChannels(track, 'quantitative', [['Minimum', `The minimum value shown is ${valmin}.`], ['Maximum', `The maximum value shown is ${valmax}.`]]);
            }
        }
        // add category data information
        if (track.data.details.dataStatistics?.categories) {
            if (track.data.details.dataStatistics?.categories.length === 1) {
                desc = desc.concat(` The category shown is called '${track.data.details.dataStatistics?.categories[0]}'.`);
                linkDataToChannels(track, 'nominal', [['Categories', `There is one category called ${track.data.details.dataStatistics?.categories[0]}`]]);
            } else {
                const linkDataToChannelsList = ['Categories'];
                // number of categories
                desc = desc.concat(` There are ${track.data.details.dataStatistics?.categories.length} categories`);

                if (track.data.details.dataStatistics?.categories.length < 7) {
                    desc = desc.concat(`: ${arrayToString(track.data.details.dataStatistics?.categories)}.`);
                } else {
                    desc = desc.concat(`.`);
                }

                linkDataToChannelsList.push(...[`There are ${track.data.details.dataStatistics?.categories.length} categories.`, `The categories are: ${arrayToString(track.data.details.dataStatistics?.categories)}.`]);

                // which category has the highest expression peak
                if (track.data.details.dataStatistics?.highestCategory) {
                    // console.log('highest cat', track.data.details.dataStatistics?.highestCategory)
                    if (track.data.details.dataStatistics?.highestCategory.length === 1) {
                        desc = desc.concat(` The highest value is observed in category ${track.data.details.dataStatistics?.highestCategory[0]}.`);
                        linkDataToChannelsList.push(`The highest value is observed in category ${track.data.details.dataStatistics?.highestCategory[0]}.`);
                    } else {
                        desc = desc.concat(` The highest value is observed in categories ${arrayToString(track.data.details.dataStatistics?.highestCategory)}.`);
                        linkDataToChannelsList.push(`The highest value is observed in categories ${arrayToString(track.data.details.dataStatistics?.highestCategory)}.`);
                    }
                }
                // See if genomic positions are the same for the min and max values of each category

                linkDataToChannels(track, 'nominal', [linkDataToChannelsList], track.data.details.dataStatistics?.categories, theme);

            }
        }
        // track.data.details.dataStatistics.genomicMaxDescription = ''
        track.data.description = desc;
    }
}


function linkDataToChannels(track: AltTrackSingle | AltTrackOverlaidByMark | AltTrackOverlaidByDataInd, typeDescList: string, descList: string[][], categories?: string[], theme?: Theme) {
    for (const enc of track.appearance.details.encodingsDescList) {
        if (enc.channelType.includes(typeDescList)) {
            enc.dataDesc = descList;
            // for rows, add information about which category is on which row
            if (enc.channel === 'row' && enc.channelType === 'nominal' && categories) {
                switch (categories.length) {
                    case 0: 
                        break;
                    case 1: 
                        enc.dataDesc[0].push(`Since there is only one category (${categories[0]}), this stratification does not change the chart.`);
                        break;
                    case 2:
                        enc.dataDesc[0].push(`The first category (${categories[0]}) is shown on the top, the second (${categories[1]}) is shown on the bottom.`);
                        break;
                    case 3: 
                        enc.dataDesc[0].push(`The first category (${categories[0]}) is shown on the top, the second (${categories[1]}) is shown in the middle and the third (${categories[2]}) is shown on the bottom.`);
                        break;
                    case 4: 
                        enc.dataDesc[0].push(`The first category (${categories[0]}) is shown on the top, the second (${categories[1]}) is shown below, the third (${categories[2]}) is shown below, and the last (${categories[3]}) is shown on the bottom.`);
                        break;
                    default: 
                        enc.dataDesc[0].push(`The first category (${categories[0]}) is shown on the top, the second (${categories[1]}) is shown below, the other categories are shown below in their own rows respectively.`);
                }
            }
            // for color, add information about which category is shown in which color
            if (enc.channel === 'color' && enc.channelType === 'nominal' && categories) {
                if (!theme) {
                    console.warn("AltGosling was not provided a Gosling Theme, so light theme is assumed.");
                }
                const nominalColors = getThemeColors(theme);

                switch (categories.length) {
                    case 0: 
                        break;
                    case 1: 
                        enc.dataDesc[0].push(`The only category (${categories[0]}) is ${GetColorName(nominalColors[0])}.`);
                        break;
                    case 2:
                        enc.dataDesc[0].push(`Category ${categories[0]} is ${GetColorName(nominalColors[0]).toLowerCase()} and category ${categories[1]} is ${GetColorName(nominalColors[1]).toLowerCase()}.`);
                        break;
                    case 3: 
                        enc.dataDesc[0].push(`Category ${categories[0]} is ${GetColorName(nominalColors[0]).toLowerCase()}, category ${categories[1]} is ${GetColorName(nominalColors[1]).toLowerCase()} and category ${categories[2]} is ${GetColorName(nominalColors[2]).toLowerCase()}.`);
                        break;
                    case 4: 
                        enc.dataDesc[0].push(`Category ${categories[0]} is ${GetColorName(nominalColors[0]).toLowerCase()}, category ${categories[1]} is ${GetColorName(nominalColors[1]).toLowerCase()}, category ${categories[2]} is ${GetColorName(nominalColors[2]).toLowerCase()} and category ${categories[3]} is ${GetColorName(nominalColors[3]).toLowerCase()}.`);
                        break;
                    default:
                        break;
                }
            }
        }
    }

    // if no color is in the encodings, add color with the default theme color
    if ((track.appearance.details.encodingsDescList.filter(enc => enc.channel === 'color').length) === 0) {
        if (!theme) {
            console.warn("AltGosling was not provided a Gosling Theme, so light theme is assumed.");
        }
        const nominalColors = getThemeColors(theme);
        const color = GetColorName(nominalColors[0]).toLowerCase();
        if (track.appearance.details.mark) {
            track.appearance.details.encodingsDescList.push({channel: 'color', channelType: 'value', desc: `The color of the ${markToText.get(track.appearance.details.mark)} is ${color}.`} as AltEncodingDesc);
        } else {
            track.appearance.details.encodingsDescList.push({channel: 'color', channelType: 'value', desc: `The color is ${color}.`} as AltEncodingDesc);
        }  
    }
}