import React, { forwardRef, useEffect, useRef, useState } from 'react';
import type { Datum } from 'gosling.js/dist/src/gosling-schema';
import { GoslingRef } from 'gosling.js';
import { GoslingApi } from 'gosling.js/dist/src/api/api';


// export const AltGoslingComponent = forwardRef<GoslingRef>((props, gosRef) => {

//     useEffect(() => {
//         const token = gosRef.current.api.subscribe('rawData', (_: string, data: {id: string, data: Datum[]}) => {
//                 console.log('Updated data was seen for', data.id);
//           });
//         return () => {
//           gosRef.current?.api.unsubscribe(token);
//         }
//       }, [gosRef.current]);
      
//     return (
//         <></>
//     )

// });


interface GoslingCompProps {
    api: GoslingApi
}

export declare const GoslingComponent: React.ForwardRefExoticComponent<GoslingCompProps & React.RefAttributes<gosling.GoslingRef>>;
export {};
//# sourceMappingURL=gosling-component.d.ts.map


export const AltGoslingComponent = (gosApi: GoslingApi) => {
    // useEffect(() => {
    //     const token = gosRef.current.api.subscribe('rawData', (_: string, data: {id: string, data: Datum[]}) => {
    //             console.log('Updated data was seen for', data.id);
    //       });
    //     return () => {
    //       gosRef.current?.api.unsubscribe(token);
    //     }
    //   }, [gosRef.current]);

    useEffect(() => {
        gosApi.subscribe('rawData', (_: string, data: {id: string, data: Datum[]}) => {
            console.log('Updated data was seen for', data.id);
        }); 
        // return () => {
        //     gosApi.unsubscribe('rawData');
        // }
    }, [])
      
    console.log(gosApi);
    return (
        <>test yes2</>
    )
};

export default AltGoslingComponent;