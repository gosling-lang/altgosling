import { treeText, dataText } from '../src/alt-gosling-model/alt-text';
import { getAltSpec } from '../src/alt-gosling-model/alt-structure/alt-from-spec';

describe("The original Gosling Spec shouldn't be edited", () => {
  it("Simple Bar Chart", () => {
    // input spec and it's copy
    const processedGoslingSpec = { "title": "Basic Marks: area", "subtitle": "Tutorial Examples", "tracks": [{ "title": "Basic Marks: area", "subtitle": "Tutorial Examples", "assembly": "hg38", "layout": "linear", "orientation": "horizontal", "static": false, "zoomLimits": [1, null], "centerRadius": 0.3, "spacing": 10, "xOffset": 0, "yOffset": 0, "width": 392, "height": 156, "data": { "url": "https://resgen.io/api/v1/tileset_info/?d=UvVPeLHuRDiYA3qwFlm7xQ", "type": "multivec", "row": "sample", "column": "position", "value": "peak", "categories": ["sample 1"] }, "mark": "area", "x": { "field": "position", "type": "genomic", "axis": "bottom", "linkingId": "07bfedd0-f5bf-40a2-929c-c11c3aeac11b" }, "y": { "field": "peak", "type": "quantitative", "axis": "right" }, "size": { "value": 2 }, "color": { "value": "#b59bf2" }, "id": "8771e531-c18d-410a-bf56-69e73d60234b", "style": {}, "overlayOnPreviousTrack": false }], "assembly": "hg38", "layout": "linear", "orientation": "horizontal", "static": false, "zoomLimits": [1, null], "centerRadius": 0.3, "spacing": 10, "xOffset": 0, "yOffset": 0, "id": "878c0e8c-839a-4757-82bd-4eff8c415f41", "_assignedWidth": 392, "_assignedHeight": 156 };
    const copy = structuredClone(processedGoslingSpec);

    // these are the three main functions called inside `getAlt()`
    const altSpec = getAltSpec(processedGoslingSpec);
    treeText(altSpec);
    dataText(altSpec);

    expect(JSON.stringify(copy)).toMatch(JSON.stringify(processedGoslingSpec));
  });
});
