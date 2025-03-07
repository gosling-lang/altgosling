import React, { useState } from 'react';

import { validateGoslingSpec } from 'gosling.js';
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
import { Grid, FormControl, InputLabel, Select, MenuItem, TextField, Typography } from '@mui/material';


function Demo() {
    const examples = {
        'Bar chart': barChart,
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
    const [editorText, setEditorText] = useState<string>('');
    const [editorValid, setEditorValid] = useState<string>('invalid');

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
                        <MenuItem key={e} value={e}>{e}</MenuItem>
                    ))}
                    <MenuItem key={"editor"} value="editor">Editor</MenuItem>
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
                {selectedExample === 'editor' ?
                    <Grid item aria-label='editor textfield' xs={12}>
                        <Typography variant='body1' color={editorValid === 'invalid' ? 'error' : ''}>Gosling spec is {editorValid}</Typography>
                        <TextField
                            id="editor"
                            multiline
                            fullWidth
                            onChange={(event) => {
                                const { state, message, details } = validateGoslingSpec(JSON.parse(event.target.value));
                                if (state !== "success") {
                                    console.error(message, details);
                                    setEditorValid('invalid');
                                } else {
                                    setEditorValid('valid');
                                }
                                setEditorText(JSON.parse(event.target.value));
                            }}
                        />
                    </Grid>
                    : null}
                <Grid item aria-label='altgosling component' xs={12}>
                    {(() => {
                        let goslingSpec: string;
                        if (selectedExample === 'editor' && editorValid === 'invalid') {
                            return <Typography variant='body1' color='error'>No Gosling or AltGosling components could be loaded.</Typography>;
                        } else if (selectedExample === 'editor' && editorValid !== 'invalid') {
                            goslingSpec = editorText;
                        } else {
                            goslingSpec = examples[selectedExample];
                        }
                        return <AltGoslingComponent spec={goslingSpec} download name={selectedExample} simplifyColorNames={true} onAltGoslingSpecUpdate={spec => {
                            console.log('AltGosling Spec Updated', spec);
                        }} />;
                    })()}
                </Grid>
            </Grid>
        </>
    );
}

export default Demo;
