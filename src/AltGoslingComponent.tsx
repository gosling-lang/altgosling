
import { useEffect, useRef, useState } from 'react';
import { GoslingComponent, type GoslingRef, type GoslingSpec, type HiGlassSpec, type Theme, type TemplateTrackDef } from 'gosling.js';
import type { Datum, AltGoslingSpec, PreviewAlt, DataPanelInformation, AltTrack, AltDataStatistics, AltTrackOverlaidByData, AltTrackOverlaidByMark, AltTrackSingle } from '@alt-gosling/schema/alt-gosling-schema';

import { getAlt, updateAlt } from './alt-gosling-model';
import { renderAltTree, renderDataPanel } from './render';

import Grid from '@mui/material/Grid';

// todo: add goslingcompprops as 1 attribute and add others for altgoslingprops e.g. padding and size
// then if compiled in goslingcompprops is defined, raise error that this is overridden
interface AltGoslingCompProps {
    spec?: GoslingSpec;
    padding?: number;
    margin?: number;
    border?: string;
    id?: string;
    className?: string;
    theme?: Theme;
    templates?: TemplateTrackDef[];
    // @ts-expect-error `gosling.UrlToFetchOptions` does not exist I think
    urlToFetchOptions?: gosling.UrlToFetchOptions;
    experimental?: {
        reactive?: boolean;
    };
}


export const AltGoslingComponent = (props: AltGoslingCompProps) => {
    const gosRef = useRef<GoslingRef>(null);

    const [specProcessed, setSpecProcessed] = useState<any>();

    // Keep the array of all alt panels since rerender
    const AltPanels = useRef<PreviewAlt[]>([]);
    // Set selected alt panel as state to be able to trigger a rerender when desired
    const [selectedAltPanel, setSelectedAltPanel] = useState<number>(-1);

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


    useEffect(() => {
        if (specProcessed) {
            // Get AltGoslingSpec
            const altSpec = getAlt(specProcessed);
            // Update current alt
            updateAltPanelDisplay(altSpec);
            // Reset data panels
            setDataPanelCurrent(undefined);
            setDataPanelPrevious(undefined);
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
                // update altpanel
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
            });
        }

        return () => {
            gosRef.current?.api.unsubscribe('rawData');
        };
    }, [gosRef.current]);



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
    
    // create the alt-gosling component as a grid with the gosling component, the altpanel and the datapanel
    return(
        <>
            <Grid container rowSpacing={3} columnSpacing={{xs: 3, sm: 12}}>
                <Grid item xs={12}>
                    <GoslingComponent ref={gosRef} {...props} compiled={(_: GoslingSpec, __: HiGlassSpec, additionalData: any) => {
                        setSpecProcessed(additionalData['_processedSpec'] as AltGoslingSpec);
                        }}/>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <AltPanelComponent/>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <DataPanelComponent/>
                </Grid>
            </Grid>
        </>
    );
};

export default AltGoslingComponent;
