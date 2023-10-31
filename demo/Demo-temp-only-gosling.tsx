import React, { useEffect, useRef, useState } from 'react';
import gosling, { GoslingComponent, GoslingSpec } from 'gosling.js';
import { getAlt } from '../src/alt-gosling-model' 
import { barProcessed } from './examples/visualEncodingProcessed';

function Demo() {

    const goslingSpec = {
            "title": "Basic Marks: bar",
            "subtitle": "Tutorial Examples",
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
  
  const gosRef = useRef<gosling.GoslingRef>(null);

  useEffect(() => {
    if (gosRef.current) {
        //rawData
        gosRef.current.api.subscribe('rawData', (type, data) => {
            console.log('rawData', data);
        });
        // specProcessed
        gosRef.current.api.subscribe('specProcessed', (type, data) => {
            console.log('specProcessed', data);
        });
    }
    return () => {
        gosRef.current?.api.unsubscribe('rawData');
        gosRef.current?.api.unsubscribe('specProcessed');
    };
}, [gosRef.current]);



  return (
    <>
        <GoslingComponent ref={gosRef} spec={goslingSpec} /> 
    </>
  )
}

export default Demo