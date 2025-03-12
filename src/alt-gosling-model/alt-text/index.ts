import type { AltGoslingSpec } from '@altgosling/schema/alt-gosling-schema';

import { addTreeDescriptions } from './text-tree';
import { addTrackDataDescriptions } from './text-data';
import { addGlobalDescription } from './text-global';

export type ColorOption = {
    simplifyColorNames?: boolean;
    customColorNames?: (hex: string) => string
};

export function treeText(altGoslingSpec: AltGoslingSpec, colorOpt: ColorOption) {
    addTreeDescriptions(altGoslingSpec, colorOpt);
    addGlobalDescription(altGoslingSpec);
}

export function dataText(altGoslingSpec: AltGoslingSpec, colorOpt: ColorOption) {
    addTrackDataDescriptions(altGoslingSpec, undefined, colorOpt);
    addGlobalDescription(altGoslingSpec);
}
