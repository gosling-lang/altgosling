export const brush = {
  "title": "Visual Linking",
  "subtitle": "Change the position and range of the brush to update the detail view on the bottom",
  "arrangement": "vertical",
  "centerRadius": 0.4,
  "views": [
    {
      "spacing": 5,
      "static": true,
      "layout": "circular",
      "xDomain": {"chromosome": "chr1"},
      "alignment": "overlay",
      "tracks": [
        {"mark": "bar"},
        {"mark": "brush", "x": {"linkingId": "detail"}}
      ],
      "data": {
        "url": "https://server.gosling-lang.org/api/v1/tileset_info/?d=cistrome-multivec",
        "type": "multivec",
        "row": "sample",
        "column": "position",
        "value": "peak",
        "categories": ["sample 1", "sample 2", "sample 3", "sample 4"]
      },
      "x": {"field": "start", "type": "genomic"},
      "xe": {"field": "end", "type": "genomic"},
      "y": {"field": "peak", "type": "quantitative"},
      "row": {"field": "sample", "type": "nominal"},
      "color": {"field": "sample", "type": "nominal"},
      "width": 250,
      "height": 130
    },
    {
      "layout": "linear",
      "xDomain": {"chromosome": "chr1", "interval": [160000000, 200000000]},
      "linkingId": "detail",
      "tracks": [
        {
          "data": {
            "url": "https://server.gosling-lang.org/api/v1/tileset_info/?d=cistrome-multivec",
            "type": "multivec",
            "row": "sample",
            "column": "position",
            "value": "peak",
            "categories": ["sample 1", "sample 2", "sample 3", "sample 4"]
          },
          "mark": "bar",
          "x": {"field": "position", "type": "genomic", "axis": "top"},
          "y": {"field": "peak", "type": "quantitative"},
          "row": {"field": "sample", "type": "nominal"},
          "color": {"field": "sample", "type": "nominal"},
          "width": 690,
          "height": 200
        }
      ]
    }
  ]
}