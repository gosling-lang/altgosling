export const circularHalves = {
  "title": "ChIP-seq of Th and ILC1",
  "layout": "circular",
  "centerRadius": 0.5,
  "static": true,
  "arrangement": "serial",
  "views": [
      {
      "title": "Th1",
      "tracks": [
          {
          "id": "track-1",
          "data": {
              "url": "https://server.gosling-lang.org/api/v1/tileset_info/?d=cistrome-multivec",
              "type": "multivec",
              "row": "sample",
              "column": "position",
              "value": "peak",
              "categories": ["Th"]
          },
          "mark": "bar",
          "x": {"field": "position", "type": "genomic", "axis": "top", "domain": {"chromosome": "chr1"}},
          "y": {"field": "peak", "type": "quantitative", "grid": true},
          "color": {"value": "black"},
          "tooltip": [
              {"field": "start", "type": "genomic", "alt": "Start Position"},
              {"field": "end", "type": "genomic", "alt": "End Position"},
              {
              "field": "peak",
              "type": "quantitative",
              "alt": "Value",
              "format": ".2"
              },
              {"field": "sample", "type": "nominal", "alt": "Sample"}
          ],
          "width": 350,
          "height": 130
          }
      ]
      },
      {
      "title": "IL1",
      "tracks": [
          {
          "id": "track-2",
          "data": {
              "url": "https://server.gosling-lang.org/api/v1/tileset_info/?d=cistrome-multivec",
              "type": "multivec",
              "row": "sample",
              "column": "position",
              "value": "peak",
              "categories": ["Th", "ILC1"]
          },
          "dataTransform": [{
          "type": "filter", "field": "sample", "oneOf": ["ILC1"]
          }],
          "mark": "bar",
          "x": {"field": "position", "type": "genomic", "axis": "top", "domain": {"chromosome": "chr5"}},
          "y": {"field": "peak", "type": "quantitative", "grid": true},
          "color": {"value": "blue"},
          "tooltip": [
              {"field": "start", "type": "genomic", "alt": "Start Position"},
              {"field": "end", "type": "genomic", "alt": "End Position"},
              {
              "field": "peak",
              "type": "quantitative",
              "alt": "Value",
              "format": ".2"
              },
              {"field": "sample", "type": "nominal", "alt": "Sample"}
          ],
          "width": 350,
          "height": 130
          }
      ]
      }
  ]
}