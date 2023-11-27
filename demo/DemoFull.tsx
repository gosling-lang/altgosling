import React, { useEffect, useRef, useState } from 'react';
import gosling, { GoslingComponent } from 'gosling.js';
import { AltGoslingComponent } from '../src/AltGoslingComponent';
import type { Datum } from 'gosling.js/dist/src/gosling-schema';
// import type { AltGoslingSpec, PreviewAlt, AltTrack, AltDataStatistics } from '../src/schema/alt-gosling-schema';
// import './Demo.css';
import { bar } from './examples/bar';
import { visualEncoding } from './examples/visualEncoding';
// import { visualEncoding } from './examples/visualEncoding';
// import Grid from '@mui/material/Grid';
// import TextField from '@mui/material/TextField';
// import Button from '@mui/material/Button';

// import { getAlt, updateAlt } from '../src/alt-gosling-model';
// import { renderAltTree, renderDataPanel } from '../src/render';


// function Demo() {
//     const gosRef = useRef<gosling.GoslingRef>(null);
//     const goslingSpec = bar as gosling.GoslingSpec;
  
//     if (gosRef.current) {
//       //rawData
//       const currentRef = gosRef.current;
//       currentRef.api.subscribe("rawData", (type, data) => {
//         console.log("rawData", data);
//       });
//       // specProcessed
//       currentRef.api.subscribe("specProcessed", (type, data) => {
//         console.log("specProcessed", data);
//       });
//     }
  
//     return (
//       <div>
//         <GoslingComponent ref={gosRef} spec={goslingSpec} />
//       </div>
//     );
//   }


function Demo() {
    const goslingSpec = bar as gosling.GoslingSpec;
    const goslingSpec2 = visualEncoding as gosling.GoslingSpec;
    return (
        <>
            <p>hello</p>
            <AltGoslingComponent spec={goslingSpec} test={true}/>
       </>
   )
}

function Demo2() {
    const goslingSpec = bar as gosling.GoslingSpec;
    const goslingSpec2 = visualEncoding as gosling.GoslingSpec;
    const gosRef = useRef<gosling.GoslingRef>(null);
    
  
    interface AltGoslingCompProps {
        spec?: gosling.GoslingSpec,
        test?: boolean
    }

    

    const AltGoslingComponent = (props: AltGoslingCompProps) => {
        const gosRef = useRef<gosling.GoslingRef>(null);
  
         // subscribe to the gosRef specResolved and rawData apis
        if (gosRef.current) {
            const currentRef = gosRef.current;
            // specProcessed
            currentRef.api.subscribe("specProcessed", (_: string, data: {id: string, spec: gosling.GoslingSpec}) => {
                console.log("specProcessed", data);

               
            });
            //rawData
            currentRef.api.subscribe("rawData", (_: string, data: {id: string, data: Datum[]}) => {
                console.log("rawData", data);

            });
        }

        return( 
            <>
                <GoslingComponent ref={gosRef} {...props}/>
            </>
        )
    }



    return (
        <>
            <p>hello</p>
            <AltGoslingComponent spec={goslingSpec} test={true}/>
        </>
    )
}

export default Demo




    // const AltGoslingComponent = (props: AltGoslingCompProps) => {
    //     const gosRef = useRef<gosling.GoslingRef>(null);
  
    //      // subscribe to the gosRef specResolved and rawData apis
    //     if (gosRef.current) {
    //         const currentRef = gosRef.current;
    //         // specProcessed
    //         currentRef.api.subscribe("specProcessed", (_: string, data: {id: string, spec: GoslingSpec}) => {
    //             console.log("specProcessed", data);
    //             // get AltGoslingSpec
    //             const altSpec = getAlt(data.spec);

    //             // update current alt
    //             updateDisplay(altSpec);
    //             console.log(previewAlt.current);

    //         });
    //         //rawData
    //         currentRef.api.subscribe("rawData", (_: string, data: {id: string, data: Datum[]}) => {
    //             console.log("rawData", data);

    //             // get latest AltGoslingSpec
    //             const updatedAlt = updateAlt(previewAlt.current[selectedPreviewAlt].data, data.id, data.data)
    //             updateDisplay(updatedAlt);
                
    //             setPreviewDataPanel([updatedAlt.tracks[0], updatedAlt.tracks[0].data.details.dataStatistics]);
    //         });
    //     }


    //     export const AltGoslingComponent = forwardRef<GoslingRef>((props, gosRef) => {

    //         useEffect(() => {
    //             const token = gosRef.current.api.subscribe('rawData', (_: string, data: {id: string, data: Datum[]}) => {
    //                     console.log('Updated data was seen for', data.id);
    //               });
    //             return () => {
    //               gosRef.current?.api.unsubscribe(token);
    //             }
    //           }, [gosRef.current]);
            
    //         return (
    //             <></>
    //         )

        
    //     return(
    //         <>
    //             <GoslingComponent ref={gosRef} {...props}/>
    //         </>
    //     )

    // }
