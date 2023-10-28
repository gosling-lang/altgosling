
import type { AltGoslingSpec, AltTrack } from '../../schema/alt-gosling-schema';

export function addGlobalDescription(altGoslingSpec: AltGoslingSpec) {
    if (altGoslingSpec.tracks.length === 1) {
        addTrackDescription(altGoslingSpec.tracks[0], false)
    } else if (altGoslingSpec.tracks.length > 1) {
        for (let t of altGoslingSpec.tracks) {
            addTrackDescription(t, true)
        }
    }

    altGoslingSpec.alt = 'Gosling visualization.';

    if (altGoslingSpec.composition.nTracks === 1) {
        altGoslingSpec.longDescription = altGoslingSpec.tracks[0].description;
    } else if (altGoslingSpec.composition.nTracks === 2) {
        var desc = '';
        desc = desc.concat('Figure with two charts.');
        altGoslingSpec.longDescription = desc;
    } else {
        var desc = '';
        desc = desc.concat('Figure with ' + altGoslingSpec.composition.nTracks + ' individual charts.');
        altGoslingSpec.longDescription = desc;
    }    
}


export function addTrackDescription(t: AltTrack, includePosition: boolean) {
    var desc = '';
    var descPos = '';
    if (t.alttype === 'single' || t.alttype === 'ov-mark') {  
        if (includePosition) {
            descPos.concat(t.position.description);
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