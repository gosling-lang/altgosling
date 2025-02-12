import React, { useState } from 'react';

import { AltGoslingComponent } from '../src/AltGoslingComponent';

// MUI elements
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import examples from './screenshots/index.ts';

function Demo() {
    const [selectedExampleName, setSelectedExampleName] = useState<string>(Object.keys(examples)[0]);

    const ExampleOptions = () => {
        return (
            <FormControl variant='filled' sx={{ m: 1, minWidth: 150 }}>
                <InputLabel id='example-options'>Select example</InputLabel>
                <Select
                    aria-labelledby="example-options-radio-button"
                    defaultValue={Object.keys(examples)[0]}
                    value={selectedExampleName}
                    name="example-options-radio-button"
                    onChange={(event) => setSelectedExampleName(event.target.value)}
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
                    <ExampleOptions />
                </Grid>
                <Grid item aria-label='altgosling component' xs={12}>
                    <AltGoslingComponent
                        spec={examples[selectedExample]}
                        download={true}
                        name={selectedExample}
                        onAltGoslingSpecUpdated={x => {
                            console.log(x.alt);
                            console.log(x.fullDescription);
                            console.log(x.longDescription);
                        }}
                    />
                </Grid >
            </Grid >
        </>
    );
}

export default Demo;
