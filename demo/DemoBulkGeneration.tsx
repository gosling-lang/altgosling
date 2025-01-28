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

let output = '';

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
    const [exampleIdx, setExampleIdx] = useState<number>(0);
    // const [selectedExample, setSelectedExample] = useState<string>(Object.keys(examples)[0]);

    return (
        <>
            <AltGoslingComponent
                spec={Object.values(examples)[exampleIdx]}
                download={true}
                name={Object.keys(examples)[exampleIdx]}
                onAltGoslingSpecUpdated={x => {
                    output += `${Object.keys(examples)[exampleIdx]}\n\n`;
                    output += `alt\n\n${x.alt}\n\n`;
                    output += `fullDescription\n\n${x.fullDescription}\n\n`;
                    output += `longDescription\n\n${x.longDescription}\n\n`;

                    if (exampleIdx < Object.keys(examples).length - 1) {
                        setExampleIdx(exampleIdx + 1);
                    } else {
                        console.log(output);
                    }
                }}
            />
        </>
    );
}

export default Demo;
