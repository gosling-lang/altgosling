import { useEffect, useState } from "react";

import { AltTrack, AltTrackSingle, AltTrackOverlaidByMark, AltDataStatistics } from '@alt-gosling/schema/alt-gosling-schema';
import { createDataTable } from './data-table';
import { dataNodeStats, nodeToJSX } from './alt-tree-mui';

import { TreeView } from '@mui/x-tree-view/TreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import { getRangeText } from '@alt-gosling/alt-gosling-model/alt-text/text-data';


export function renderDataPanel(
        expandedStart: string[], setExpandedDataPanelWrapper: any, focusStart: string, setFocusDataPanelWrapper: any, 
        track: AltTrack, altDataStatistics: AltDataStatistics, previousAltDataStatistics?: AltDataStatistics
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
    }, [expanded])

    /**
     * Any time focus is updated, call setFocusDataPanelWrapper, which will update the state of the parent component
     */
    useEffect(() => {
        setFocusDataPanelWrapper(focus);
    }, [focus])

    // console.log(track.alttype)
    if (track.alttype == 'ov-data') {
        console.log('overlaid with data not yet supported')
        return <></>
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

    if (previousAltDataStatistics) {
        // check if the ids are the same
        if (previousAltDataStatistics.id == altDataStatistics.id) {
            if (altDataStatistics.genomicMin && altDataStatistics.genomicMax)
            desc = `Genomic range has been changed, now showing ${getRangeText(altDataStatistics.genomicMin, altDataStatistics.genomicMax)}.`
        } else {
            desc = `Showing track ${altDataStatistics.id}`;
        }
    } else {
        desc = `Showing track ${altDataStatistics.id}`;
    }

    // console.log('desc data panel', desc)

    const dataNode = dataNodeStats(altDataStatistics, track.uid);

    const dataTable = createDataTable(altDataStatistics.flatTileData);

    return (
        <TreeView
            className = 'data-panel-tree'
            aria-label='Hierarchical tree describing updated data.'
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpanded={expandedStart}
            // When nodes are collapsed, save this in the state
            onNodeToggle={(_, nodeIds) => {
                setExpanded(nodeIds)
            }}
            defaultSelected={focusStart}
            // Save the focus state in the state
            onNodeFocus={(_, nodeId) => {
                setFocus(nodeId)
            }}
            defaultExpandIcon={<ChevronRightIcon />}
        >
            <TreeItem nodeId='desc' label={desc}></TreeItem>
            {nodeToJSX(dataNode)}
            <TreeItem nodeId='rawData' label='Raw Data'>{dataTable}</TreeItem>
            
        </TreeView>
    );

}

// function dataPanelDescription() {

// }




// function createTreeTrackDataStatistics(t: AltTrack, uid: string) {
//     if (t.alttype === 'single' || t.alttype === 'ov-mark') {
//         return (
//             (
//                 <TreeItem key={'T-'+uid+'details-data'} nodeId={'T-'+uid+'details-data'} label={'Data'}>
//                     {createTreeItemLeaf('T-'+uid+'-details-data-desc', 'Description', t.data.description, true)}
//                     <TreeItem key={'T-'+uid+'-details-data-details-stats'} nodeId={'T-'+uid+'-details-data-details-stats'} label={'Data statistics'}>
//                         <TreeItem key={'T-'+uid+'-details-data-details-stats-genomic'} nodeId={'T-'+uid+'-details-data-details-stats-genomic'} label={'Genomic range'}>
//                             {createTreeItemLeaf('T-'+uid+'-details-data-details-stats-genomic-min', 'Minimum', t.data.details.dataStatistics?.genomicMin, false)}
//                             {createTreeItemLeaf('T-'+uid+'-details-data-details-stats-genomic-max', 'Maximum', t.data.details.dataStatistics?.genomicMax, false)}
//                         </TreeItem>
//                         <TreeItem key={'T-'+uid+'-details-data-details-stats-value'} nodeId={'T-'+uid+'-details-data-details-stats-value'} label={'Value range'}>
//                             <TreeItem key={'T-'+uid+'-details-data-details-stats-value-min'} nodeId={'T-'+uid+'-details-data-details-stats-value-min'} label={'Minimum: ' + t.data.details.dataStatistics?.valueMin}>
//                                 {createTreeItemLeaf('T-'+uid+'-details-data-details-stats-value-min-genomic', 'Found at position(s)', t.data.details.dataStatistics?.valueMinGenomic?.toString(), false)}
//                             </TreeItem>
//                             <TreeItem key={'T-'+uid+'-details-data-details-stats-value-max'} nodeId={'T-'+uid+'-details-data-details-stats-value-max'} label={'Maxmimum: ' + t.data.details.dataStatistics?.valueMax}>
//                                 {createTreeItemLeaf('T-'+uid+'-details-data-details-stats-value-max-genomic', 'Found at position(s)', t.data.details.dataStatistics?.valueMaxGenomic?.toString(), false)}
//                             </TreeItem>
//                         </TreeItem>

