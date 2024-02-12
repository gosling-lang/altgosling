
export const barChartStatic = {
    "title": "Basic Marks: bar",
    "subtitle": "Tutorial Examples",
    "static": true,
    "tracks": [
      {
        "layout": "linear",
        "width": 800,
        "height": 180,
        "data": {
          "url": "https://resgen.io/api/v1/tileset_info/?d=UvVPeLHuRDiYA3qwFlm7xQ",
          "type": "multivec",
          "row": "sample",
          "column": "position",
          "value": "peak",
          "categories": ["sample 1"],
          "binSize": 5
        },
        "mark": "bar",
        "x": {"field": "start", "type": "genomic", "axis": "bottom"},
        "xe": {"field": "end", "type": "genomic"},
        "y": {"field": "peak", "type": "quantitative", "axis": "right"},
        "size": {"value": 5}
      }
    ]
  }
  

export const ideogram = {
    "title": "Simple ideogram",
    "subtitle": "Ideogram of hg38",
    "tracks": [
      {
        "width": 800,
        "height": 40,
        "data": {
          "url": "https://raw.githubusercontent.com/sehilyi/gemini-datasets/master/data/UCSC.HG38.Human.CytoBandIdeogram.csv",
          "type": "csv",
          "chromosomeField": "Chromosome",
          "genomicFields": ["chromStart", "chromEnd"]
        },
        "mark": "rect",
        "dataTransform": [
          {"type": "filter", "field": "Stain", "oneOf": ["acen"], "not": true}
        ],
        "color": {
          "field": "Stain",
          "type": "nominal",
          "domain": ["gneg", "gpos25", "gpos50", "gpos75", "gpos100", "gvar"],
          "range": ["white", "#D9D9D9", "#979797", "#636363", "black", "#A0A0F2"]
        },
        "x": {
          "field": "chromStart",
          "type": "genomic",
          "domain": {"chromosome": "chr1"},
          "axis": "top"
        },
        "xe": {"field": "chromEnd", "type": "genomic"},
        "size": {"value": 20},
        "stroke": {"value": "gray"},
        "strokeWidth": {"value": 0.5},
        "style": {"outline": "white"}
      }
    ]
  }

  export const visualEncodingTrack1 = {
    "title": "Visual Encoding",
    "subtitle": "Gosling provides diverse visual encoding methods",
    "layout": "linear",
    "arrangement": "vertical",
    "centerRadius": 0.8,
    "views": [
      {
        "tracks": [
          {
            "id": "track-1",
            "data": {
              "url": "https://server.gosling-lang.org/api/v1/tileset_info/?d=cistrome-multivec",
              "type": "multivec",
              "row": "sample",
              "column": "position",
              "value": "peak",
              "categories": ["sample 1", "sample 2", "sample 3", "sample 4"],
              "binSize": 4
            },
            "mark": "rect",
            "x": {"field": "start", "type": "genomic", "axis": "top"},
            "xe": {"field": "end", "type": "genomic"},
            "row": {"field": "sample", "type": "nominal", "legend": true},
            "color": {"field": "peak", "type": "quantitative", "legend": true},
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
            "width": 600,
            "height": 130
          }
        ]
      }
    ]
  }
     


  export const visualEncodingTrack1And2 = {
    "title": "Visual Encoding",
    "subtitle": "Gosling provides diverse visual encoding methods",
    "layout": "linear",
    "arrangement": "vertical",
    "centerRadius": 0.8,
    "xDomain": {"chromosome": "chr1", "interval": [1, 3000500]},
    "views": [
      {
        "tracks": [
          {
            "id": "track-1",
            "data": {
              "url": "https://server.gosling-lang.org/api/v1/tileset_info/?d=cistrome-multivec",
              "type": "multivec",
              "row": "sample",
              "column": "position",
              "value": "peak",
              "categories": ["sample 1", "sample 2", "sample 3", "sample 4"],
              "binSize": 4
            },
            "mark": "rect",
            "x": {"field": "start", "type": "genomic", "axis": "top"},
            "xe": {"field": "end", "type": "genomic"},
            "row": {"field": "sample", "type": "nominal", "legend": true},
            "color": {"field": "peak", "type": "quantitative", "legend": true},
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
            "width": 600,
            "height": 130
          }
        ]
      },
      {
        "tracks": [
          {
            "id": "track-2",
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
            "color": {"field": "sample", "type": "nominal", "legend": true},
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
            "width": 600,
            "height": 130
          }
        ]
      }
    ]
  }

  export const visualEncoding = {
    "title": "Visual Encoding",
    "subtitle": "Gosling provides diverse visual encoding methods",
    "layout": "linear",
    "arrangement": "vertical",
    "centerRadius": 0.8,
    "xDomain": {"chromosome": "chr1", "interval": [1, 3000500]},
    "views": [
      {
        "tracks": [
          {
            "id": "track-1",
            "data": {
              "url": "https://server.gosling-lang.org/api/v1/tileset_info/?d=cistrome-multivec",
              "type": "multivec",
              "row": "sample",
              "column": "position",
              "value": "peak",
              "categories": ["sample 1", "sample 2", "sample 3", "sample 4"],
              "binSize": 4
            },
            "mark": "rect",
            "x": {"field": "start", "type": "genomic", "axis": "top"},
            "xe": {"field": "end", "type": "genomic"},
            "row": {"field": "sample", "type": "nominal", "legend": true},
            "color": {"field": "peak", "type": "quantitative", "legend": true},
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
            "width": 600,
            "height": 130
          }
        ]
      },
      {
        "tracks": [
          {
            "id": "track-2",
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
            "color": {"field": "sample", "type": "nominal", "legend": true},
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
            "width": 600,
            "height": 130
          }
        ]
      },
      {
        "tracks": [
          {
            "id": "track-3",
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
            "y": {"field": "peak", "type": "quantitative", "grid": true},
            "color": {"field": "sample", "type": "nominal", "legend": true},
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
            "width": 600,
            "height": 130
          }
        ]
      },
      {
        "id": "track-4",
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
      },
      {
        "tracks": [
          {
            "id": "track-5",
            "data": {
              "url": "https://server.gosling-lang.org/api/v1/tileset_info/?d=cistrome-multivec",
              "type": "multivec",
              "row": "sample",
              "column": "position",
              "value": "peak",
              "categories": ["sample 1", "sample 2", "sample 3", "sample 4"]
            },
            "mark": "point",
            "x": {"field": "position", "type": "genomic", "axis": "top"},
            "y": {"field": "peak", "type": "quantitative"},
            "row": {"field": "sample", "type": "nominal"},
            "size": {"field": "peak", "type": "quantitative"},
            "color": {"field": "sample", "type": "nominal", "legend": true},
            "opacity": {"value": 0.5},
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
            "width": 600,
            "height": 130
          }
        ]
      },
      {
        "tracks": [
          {
            "id": "track-6",
            "data": {
              "url": "https://server.gosling-lang.org/api/v1/tileset_info/?d=cistrome-multivec",
              "type": "multivec",
              "row": "sample",
              "column": "position",
              "value": "peak",
              "categories": ["sample 1", "sample 2", "sample 3", "sample 4"]
            },
            "mark": "point",
            "x": {"field": "position", "type": "genomic", "axis": "top"},
            "y": {"field": "peak", "type": "quantitative", "grid": true},
            "size": {"field": "peak", "type": "quantitative"},
            "color": {"field": "sample", "type": "nominal", "legend": true},
            "opacity": {"value": 0.5},
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
            "width": 600,
            "height": 130
          }
        ]
      },
      {
        "tracks": [
          {
            "id": "track-7",
            "data": {
              "url": "https://server.gosling-lang.org/api/v1/tileset_info/?d=cistrome-multivec",
              "type": "multivec",
              "row": "sample",
              "column": "position",
              "value": "peak",
              "categories": ["sample 1", "sample 2", "sample 3", "sample 4"]
            },
            "mark": "area",
            "x": {"field": "position", "type": "genomic", "axis": "top"},
            "y": {"field": "peak", "type": "quantitative"},
            "row": {"field": "sample", "type": "nominal"},
            "color": {"field": "sample", "type": "nominal", "legend": true},
            "stroke": {"value": "white"},
            "strokeWidth": {"value": 0.5},
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
            "width": 600,
            "height": 130
          }
        ]
      },
      {
        "tracks": [
          {
            "id": "track-8",
            "data": {
              "url": "https://server.gosling-lang.org/api/v1/tileset_info/?d=cistrome-multivec",
              "type": "multivec",
              "row": "sample",
              "column": "position",
              "value": "peak",
              "categories": ["sample 1", "sample 2", "sample 3", "sample 4"],
              "binSize": 4
            },
            "mark": "bar",
            "x": {"field": "start", "type": "genomic", "axis": "top"},
            "xe": {"field": "end", "type": "genomic", "axis": "top"},
            "y": {"field": "peak_min", "type": "quantitative"},
            "ye": {"field": "peak_max", "type": "quantitative"},
            "row": {"field": "sample", "type": "nominal"},
            "color": {"field": "sample", "type": "nominal", "legend": true},
            "stroke": {"value": "black"},
            "strokeWidth": {"value": 0.2},
            "tooltip": [
              {"field": "position", "type": "genomic", "alt": "Position"},
              {
                "field": "peak_min",
                "type": "quantitative",
                "alt": "min(Value)",
                "format": ".2"
              },
              {
                "field": "peak_max",
                "type": "quantitative",
                "alt": "max(Value)",
                "format": ".2"
              },
              {"field": "sample", "type": "nominal", "alt": "Sample"}
            ],
            "width": 600,
            "height": 130
          }
        ]
      },
      {
        "tracks": [
          {
            "id": "track-9",
            "data": {
              "url": "https://raw.githubusercontent.com/sehilyi/gemini-datasets/master/data/circos-segdup-edited.txt",
              "type": "csv",
              "chromosomeField": "c2",
              "genomicFields": ["s1", "e1", "s2", "e2"]
            },
            "mark": "withinLink",
            "x": {
              "field": "s1",
              "type": "genomic",
              "domain": {"chromosome": "chr1", "interval": [103900000, 104100000]}
            },
            "xe": {"field": "e1", "type": "genomic"},
            "x1": {
              "field": "s2",
              "type": "genomic",
              "domain": {"chromosome": "chr1"}
            },
            "x1e": {"field": "e2", "type": "genomic"},
            "color": {"field": "s1", "type": "nominal"},
            "stroke": {"value": "black"},
            "strokeWidth": {"value": 0.5},
            "opacity": {"value": 0.2},
            "width": 600,
            "height": 130
          }
        ]
      }
    ]
  }




