export const matrix = {
    "title": "Hi-C for HFFc6 Cells",
    "xDomain": {"chromosome": "chr7", "interval": [79700000, 81000000]},
    "tracks": [
      {
        "id": "https://higlass.io/api/v1/tileset_info/?d=ZCvntCKST0KUvQPGcCbJGA",
        "data": {
          "url": "https://higlass.io/api/v1/tileset_info/?d=ZCvntCKST0KUvQPGcCbJGA",
          "type": "matrix"
        },
        "mark": "bar",
        "x": {"field": "xs", "type": "genomic", "axis": "top"},
        "xe": {"field": "xe", "type": "genomic", "axis": "none"},
        "y": {"field": "ys", "type": "genomic", "axis": "left"},
        "ye": {"field": "ye", "type": "genomic"},
        "color": {
          "field": "value",
          "type": "quantitative",
          "range": "pink",
          "legend": false
        },
        "width": 400,
        "height": 400
      }
    ]
  }