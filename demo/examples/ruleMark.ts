export const ruleMark = {
  "title": "Tonsil ChIP-seq in Th1 cells",
  "subtitle": "Annotated bar chart with lines",
  "style": {"dashed": [3, 3]},
  "views": [
    {
      "alignment": "overlay",
      "tracks": [
        {
          "data": {
            "url": "https://server.gosling-lang.org/api/v1/tileset_info/?d=cistrome-multivec",
            "type": "multivec",
            "row": "sample",
            "column": "position",
            "value": "peak",
            "categories": ["Th1"],
            "binSize": 4
          },
          "mark": "bar",
          "x": {"field": "start", "type": "genomic"},
          "xe": {"field": "end", "type": "genomic"},
          "y": {"field": "peak", "type": "quantitative", "domain": [0, 0.003]},
          "color": {"value": "lightgray"}
        },
        {
          "data": {
            "type": "json",
            "values": [
              {"c": "chr5", "p": 100000, "v": 0.0004},
              {"c": "chr10", "p": 100000, "v": 0.0009}
            ],
            "chromosomeField": "c",
            "genomicFields": ["p"]
          },
          "mark": "rule",
          "x": {"field": "p", "type": "genomic"},
          "y": {"field": "v", "type": "quantitative", "domain": [0, 0.003]},
          "strokeWidth": {"field": "v", "type": "quantitative"},
          "color": {"value": "blue"}
        }
      ],
      "width": 500,
      "height": 200
    }
  ]
}
