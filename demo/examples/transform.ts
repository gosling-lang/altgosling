export const transform2 = {
    "title": "Th1 CD4+ CXCR3+ ChIP-Seq",
    "views": [
      {
        "tracks": [
          {
            "layout": "linear",
            "width": 800,
            "height": 180,
            "data": {
              "url": "https://server.gosling-lang.org/api/v1/tileset_info/?d=cistrome-multivec",
              "type": "multivec",
              "row": "sample",
              "column": "position",
              "value": "peak",
              "categories": ["sample 1", "sample 2", "sample 3"],
              "binSize": 5
            },
            "dataTransform": [
              {"type": "filter", "field": "sample", "oneOf": ["sample 1", "sample 2"]}
            ],
            "mark": "bar",
            "x": {"field": "start", "type": "genomic", "axis": "bottom"},
            "xe": {"field": "end", "type": "genomic"},
            "y": {"field": "peak", "type": "quantitative", "axis": "right"},
            "row": {"field": "sample", "type": "nominal"},
            "size": {"value": 5}
          }
        ]
      }
  
    ]
  }


  export const transform = {
      "title": "Rule Mark",
      "subtitle": "Annotate visualization with horizontal and vertical lines",
      "style": {"dashed": [3, 3]},
      "views": [
        {
          "alignment": "overlay",
          "data": {
                "url": "https://server.gosling-lang.org/api/v1/tileset_info/?d=cistrome-multivec",
                "type": "multivec",
                "row": "sample",
                "column": "position",
                "value": "peak",
                "categories": ["sample 1", "sample 2", "sample 3", "sample 4"],
                "binSize": 4
              },
          "tracks": [
            {
               "dataTransform": [
              {"type": "filter", "field": "sample", "oneOf": ["sample 2"]}
            ],
              "mark": "bar",
              "x": {"field": "start", "type": "genomic"},
              "xe": {"field": "end", "type": "genomic"},
              "y": {"field": "peak", "type": "quantitative", "domain": [0, 0.003]},
              "color": {"value": "lightgray"}
            },
            {
              "mark": "point",
              "x": {"field": "start", "type": "genomic"},
              "y": {"field": "peak", "type": "quantitative", "domain": [0, 0.003]},
              "color": {"value": "red"}
            }
          ],
          "width": 500,
          "height": 200
        }
      ]
    }


export const transform3 = 
{
    "title": "Rule Mark",
    "subtitle": "Annotate visualization with horizontal and vertical lines",
    "style": {"dashed": [3, 3]},
    "views": [
      {
        "alignment": "overlay",
        "data": {
              "url": "https://server.gosling-lang.org/api/v1/tileset_info/?d=cistrome-multivec",
              "type": "multivec",
              "row": "sample",
              "column": "position",
              "value": "peak",
              "categories": ["sample 1", "sample 2", "sample 3", "sample 4"],
              "binSize": 4
            },
        "tracks": [
          {
            "data": {
            "url": "https://server.gosling-lang.org/api/v1/tileset_info/?d=gene-annotation",
            "type": "beddb",
            "genomicFields": [
              {"index": 1, "name": "start"},
              {"index": 2, "name": "end"}
            ],
            "valueFields": [
              {"index": 5, "name": "strand", "type": "nominal"},
              {"index": 3, "name": "name", "type": "nominal"}
            ],
            "exonIntervalFields": [
              {"index": 12, "name": "start"},
              {"index": 13, "name": "end"}
            ]
          },
             "dataTransform": [
            {"type": "filter", "field": "sample", "oneOf": ["sample 2"]}
          ],
            "mark": "bar",
            "x": {"field": "start", "type": "genomic"},
            "xe": {"field": "end", "type": "genomic"},
            "y": {"field": "peak", "type": "quantitative", "domain": [0, 0.003]},
            "color": {"value": "lightgray"}
          },
          {
            "mark": "point",
            "x": {"field": "start", "type": "genomic"},
            "y": {"field": "peak", "type": "quantitative", "domain": [0, 0.003]},
            "color": {"value": "red"}
          }
        ],
        "width": 500,
        "height": 200
      }
    ]
  }