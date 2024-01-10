import React, { useState } from 'react';

import { AltGoslingComponent } from '../src/AltGoslingComponent';

import { bar } from './examples/bar';
import { visualEncoding } from './examples/visualEncoding';
import { visualEncodingTrack1, visualEncodingOnly2 } from './examples/visualEncodingTrack1';
import { overlaidByMark, overlaidByMark2 } from './examples/overlaidByMark';
import { ruleMark, ruleMark2 } from './examples/ruleMark';
import { give } from './examples/complex';

import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';


function Demo() {
    const examples = {'Bar chart': bar, 'Multiple Visual Encodings': visualEncoding, 'visualEncoding4th': overlaidByMark, 'visualEncoding4thDiffData': overlaidByMark2, 'visual encoding first 2': visualEncodingOnly2, 'Bar chart with lines': ruleMark, 'rule mark 2': ruleMark2, 'complex GIVE CAO et al': give};
    const [selectedExample, setSelectedExample] = useState<string>(Object.keys(examples)[0]);

    const ExampleOptions = () => {
        return (
            <FormControl variant='filled' sx={{ m: 1, minWidth: 150 }}>
                <InputLabel id='example-options'>Select example</InputLabel>
                <Select
                    aria-labelledby="example-options-radio-button"
                    defaultValue={Object.keys(examples)[0]}
                    value={selectedExample}
                    name="example-options-radio-button"
                    onChange={(event) => setSelectedExample(event.target.value)}
                >
                    {Object.keys(examples).sort().map(e => (
                        <MenuItem value={e}>{e}</MenuItem>
                    ))}
                </Select>
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