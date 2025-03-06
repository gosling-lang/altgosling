import type { GoslingSpec, Datum } from '@altgosling/schema/gosling.schema';
import type {  AltGoslingSpec } from '@altgosling/schema/alt-gosling-schema';

import { getAltSpec } from './alt-structure/alt-from-spec';
import { treeText, dataText } from './alt-text';
import { altUpdateSpecWithData } from './alt-data/alt-from-data';
import type { Theme } from 'gosling.js';

// this function is only called once every time a spec is compiled
export function getAlt(
    specProcessed: GoslingSpec,
    simplifyColor?: boolean,
): AltGoslingSpec {
    // get altSpec
    const altSpec = getAltSpec(specProcessed) as AltGoslingSpec;

    // add descriptions
    treeText(altSpec, simplifyColor);
    dataText(altSpec, simplifyColor);

    return altSpec;
}

// this function is called every time the data is updated
export function updateAlt(
    altGoslingSpec: AltGoslingSpec,
    id: string,
    flatTileData: Datum[],
    theme?: Theme,
    simplifyColor?: boolean,
): AltGoslingSpec {
    return altUpdateSpecWithData(altGoslingSpec, id, flatTileData, theme, simplifyColor);
}