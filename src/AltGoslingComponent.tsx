
import { useEffect, useRef, useState } from 'react';
import gosling, { GoslingComponent, GoslingSpec, HiGlassSpec } from 'gosling.js';
import type { Datum, AltGoslingSpec, PreviewAlt, AltTrack, AltDataStatistics, AltTrackOverlaidByData, AltTrackOverlaidByMark, AltTrackSingle } from '@alt-gosling/schema/alt-gosling-schema';

import { getAlt, updateAlt } from './alt-gosling-model';
import { renderAltTree, renderDataPanel } from './render';

// import Grid from '@mui/material/Grid';
// import TextField from '@mui/material/TextField';



// import Button from '@mui/material/Button';


// todo: add goslingcompprops as 1 attribute and add others for altgoslingprops e.g. padding and size
// then if compiled in goslingcompprops is defined, raise error that this is overridden
interface AltGoslingCompProps {
    spec?: gosling.GoslingSpec;
    padding?: number;
    margin?: number;
    border?: string;
    id?: string;
    className?: string;
    theme?: gosling.Theme;
    templates?: gosling.TemplateTrackDef[];
    urlToFetchOptions?: gosling.UrlToFetchOptions;
    experimental?: {
        reactive?: boolean;
    };
}


interface DataPanelInformation {
    altTrack: AltTrack,
    altDataStatistics: AltDataStatistics
}

