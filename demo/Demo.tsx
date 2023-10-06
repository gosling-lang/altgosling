import React, { useEffect, useRef, useState } from 'react'
import gosling, { GoslingComponent } from 'gosling.js'
import type { Datum } from 'gosling.js/dist/src/gosling-schema';
import './Demo.css'
import { bar } from './examples/bar';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

function Demo() {

  const [goslingSpec, setGoslingSpec] = useState<gosling.GoslingSpec>();
  const [inputText, setInputText] = useState(null);
  
  const gosRef = useRef<gosling.GoslingRef>(null);

  useEffect(() => {
    if (gosRef.current) {
      const token = gosRef.current.api.subscribe('rawData', (_: string, data: {id: string, data: Datum[]}) => {
            console.log('Updated data was seen for', data.id);
      });
    }
    return () => {
      gosRef.current?.api.unsubscribe('rawData');
    }
  }, [gosRef.current]);
  

  useEffect(() => {
    setGoslingSpec(bar)
  }, []);

  const handleChange = (event) => {
    // setInputText(event.target.value);
  };

  const handleClick = () => {
    // setGoslingSpec(inputText);
  };
  

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