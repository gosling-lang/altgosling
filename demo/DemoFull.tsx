import React, { useState } from 'react';

import { AltGoslingComponent } from '../src/AltGoslingComponent';

import { bar } from './examples/bar';
import { visualEncoding } from './examples/visualEncoding';

import Grid from '@mui/material/Grid';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';


function Demo() {
    const examples = {'bar': bar, 'visualEncoding': visualEncoding};
    const [selectedExample, setSelectedExample] = useState<string>(Object.keys(examples)[0]);

    const ExampleOptions = () => {
        return (
            <FormControl>
                <FormLabel id='example-options'>Select example</FormLabel>
                <RadioGroup
                    row
                    aria-labelledby="example-options-radio-button"
                    defaultValue={Object.keys(examples)[0]}
                    value={selectedExample}
                    name="example-options-radio-button"
                    onChange={(event) => setSelectedExample(event.target.value)}
                >
                    {Object.keys(examples).map(e => (
                        <FormControlLabel value={e} control={<Radio />} label={e} key={'example-'+e}/>
                    ))}
                </RadioGroup>
            </FormControl>
        );
    };

    return (
        <>
            <Grid container spacing={1}>
                <Grid item aria-label='example checkbox' xs={12}>
                    <ExampleOptions/>
                </Grid>
                <Grid item aria-label='alt-gosling component' xs={12}>
                    <AltGoslingComponent spec={examples[selectedExample]}/>
                </Grid>
            </Grid>
       </>
   );
}

export default Demo;