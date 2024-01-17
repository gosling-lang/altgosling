
import { useEffect, useRef, useState } from 'react';
import { GoslingComponent, type GoslingRef, type GoslingSpec, type HiGlassSpec, type Theme, type TemplateTrackDef } from 'gosling.js';
import type { Datum, AltGoslingSpec, PreviewAlt, DataPanelInformation, AltTrack, AltDataStatistics, AltTrackOverlaidByData, AltTrackOverlaidByMark, AltTrackSingle } from '@alt-gosling/schema/alt-gosling-schema';

import { getAlt, updateAlt } from './alt-gosling-model';
import { renderAltTree, renderDataPanel } from './render';

import Grid from '@mui/material/Grid';
// import Button from '@mui/material/Button';


// eventually import this from gosling
interface GoslingCompProps {
    spec?: GoslingSpec;
    // @ts-expect-error
    compiled?: CompiledCallbackFn;
    padding?: number;
    margin?: number;
    border?: string;
    id?: string;
    className?: string;
    theme?: Theme;
    templates?: TemplateTrackDef[];
    // @ts-expect-error
    urlToFetchOptions?: UrlToFetchOptions;
    experimental?: {
        reactive?: boolean;
    };
}

interface AltGoslingCompProps extends GoslingCompProps {
    layout?: 'vertical' | 'horizontal';
    layoutPanels?: 'vertical' | 'horizontal';
}