export const AltGoslingComponent = (props: AltGoslingCompProps) => {
    const gosRef = useRef<gosling.GoslingRef>(null);


    const [specProcessed, setSpecProcessed] = useState<any>();
    /**
     * Keep the array of all alt and data panels since rerender(?)
     */
    const AltPanels = useRef<PreviewAlt[]>([]);
    // const DataPanels = useRef<DataPanelInformation[]>([]);

    const [dataPanelCurrent, setDataPanelCurrent] = useState<DataPanelInformation>(null);
    const [dataPanelPrevious, setDataPanelPrevious] = useState<DataPanelInformation>(null);
    
    // const DataPanels = useRef<[AltTrack, AltDataStatistics]>();
    // const TestPanels = useRef<String[]>([]);

    const [selectedAltPanel, setSelectedAltPanel] = useState<number>(-1);
    // const [selectedDataPanel, setSelectedDataPanel] = useState<number>(-1);
    // const [amountOfDataFetched, setAmountOfDataFetched] = useState<number>(0);

    // expansion and focus of panel, using refs to avoid updating the state
    const expandedAltPanelRef = useRef<string[]>(['tree'])
    const focusAltPanelRef = useRef<string>('tree')
    const setExpandedAltPanelWrapper = (newExpanded: string[]) => {
        expandedAltPanelRef.current = newExpanded
    }
    const setFocusAltPanelWrapper = (newFocus: string) => {
        focusAltPanelRef.current = newFocus
    }

    const expandedDataPanelRef = useRef<string[]>(['tree'])
    const focusDataPanelRef = useRef<string>('tree')
    const setExpandedDataPanelWrapper = (newExpanded: string[]) => {
        expandedDataPanelRef.current = newExpanded
    }
    const setFocusDataPanelWrapper = (newFocus: string) => {
        focusDataPanelRef.current = newFocus
    }

    // useEffect(() => {
    //     AltPanels.current = [];
    //     DataPanels.current = [];
    // }, []);


    useEffect(() => {
        // console.log('specP', specProcessed)
        if (specProcessed) {
            // get AltGoslingSpec
            const altSpec = getAlt(specProcessed);
            console.log("altSpec", altSpec);
            // update current alt
            updateAltPanelDisplay(altSpec);
            // console.log(AltPanels.current);
        }
    }, [specProcessed]);

    function updateAltPanelDisplay(altSpec: AltGoslingSpec) {
        // console.log('updating alt panel...')
        const NewAltPanelID = JSON.stringify(altSpec);
        const NewAltPanel: PreviewAlt = {id: NewAltPanelID, data: altSpec};
        const AltPanelsFiltered = AltPanels.current.filter(d => d.id !== NewAltPanelID);
        AltPanels.current = [...AltPanelsFiltered, { ...NewAltPanel }];
        // console.log('cur', AltPanels.current)
        // console.log('new one', AltPanels.current.length - 1)
        // console.log('the selected', selectedAltPanel)
        setSelectedAltPanel(AltPanels.current.length - 1);
        // console.log('after updating', selectedAltPanel)
    }

    function updateDataPanelDisplay(altTrack: AltTrack, altDataStatistics: AltDataStatistics) {
        // console.log('updating data panel...')
        const NewDataPanel = {altTrack: altTrack, altDataStatistics: altDataStatistics};
        setDataPanelPrevious(dataPanelCurrent);
        setDataPanelCurrent(NewDataPanel);
    }

    // subscribe to the gosRef specResolved and rawData apis
    useEffect(() => {
        if (gosRef.current) {
            const currentRef = gosRef.current;
                
            //rawData
            currentRef.api.subscribe("rawData", (_: string, data: {id: string, data: Datum[]}) => {
                console.log("rawData", data);

                // const NewTestPanelID = data.id;
                // const NewTestPanel = NewTestPanelID;
                // TestPanels.current = [...TestPanels.current, NewTestPanel];

                // setSelectedTestPanel(TestPanels.current.length - 1);

                // get latest AltGoslingSpec
                
                // could set state of rawdata, then based on state update
                // as setstate is asynchronous, this delays the updating of the panel
                const updatedAlt = updateAlt(AltPanels.current[selectedAltPanel].data, data.id, data.data);
                updateAltPanelDisplay(updatedAlt);
                
                let t;
                for (const i in updatedAlt.tracks) {
                    if (updatedAlt.tracks[i].alttype == 'ov-data') {
                        t = updatedAlt.tracks[i] as AltTrackOverlaidByData;
                        if (data.id in t.uids) {
                            // updateDataPanelDisplay(t, t.data.details.dataStatistics)
                        }
                    } else {
                        t = updatedAlt.tracks[i] as AltTrackSingle | AltTrackOverlaidByMark;
                        if (data.id == t.uid) {
                            if (t.data.details.dataStatistics){
                                updateDataPanelDisplay(t, t.data.details.dataStatistics)
                            }
                        }
                    }
                }
            });
        }

        return () => {
            gosRef.current?.api.unsubscribe('rawData');
        };
    }, [gosRef.current]);



    const AltPanelComponent = () => {
        // console.log('altcomp rerender')
        let expandedStart = ['tree'];
        if (expandedAltPanelRef.current) {
            expandedStart = expandedAltPanelRef.current;
        }
        let focusStart = 'tree';
        if (focusAltPanelRef.current) {
            focusStart = focusAltPanelRef.current;
        }
        return (
            <div className="editor-alt-text-panel">
                {selectedAltPanel >= 0 &&
                // AltPanels.current.length > selectedAltPanel &&
                AltPanels.current[selectedAltPanel] &&
                Object.keys(AltPanels.current[selectedAltPanel].data).length > 0 ? (
                    <>
                        <div className="editor-alt-text-body">
                            <div>
                                {/* {AltPanels.current[selectedAltPanel].id} */}
                                {renderAltTree(AltPanels.current[selectedAltPanel].data, expandedStart, setExpandedAltPanelWrapper, focusStart, setFocusAltPanelWrapper)}
                            </div>
                        </div>
                    </>
                ) : null}
            </div>
        );
    };

    const DataPanelComponent = () => {
        // console.log('datapanel rerender')
        let expandedStart = ['tree'];
        if (expandedDataPanelRef.current) {
            expandedStart = expandedDataPanelRef.current;
        }
        let focusStart = 'tree';
        if (focusDataPanelRef.current) {
            focusStart = focusDataPanelRef.current;
        }

        let panel;
        if (dataPanelCurrent) {
            if (dataPanelPrevious) {
                panel = renderDataPanel(expandedStart, setExpandedDataPanelWrapper, focusStart, setFocusDataPanelWrapper, dataPanelCurrent.altTrack, dataPanelCurrent.altDataStatistics, dataPanelPrevious.altDataStatistics);
            } else {
                panel = renderDataPanel(expandedStart, setExpandedDataPanelWrapper, focusStart, setFocusDataPanelWrapper, dataPanelCurrent.altTrack, dataPanelCurrent.altDataStatistics);
            }
            return (
                <div className="editor-data-panel">
                    <div className="editor-alt-text-body">
                        <div>
                            {'----------------------------------------------'}
                            {/* {'Amount of data fetched:' + amountOfDataFetched} */}
                            {panel}
                        </div>
                    </div>
                </div>
            )
        } else {
            return <></>
        }
    }
    

    return(
        <>
            <GoslingComponent ref={gosRef} {...props} compiled={(gs: GoslingSpec, hs: HiGlassSpec, additionalData: any) => {
                setSpecProcessed(additionalData['_processedSpec'] as AltGoslingSpec);
                }}/>

            <AltPanelComponent/>

            <DataPanelComponent/>
        </>
    );
};

export default AltGoslingComponent;



























// import React, { forwardRef, useEffect, useRef, useState } from 'react';




// // import type { Datum } from 'gosling.js/dist/src/gosling-schema';
// import  { GoslingComponent, GoslingRef, GoslingSpec } from 'gosling.js';
// // import { GoslingApi } from 'gosling.js/dist/src/api/api';



