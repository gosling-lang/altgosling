import type { AltGoslingSpec } from '../../schema/alt-gosling-schema';
import { addTreeDescriptions } from './text-tree';
import { addTrackDataDescriptions } from './text-data';
import { addGlobalDescription } from './text-global'


export function treeText(altGoslingSpec: AltGoslingSpec) {
    addTreeDescriptions(altGoslingSpec);
    addGlobalDescription(altGoslingSpec);
}

export function dataText(altGoslingSpec: AltGoslingSpec) {
    addTrackDataDescriptions(altGoslingSpec);
    addGlobalDescription(altGoslingSpec);
}
