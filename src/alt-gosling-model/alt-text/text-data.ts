import type { AltGoslingSpec, AltTrack } from '../../schema/alt-gosling-schema';
import { arrayToString } from '../util';


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
        descMinMax = descMinMax.concat( ' The ' + key + ' expression is shown at ' + values.length + ' genomic positions.')
    }
    return descMinMax;
}

export function addTrackDataDescriptionsTrack(track: AltTrack) {
    if (track.alttype === 'single' || track.alttype === 'ov-mark') {
        if (track.data.details.dataStatistics) {
            var desc = '';

            // genomic and expression ranges
            if (track.data.details.dataStatistics?.genomicMin && track.data.details.dataStatistics?.genomicMax) {
                desc = desc.concat('The genomic range shown is from ' + track.data.details.dataStatistics?.genomicMin + ' to ' + track.data.details.dataStatistics?.genomicMax + ' basepairs.');
            }
            if (track.data.details.dataStatistics?.valueMin && track.data.details.dataStatistics?.valueMax) {
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

