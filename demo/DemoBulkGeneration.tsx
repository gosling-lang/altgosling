import React, { useState } from 'react';

import { AltGoslingComponent } from '../src/AltGoslingComponent';

// Editor examples
import { examples as EditorExamples } from './editor-examples';
const examples = {};
Object.values(EditorExamples).forEach(ex => {
    examples[ex.name] = ex.spec;
});

let output = '';
console.log(Object.keys(examples).length);

function download(filename: string, text: string) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function Demo() {
    const [exampleIdx, setExampleIdx] = useState<number>(0);

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
                        // console.log(output);
                        download("gosling-editor-examples.txt", output);
                    }
                }}
            />
        </>
    );
}

export default Demo;
