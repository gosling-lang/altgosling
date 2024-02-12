import React, { useState } from 'react';

import { AltGoslingComponent } from '../src/AltGoslingComponent';

// simple examples
import { barChart } from './examples/barChart';
import { lineChart } from './examples/lineChart';
import { pointChart } from './examples/pointChart';
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

// MUI elements
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';


function Demo() {
    const examples = {'Bar chart': barChart, 
                      'Line chart': lineChart,
                    //   'Point chart': pointChart,
                      // 'Ideogram': ideogram,
                    'Ideogram': ideogramWithArea,
                    'Linked views': brush,
                    //   'Multiple Visual Encodings': visualEncoding, 
                      'Tonsil ChIP-seq comparison': compareTwoSamples,
                    //   'Multiple Visual Encoding Track 1 and 2': visualEncodingTrack1And2, 
                      // 'Multiple Visual Encoding Track 4': visualEncodingTrack4, 
                    //   'Multiple Visual Encoding Track 4 Test': visualEncodingTrack4WithDataCopied, 
                      'Bar chart with lines': ruleMark, 
                    //   'Bar chart with lines2': ruleMark2, 
                      // 'Bar chart with points': ruleMarkOverlaidWithSecondEncoding, 
                    //   'Bar chart with points2': ruleMarkOverlaidWithSecondEncodingSame,
                    'Double marks': doubleMarks,
                    //   'GIVE - CAO et al.': give,
                      'Gene annotations': geneAnnotation,
                      'Circular halves': circularHalves,
                      'Circular heatmap': heatmap,
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
                <Grid item aria-label='alt-gosling component' xs={12}>
                    <AltGoslingComponent spec={examples[selectedExample]}/>
                </Grid>
            </Grid>
       </>
   );
}

export default Demo;