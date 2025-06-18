export const doubleMarks = {
  "title": "Expression of ChIP-seq",
  "layout": "linear",
  "arrangement": "vertical",
  "centerRadius": 0.8,
  "xDomain": {"chromosome": "chr1", "interval": [1, 3000500]},
  "views": [
    {
      "id": "track-1",
      "alignment": "overlay",
      "data": {
        "url": "https://server.gosling-lang.org/api/v1/tileset_info/?d=cistrome-multivec",
        "type": "multivec",
        "row": "sample",
        "column": "position",
        "value": "peak",
        "categories": ["sample 1", "sample 2", "sample 3", "sample 4"]
      },
      "x": {"field": "position", "type": "genomic", "axis": "top"},
      "y": {"field": "peak", "type": "quantitative"},
      "row": {"field": "sample", "type": "nominal"},
      "color": {"field": "sample", "type": "nominal", "legend": true},
      "tracks": [
        {"mark": "line"},
        {
          "mark": "point",
          "size": {"field": "peak", "type": "quantitative", "range": [0, 2]}
        }
      ],
      "tooltip": [
        {"field": "position", "type": "genomic", "alt": "Position"},
        {
          "field": "peak",
          "type": "quantitative",
          "alt": "Value",
          "format": ".2"
        },
        {"field": "sample", "type": "nominal", "alt": "Sample"}
      ],
      "width": 600,
      "height": 130
    }
  ]
}