// import React, { useEffect, useRef, useState } from 'react';
// import gosling, { GoslingComponent } from 'gosling.js';
// // import { AltGoslingComponent2 } from '../src/AltGoslingComponent';
// import type { Datum } from 'gosling.js/dist/src/gosling-schema';
// // import type { AltGoslingSpec, PreviewAlt, AltTrack, AltDataStatistics } from '../src/schema/alt-gosling-schema';
// // import './Demo.css';
// import { bar } from './examples/bar';
// // import { visualEncoding } from './examples/visualEncoding';
// // import Grid from '@mui/material/Grid';
// // import TextField from '@mui/material/TextField';
// // import Button from '@mui/material/Button';

// // import { getAlt, updateAlt } from '../src/alt-gosling-model';
// // import { renderAltTree, renderDataPanel } from '../src/render';

// function Demo() {
//     const goslingSpec = bar as gosling.GoslingSpec;
//     // const gosRef = useRef<gosling.GoslingRef>(null);
    
  
//     interface AltGoslingCompProps {
//         spec?: gosling.GoslingSpec,
//         test?: boolean
//     }

    
    

//     const AltGoslingComponent = (props: AltGoslingCompProps) => {
//         const gosRef = useRef<gosling.GoslingRef>(null);
  
//          // subscribe to the gosRef specResolved and rawData apis
//         if (gosRef.current) {
//             const currentRef = gosRef.current;
//             // specProcessed
//             currentRef.api.subscribe("specProcessed", (_: string, data: {id: string, spec: GoslingSpec}) => {
//                 console.log("specProcessed", data);
//                 // get AltGoslingSpec
//                 const altSpec = getAlt(data.spec);

//                 // update current alt
//                 updateDisplay(altSpec);
//                 console.log(previewAlt.current);

//             });
//             //rawData
//             currentRef.api.subscribe("rawData", (_: string, data: {id: string, data: Datum[]}) => {
//                 console.log("rawData", data);

//                 // get latest AltGoslingSpec
//                 const updatedAlt = updateAlt(previewAlt.current[selectedPreviewAlt].data, data.id, data.data)
//                 updateDisplay(updatedAlt);
                
//                 setPreviewDataPanel([updatedAlt.tracks[0], updatedAlt.tracks[0].data.details.dataStatistics]);
//             });
//         }




// }

// export default Demo



// // export const AltGoslingComponent2 = forwardRef<GoslingRef, typeof GoslingComponent>((props, ref) => {
    
// //     return(

// //         <>
// //             <p>hello</p>
// //             {/* <GoslingComponent ref={ref} {...props}/> */}
        
// //         </>
// //     )

// // })

// export const AltGoslingComponent2 = (spec: GoslingSpec) => {
//     return(
//         <>
//             <GoslingComponent spec={spec}/>
//         </>
//     )

// }


// // i want the ref to point to goslingcomponent
// //

// // export const AltGoslingComponent = forwardRef<GoslingRef>((props, gosRef) => {

// //     useEffect(() => {
// //         const token = gosRef.current.api.subscribe('rawData', (_: string, data: {id: string, data: Datum[]}) => {
// //                 console.log('Updated data was seen for', data.id);
// //           });
// //         return () => {
// //           gosRef.current?.api.unsubscribe(token);
// //         }
// //       }, [gosRef.current]);
      
// //     return (
// //         <></>
// //     )

// // });


// // interface GoslingCompProps {
// //     api: GoslingApi
// // }

// // export declare const GoslingComponent: React.ForwardRefExoticComponent<GoslingCompProps & React.RefAttributes<gosling.GoslingRef>>;
// // export {};
// // //# sourceMappingURL=gosling-component.d.ts.map


// // export const AltGoslingComponent = (gosApi: GoslingApi) => {
// //     // useEffect(() => {
// //     //     const token = gosRef.current.api.subscribe('rawData', (_: string, data: {id: string, data: Datum[]}) => {
// //     //             console.log('Updated data was seen for', data.id);
// //     //       });
// //     //     return () => {
// //     //       gosRef.current?.api.unsubscribe(token);
// //     //     }
// //     //   }, [gosRef.current]);

// //     useEffect(() => {
// //         gosApi.subscribe('rawData', (_: string, data: {id: string, data: Datum[]}) => {
// //             console.log('Updated data was seen for', data.id);
// //         });
// //         // return () => {
// //         //     gosApi.unsubscribe('rawData');
// //         // }
// //     }, [])
      
// //     console.log(gosApi);
// //     return (
// //         <>test yes2</>
// //     )
// // };

// export default AltGoslingComponent2;