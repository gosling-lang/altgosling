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

export const ideogramWithArea = {
  "static": true,
  "layout": "linear",
  "centerRadius": 0.2,
  "arrangement": "parallel",
  "views": [
    {
      "xDomain": {"chromosome": "chr1"},
      "tracks": [
        {
          "data": {
            "url": "https://server.gosling-lang.org/api/v1/tileset_info/?d=cistrome-multivec",
            "type": "multivec",
            "row": "sample",
            "column": "position",
            "value": "peak",
            "categories": ["sample 1"]
          },
          "mark": "area",
          "x": {"field": "position", "type": "genomic"},
          "y": {"field": "peak", "type": "quantitative"},
          "color": {"field": "sample", "type": "nominal"},
          "width": 1000,
          "height": 30
        },
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
            "domain": {"chromosome": "chr1"}
        },
        "xe": {"field": "chromEnd", "type": "genomic"},
        "size": {"value": 20},
        "stroke": {"value": "gray"},
        "strokeWidth": {"value": 0.5},
        "style": {"outline": "white"}
        }
      ]
    }
  ]
}