export const ruleMarkJustLines = {
    "title": "Tonsil ChIP-seq in Th1 cells",
    "subtitle": "Annotated bar chart with lines",
    "style": {"dashed": [3, 3]},
    "views": [
      {
        "tracks": [
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
  
  

  export const visualEncodingTrack4WithDataCopied = {
    "title": "Visual Encoding",
    "subtitle": "Gosling provides diverse visual encoding methods",
    "layout": "linear",
    "arrangement": "vertical",
    "centerRadius": 0.8,
    "xDomain": {"chromosome": "chr1", "interval": [1, 3000500]},
    "views": [
      {
        "id": "track-4",
        "alignment": "overlay",
        "x": {"field": "position", "type": "genomic", "axis": "top"},
        "y": {"field": "peak", "type": "quantitative"},
        "row": {"field": "sample", "type": "nominal"},
        "color": {"field": "sample", "type": "nominal", "legend": true},
        "tracks": [
          {"mark": "line", "data": {
          "url": "https://server.gosling-lang.org/api/v1/tileset_info/?d=cistrome-multivec",
          "type": "multivec",
          "row": "sample",
          "column": "position",
          "value": "peak",
          "categories": ["sample 1", "sample 2", "sample 3", "sample 4"]
        }},
          {
            "mark": "point",
            "size": {"field": "peak", "type": "quantitative", "range": [0, 2]},
            "data": {
          "url": "https://server.gosling-lang.org/api/v1/tileset_info/?d=cistrome-multivec",
          "type": "multivec",
          "row": "sample",
          "column": "position",
          "value": "peak",
          "categories": ["sample 1", "sample 2", "sample 3", "sample 4"]
        }
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

  export const ruleMarkDouble = {
    "title": "Tonsil ChIP-seq in Th1 cells",
    "subtitle": "Annotated bar chart with lines",
    "style": {"dashed": [3, 3]},
    "views": [
      {
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
      },
      {
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
    ]
  }
  
  export const ruleMark4 = {
      "title": "Rule Mark",
      "subtitle": "Annotate visualization with horizontal and vertical lines",
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
                "categories": ["sample 1"],
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
                  {"c": "chr2", "p": 100000, "v": 0.0001},
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
              "color": {"value": "red"}
            },
            {
              "data": {
                "type": "json",
                "values": [
                  {"c": "chr2", "p": 100000, "v": 0.0001},
                  {"c": "chr5", "p": 100000, "v": 0.0004},
                  {"c": "chr10", "p": 100000, "v": 0.0009}
                ],
                "chromosomeField": "c",
                "genomicFields": ["p"]
              },
              "mark": "rule",
              "x": {"field": "p", "type": "genomic"},
              "strokeWidth": {"value": 2},
              "color": {"value": "blue"}
            }
          ],
          "width": 500,
          "height": 200
        }
      ]
    }
  
  
    export const ruleMark2 = {
      "title": "Rule Mark",
      "subtitle": "Annotate visualization with horizontal and vertical lines",
      "style": {"dashed": [3, 3]},
      "views": [
        {
          "alignment": "overlay",
          "mark": "rule",
          "tracks": [
            {
              "data": {
                "url": "https://server.gosling-lang.org/api/v1/tileset_info/?d=cistrome-multivec",
                "type": "multivec",
                "row": "sample",
                "column": "position",
                "value": "peak",
                "categories": ["sample 1"],
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
                  {"c": "chr2", "p": 100000, "v": 0.0001},
                  {"c": "chr5", "p": 100000, "v": 0.0004},
                  {"c": "chr10", "p": 100000, "v": 0.0009}
                ],
                "chromosomeField": "c",
                "genomicFields": ["p"]
              },
              // "mark": "rule",
              "x": {"field": "p", "type": "genomic"},
              "y": {"field": "v", "type": "quantitative", "domain": [0, 0.003]},
              "strokeWidth": {"field": "v", "type": "quantitative"},
              "color": {"value": "red"}
            },
            {
              "data": {
                "type": "json",
                "values": [
                  {"c": "chr2", "p": 100000, "v": 0.0001},
                  {"c": "chr5", "p": 100000, "v": 0.0004},
                  {"c": "chr10", "p": 100000, "v": 0.0009}
                ],
                "chromosomeField": "c",
                "genomicFields": ["p"]
              },
              // "mark": "rule",
              "x": {"field": "p", "type": "genomic"},
              "strokeWidth": {"value": 2},
              "color": {"value": "blue"}
            }
          ],
          "width": 500,
          "height": 200
        }
      ]
    }
  
  
  
    export const ruleMarkOverlaidWithSecondEncoding = {
      "title": "Rule Mark",
      "subtitle": "Annotate visualization with horizontal and vertical lines",
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
                "categories": ["sample 1"],
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
                "url": "https://server.gosling-lang.org/api/v1/tileset_info/?d=cistrome-multivec",
                "type": "multivec",
                "row": "sample",
                "column": "position",
                "value": "peak",
                "categories": ["sample 1"],
                "binSize": 4
              },
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
  
  
  
  
  export const ruleMarkOverlaidWithSecondEncodingSame = {
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
              "categories": ["sample 1"],
              "binSize": 4
            },
          "x": {"field": "start", "type": "genomic"},
          "y": {"field": "peak", "type": "quantitative", "domain": [0, 0.003]},
          "color": "red",
        "tracks": [
          {
            "mark": "bar",
            "xe": {"field": "end", "type": "genomic"},
            "color": {"value": "lightgray"}
          },
          {
            "mark": "point",
            "color": {"value": "red"}
          }
        ],
        "width": 500,
        "height": 200
      }
    ]
  }


  export const give = {
    "title": "GIVE",
    "subtitle": "Reimplementation of GenoCAT examples",
    "spacing": 60,
    "arrangement": "vertical",
    "views": [
      {
        "layout": "linear",
        "tracks": [
          {
            "alignment": "overlay",
            "title": "Genes",
            "data": {
              "url": "https://resgen.io/api/v1/tileset_info/?d=M9A9klpwTci5Vf4bHZ864g",
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
            "tracks": [
              {
                "dataTransform": [
                  {"type": "filter", "field": "type", "oneOf": ["gene"]},
                  {"type": "filter", "field": "strand", "oneOf": ["+"]}
                ],
                "mark": "rect",
                "x": {
                  "field": "end",
                  "type": "genomic",
                  "domain": {"chromosome": "chr17", "interval": [200000, 800000]},
                  "axis": "top"
                },
                "size": {"value": 7}
              },
              {
                "dataTransform": [
                  {"type": "filter", "field": "type", "oneOf": ["gene"]},
                  {"type": "filter", "field": "strand", "oneOf": ["-"]}
                ],
                "mark": "rect",
                "x": {"field": "start", "type": "genomic"},
                "size": {"value": 7}
              },
              {
                "dataTransform": [
                  {"type": "filter", "field": "type", "oneOf": ["exon"]}
                ],
                "mark": "rect",
                "x": {"field": "start", "type": "genomic"},
                "xe": {"field": "end", "type": "genomic"},
                "size": {"value": 14}
              },
              {
                "dataTransform": [
                  {"type": "filter", "field": "type", "oneOf": ["gene"]}
                ],
                "mark": "rule",
                "x": {"field": "start", "type": "genomic"},
                "xe": {"field": "end", "type": "genomic"},
                "strokeWidth": {"value": 3}
              }
            ],
            "row": {"field": "strand", "type": "nominal", "domain": ["+", "-"]},
            "color": {"value": "#4050B4"},
            "width": 700,
            "height": 50
          },
          {
            "data": {
              "url": "https://resgen.io/api/v1/tileset_info/?d=Zz3CBDSqQ3ySrOSe2yj1eg",
              "type": "vector",
              "column": "position",
              "value": "peak",
              "binSize": 4
            },
            "mark": "bar",
            "x": {"field": "start", "type": "genomic"},
            "xe": {"field": "end", "type": "genomic"},
            "y": {"field": "peak", "type": "quantitative"},
            "color": {"value": "#8A96D5"},
            "stroke": {"value": "#3C4DB4"},
            "strokeWidth": {"value": 0.5},
            "width": 700,
            "height": 40
          },
          {
            "data": {
              "url": "https://resgen.io/api/v1/tileset_info/?d=dc_SOjdCRgq_8PYf6W--7w",
              "type": "vector",
              "column": "position",
              "value": "peak",
              "binSize": 4
            },
            "mark": "bar",
            "x": {"field": "start", "type": "genomic"},
            "xe": {"field": "end", "type": "genomic"},
            "y": {"field": "peak", "type": "quantitative"},
            "color": {"value": "#8A96D5"},
            "stroke": {"value": "#3C4DB4"},
            "strokeWidth": {"value": 0.5},
            "width": 700,
            "height": 40
          },
          {
            "data": {
              "url": "https://resgen.io/api/v1/tileset_info/?d=Nolbrk9kS3CE0jJL_7OW1g",
              "type": "vector",
              "column": "position",
              "value": "peak",
              "binSize": 4
            },
            "mark": "bar",
            "x": {"field": "start", "type": "genomic"},
            "xe": {"field": "end", "type": "genomic"},
            "y": {"field": "peak", "type": "quantitative"},
            "color": {"value": "#8A96D5"},
            "stroke": {"value": "#3C4DB4"},
            "strokeWidth": {"value": 0.5},
            "width": 700,
            "height": 40
          },
          {
            "alignment": "overlay",
            "data": {
              "url": "https://raw.githubusercontent.com/sehilyi/gemini-datasets/master/data/UCSC.HG38.Human.CytoBandIdeogram.csv",
              "type": "csv",
              "chromosomeField": "Chromosome",
              "genomicFields": ["chromStart", "chromEnd"]
            },
            "tracks": [
              {
                "mark": "rect",
                "dataTransform": [
                  {
                    "type": "filter",
                    "field": "Stain",
                    "oneOf": ["acen"],
                    "not": true
                  }
                ]
              },
              {
                "mark": "triangleRight",
                "dataTransform": [
                  {"type": "filter", "field": "Stain", "oneOf": ["acen"]},
                  {"type": "filter", "field": "Name", "include": "q"}
                ]
              },
              {
                "mark": "triangleLeft",
                "dataTransform": [
                  {"type": "filter", "field": "Stain", "oneOf": ["acen"]},
                  {"type": "filter", "field": "Name", "include": "p"}
                ]
              }
            ],
            "x": {
              "field": "chromStart",
              "type": "genomic",
              "domain": {"chromosome": "chr17", "interval": [20000000, 50000000]}
            },
            "xe": {"field": "chromEnd", "type": "genomic"},
            "color": {"value": "white"},
            "size": {"value": 14},
            "stroke": {"value": "black"},
            "strokeWidth": {"value": 0.5},
            "width": 700,
            "height": 40
          },
          {
            "data": {
              "url": "https://raw.githubusercontent.com/vigsterkr/circos/master/data/5/segdup.txt",
              "type": "csv",
              "headerNames": ["id", "chr", "p1", "p2"],
              "chromosomePrefix": "hs",
              "chromosomeField": "chr",
              "genomicFields": ["p1", "p2"],
              "separator": " ",
              "longToWideId": "id"
            },
            "dataTransform": [
              {"type": "filter", "field": "chr", "oneOf": ["hs17"]}
            ],
            "mark": "rect",
            "x": {"field": "p1", "type": "genomic"},
            "xe": {"field": "p2", "type": "genomic"},
            "color": {
              "field": "chr_2",
              "type": "nominal",
              "domain": [
                "chr1",
                "chr2",
                "chr3",
                "chr4",
                "chr5",
                "chr6",
                "chr7",
                "chr8",
                "chr9",
                "chr10",
                "chr11",
                "chr12",
                "chr13",
                "chr14",
                "chr15",
                "chr16",
                "chr17",
                "chr18",
                "chr19",
                "chr20",
                "chr21",
                "chr22",
                "chrX",
                "chrY"
              ]
            },
            "opacity": {"value": 0.5},
            "size": {"value": 14},
            "overlayOnPreviousTrack": true,
            "width": 700,
            "height": 40
          }
        ]
      },
      {
        "layout": "linear",
        "tracks": [
          {
            "alignment": "overlay",
            "data": {
              "url": "https://raw.githubusercontent.com/sehilyi/gemini-datasets/master/data/UCSC.HG38.Human.CytoBandIdeogram.csv",
              "type": "csv",
              "chromosomeField": "Chromosome",
              "genomicFields": ["chromStart", "chromEnd"]
            },
            "tracks": [
              {
                "mark": "rect",
                "dataTransform": [
                  {
                    "type": "filter",
                    "field": "Stain",
                    "oneOf": ["acen"],
                    "not": true
                  }
                ]
              },
              {
                "mark": "triangleRight",
                "dataTransform": [
                  {"type": "filter", "field": "Stain", "oneOf": ["acen"]},
                  {"type": "filter", "field": "Name", "include": "q"}
                ]
              },
              {
                "mark": "triangleLeft",
                "dataTransform": [
                  {"type": "filter", "field": "Stain", "oneOf": ["acen"]},
                  {"type": "filter", "field": "Name", "include": "p"}
                ]
              }
            ],
            "x": {"field": "chromStart", "type": "genomic", "axis": "none"},
            "xe": {"field": "chromEnd", "type": "genomic"},
            "color": {"value": "white"},
            "size": {"value": 14},
            "stroke": {"value": "black"},
            "strokeWidth": {"value": 0.5},
            "width": 700,
            "height": 40
          },
          {
            "data": {
              "url": "https://raw.githubusercontent.com/vigsterkr/circos/master/data/5/segdup.txt",
              "type": "csv",
              "headerNames": ["id", "chr", "p1", "p2"],
              "chromosomePrefix": "hs",
              "chromosomeField": "chr",
              "genomicFields": ["p1", "p2"],
              "separator": " ",
              "longToWideId": "id"
            },
            "dataTransform": [
              {"type": "filter", "field": "chr_2", "oneOf": ["hs1"]}
            ],
            "mark": "rect",
            "x": {"field": "p1_2", "type": "genomic"},
            "xe": {"field": "p2_2", "type": "genomic"},
            "color": {
              "field": "chr",
              "type": "nominal",
              "domain": [
                "chr1",
                "chr2",
                "chr3",
                "chr4",
                "chr5",
                "chr6",
                "chr7",
                "chr8",
                "chr9",
                "chr10",
                "chr11",
                "chr12",
                "chr13",
                "chr14",
                "chr15",
                "chr16",
                "chr17",
                "chr18",
                "chr19",
                "chr20",
                "chr21",
                "chr22",
                "chrX",
                "chrY"
              ]
            },
            "opacity": {"value": 0.5},
            "size": {"value": 14},
            "overlayOnPreviousTrack": true,
            "width": 700,
            "height": 40
          },
          {
            "data": {
              "url": "https://resgen.io/api/v1/tileset_info/?d=Zz3CBDSqQ3ySrOSe2yj1eg",
              "type": "vector",
              "column": "position",
              "value": "peak",
              "binSize": 4
            },
            "mark": "bar",
            "x": {"field": "start", "type": "genomic"},
            "xe": {"field": "end", "type": "genomic"},
            "y": {"field": "peak", "type": "quantitative"},
            "color": {"value": "#8A96D5"},
            "stroke": {"value": "#3C4DB4"},
            "strokeWidth": {"value": 0.5},
            "width": 700,
            "height": 40
          },
          {
            "data": {
              "url": "https://resgen.io/api/v1/tileset_info/?d=dc_SOjdCRgq_8PYf6W--7w",
              "type": "vector",
              "column": "position",
              "value": "peak",
              "binSize": 4
            },
            "mark": "bar",
            "x": {"field": "start", "type": "genomic"},
            "xe": {"field": "end", "type": "genomic"},
            "y": {"field": "peak", "type": "quantitative"},
            "color": {"value": "#8A96D5"},
            "stroke": {"value": "#3C4DB4"},
            "strokeWidth": {"value": 0.5},
            "width": 700,
            "height": 40
          },
          {
            "data": {
              "url": "https://resgen.io/api/v1/tileset_info/?d=Nolbrk9kS3CE0jJL_7OW1g",
              "type": "vector",
              "column": "position",
              "value": "peak",
              "binSize": 4
            },
            "mark": "bar",
            "x": {"field": "start", "type": "genomic"},
            "xe": {"field": "end", "type": "genomic"},
            "y": {"field": "peak", "type": "quantitative"},
            "color": {"value": "#8A96D5"},
            "stroke": {"value": "#3C4DB4"},
            "strokeWidth": {"value": 0.5},
            "width": 700,
            "height": 40
          },
          {
            "alignment": "overlay",
            "title": "Genes",
            "data": {
              "url": "https://resgen.io/api/v1/tileset_info/?d=M9A9klpwTci5Vf4bHZ864g",
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
            "tracks": [
              {
                "dataTransform": [
                  {"type": "filter", "field": "type", "oneOf": ["gene"]},
                  {"type": "filter", "field": "strand", "oneOf": ["+"]}
                ],
                "mark": "rect",
                "x": {
                  "field": "end",
                  "type": "genomic",
                  "domain": {
                    "chromosome": "chr1",
                    "interval": [109000000, 112000000]
                  },
                  "axis": "bottom"
                },
                "size": {"value": 7}
              },
              {
                "dataTransform": [
                  {"type": "filter", "field": "type", "oneOf": ["gene"]},
                  {"type": "filter", "field": "strand", "oneOf": ["-"]}
                ],
                "mark": "rect",
                "x": {"field": "start", "type": "genomic"},
                "size": {"value": 7}
              },
              {
                "dataTransform": [
                  {"type": "filter", "field": "type", "oneOf": ["exon"]}
                ],
                "mark": "rect",
                "x": {"field": "start", "type": "genomic"},
                "xe": {"field": "end", "type": "genomic"},
                "size": {"value": 14}
              },
              {
                "dataTransform": [
                  {"type": "filter", "field": "type", "oneOf": ["gene"]}
                ],
                "mark": "rule",
                "x": {"field": "start", "type": "genomic"},
                "xe": {"field": "end", "type": "genomic"},
                "strokeWidth": {"value": 3}
              }
            ],
            "row": {"field": "strand", "type": "nominal", "domain": ["+", "-"]},
            "color": {"value": "#4050B4"},
            "width": 700,
            "height": 50
          }
        ]
      }
    ],
    "style": {"outlineWidth": 0}
  }


  export const geneAnnotation2 = {
    "layout": "linear",
    "xDomain": {"chromosome": "chr3", "interval": [52168000, 52890000]},
    "arrangement": "horizontal",
    "views": [
      {
        "arrangement": "vertical",
        "views": [
          {
            "alignment": "overlay",
            "title": "HiGlass",
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
            "tracks": [
              {
                "dataTransform": [
                  {"type": "filter", "field": "type", "oneOf": ["gene"]},
                  {"type": "filter", "field": "strand", "oneOf": ["+"]}
                ],
                "mark": "triangleRight",
                "x": {"field": "end", "type": "genomic", "axis": "top"},
                "size": {"value": 15}
              }
            ],
            "row": {"field": "strand", "type": "nominal", "domain": ["+", "-"]},
            "color": {
              "field": "strand",
              "type": "nominal",
              "domain": ["+", "-"],
              "range": ["#7585FF", "#FF8A85"]
            },
            "visibility": [
              {
                "operation": "less-than",
                "measure": "width",
                "threshold": "|xe-x|",
                "transitionPadding": 10,
                "target": "mark"
              }
            ],
            "opacity": {"value": 0.8},
            "width": 350,
            "height": 100
          },
          {
            "alignment": "overlay",
            "title": "Corces et al.",
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
            "tracks": [
              {
                "dataTransform": [
                  {"type": "filter", "field": "type", "oneOf": ["gene"]},
                  {"type": "filter", "field": "strand", "oneOf": ["+"]}
                ],
                "mark": "text",
                "text": {"field": "name", "type": "nominal"},
                "x": {"field": "start", "type": "genomic"},
                "xe": {"field": "end", "type": "genomic"},
                "size": {"value": 8},
                "style": {"textFontSize": 8, "dy": -12}
              },
              {
                "dataTransform": [
                  {"type": "filter", "field": "type", "oneOf": ["gene"]},
                  {"type": "filter", "field": "strand", "oneOf": ["-"]}
                ],
                "mark": "text",
                "text": {"field": "name", "type": "nominal"},
                "x": {"field": "start", "type": "genomic"},
                "xe": {"field": "end", "type": "genomic"},
                "size": {"value": 8},
                "style": {"textFontSize": 8, "dy": 10}
              },
              {
                "dataTransform": [
                  {"type": "filter", "field": "type", "oneOf": ["gene"]},
                  {"type": "filter", "field": "strand", "oneOf": ["+"]}
                ],
                "mark": "rect",
                "x": {"field": "end", "type": "genomic"},
                "size": {"value": 7}
              },
              {
                "dataTransform": [
                  {"type": "filter", "field": "type", "oneOf": ["gene"]},
                  {"type": "filter", "field": "strand", "oneOf": ["-"]}
                ],
                "mark": "rect",
                "x": {"field": "start", "type": "genomic"},
                "size": {"value": 7}
              },
              {
                "dataTransform": [
                  {"type": "filter", "field": "type", "oneOf": ["exon"]}
                ],
                "mark": "rect",
                "x": {"field": "start", "type": "genomic"},
                "xe": {"field": "end", "type": "genomic"},
                "size": {"value": 14}
              },
              {
                "dataTransform": [
                  {"type": "filter", "field": "type", "oneOf": ["gene"]}
                ],
                "mark": "rule",
                "x": {"field": "start", "type": "genomic"},
                "xe": {"field": "end", "type": "genomic"},
                "strokeWidth": {"value": 3}
              }
            ],
            "row": {"field": "strand", "type": "nominal", "domain": ["+", "-"]},
            "color": {
              "field": "strand",
              "type": "nominal",
              "domain": ["+", "-"],
              "range": ["#012DB8", "#BE1E2C"]
            },
            "visibility": [
              {
                "operation": "less-than",
                "measure": "width",
                "threshold": "|xe-x|",
                "transitionPadding": 10,
                "target": "mark"
              }
            ],
            "width": 350,
            "height": 100
          },
          {
            "alignment": "overlay",
            "title": "IGV",
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
            "tracks": [
              {
                "dataTransform": [
                  {"type": "filter", "field": "type", "oneOf": ["gene"]}
                ],
                "mark": "text",
                "text": {"field": "name", "type": "nominal"},
                "x": {"field": "start", "type": "genomic", "axis": "top"},
                "xe": {"field": "end", "type": "genomic"}
              },
              {
                "dataTransform": [
                  {"type": "filter", "field": "type", "oneOf": ["gene"]}
                ],
                "mark": "rect",
                "x": {"field": "start", "type": "genomic", "axis": "top"},
                "size": {"value": 15},
                "xe": {"field": "end", "type": "genomic"}
              },
              {
                "dataTransform": [
                  {"type": "filter", "field": "type", "oneOf": ["gene"]},
                  {"type": "filter", "field": "strand", "oneOf": ["-"]}
                ],
                "mark": "rule",
                "x": {"field": "start", "type": "genomic", "axis": "top"},
                "strokeWidth": {"value": 0},
                "xe": {"field": "end", "type": "genomic"},
                "color": {"value": "white"},
                "opacity": {"value": 0.6},
                "style": {"linePattern": {"type": "triangleLeft", "size": 10}}
              },
              {
                "dataTransform": [
                  {"type": "filter", "field": "type", "oneOf": ["gene"]},
                  {"type": "filter", "field": "strand", "oneOf": ["+"]}
                ],
                "mark": "rule",
                "x": {"field": "start", "type": "genomic", "axis": "top"},
                "strokeWidth": {"value": 0},
                "xe": {"field": "end", "type": "genomic"},
                "color": {"value": "white"},
                "opacity": {"value": 0.6},
                "style": {"linePattern": {"type": "triangleRight", "size": 10}}
              }
            ],
            "row": {"field": "strand", "type": "nominal", "domain": ["+", "-"]},
            "color": {"value": "#0900B1"},
            "visibility": [
              {
                "operation": "less-than",
                "measure": "width",
                "threshold": "|xe-x|",
                "transitionPadding": 10,
                "target": "mark"
              }
            ],
            "width": 350,
            "height": 100
          }
        ]
      },
      {
        "arrangement": "vertical",
        "views": [
          {
            "alignment": "overlay",
            "title": "Cyverse-QUBES",
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
            "tracks": [
              {
                "dataTransform": [
                  {"type": "filter", "field": "type", "oneOf": ["gene"]}
                ],
                "mark": "text",
                "text": {"field": "name", "type": "nominal"},
                "x": {"field": "start", "type": "genomic"},
                "xe": {"field": "end", "type": "genomic"},
                "color": {"value": "black"}
              },
              {
                "dataTransform": [
                  {"type": "filter", "field": "type", "oneOf": ["gene"]},
                  {"type": "filter", "field": "strand", "oneOf": ["+"]}
                ],
                "mark": "triangleRight",
                "x": {"field": "end", "type": "genomic", "axis": "top"},
                "color": {"value": "#999999"}
              },
              {
                "dataTransform": [
                  {"type": "filter", "field": "type", "oneOf": ["gene"]},
                  {"type": "filter", "field": "strand", "oneOf": ["-"]}
                ],
                "mark": "triangleLeft",
                "x": {"field": "start", "type": "genomic", "axis": "top"},
                "color": {"value": "#999999"},
                "style": {"align": "right"}
              },
              {
                "dataTransform": [
                  {"type": "filter", "field": "type", "oneOf": ["gene"]}
                ],
                "mark": "rect",
                "x": {"field": "start", "type": "genomic", "axis": "top"},
                "xe": {"field": "end", "type": "genomic"},
                "color": {"value": "lightgray"}
              },
              {
                "dataTransform": [
                  {"type": "filter", "field": "type", "oneOf": ["gene"]}
                ],
                "mark": "rule",
                "x": {"field": "start", "type": "genomic", "axis": "top"},
                "strokeWidth": {"value": 5},
                "xe": {"field": "end", "type": "genomic"},
                "color": {"value": "gray"}
              },
              {
                "dataTransform": [
                  {"type": "filter", "field": "type", "oneOf": ["exon"]}
                ],
                "mark": "rect",
                "x": {"field": "start", "type": "genomic", "axis": "top"},
                "xe": {"field": "end", "type": "genomic"},
                "color": {"value": "#E2A6F5"},
                "stroke": {"value": "#BB57C9"},
                "strokeWidth": {"value": 1}
              }
            ],
            "row": {"field": "strand", "type": "nominal", "domain": ["+", "-"]},
            "visibility": [
              {
                "operation": "less-than",
                "measure": "width",
                "threshold": "|xe-x|",
                "transitionPadding": 10,
                "target": "mark"
              }
            ],
            "size": {"value": 15},
            "width": 350,
            "height": 100
          },
          {
            "alignment": "overlay",
            "title": "GmGDV",
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
            "tracks": [
              {
                "dataTransform": [
                  {"type": "filter", "field": "type", "oneOf": ["gene"]}
                ],
                "mark": "text",
                "text": {"field": "name", "type": "nominal"},
                "x": {"field": "start", "type": "genomic", "axis": "top"},
                "xe": {"field": "end", "type": "genomic"},
                "style": {"dy": -14}
              },
              {
                "dataTransform": [
                  {"type": "filter", "field": "type", "oneOf": ["gene"]},
                  {"type": "filter", "field": "strand", "oneOf": ["+"]}
                ],
                "mark": "triangleRight",
                "x": {"field": "end", "type": "genomic", "axis": "top"},
                "size": {"value": 15}
              },
              {
                "dataTransform": [
                  {"type": "filter", "field": "type", "oneOf": ["gene"]},
                  {"type": "filter", "field": "strand", "oneOf": ["-"]}
                ],
                "mark": "triangleLeft",
                "x": {"field": "start", "type": "genomic", "axis": "top"},
                "size": {"value": 15},
                "style": {"align": "right"}
              },
              {
                "dataTransform": [
                  {"type": "filter", "field": "type", "oneOf": ["exon"]}
                ],
                "mark": "rect",
                "x": {"field": "start", "type": "genomic", "axis": "top"},
                "size": {"value": 10},
                "xe": {"field": "end", "type": "genomic"}
              },
              {
                "dataTransform": [
                  {"type": "filter", "field": "type", "oneOf": ["gene"]}
                ],
                "mark": "rule",
                "x": {"field": "start", "type": "genomic", "axis": "top"},
                "strokeWidth": {"value": 3},
                "xe": {"field": "end", "type": "genomic"}
              }
            ],
            "row": {"field": "strand", "type": "nominal", "domain": ["+", "-"]},
            "color": {
              "field": "strand",
              "type": "nominal",
              "domain": ["+", "-"],
              "range": ["blue", "red"]
            },
            "visibility": [
              {
                "operation": "less-than",
                "measure": "width",
                "threshold": "|xe-x|",
                "transitionPadding": 10,
                "target": "mark"
              }
            ],
            "width": 350,
            "height": 100
          },
          {
            "alignment": "overlay",
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
            "tracks": [
              {
                "dataTransform": [
                  {"type": "filter", "field": "type", "oneOf": ["gene"]}
                ],
                "mark": "text",
                "text": {"field": "name", "type": "nominal"},
                "x": {"field": "start", "type": "genomic", "axis": "top"},
                "color": {"value": "black"},
                "xe": {"field": "end", "type": "genomic"}
              },
              {
                "dataTransform": [
                  {"type": "filter", "field": "type", "oneOf": ["gene"]}
                ],
                "mark": "rect",
                "x": {"field": "start", "type": "genomic", "axis": "top"},
                "xe": {"field": "end", "type": "genomic"},
                "color": {"value": "#666666"}
              },
              {
                "dataTransform": [
                  {"type": "filter", "field": "type", "oneOf": ["exon"]}
                ],
                "mark": "rect",
                "x": {"field": "start", "type": "genomic", "axis": "top"},
                "xe": {"field": "end", "type": "genomic"},
                "color": {"value": "#FF6666"}
              },
              {
                "dataTransform": [
                  {"type": "filter", "field": "type", "oneOf": ["intron"]}
                ],
                "mark": "rect",
                "x": {"field": "start", "type": "genomic", "axis": "top"},
                "xe": {"field": "end", "type": "genomic"},
                "color": {"value": "#99FEFF"}
              }
            ],
            "size": {"value": 30},
            "row": {"field": "strand", "type": "nominal", "domain": ["+", "-"]},
            "stroke": {"value": "#777777"},
            "strokeWidth": {"value": 1},
            "visibility": [
              {
                "operation": "less-than",
                "measure": "width",
                "threshold": "|xe-x|",
                "transitionPadding": 10,
                "target": "mark"
              }
            ],
            "width": 350,
            "height": 100
          }
        ]
      }
    ]
  }

  export const compare1 = {
    "title": "Comparing ChIP-seq Tonsil in Th1 and ILC1",
    "layout": "linear",
    "arrangement": "vertical",
    "views": [
      {
        "tracks": [
          {
            "id": "track-1",
            "data": {
              "url": "https://server.gosling-lang.org/api/v1/tileset_info/?d=cistrome-multivec",
              "type": "multivec",
              "row": "sample",
              "column": "position",
              "value": "peak",
              "categories": ["Th1"]
            },
            "mark": "point",
            "x": {"field": "position", "type": "genomic", "axis": "top"},
            "y": {"field": "peak", "type": "quantitative"},
            "row": {"field": "sample", "type": "nominal"},
            "color": {"field": "sample", "type": "nominal", "legend": true},
            "stroke": {"value": "white"},
            "strokeWidth": {"value": 0.5},
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
            "width": 600,
            "height": 130
          }
        ]
      },
      {
        "tracks": [
          {
            "id": "track-2",
            "data": {
              "url": "https://server.gosling-lang.org/api/v1/tileset_info/?d=cistrome-multivec",
              "type": "multivec",
              "row": "sample",
              "column": "position",
              "value": "peak",
              "categories": ["Th1", "Ununsed", "ILC1"]
            },
            "dataTransform": [{
              "type": "filter", "field": "sample", "oneOf": ["ILC1"]
            }],
            "mark": "point",
            "x": {"field": "position", "type": "genomic", "axis": "top"},
            "y": {"field": "peak", "type": "quantitative"},
            "row": {"field": "sample", "type": "nominal"},
            "color": {"field": "sample", "type": "nominal", "legend": true},
            "stroke": {"value": "white"},
            "strokeWidth": {"value": 0.5},
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
            "width": 600,
            "height": 130
          }
        ]
      }
    ]
  }



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