export const AltGoslingComponent = (props: AltGoslingCompProps) => {
    if (props.compiled) {
        try {
            throw new Error("The compiled calledback function is used by Alt-Gosling, and cannot be used.");
          } catch (e) {
            console.error(`${(e as Error).name}: ${(e as Error).message}`);
          }
    }
    
    const gosRef = useRef<GoslingRef>(null);

    const [specProcessed, setSpecProcessed] = useState<GoslingSpec>();

    // Keep the array of all alt panels since rerender
    const AltPanels = useRef<PreviewAlt[]>([]);
    // Set selected alt panel as state to be able to trigger a rerender when desired
    const [selectedAltPanel, setSelectedAltPanel] = useState<number>(-1);

    // save the state for rawData each time it is captured
    const [rawData, setRawData] = useState<{id: string, data: Datum[]}>();

    // Save current and previous datapanels as states to trigger rerender every time they are updated
    const [dataPanelCurrent, setDataPanelCurrent] = useState<DataPanelInformation>();
    const [dataPanelPrevious, setDataPanelPrevious] = useState<DataPanelInformation>();

    // expansion and focus of panel, using refs to avoid updating the state
    const expandedAltPanelRef = useRef<string[]>(['tree']);
    const focusAltPanelRef = useRef<string>('tree');
    const setExpandedAltPanelWrapper = (newExpanded: string[]) => {
        expandedAltPanelRef.current = newExpanded;
    };
    const setFocusAltPanelWrapper = (newFocus: string) => {
        focusAltPanelRef.current = newFocus;
    };

    const expandedDataPanelRef = useRef<string[]>(['tree']);
    const focusDataPanelRef = useRef<string>('tree');
    const setExpandedDataPanelWrapper = (newExpanded: string[]) => {
        expandedDataPanelRef.current = newExpanded;
    };
    const setFocusDataPanelWrapper = (newFocus: string) => {
        focusDataPanelRef.current = newFocus;
    };

    // const refContainer = useRef<HTMLDivElement>(null);
    // const [dimensions, setDimensions] = useState({
    //     width: 0,
    //     height: 0,
    // });

    const [goslingDimensions, setGoslingDimensions] = useState({
        width: 0,
        height: 0,
    });
    const [containerSizes, setContainerSizes] = useState([0,0,0]);


    // useEffect(() => {
    //     if (refContainer.current) {
    //         setDimensions({
    //             width: refContainer.current.offsetWidth,
    //             height: refContainer.current.offsetHeight,
    //         });
    //     }
    // }, []);

    // Grid sizes range between 1 and 12
    // If layout is not set, if GoslingComponent is wider than its height, set to vertical, otherwise horizontal
    // If layoutPanels is not set, set it to horizontal if layout is vertical, otherwise vertical
    useEffect(() => {
        const sizes = [12,12,12];
        let layout = props.layout;
        let layoutPanels = props.layoutPanels;
        if (!layout) {
            if (goslingDimensions.width > goslingDimensions.height) {
                layout = 'vertical';
            } else {
                layout = 'horizontal';
            }
        }
        if (!layoutPanels) {
            if (layout === 'vertical') {
                layoutPanels = 'horizontal';
            } else {
                layoutPanels = 'vertical';
            }
        }
        if (layout === 'vertical') {
            sizes[0] = 12;
            if (layoutPanels == 'vertical') {
                sizes[1] = 12;
                sizes[2] = 12;
            } else {
                sizes[1] = 6;
                sizes[2] = 6;
            }
        } else {
            sizes[0] = 6;
            if (layoutPanels == 'vertical') {
                sizes[1] = 6;
                sizes[2] = 6;
            } else {
                sizes[1] = 3;
                sizes[2] = 3;
            }
        }
        setContainerSizes(sizes);
    }, [goslingDimensions, props.layout, props.layoutPanels]);


    useEffect(() => {
        if (specProcessed) {
            // Get AltGoslingSpec
            const altSpec = getAlt(specProcessed);
            setGoslingDimensions({width: specProcessed._assignedWidth, height: specProcessed._assignedHeight});
            // Update current alt
            updateAltPanelDisplay(altSpec);
            // Reset data panels
            setDataPanelCurrent(undefined);
            setDataPanelPrevious(undefined);
            // setExpandedAltPanelWrapper(['tree']);
            // setExpandedDataPanelWrapper(['tree']);
        }
    }, [specProcessed]);

    function updateAltPanelDisplay(altSpec: AltGoslingSpec) {
        // Create ID for data panel, to be able to filter by id
        const NewAltPanelID = JSON.stringify(altSpec);
        const NewAltPanel: PreviewAlt = {id: NewAltPanelID, data: altSpec};

        // Filter by ID such that we don't update if unnecessary
        const AltPanelsFiltered = AltPanels.current.filter(d => d.id !== NewAltPanelID);
        AltPanels.current = [...AltPanelsFiltered, { ...NewAltPanel }];

        // Update selected alt panel
        setSelectedAltPanel(AltPanels.current.length - 1);
    }

    function updateDataPanelDisplay(altTrack: AltTrack, altDataStatistics: AltDataStatistics) {
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
                // console.log('New rawData', data);
                setRawData(data);
            });
        }

        return () => {
            gosRef.current?.api.unsubscribe('rawData');
        };
    }, [gosRef.current]);


    // every time that rawData is updated, update the panels
    // put in a useEffect hook to make sure that panels are updated correctly
    useEffect(() => {
        // update altpanel
        const data = rawData;
        if (data) {
           const updatedAlt = updateAlt(AltPanels.current[selectedAltPanel].data, data.id, data.data);
           updateAltPanelDisplay(updatedAlt);
           
           // update datapanel, match uid of updated data to individual track
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
                           updateDataPanelDisplay(t, t.data.details.dataStatistics);
                       }
                   }
               }
           }
        }
   }, [rawData]);
   


    const AltPanelComponent = () => {
        // determine expanded and focussed values 
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
                AltPanels.current[selectedAltPanel] &&
                Object.keys(AltPanels.current[selectedAltPanel].data).length > 0 ? (
                    <>
                        <div className="editor-alt-text-body">
                            <div>
                                {renderAltTree(AltPanels.current[selectedAltPanel].data, expandedStart, setExpandedAltPanelWrapper, focusStart, setFocusAltPanelWrapper)}
                            </div>
                        </div>
                    </>
                ) : null}
            </div>
        );
    };

    const DataPanelComponent = () => {
        // determine expanded and focussed values 
        let expandedStart = ['tree'];
        if (expandedDataPanelRef.current) {
            expandedStart = expandedDataPanelRef.current;
        }
        let focusStart = 'tree';
        if (focusDataPanelRef.current) {
            focusStart = focusDataPanelRef.current;
        }

        // if previous data panel exists, add it
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
                            {panel}
                        </div>
                    </div>
                </div>
            );
        } else {
            return <></>;
        }
    };

    // debug purposes
    // function handleChange() {
    //     console.log('Button clicked!');
    // }
    
    return(
        <>
            <Grid container rowSpacing={3} columnSpacing={{xs: 1, sm: 1}} aria-label='altgosling-component-container'>
                <Grid item xs={containerSizes[0]}>
                    <div
                        aria-label='gosling-component-container' //ref={refContainer}
                    >
                    <GoslingComponent ref={gosRef} {...props} compiled={(_: GoslingSpec, __: HiGlassSpec, additionalData: any) => {
                        setSpecProcessed(additionalData['_processedSpec'] as AltGoslingSpec);
                        }}/>
                    </div>
                </Grid>
                {/* <Grid item xs={containerSizes[0] == 12 ? 12 : 12 - containerSizes[0]}> */}
                    <Grid item xs={containerSizes[1]}>
                        <AltPanelComponent/>
                    </Grid>
                    <Grid item xs={containerSizes[2]}>
                        <DataPanelComponent/>
                    </Grid>
                {/* </Grid> */}
                {/* <Button onClick={handleChange}>Click me!</Button> */}
            </Grid>
        </>
    );
};

export default AltGoslingComponent;
