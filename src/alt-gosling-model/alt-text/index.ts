import type { AltGoslingSpec } from '@altgosling/schema/alt-gosling-schema';

import { addTreeDescriptions } from './text-tree';
import { addTrackDataDescriptions } from './text-data';
import { addGlobalDescription } from './text-global';


export function treeText(altGoslingSpec: AltGoslingSpec, simplifyColor?: boolean) {
    addTreeDescriptions(altGoslingSpec, simplifyColor);
    addGlobalDescription(altGoslingSpec);
}

export function dataText(altGoslingSpec: AltGoslingSpec, simplifyColor?: boolean) {
    addTrackDataDescriptions(altGoslingSpec, undefined, simplifyColor);
    addGlobalDescription(altGoslingSpec);
}
