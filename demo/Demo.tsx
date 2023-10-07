import React, { useEffect, useRef, useState } from 'react';
import gosling, { GoslingComponent } from 'gosling.js';
// import { AltGoslingComponent } from '../src/AltGoslingComponent';
import type { Datum, GoslingSpec } from 'gosling.js/dist/src/gosling-schema';
import type { PreviewAlt } from '../src/schema/alt-gosling-schema';
import './Demo.css';
import { bar } from './examples/bar';
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
  useEffect(() => {
    setGoslingSpec(bar)
  }, []);

  // using the input box for setting a new gosling spec
  const handleChange = (event) => {
    // setInputText(event.target.value);
  };
  const handleClick = () => {
    // setGoslingSpec(inputText);
  };

  // should eventually move into the AltGoslingComponent
  const previewAlt = useRef<PreviewAlt[]>([]);
  const [selectedPreviewAlt, setSelectedPreviewAlt] = useState<number>(0);

  useEffect(() => {
    previewAlt.current = [];
    setSelectedPreviewAlt(0);
  }, []);

  // subscribe to the gosRef specTraversed and rawData apis
  useEffect(() => {
    if (gosRef.current) {
      gosRef.current.api.subscribe('specTraversed', (_: string, data: {id: string, data: Datum[]}) => {
        // get AltGoslingSpec
        const altSpec = getAlt(data.data as unknown as GoslingSpec, data.data as unknown as GoslingSpec)

        const id = JSON.stringify(altSpec)
        const updatedPreviewAlt: PreviewAlt = {id: id, data: altSpec};
      
        const newPreviewAlt = previewAlt.current.filter(d => d.id !== id);       
        previewAlt.current = [...newPreviewAlt, { ...updatedPreviewAlt, id }];

        setSelectedPreviewAlt(previewAlt.current.length - 1);
      });
    }
    return () => {
      gosRef.current?.api.unsubscribe('specTraversed');
    }
  }, [gosRef.current]);

  useEffect(() => {
    if (gosRef.current) {
      gosRef.current.api.subscribe('rawData', (_: string, data: {id: string, data: Datum[]}) => {
        // get latest AltGoslingSpec
        const updatedAlt = updateAlt(previewAlt.current[selectedPreviewAlt].data, data.id, data.data)
        
        const id = JSON.stringify(updatedAlt)
        const updatedPreviewAlt: PreviewAlt = {id: id, data: updatedAlt};
      
        const newPreviewAlt = previewAlt.current.filter(d => d.id !== id);       
        previewAlt.current = [...newPreviewAlt, { ...updatedPreviewAlt, id }];

        setSelectedPreviewAlt(previewAlt.current.length - 1);
      });
    }
    return () => {
      gosRef.current?.api.unsubscribe('rawData');
    }
  }, [gosRef.current]);


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
            Data
          </Grid>
        
        </Grid>
      </div>
    </>
  )
}

export default Demo