import type { GoslingSpec, Datum } from 'gosling.js/dist/src/gosling-schema';
import type {  AltGoslingSpec, AltTrack } from './schema/alt-gosling-schema';
import { getAltSpec } from './alt-structure/alt-from-spec';
import { addDescriptions } from './alt-structure/alt-to-text';
import { altUpdateSpecWithData } from './alt-data/alt-from-data';

// this function is only called once every time a spec is compiled
export function getAlt(
    specTraversed: GoslingSpec,
    specOriginal: GoslingSpec
): AltGoslingSpec {
    console.log(specTraversed)

    // get altSpec
    const altSpec = getAltSpec(specTraversed) as AltGoslingSpec;

    // add descriptions
    addDescriptions(altSpec)

    return altSpec;
}

// this function is called every time the data is updated
export function updateAlt(
    altGoslingSpec: AltGoslingSpec, 
    id: string, 
    flatTileData: Datum[]
): AltGoslingSpec {
    return altUpdateSpecWithData(altGoslingSpec, id, flatTileData);
}