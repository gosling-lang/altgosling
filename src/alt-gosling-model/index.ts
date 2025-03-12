import type { GoslingSpec, Datum } from '@altgosling/schema/gosling.schema';
import type { AltGoslingSpec } from '@altgosling/schema/alt-gosling-schema';

import { getAltSpec } from './alt-structure/alt-from-spec';
import { treeText, dataText } from './alt-text';
import { altUpdateSpecWithData } from './alt-data/alt-from-data';
import type { Theme } from 'gosling.js';


// this function is only called once every time a spec is compiled
export function getAlt(
    specProcessed: GoslingSpec,
    simplifyColorNames?: boolean,
    customColorNames?: (hex: string) => string
): AltGoslingSpec {
    // get altSpec
    const altSpec = getAltSpec(specProcessed) as AltGoslingSpec;

    // options for color names
    const colorOpt = { simplifyColorNames, customColorNames };

    // add descriptions
    treeText(altSpec, colorOpt);
    dataText(altSpec, colorOpt);

    return altSpec;
}

// this function is called every time the data is updated
export function updateAlt(
    altGoslingSpec: AltGoslingSpec,
    id: string,
    flatTileData: Datum[],
    theme?: Theme,
    simplifyColorNames?: boolean,
): AltGoslingSpec {
    return altUpdateSpecWithData(altGoslingSpec, id, flatTileData, theme, simplifyColorNames);
}