//                         {t.data.details.dataStatistics?.categories ? (
//                             <TreeItem key={'T-'+uid+'-details-data-details-stats-category'} nodeId={'T-'+uid+'-details-data-details-stats-category'} label={'Categories'}>
//                                 {createTreeItemLeaf('T-'+uid+'-details-data-details-stats-category-list', 'Categories', arrayToString(t.data.details.dataStatistics.categories), false)}
//                             </TreeItem>
//                         ): null}
//                     </TreeItem>
//                     <TreeItem key={'T-'+uid+'-details-data-details-rawdata'} nodeId={'T-'+uid+'-details-data-details-rawdata'} label={'Raw data table'}>
//                         {t.data.details.dataStatistics?.flatTileData ? (
//                             createDataTable(t.data.details.dataStatistics?.flatTileData)
//                             // <table>
//                             //     <tbody>
//                             //         <tr>
//                             //             {Object.keys(
//                             //                 (t.data.details.dataStatistics?.flatTileData[0])
//                             //             ).map((field: string, i: number) => (
//                             //                 <th key={i}>{field}</th>
//                             //             ))}
//                             //         </tr>
//                             //         {t.data.details.dataStatistics?.flatTileData.map(
//                             //             (row: Datum, i: number) => (
//                             //                 <tr key={i}>
//                             //                     {Object.keys(row).map(
//                             //                         (field: string, j: number) => (
//                             //                             <td key={j}>
//                             //                                 {row[field]?.toString()}
//                             //                             </td>
//                             //                         )
//                             //                     )}
//                             //                 </tr>
//                             //             )
//                             //         )}
//                             //     </tbody>
//                             // </table>
                            
//                         ): null}
//                     </TreeItem>
//                 </TreeItem>
//             )
//         )
//     } else {
//         return (<></>)
//     }
// }


// function createTreeItemLeaf(id: string, label: string, item: string | number | boolean | undefined, showIfUndefined: boolean) {
//     if (item) {
//         item = item as string;
//         return (
//             <TreeItem key={id} nodeId={id} label={label + ': ' + item}></TreeItem>
//         )
//     } else {
//         if (showIfUndefined) {
//             return (
//                 <TreeItem key={id} nodeId={id} label={label + ': Information could not be retrieved.'}></TreeItem>
//             )
//         } else {
//             return
//         }
//     }
// }

// function createTreeItemNode(id: string, label: string, item: string | number | boolean | undefined, showIfUndefined: boolean) {
//     if (item) {
//         item = item as string;
//         return (
//             <TreeItem key={id} nodeId={id} label={label}>
//                 <TreeItem key={id+'-item'} nodeId={id+'-item'} label={item}></TreeItem>
//             </TreeItem>
//         )
//     } else {
//         if (showIfUndefined) {
//             return (
//                 <TreeItem key={id} nodeId={id} label={label}>
//                     <TreeItem key={id+'-item'} nodeId={id+'-item'} label={'Information could not be retrieved.'}></TreeItem>
//                 </TreeItem>
//             )
//         } else {
//             return
//         }
//     }
// }


function renderNewDataPanel(altDataStatistics: AltDataStatistics) {
    

}

function determineDifferenceDataPanels() {

}