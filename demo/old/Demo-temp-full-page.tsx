// import React, { useEffect, useRef, useState } from 'react';
// import gosling, { GoslingComponent } from 'gosling.js';
// import type { Datum, GoslingSpec } from 'gosling.js/dist/src/gosling-schema';

// const bar = {
//     "title": "Basic Marks: bar",
//     "subtitle": "Tutorial Examples",
//     "tracks": [
//       {
//         "layout": "linear",
//         "width": 800,
//         "height": 180,
//         "data": {
//           "url": "https://resgen.io/api/v1/tileset_info/?d=UvVPeLHuRDiYA3qwFlm7xQ",
//           "type": "multivec",
//           "row": "sample",
//           "column": "position",
//           "value": "peak",
//           "categories": ["sample 1"],
//           "binSize": 5
//         },
//         "mark": "bar",
//         "x": {"field": "start", "type": "genomic", "axis": "bottom"},
//         "xe": {"field": "end", "type": "genomic"},
//         "y": {"field": "peak", "type": "quantitative", "axis": "right"},
//         "size": {"value": 5}
//       }
//     ]
//   }


// function Demo() {

//   var goslingSpec = bar as gosling.GoslingSpec;
//   const gosRef = useRef<gosling.GoslingRef>(null);

//   // useEffect(() => {
//   //   if (gosRef.current) {
//   //     gosRef.current.api.subscribe('specProcessed', (_: string, data: {id: string, spec: gosling.GoslingSpec}) => {
//   //       console.log('spec')
//   //     });

//   //     gosRef.current.api.subscribe('rawData', (_: string, data: {id: string, data: Datum[]}) => {
//   //       console.log('data')
//   //     });
//   //   }
//   //   return () => {
//   //     gosRef.current?.api.unsubscribe('specProcessed');
//   //     gosRef.current?.api.unsubscribe('rawData');
//   //   }
//   // }, [gosRef.current]);

//   useEffect(() => {
//     if (gosRef.current) {
//         // gosRef.current.api.subscribe('rawdata', (type, data) => {
//         // console.log('rawdata', data);
//         // gosRef.current.api.zoomTo('bam-1', `chr${data.data.chr1}:${data.data.start1}-${data.data.end1}`, 2000);
//         // gosRef.current.api.zoomTo('bam-2', `chr${data.data.chr2}:${data.data.start2}-${data.data.end2}`, 2000);
//         // console.log('click', data.data);
//         // TODO: show messages on the right-bottom of the editor
//         // gosRef.current.api.subscribe('mouseOver', (type, eventData) => {
//         //     console.warn(type, eventData.id, eventData.genomicPosition, eventData.data);
//         //     // setMouseEventInfo({ type: 'mouseOver', data: eventData.data, position: eventData.genomicPosition });
//         // });
//         // gosRef.current.api.subscribe('click', (type, eventData) => {
//         //     console.warn(type, eventData.id, eventData.genomicPosition, eventData.data);
//         //     // setMouseEventInfo({ type: 'click', data: eventData.data, position: eventData.genomicPosition });
//         // });
//         // Range Select API
//         // gosRef.current.api.subscribe('rangeSelect', (type, eventData) => {
//         //     console.warn(type, eventData.id, eventData.genomicRange, eventData.data);
//         // });
//         // Mouse click on a track
//         // gosRef.current.api.subscribe('trackClick', (type, eventData) => {
//         //     console.warn(type, eventData.id, eventData.spec, eventData.shape);
//         // });
//         // Location API
//         // gosRef.current.api.subscribe('location', (type, eventData) => {
//         //     console.warn(type, eventData.id, eventData.genomicRange);
//         // New Track
//         // gosRef.current.api.subscribe('onNewTrack', (type, eventData) => {
//         //     console.warn(type, eventData);
//         // });
//         // New View
//         // gosRef.current.api.subscribe('onNewView', (type, eventData) => {
//         //     console.warn(type, eventData);
//         // });
//         // specProcessed
//         gosRef.current.api.subscribe('specProcessed', (type, eventData) => {
//             console.warn(type, eventData);
//         });
//     }
//     return () => {
//         // gosRef.current?.api.unsubscribe('mouseOver');
//         // gosRef.current?.api.unsubscribe('click');
//         // gosRef.current?.api.unsubscribe('rangeSelect');
//         // gosRef.current?.api.unsubscribe('trackClick');
//         // gosRef.current?.api.unsubscribe('location');
//         gosRef.current?.api.unsubscribe('specProcessed');
//     };
// }, [gosRef.current]);


//   return (
//     <>
//       <div className='demo'>
//             {goslingSpec ? 
//               <gosling.GoslingComponent ref={gosRef} spec={goslingSpec} /> 
//               : null}
//       </div>
//     </>
//   )
// }

