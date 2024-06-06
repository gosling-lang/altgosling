import type { AltGoslingSpec, AltTrack } from '@altgosling/schema/alt-gosling-schema';
import { arrayToString, capDesc, countOccurences } from '../util';

export function addGlobalDescription(altGoslingSpec: AltGoslingSpec, update?: boolean) {
    if (update !== false) {
        addTrackDescriptions(altGoslingSpec);
    }

    altGoslingSpec.alt = 'Genomic visualization.';

    if (altGoslingSpec.composition.nTracks === 1) {
        // long description
        altGoslingSpec.longDescription = altGoslingSpec.tracks[0].description;
        altGoslingSpec.fullDescription = altGoslingSpec.tracks[0].descriptionFull;

        // alt
        let alt = '';
        alt = alt.concat(altGoslingSpec.longDescription.split('.')[0]);
        if (hasGenomicData(altGoslingSpec.tracks[0])) {
            alt = alt.concat(' showing genomic data');
        }
        if (altGoslingSpec.title) {
            alt = alt.concat(`, titled ${altGoslingSpec.title}`);
        } else if (altGoslingSpec.tracks[0].title) {
            alt = alt.concat(`, titled '${altGoslingSpec.tracks[0].title}'`);
        }
        altGoslingSpec.alt = alt;

    } else if (altGoslingSpec.composition.nTracks === 2) {
        let alt = '';
        let desc = '';
        desc = desc.concat('Figure with two charts.');
        let descFull = desc;

        // two helper functions to reduce code duplication

        // split out charttype and chartdesc from a description
        function getSlicedDescriptions(description: string) {
            const chart = description.split('.');
            const chartType = chart[0];
            const chartDesc = chart.slice(1).join('.');
            return [chartType, chartDesc];
        }

        // combine positiondescriptions and charttype and chartdesc descriptions
        function getSlicedDescriptionsDescText(positionDescription: string, chartType: string, chartDesc: string) {
            return ` ${capDesc(positionDescription)} track is a ${chartType.toLowerCase()}. ${chartDesc}`;
        }

        const [chart1Type, chart1Desc] = getSlicedDescriptions(altGoslingSpec.tracks[0].description);
        const [chart2Type, chart2Desc] = getSlicedDescriptions(altGoslingSpec.tracks[1].description);
        const [chart1TypeFull, chart1DescFull] = getSlicedDescriptions(altGoslingSpec.tracks[0].descriptionFull);
        const [chart2TypeFull, chart2DescFull] = getSlicedDescriptions(altGoslingSpec.tracks[1].descriptionFull);

        desc = desc.concat(getSlicedDescriptionsDescText(altGoslingSpec.tracks[0].position.description, chart1Type, chart1Desc));
        desc = desc.concat(getSlicedDescriptionsDescText(altGoslingSpec.tracks[1].position.description, chart2Type, chart2Desc));
        descFull = descFull.concat(getSlicedDescriptionsDescText(altGoslingSpec.tracks[0].position.description, chart1TypeFull, chart1DescFull));
        descFull = descFull.concat(getSlicedDescriptionsDescText(altGoslingSpec.tracks[1].position.description, chart2TypeFull, chart2DescFull));

        alt = alt.concat(` Figure with ${chart1Type.toLowerCase()} on ${altGoslingSpec.tracks[0].position.description} and ${chart2Type.toLowerCase()} on ${altGoslingSpec.tracks[1].position.description}`);
        
        altGoslingSpec.alt = alt;
        altGoslingSpec.longDescription = desc;
        altGoslingSpec.fullDescription = descFull;

    } else {
        let desc = '';
        
        const chartTypeList = [] as string[];
        for (const t in Object.keys(altGoslingSpec.tracks)) {
            const chartType = altGoslingSpec.tracks[t].description.split('.')[0];
            chartTypeList.push(chartType);
        }


        const chartTypeListUnique = [...new Set(chartTypeList)].map(i => [i, countOccurences(chartTypeList, i)]);
        const chartTypeListUniqueText = chartTypeListUnique.map(i => {
            const count = i[1] as number;
            let chartType = i[0] as string;
            chartType = chartType.toLowerCase();
            if (count == 1) {
                return `a ${chartType}`;
            } else {
                if (chartType.includes('chart')) {
                    chartType = chartType.replace('chart', 'charts');
                } else {
                    chartType = `${chartType}s`;
                }
                return `${count} different ${chartType}`;
            }
        });

        desc = desc.concat(`Figure with ${altGoslingSpec.composition.nTracks} individual charts. Briefly, these are ${arrayToString(chartTypeListUniqueText).toLowerCase()}.`);

        altGoslingSpec.alt = `Genomic visualization with ${altGoslingSpec.composition.nTracks} individual charts.`;
        altGoslingSpec.longDescription = desc;

        const descriptionList = [];
        for (const t in Object.keys(altGoslingSpec.tracks)) {
            descriptionList.push(altGoslingSpec.tracks[t].descriptionFull);
        }
        altGoslingSpec.fullDescription = desc.concat(...descriptionList);
    }
}

export function addTrackDescriptions(altGoslingSpec: AltGoslingSpec) {
    if (Object.keys(altGoslingSpec.tracks).length === 1) {
        addTrackDescription(altGoslingSpec.tracks[0], false);
    }
    if (Object.keys(altGoslingSpec.tracks).length === 2) {
        addTrackDescription(altGoslingSpec.tracks[0], true);
        addTrackDescription(altGoslingSpec.tracks[1], true);
    }
    else {
        for (const t in Object.keys(altGoslingSpec.tracks)) {
            addTrackDescription(altGoslingSpec.tracks[t], false);
        }
    }
}

export function addTrackDescription(t: AltTrack, includePosition: boolean) {
    let desc = '';
    let descFull = '';
    let descPos = '';
    if (t.alttype === 'single' || t.alttype === 'ov-mark') {
        // if (includePosition) {
        //     descPos = descPos.concat(t.position.description);
        // }
        desc = descPos.concat(`${t.appearance.description} ${t.data.description}`);
        descFull = desc;
    } else {
        desc = descPos.concat(`${capDesc(t.appearance.details.charttype)}. See separate overlaid tracks for details.`);

        // if someone wants to extract the full description, we save the full track description
        descFull = descPos.concat(`${capDesc(t.appearance.details.charttype)}. Multiple tracks are overlaid in this chart.`);
        for (let i = 0; i < Object.keys(t.tracks).length; i++) {
            const overlaidDataTrack = t.tracks[i];
            descFull = descFull.concat(` Overlaid track ${i+1}. ${overlaidDataTrack.appearance.description} ${overlaidDataTrack.data.description}`)
        }
    }
    t.description = desc;
    t.descriptionFull = descFull;
}


/**
 * Function to check if AltTrack describes genomic data
 * @param track AltTrack
 * @returns true if any genomicField, false otherwise
 */
export function hasGenomicData(track: AltTrack) {
    if (track.alttype === 'single' || track.alttype === 'ov-mark') {
        if (track.data.details.fields.genomicField) {
            if (track.data.details.fields.genomicField.length > 0) {
                return true;
            }
        }
    } else {
        for (const ti of track.tracks) {
            if (ti.data.details.fields.genomicField) {
                if (ti.data.details.fields.genomicField.length > 0) {
                    return true;
                }
            }
        }
    }
    return false;
}