import type { AltGoslingSpec } from '@altgosling/schema/alt-gosling-schema';

import { addTreeDescriptions } from './text-tree';
import { addTrackDataDescriptions } from './text-data';
import { addGlobalDescription } from './text-global';


export function treeText(altGoslingSpec: AltGoslingSpec, simplifyColorNames?: boolean) {
    addTreeDescriptions(altGoslingSpec, simplifyColorNames);
    addGlobalDescription(altGoslingSpec);
}

export function dataText(altGoslingSpec: AltGoslingSpec, simplifyColorNames?: boolean) {
    addTrackDataDescriptions(altGoslingSpec, undefined, simplifyColorNames);
    addGlobalDescription(altGoslingSpec);
}
