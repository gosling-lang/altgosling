import type { AltGoslingSpec, AltTrack } from '@alt-gosling/schema/alt-gosling-schema';

export function addGlobalDescription(altGoslingSpec: AltGoslingSpec, update?: boolean) {
    if (update !== false) {
        addTrackDescriptions(altGoslingSpec);
    }

    altGoslingSpec.alt = 'Gosling visualization.';

    if (altGoslingSpec.composition.nTracks === 1) {
        altGoslingSpec.longDescription = altGoslingSpec.tracks[0].description;
        altGoslingSpec.alt = altGoslingSpec.longDescription.split('.')[0];
    } else if (altGoslingSpec.composition.nTracks === 2) {
        let desc = '';
        desc = desc.concat('Figure with two charts.');
        altGoslingSpec.longDescription = desc;
    } else {
        let desc = '';
        desc = desc.concat('Figure with ' + altGoslingSpec.composition.nTracks + ' individual charts.');
        altGoslingSpec.longDescription = desc;
    }
}

export function addTrackDescriptions(altGoslingSpec: AltGoslingSpec) {
    if (Object.keys(altGoslingSpec.tracks).length === 1) {
        addTrackDescription(altGoslingSpec.tracks[0], false);
    } else {
        for (const t of altGoslingSpec.tracks) {
            addTrackDescription(t, true);
        }
    }
}

export function addTrackDescription(t: AltTrack, includePosition: boolean) {
    let desc = '';
    let descPos = '';
    if (t.alttype === 'single' || t.alttype === 'ov-mark') {
        if (includePosition) {
            descPos = descPos.concat(t.position.description);
        }
        desc = descPos.concat(' ' + t.appearance.description + ' ' + t.data.description);
    } else {
        if (includePosition) {
            descPos.concat(t.position.description);
        }
        desc = descPos.concat(' Overlaid track with different data sources. See individual tracks for details.');
    }
    t.description = desc;
}