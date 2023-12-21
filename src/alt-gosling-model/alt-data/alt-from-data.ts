//const _spec = models[0]?.spec(); _spec?.id
import type { Assembly, Datum, GenomicPosition } from '../../schema/gosling.schema';
import { getRelativeGenomicPosition } from 'gosling.js/utils';
import type { AltGoslingSpec, AltTrackDataFields, AltDataStatistics, AltTrack } from '../../schema/alt-gosling-schema';
import { addTrackDataDescriptionsTrack } from '../alt-text/text-data';
import { addTrackDescription, addGlobalDescription} from '../alt-text/text-global';

export function altRetrieveDataStatistics(id: string, flatTileData: Datum[], dataFields?: AltTrackDataFields, assembly?: Assembly): AltDataStatistics {
    var altDataStatistics: AltDataStatistics = { id: id, flatTileData: flatTileData};

    if (!dataFields) {
        return altDataStatistics;
    } else {

        if (dataFields.genomicField !== undefined) {
            const genomicField = dataFields.genomicField as string;
            try {
                const genomicValues = (flatTileData.map(d => d[genomicField]) as unknown as number[]).filter(d => !isNaN(d));
                altDataStatistics.genomicMin  = Math.min(...genomicValues);
                altDataStatistics.genomicMax = Math.max(...genomicValues);

                // altDataStatistics.genomicMinRel = getRelativeGenomicPosition(altDataStatistics.genomicMin, assembly);   
                // altDataStatistics.genomicMaxRel = getRelativeGenomicPosition(altDataStatistics.genomicMax, assembly);         
            } catch {}
        }

        if (dataFields.valueField !== undefined) {
            const valueField = dataFields.valueField as string;
            try {
                const valueValues = (flatTileData.map(d => d[valueField]) as unknown as number[]).filter(d => !isNaN(d));
                altDataStatistics.valueMin = Math.min(...valueValues);
                altDataStatistics.valueMax = Math.max(...valueValues);
            } catch {}
        }

        if (dataFields.genomicField !== undefined && dataFields.valueField !== undefined) {
            const genomicField = dataFields.genomicField as string;
            const valueField = dataFields.valueField as string;
            try {
                altDataStatistics.valueMinGenomic = (flatTileData.filter(d => d[valueField] == altDataStatistics.valueMin).map(d => d[genomicField]) as unknown as number[]);
                altDataStatistics.valueMaxGenomic = (flatTileData.filter(d => d[valueField] == altDataStatistics.valueMax).map(d => d[genomicField]) as unknown as number[]);

                altDataStatistics.valueMinGenomicRel = altDataStatistics.valueMinGenomic.map(d => getRelativeGenomicPosition(d, assembly));
                altDataStatistics.valueMaxGenomicRel = altDataStatistics.valueMaxGenomic.map(d => getRelativeGenomicPosition(d, assembly));
            } catch {}
        }
    
        if (dataFields.categoryField !== undefined) {
            const genomicField = dataFields.genomicField as string;
            const valueField = dataFields.valueField as string;
            const categoryField = dataFields.categoryField as string;

            try {
                var categoryValues = flatTileData.map(d => d[categoryField]);
                const categories = [... new Set(categoryValues)] as unknown as string[]

                const categoryMinMaxWG: { [key: string]: (number | number[])[] } = {};

                var highestCategory = [] as string[];

                for (let category of categories) {
                    let dataCat = flatTileData.filter(d => d[categoryField] === category);
                    let valueValuesCat = (dataCat.map(d => d[valueField]) as unknown as number[]).filter(d => !isNaN(d));
                    let valueMinCat = Math.min(...valueValuesCat);
                    let valueMaxCat = Math.max(...valueValuesCat);

                    let valueMinCatGenomic = (dataCat.filter(d => d[valueField] == valueMinCat).map(d => d[genomicField]) as unknown as number[])
                    let valueMaxCatGenomic = (dataCat.filter(d => d[valueField] == valueMaxCat).map(d => d[genomicField]) as unknown as number[])

                    categoryMinMaxWG[category] = [valueMinCat, valueMinCatGenomic, valueMaxCat, valueMaxCatGenomic];

                    if (valueMaxCat === altDataStatistics.valueMax) {
                        highestCategory.push(category);
                    }
                }
                altDataStatistics.categories = categories;
                altDataStatistics.categoryMinMaxWG = categoryMinMaxWG;
                altDataStatistics.highestCategory = highestCategory;
            } catch {}
        }   
        return(altDataStatistics);
    }
}


export function altUpdateSpecWithData(
    altGoslingSpec: AltGoslingSpec, 
    id: string, 
    flatTileData: Datum[]
): AltGoslingSpec {

    var includePosition = altGoslingSpec.tracks.length > 1;
    // get correct track index
    for (let i = 0; i < Object.keys(altGoslingSpec.tracks).length; i++) {
        var track = altGoslingSpec.tracks[i];

        let fields;

        if (track.alttype === 'single' || track.alttype === 'ov-mark') {
            if (track.uid === id) {
                // get genomic field headers for that track
                fields = track.data.details.fields;
            } 
            // retrieve data statistics
            const altDataStatistics = altRetrieveDataStatistics(id, flatTileData, fields);

            // fill in data
            track.data.details.dataStatistics = altDataStatistics;

            // update description            
            addTrackDataDescriptionsTrack(track);
            addTrackDescription(track, includePosition);       
        }     
    }
    addGlobalDescription(altGoslingSpec, false)
    return(altGoslingSpec);
}


// export function altCreateDataPanel(
//     track: AltTrack,
//     altDataStatistics: AltDataStatistics, 
// ) {

// }



// export function altCreateDataPanel(
//     altGoslingSpec: AltGoslingSpec, 
//     id: string, 
//     flatTileData: Datum[]
// ): AltDataStatistics {

//     var includePosition = altGoslingSpec.tracks.length > 1;
//     // get correct track index
//     for (let i = 0; i < Object.keys(altGoslingSpec.tracks).length; i++) {
//         var track = altGoslingSpec.tracks[i];

//         if (track.alttype === 'single' || track.alttype === 'ov-mark') {
//             if (track.uid === id) {

//                 // get genomic field headers for that track
//                 const fields = track.data.details.fields;
    
//                 // retrieve data statistics
//                 const altDataStatistics = altRetrieveDataStatistics(id, flatTileData, fields);

                
    
//             } 
//         } else {
//             // just get the raw data
//         }     
//     }

//     return(altGoslingSpec);
// }


