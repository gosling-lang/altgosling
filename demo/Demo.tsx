import React, { useEffect, useRef, useState } from 'react';
import gosling, { GoslingComponent } from 'gosling.js';
import { AltGoslingComponent } from '../src/AltGoslingComponent';
import type { Datum, GoslingSpec } from 'gosling.js/dist/src/gosling-schema';
import type { AltGoslingSpec, PreviewAlt } from '../src/schema/alt-gosling-schema';
import './Demo.css';
import { bar } from './examples/bar';
import { visualEncoding } from './examples/visualEncoding';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import { getAlt, updateAlt } from '../src/alt-gosling-model';
import { renderAltTree } from '../src/render';

function Demo() {
    // spec
    const goslingSpec = bar;

    const gosRef = useRef<gosling.GoslingRef>(null);

    // // alt
    const previewAlt = useRef<PreviewAlt[]>([]);
    const [selectedPreviewAlt, setSelectedPreviewAlt] = useState<number>(0);

    useEffect(() => {
        previewAlt.current = [];
        setSelectedPreviewAlt(0);
    }, []);

    function updateDisplay(altSpec: AltGoslingSpec) {
        const id = JSON.stringify(altSpec);
        const updatedPreviewAlt: PreviewAlt = {id: id, data: altSpec};
        const newPreviewAlt = previewAlt.current.filter(d => d.id !== id);
        previewAlt.current = [...newPreviewAlt, { ...updatedPreviewAlt, id }];
        setSelectedPreviewAlt(previewAlt.current.length - 1);
    }

    // subscribe to the gosRef specResolved and rawData apis
    if (gosRef.current) {
        const currentRef = gosRef.current;
        // specProcessed
        currentRef.api.subscribe("specProcessed", (_: string, data: {id: string, spec: GoslingSpec}) => {
            console.log("specProcessed", data);
            // get AltGoslingSpec
            const altSpec = getAlt(data.spec);

            // update current alt
            updateDisplay(altSpec);
            console.log(previewAlt.current);

        });
        //rawData
        currentRef.api.subscribe("rawData", (_: string, data: {id: string, data: Datum[]}) => {
            console.log("rawData", data);

            // get latest AltGoslingSpec
            const updatedAlt = updateAlt(previewAlt.current[selectedPreviewAlt].data, data.id, data.data)
            updateDisplay(updatedAlt);
        });
    }

    // if (gosRef.current) {
    //     //rawData
    //     const currentRef = gosRef.current;
    //     currentRef.api.subscribe("rawData", (type, data) => {
    //       console.log("rawData", data);
    //     });
    //     // specProcessed
    //     currentRef.api.subscribe("specProcessed", (type, data) => {
    //       console.log("specProcessed", data);
    //     });
    //   }


    const altComponent = (
        <div className="editor-alt-text-panel">    
            {previewAlt.current.length > selectedPreviewAlt &&
            previewAlt.current[selectedPreviewAlt] &&
            Object.keys(previewAlt.current[selectedPreviewAlt].data).length > 0 ? (

                <>
                    <div className="editor-alt-text-body">
                        <div>
                            {renderAltTree(previewAlt.current[selectedPreviewAlt].data)}
                        </div>
                    </div>
                </>
            ) : null}
        </div>
    );

  

    return (
        <>
            <div className='demo'>
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                
                    <Grid item xs={12}>
                        {goslingSpec ? 
                            <GoslingComponent ref={gosRef} spec={goslingSpec} /> 
                        : null}
                    </Grid>
                
                    <Grid item xs={12}>
                        Test
                        {altComponent}
                    </Grid>

                </Grid>
            </div>
        </>
    )
}

export default Demo