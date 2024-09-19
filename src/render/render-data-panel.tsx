import { useEffect, useState } from "react";

import { AltTrack, AltDataStatistics } from '@altgosling/schema/alt-gosling-schema';
import { createDataTable } from './data-table';
import { dataNodeStats, nodeToJSX } from './alt-tree-mui';

import { TreeView } from '@mui/x-tree-view/TreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import { getRangeText } from '@altgosling/alt-gosling-model/alt-text/text-data';


export function renderDataPanel(
        expandedStart: string[], setExpandedDataPanelWrapper: any, focusStart: string, setFocusDataPanelWrapper: any,
        track: AltTrack, altDataStatistics: AltDataStatistics, previousAltDataStatistics?: AltDataStatistics, dataTableRoundValues?: boolean
    ) {

    /**
     * Keep track of the expanded nodes.
     * The tree does not depend on these component so it does not rerender every time it is updated
     */
    const [expanded, setExpanded] = useState<string[]>(expandedStart);
    const [focus, setFocus] = useState<string>(focusStart);

    /**
     * Any time expanded is updated, call setExpandedDataPanelWrapper, which will update the state of the parent component
     */
    useEffect(() => {
        setExpandedDataPanelWrapper(expanded);
    }, [expanded]);

    /**
     * Any time focus is updated, call setFocusDataPanelWrapper, which will update the state of the parent component
     */
    useEffect(() => {
        setFocusDataPanelWrapper(focus);
    }, [focus]);

    if (track.alttype == 'ov-data') {
        console.warn('overlaid with data not yet supported');
        return <></>;
    }
    // data panel has 3 pieces:
    // - description of which track & what's different
    // ---- either 'showing track xx, bar chart' or 'genomic range changed to xxx to xxx'
    // - altDataStatistics
    // - raw data table
    
    // if (altDataStatistics.id === previousAltDataStatistics.id) {
    //     determineDifferenceDataPanels()
    // } else {
    //     renderNewDataPanel(altDataStatistics)
    // }
    let desc;

    // if there is only 1 track, there is no need to mention this
    let positionDescription;
    if (track.position.description === 'There is only one view.') {
        positionDescription = ``;
    } else {
        positionDescription = `Showing track on the ${track.position.description}.`;
    }

    if (previousAltDataStatistics) {
        // check if the ids are the same
        if (previousAltDataStatistics.id == altDataStatistics.id) {
            if (altDataStatistics.genomicMin !== undefined && altDataStatistics.genomicMax !== undefined) {
                desc = `${positionDescription} Genomic range has been changed. ${getRangeText(altDataStatistics.genomicMin, altDataStatistics.genomicMax)}`;
            }
        } else {
            desc = `${positionDescription}`;
        }
    } else {
        desc = `${positionDescription}`;
    }

    const dataNode = dataNodeStats(altDataStatistics, track.uid);

    const dataTable = createDataTable(altDataStatistics.flatTileData, dataTableRoundValues);

    return (
        <TreeView
            className = 'data-panel-tree'
            aria-label='Hierarchical tree describing updated data.'
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpanded={expandedStart}
            // When nodes are collapsed, save this in the state
            onNodeToggle={(_, nodeIds) => {
                setExpanded(nodeIds);
            }}
            defaultSelected={focusStart}
            // Save the focus state in the state
            onNodeFocus={(_, nodeId) => {
                setFocus(nodeId);
            }}
            defaultExpandIcon={<ChevronRightIcon />}
        >
            <TreeItem nodeId='tree' label='Data panel'>
                <TreeItem nodeId='desc' label={desc}></TreeItem>
                {nodeToJSX(dataNode)}
                <TreeItem nodeId='rawData' label='Data Table'>{dataTable}</TreeItem>
            </TreeItem>
        </TreeView>
    );

}
