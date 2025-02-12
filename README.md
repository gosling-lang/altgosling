# AltGosling

AltGosling is a library based on [Gosling](https://github.com/gosling-lang/gosling.js) that automatically extracts features and converts these into natural language to describe Gosling visualizations.


## Why AltGosling? 
There is a large gap in accessibility, specifically for people with blindness and low vision (BLV), on the web. The Web Content Accessibility Guidelines ([WCAG](https://www.w3.org/WAI/standards-guidelines/wcag/)) require text descriptions for images. AltGosling creates text descriptions for genomic visualizations created with Gosling. In this way, interactive visualizations can be deployed on the web and automatically include text descriptions.


## Installation
AltGosling is available as an [NPM package](https://www.npmjs.com/package/altgosling).

Install it with your favorite package manager.

```bash
npm install altgosling
```

## Quick Start with React
The fastest way to get AltGosling running is shown below.

```bash
import React from 'react';
import gosling from 'gosling.js';
import { AltGoslingComponent } from 'altgosling';

function Demo() {
  // example spec
  const goslingSpec = {
    "title": "Tonsil ChIP-seq in Th1 cells",
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
  return (
    <>
      <AltGoslingComponent spec={goslingSpec}/>
    </>
  );
}
```


## Demo
A demo of AltGosling is available [here](https://gosling-lang.github.io/altgosling/). 

All examples are available in [demo/examples](https://github.com/gosling-lang/altgosling/tree/master/demo/examples).


## Contributing to AltGosling
We welcome contributions to AltGosling! Please refer to the [contributing guidelines](CONTRIBUTING.md).


## Team
[HiDIVE Lab](https://hidivelab.org)
- Thomas C. Smits
- Sehi L'Yi
- Andrew P. Mar
- Nils Gehlenborg

Questions can be directed towards <nils@hms.harvard.edu>


## Cite
Our preprint is available [here](https://osf.io/preprints/osf/26jvr).

Please cite this work as follows:

```
Thomas C Smits, Sehi L’Yi, Andrew P Mar, Nils Gehlenborg (2024). AltGosling: Automatic Generation of Text Descriptions for Accessible Genomics Data Visualization, Bioinformatics 40(12), btae670. 10.1093/bioinformatics/btae670
