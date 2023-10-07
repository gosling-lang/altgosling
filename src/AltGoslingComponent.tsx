// // import React, { forwardRef, useEffect } from 'react'
// import { GoslingRef } from 'gosling.js';
// import React, { forwardRef, useEffect, useRef, useState } from 'react';


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

// export default AltGoslingComponent;