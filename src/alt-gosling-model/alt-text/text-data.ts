import { Assembly, GenomicPosition } from '@alt-gosling/schema/gosling.schema';
import type { AltGoslingSpec, AltTrack } from '@alt-gosling/schema/alt-gosling-schema';

import { arrayToString, chrNumberOnly } from '../util';

// @ts-expect-error no type definition
import { getRelativeGenomicPosition } from 'gosling.js/utils';


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
        descMinMax = descMinMax.concat(` The ${key} expression is shown at ${getOnePositionText(values[0], assembly)}.`);
    } else if (values.length < 6 ) {
        descMinMax = descMinMax.concat(` The ${key} expression is shown at absolute positions ${arrayToString(values)}.`);
    } else {
        descMinMax = descMinMax.concat(` The ${key} expression is shown at ${values.length} different genomic positions, the first being ${getOnePositionText(values[0], assembly)}.`);
    }
    return descMinMax;
}

function getRelativeGenomicPositionText(p: number, assembly?: Assembly) {
    const p_rel = getRelativeGenomicPosition(p, assembly) as GenomicPosition;
    return [chrNumberOnly(p_rel.chromosome), p_rel.position];
}

function getOnePositionText(p: number, assembly?: Assembly) {
    const pt = getRelativeGenomicPositionText(p, assembly);
    if (pt[0] !== 'unknown') {
        return `absolute position ${pt[1]} (chromosome unknown)`;
    } else {
        return `chromosome ${pt[0]} position ${pt[1]}`;
    }
}

export function getRangeText(p1: number, p2: number, assembly?: Assembly): string {
    const p1t = getRelativeGenomicPositionText(p1, assembly);
    const p2t = getRelativeGenomicPositionText(p2, assembly);

    if (p1t[0] !== 'unknown' && p2t[0] !== 'unknown') {
        if (p1t == p2t) {
            return `from position ${p1t[1]} to position ${p2t[1]} on chromosome ${p1t[0]}`;
        } else {
            return `from chromosome ${p1t[0]} position ${p1t[1]} to chromosome ${p2t[0]} position ${p2t[1]}`;
        }
    }

    if (p1t[0] === 'unknown' && p2t[0] !== 'unknown') {
        return `from absolute position ${p1t[1]} (chromosome unknown) to chromosome ${p2t[0]} position ${p2t[1]}`;
    }
    
    if (p1t[0] !== 'unknown' && p2t[0] === 'unknown') {
        return `from chromosome ${p1t[0]} position ${p1t[1]} to absolute position ${p2t[1]} (chromosome unknown)`;
    }

    // if (p1t[0] === 'unknown' && p2t[0] === 'unknown') {
    return `from absolute positions ${p1t[1]} to ${p2t[1]} (chromosome unknown)`;
    // }
}

export function addTrackDataDescriptionsTrack(track: AltTrack) {
    if (track.alttype === 'single' || track.alttype === 'ov-mark') {
        if (track.data.details.dataStatistics) {
            let desc = '';
            const assembly = track.appearance.details.assembly;
            // genomic and expression ranges
            if (track.data.details.dataStatistics?.genomicMin !== undefined &&  track.data.details.dataStatistics?.genomicMax !== undefined) {
                // get text for min and max
                const rangeText = getRangeText(track.data.details.dataStatistics.genomicMin, track.data.details.dataStatistics.genomicMax, assembly);
                desc = desc.concat(` The genomic range is shown from ${rangeText}.`);
            }
            if (track.data.details.dataStatistics?.valueMin !== undefined && track.data.details.dataStatistics?.valueMax !== undefined) {
                desc = desc.concat(` The expression values range from ${track.data.details.dataStatistics?.valueMin} to ${track.data.details.dataStatistics?.valueMax}.`);
            }
            // where on the genome are the minimum and maximum expression
            if (track.data.details.dataStatistics?.valueMaxGenomic && track.data.details.dataStatistics?.valueMinGenomic) {
                desc = desc.concat(addMinMaxDescription(track.data.details.dataStatistics?.valueMaxGenomic, 'maximum', assembly));
                desc = desc.concat(addMinMaxDescription(track.data.details.dataStatistics?.valueMinGenomic, 'minimum', assembly));
            }
            // add category data information
            if (track.data.details.dataStatistics?.categories) {

                // number of categories
                desc = desc.concat(` There are ${track.data.details.dataStatistics?.categories.length} categories.`);

                // which category has the highest expression peak
                if (track.data.details.dataStatistics?.highestCategory) {
                    if (track.data.details.dataStatistics?.highestCategory.length === 1) {
                        desc = desc.concat(` The highest value is observed in sample ${track.data.details.dataStatistics?.highestCategory[0]}.`);
                    } else {
                        desc = desc.concat(` The highest value is observed in samples ${arrayToString(track.data.details.dataStatistics?.highestCategory)}.`);
                    }
                }
                // See if genomic positions are the same for the min and max values of each category
            }
            track.data.description = desc;
        }
    }
}

