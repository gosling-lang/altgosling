import type { GoslingSpec, Datum } from '@alt-gosling/schema/gosling.schema';
import type {  AltGoslingSpec } from '@alt-gosling/schema/alt-gosling-schema';

import { getAltSpec } from './alt-structure/alt-from-spec';
import { treeText, dataText } from './alt-text';
import { altUpdateSpecWithData } from './alt-data/alt-from-data';

// this function is only called once every time a spec is compiled
export function getAlt(
    specProcessed: GoslingSpec,
): AltGoslingSpec {
    // get altSpec
    const altSpec = getAltSpec(specProcessed) as AltGoslingSpec;

    // add descriptions
    treeText(altSpec);
    dataText(altSpec);

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