// export default Demo




import React, { useEffect, useRef, useState } from 'react';
import gosling, { GoslingComponent } from 'gosling.js';
import { AltGoslingComponent } from '../src/AltGoslingComponent';
import type { Datum, GoslingSpec } from 'gosling.js/dist/src/gosling-schema';
import type { PreviewAlt } from '../src/schema/alt-gosling-schema';
import './Demo.css';
import { bar } from './examples/bar';
import { visualEncoding } from './examples/visualEncoding';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import { getAlt, updateAlt } from '../src/init';
import { createTree } from '../src/render-tree/alt-tree';

function Demo() {

  const [goslingSpec, setGoslingSpec] = useState<gosling.GoslingSpec>();
  const [inputText, setInputText] = useState(null);
  
  const gosRef = useRef<gosling.GoslingRef>(null);

  // for dev purposes, set the gosling spec to the bar example when loading the page
  // useEffect(() => {
  //   setGoslingSpec(bar)
  // }, []);

  // using the input box for setting a new gosling spec
  const handleChange = (event) => {
    // setInputText(event.target.value);
  };
  const handleClick = () => {
    console.log('clicked')
    // setGoslingSpec(inputText);
  };

  const handleChangeButton = () => {
    console.log('reset example')
    setGoslingSpec(bar)
  }

  const handleChangeButtonEmpty = () => {
    console.log('empty example')
    setGoslingSpec(null)
  }

  // should eventually move into the AltGoslingComponent
  const previewAlt = useRef<PreviewAlt[]>([]);
  const [selectedPreviewAlt, setSelectedPreviewAlt] = useState<number>(0);

  useEffect(() => {
    previewAlt.current = [];
    setSelectedPreviewAlt(0);
  }, []);

  // // subscribe to the gosRef specResolved and rawData apis
  // useEffect(() => {
  //   if (gosRef.current) {
  //     gosRef.current.api.subscribe('specResolved', (_: string, data: {id: string, spec: GoslingSpec}) => {

  //       console.log('specProc')
  //       // get AltGoslingSpec
  //       // const altSpec = getAlt(data.data as unknown as GoslingSpec, data.data as unknown as GoslingSpec)

  //       // const id = JSON.stringify(altSpec)
  //       // const updatedPreviewAlt: PreviewAlt = {id: id, data: altSpec};
      
  //       // const newPreviewAlt = previewAlt.current.filter(d => d.id !== id);       
  //       // previewAlt.current = [...newPreviewAlt, { ...updatedPreviewAlt, id }];

  //       // setSelectedPreviewAlt(previewAlt.current.length - 1);
  //     });
  //   }
  //   return () => {
  //     gosRef.current?.api.unsubscribe('specResolved');
  //   }
  // }, [goslingSpec]);

  if (gosRef.current) {
      //rawData
      const currentRef = gosRef.current;
      currentRef.api.subscribe("rawData", (type, data) => {
        console.log("rawData", data);
      });
      // specProcessed
      currentRef.api.subscribe("specProcessed", (type, data) => {
        console.log("specProcessed", data);
      });
    }




const altComponent = <div className="editor-alt-text-panel">    
                        {previewAlt.current.length > selectedPreviewAlt &&
                        previewAlt.current[selectedPreviewAlt] &&
                        Object.keys(previewAlt.current[selectedPreviewAlt].data).length > 0 ? (

                            <>
                                <div className="editor-alt-text-body">
                                    <div>
                                        {createTree(previewAlt.current[selectedPreviewAlt].data)}
                                    </div>
                                </div>
                            </>
                        ) : null}
                        </div>

  

  return (
    <>
      <div className='demo'>
      <div>
        <Button variant="contained" onClick={handleChangeButton}>Reset example</Button>
      </div>

      <div>
        <Button variant="contained" onClick={handleChangeButtonEmpty}>Null example</Button>
      </div>
     
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          
          <Grid item xs={6}>
            <TextField
              id="spec-input"
              label="Gosling Spec"
              multiline
              rows={10}
              onChange={handleChange}
            />
            <Button variant="contained" onClick={handleClick}>Submit</Button>
          </Grid>
          
          <Grid item xs={6}>
            {goslingSpec ? 
              <GoslingComponent ref={gosRef} spec={goslingSpec} /> 
              : null}
          
          </Grid>
          
          <Grid item xs={6}>
            Alt tree
            {altComponent}
          </Grid>
          
          <Grid item xs={6}>
            {/* {gosRef.current? 
                <AltGoslingComponent gosApi={gosRef.current.api} />
                : null} */}
          </Grid>
        
        </Grid>
      </div>
    </>
  )
}

export default Demo