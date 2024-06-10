import React, { useState } from 'react';

import { AltGoslingComponent } from '../src/AltGoslingComponent';

// simple examples
import { barChart } from './examples/barChart';
import { ideogramWithArea } from './examples/ideogram';
import { compareTwoSamples } from './examples/tonsil';
import { circularHalves } from './examples/circularHalves';
import { heatmap } from './examples/heatmap';

// multiple visual encodings
import { doubleMarks } from './examples/visualEncodingOverlay';
import { ruleMark } from './examples/ruleMark';
import { brush } from './examples/brush';

// complex examples
import { geneAnnotation } from './examples/geneAnnotation';
import { matrix } from './examples/matrix';

// MUI elements
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';


function Demo() {
    const examples = {'Bar chart': barChart,
                      'Heatmap': heatmap,
                      'Matrix': matrix,
                      'Comparison of four samples': doubleMarks,
                      'Annotated chart': ruleMark,
                      'Comparing two samples': compareTwoSamples,
                      'Linked views': brush,
                      'Circular halves': circularHalves,
                      'Gene annotations': geneAnnotation,
                      'Ideogram expression': ideogramWithArea,
                    };
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
                <Grid item aria-label='altgosling component' xs={12}>
                    <AltGoslingComponent spec={examples[selectedExample]} download={true} name={selectedExample} />
                </Grid>
            </Grid>
       </>
   );
}

export default Demo;