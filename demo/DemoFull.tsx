import React, { useState } from 'react';

import { AltGoslingComponent } from '../src/AltGoslingComponent';

// simple examples
import { barChart, barChartStatic } from './examples/barChart';
import { lineChart } from './examples/lineChart';
import { pointChart } from './examples/pointChart';
import { ideogram, ideogramWithArea } from './examples/ideogram';
import { compare2 } from './examples/tonsil';

// multiple visual encodings
import { visualEncoding } from './examples/visualEncoding';
import { visualEncodingTrack1, visualEncodingTrack1And2, visualEncodingTrack4, visualEncodingTrack4WithDataCopied } from './examples/visualEncodingVariations';
import { ruleMark, ruleMark2, ruleMarkOverlaidWithSecondEncoding, ruleMarkOverlaidWithSecondEncodingSame } from './examples/ruleMark';

// complex examples
import { give } from './examples/exampleGIVE';
import { geneAnnotation } from './examples/geneAnnotation';
import { transform } from './examples/transform';

// MUI elements
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { brush } from './examples/brush';


function Demo() {
    const examples = {'Bar chart': barChart, 
                      'Line chart': lineChart,
                    //   'Point chart': pointChart,
                      // 'Ideogram': ideogram,
                    'Ideogram': ideogramWithArea,
                    'Linked views': brush,
                    //   'Multiple Visual Encodings': visualEncoding, 
                      'Tonsil ChIP-seq comparison': compare2,
                    //   'Multiple Visual Encoding Track 1 and 2': visualEncodingTrack1And2, 
                    //   'Multiple Visual Encoding Track 4': visualEncodingTrack4, 
                    //   'Multiple Visual Encoding Track 4 Test': visualEncodingTrack4WithDataCopied, 
                      'Bar chart with lines': ruleMark, 
                    //   'Bar chart with lines2': ruleMark2, 
                      'Bar chart with points': ruleMarkOverlaidWithSecondEncoding, 
                    //   'Bar chart with points2': ruleMarkOverlaidWithSecondEncodingSame,
                    //   'GIVE - CAO et al.': give,
                      'Gene annotations': geneAnnotation,
                    //   'transform': transform
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