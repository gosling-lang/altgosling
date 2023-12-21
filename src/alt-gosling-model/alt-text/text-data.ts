import type { AltGoslingSpec, AltTrack } from '../../schema/alt-gosling-schema';
import { arrayToString, chrNumberOnly } from '../util';


export function addTrackDataDescriptions(altGoslingSpec: AltGoslingSpec) {
    for (const i in altGoslingSpec.tracks) {
        const track = altGoslingSpec.tracks[i];
        addTrackDataDescriptionsTrack(track);
    }
}

// used in addTrackDataDescriptions
function addMinMaxDescription(values: number[], key: 'minimum' | 'maximum') {
    var descMinMax = ''
    if (values.length === 1 ) {
        descMinMax = descMinMax.concat(' The ' + key + ' expression is shown at genomic position ' + values[0] + ' bp.');
    } else if (values.length < 6 ) {
        descMinMax = descMinMax.concat( ' The ' + key + ' expression is shown at genomic positions ' + arrayToString(values) + ' bp.')
    } else {
        descMinMax = descMinMax.concat( ' The ' + key + ' expression is shown at ' + values.length + ' different genomic positions, the first being ' + values[0] + '.')
    }
    return descMinMax;
}

export function addTrackDataDescriptionsTrack(track: AltTrack) {
    if (track.alttype === 'single' || track.alttype === 'ov-mark') {
        if (track.data.details.dataStatistics) {
            var desc = '';
            // genomic and expression ranges
            if (track.data.details.dataStatistics?.genomicMin !== undefined &&  track.data.details.dataStatistics?.genomicMax !== undefined) {
                // check if we have the relative positions
                // if chromosome is unknown, we can just default to the absolute positions
                if (track.data.details.dataStatistics?.genomicMinRel !== undefined && track.data.details.dataStatistics?.genomicMaxRel !== undefined) {
                    // if both chromosomes are known
                    if (track.data.details.dataStatistics?.genomicMinRel.chromosome !== 'unknown' && track.data.details.dataStatistics?.genomicMaxRel.chromosome !== 'unknown') {
                        // if they are the same chromosome
                        if (track.data.details.dataStatistics?.genomicMinRel.chromosome == track.data.details.dataStatistics?.genomicMaxRel.chromosome) {
                            // 'The genomic range is shown from basepair x to y on chromosome n.'
                            desc = desc.concat('The genomic range shown is from position ' + track.data.details.dataStatistics?.genomicMinRel.position + ' to ' + track.data.details.dataStatistics?.genomicMaxRel.position + ' on chromosome ' + chrNumberOnly(track.data.details.dataStatistics?.genomicMaxRel.chromosome) + '.');
                        } else {
                            // if they do not have the same chromosome
                            // 'The genomic range is shown from chromsome n basepair x to chromosome m basepair y.'
                            desc = desc.concat('The genomic range shown is from chromosome ' + chrNumberOnly(track.data.details.dataStatistics?.genomicMinRel.chromosome) + ' basepair '  + track.data.details.dataStatistics?.genomicMinRel.position + ' to chromosome ' + chrNumberOnly(track.data.details.dataStatistics?.genomicMaxRel.chromosome) + ' position ' + track.data.details.dataStatistics?.genomicMaxRel.position + '.');
                        }
                    } else {
                        if (track.data.details.dataStatistics?.genomicMinRel.chromosome == 'unknown' && track.data.details.dataStatistics?.genomicMinRel.chromosome == 'unknown') {
                            // if both unknown, same as if not defined relative ranges
                            desc = desc.concat('The genomic range shown is from absolute positions ' + track.data.details.dataStatistics?.genomicMin + ' to ' + track.data.details.dataStatistics?.genomicMax + ' (chromsomes unknown).');
                        } else {
                            if (track.data.details.dataStatistics?.genomicMinRel.chromosome == 'unknown') {
                                desc = desc.concat('The genomic range is from absolute position ' + track.data.details.dataStatistics?.genomicMinRel.position + ' (chromosome unknown) to chromosome ' + chrNumberOnly(track.data.details.dataStatistics?.genomicMaxRel.chromosome) + ' position ' + track.data.details.dataStatistics?.genomicMaxRel.position + '.');
                            } else {
                                desc = desc.concat('The genomic range is from chromosome ' + chrNumberOnly(track.data.details.dataStatistics?.genomicMinRel.chromosome) + ' position ' + track.data.details.dataStatistics?.genomicMinRel.position + ' to absolute position ' + track.data.details.dataStatistics?.genomicMaxRel.position + ' (chromosome unknown).');
                            }
                        }
                        
                    }
                } else {
                    // no defined relative ranges
                    desc = desc.concat('The genomic range shown is from absolute positions ' + track.data.details.dataStatistics?.genomicMin + ' to ' + track.data.details.dataStatistics?.genomicMax + ' (chromsomes unknown).');
                }
            }
            if (track.data.details.dataStatistics?.valueMin !== undefined && track.data.details.dataStatistics?.valueMax !== undefined) {
                desc = desc.concat(' The expression values range from ' + track.data.details.dataStatistics?.valueMin + ' to ' + track.data.details.dataStatistics?.valueMax + '.');
            }
            // where on the genome are the minimum and maximum expression
            if (track.data.details.dataStatistics?.valueMaxGenomic && track.data.details.dataStatistics?.valueMinGenomic) {
                desc = desc.concat(addMinMaxDescription(track.data.details.dataStatistics?.valueMaxGenomic, 'maximum'));
                desc = desc.concat(addMinMaxDescription(track.data.details.dataStatistics?.valueMinGenomic, 'minimum'));
            }
            // add category data information
            if (track.data.details.dataStatistics?.categories) {

                // number of categories
                desc = desc.concat(' There are ' + track.data.details.dataStatistics?.categories.length + ' categories.');

                // which category has the highest expression peak
                if (track.data.details.dataStatistics?.highestCategory) {
                    if (track.data.details.dataStatistics?.highestCategory.length === 1) {
                        desc = desc.concat(' The highest value is observed in sample ' + track.data.details.dataStatistics?.highestCategory[0] + '.');
                    } else {
                        desc = desc.concat(' The highest value is observed in samples ' + arrayToString(track.data.details.dataStatistics?.highestCategory) + '.');
                    }
                }    
                // See if genomic positions are the same for the min and max values of each category
            }
            track.data.description = desc;
        }
    }
}

