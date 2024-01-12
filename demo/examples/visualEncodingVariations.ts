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


  export const visualEncodingTrack4 = {
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