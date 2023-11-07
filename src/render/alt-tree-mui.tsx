import { TreeView } from '@mui/x-tree-view/TreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import type { Datum } from 'gosling.js/dist/src/gosling-schema';
import type { AltDataStatistics, AltGoslingSpec, AltTrack, AltTrackOverlaidByMark, AltTrackSingle } from '../schema/alt-gosling-schema';
import { createDataTable } from './data-table';
import { arrayToString, booleanToString } from './util';

/**
 * Wrapper function to generate tree from AltGoslingSpec
 * @param {AltGoslingSpec} data AltGoslingSpec 
 * @returns {JSX.Element} tree element
 */
export function renderAltTree(altSpec: AltGoslingSpec): JSX.Element {
    const structure = createAltNodes(altSpec);
    return structureToTree(structure);
}


class AltNode {
    name: string;
    key: string;
    always_show: boolean;
    collapsing: boolean;
    children_type: 'value' | 'altnodelist' | 'rawData';
    children: string | Array<AltNode> | Datum[] | undefined;

    constructor(name: string, key: string, always_show: boolean, collapsing: boolean, children_type: 'value' | 'altnodelist' | 'rawData', children: string | Array<AltNode> | Datum[] | undefined) {
        this.name = name;
        this.key = key;
        this.always_show = always_show;
        this.collapsing = collapsing;
        this.children_type = children_type;
        this.children = children;
    }
}

function structureToTree(structure: AltNode): JSX.Element {
    const treeContent = nodeToJSX(structure);
    return(
        <TreeView
            className = 'tree-view'
            aria-label="Hierarchical tree describing displayed Gosling visualization."
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpanded={['tree']}
            defaultExpandIcon={<ChevronRightIcon />}
        >{treeContent}</TreeView>
    );
}

function nodeToJSX(node: AltNode): JSX.Element {
    if (!node.children) {
        if (node.always_show) {
            node.children = 'This information cannot be displayed.';
        } else {
            return <></>
        }
    }

    if (typeof(node.children) === 'string') {
        if (node.collapsing) {
            return(
                <TreeItem nodeId={node.key} label={node.name}>
                    <TreeItem nodeId={node.key+'-item'} label={node.children}></TreeItem>
                </TreeItem>
                );
        } else {
            return(<TreeItem nodeId={node.key} label={node.name + ': ' + node.children}></TreeItem>);
        }
    } 
    
    else if (node.children_type === 'altnodelist') {
        const nodeList = node.children as AltNode[];
        const elementList = Object.keys(node.children).map((n, i) => {return nodeToJSX(nodeList[i])});
        return(
            <TreeItem nodeId={node.key} label={node.name}>
                {...elementList}
            </TreeItem>
        );
    } 
    
    else {   
        const rawData = node.children as Datum[];
        return(
            <TreeItem nodeId={node.key} label={node.name}>
                {createDataTable(rawData)}
            </TreeItem>
        );
    }
}


function createAltNodes(altSpec: AltGoslingSpec): AltNode {
    const structure = new AltNode('Automatic description', 'tree', true, true, 'altnodelist', [
        new AltNode('Alt-text', 'alt', true, true, 'value', altSpec.alt),
        new AltNode('Description', 'long', true, true, 'value', altSpec.longDescription),
        new AltNode('Details', 'details', true, true, 'altnodelist', [
            new AltNode('Title', 'title', false, true, 'value', altSpec.title),
            new AltNode('Subtitle', 'subtitle', false, true, 'value', altSpec.subtitle),
            ...trackNode(altSpec)
        ]),
    ]);
    return(structure);
}


function trackNode(altSpec: AltGoslingSpec): Array<AltNode> {
    if (altSpec.composition.nTracks === 1) {
        return(trackNodeSingle(altSpec.tracks[0]))
    } else {
        const tracks = Object.keys(altSpec.tracks).map((t, i) => (trackNodeMulti(altSpec.tracks[i])))
        return([
            new AltNode('Composition', 'composition', true, true, 'value', altSpec.composition.description),
            new AltNode('Tracks', 'tracks', true, true, 'altnodelist', tracks)
        ])
    }

}


function trackNodeSingle(t: AltTrack): Array<AltNode> {

    const structureList = [
        new AltNode('Description', 'T-1-desc', true, true, 'value', t.description),
        new AltNode('Details', 'T-1-det', true, true, 'altnodelist', [
            new AltNode('Title', 'T-1-det-title', false, true, 'value', t.title),
            chartTypeNode(t, '1'),
            appearanceNode(t, '1'),
            new AltNode('Data', 'T-1-det-data', true, true, 'altnodelist', [
                dataNode(t, '1')
            ]),
        ]),
    ]
    return(structureList);
}


function trackNodeMulti(t: AltTrack): AltNode {
    var uid = t.position.details.trackNumber as any as string;

    const structure = new AltNode('Track ' + t.position.description, 'T-'+uid, true, true, 'altnodelist', [
        new AltNode('Description', 'T-'+uid+'-desc', true, true, 'value', t.description),
        new AltNode('Details', 'T-'+uid+'-det', true, true, 'altnodelist', [
            new AltNode('Title', 'T-'+uid+'-det-title', false, true, 'value', t.title),
            new AltNode('Position', 'T-'+uid+'-det-pos', true, true, 'altnodelist', [
                new AltNode('Description', 'T-'+uid+'-det-pos-desc', true, false, 'value', t.position.description),
                new AltNode('Track number', 'T-'+uid+'-det-pos-trackN', true, false, 'value', (t.position.details.trackNumber + 1).toString()),
            ]),
            chartTypeNode(t, uid),
            appearanceNode(t, uid),
            dataNode(t, uid),
        ]),
    ])
    return(structure);
    
}


function chartTypeNode(t: AltTrack, uid: string): AltNode {
    var charttype;

    if (t.alttype === 'single') {
        charttype = t.charttype;
    } else if (t.alttype === 'ov-mark') {
        if (t.charttype) {
            charttype = arrayToString(t.charttype);
        }
    }
    return(new AltNode('Type', 'T-'+uid+'-det-type', false, false, 'value', charttype));
}


function appearanceNode(t: AltTrack, uid: string): AltNode {
    if (t.alttype === 'single' || t.alttype === 'ov-mark') {
        return(
            new AltNode('Appearance', 'T-'+uid+'-det-app', false, true, 'altnodelist', [
                new AltNode('Description', 'T-'+uid+'-det-app-desc', false, true, 'value', t.appearance.description),
                new AltNode('Details', 'T-'+uid+'-det-app-det', false, true, 'altnodelist', [
                    markNode(t, uid),
                    new AltNode('Layout (linear or circular)', 'T-'+uid+'-det-app-lay', false, false, 'value', t.appearance.details.layout),
                    new AltNode('overlaid', 'T-'+uid+'-det-app-overlaid', false, false, 'value', booleanToString(t.appearance.details.overlaid)),
                    ...encodingNode(t, uid)
                ]),
            ])
        );
    } else {
        return emptyNode();
    }
}


function markNode(t: AltTrackSingle | AltTrackOverlaidByMark, uid: string): AltNode {
    var mark;
    if (t.alttype === 'ov-mark') {
        mark = arrayToString(t.appearance.details.mark);
    } else {
        mark = t.appearance.details.mark;
    }
    return(new AltNode('Mark', 'T-'+uid+'-det-pos-app-mark', false, false, 'value', mark));
}


//   {t.appearance.details.encodingsDescList.map((enc, i) => createTreeItemNode('T-'+uid+'-details-pos-details-enc'+enc[0]+i, enc[0], enc[1], true))}
function encodingNode(t: AltTrackSingle | AltTrackOverlaidByMark, uid: string): Array<AltNode> {
    const nodeList = t.appearance.details.encodingsDescList.map((enc, i) => {
        return new AltNode(enc[0], 'T-'+uid+'-det-pos-enc'+enc[0]+i, false, true, 'value', enc[1])
    })
    return nodeList;
}


function dataNode(t: AltTrack, uid: string): AltNode {
    if ((t.alttype === 'single' || t.alttype === 'ov-mark') && t.data.details.dataStatistics) {
        return (new AltNode('Data', 'T-'+uid+'-det-data', true, true, 'altnodelist', [
            new AltNode('Description', 'T-'+uid+'-det-data-desc', true, true, 'value', t.data.description),
            dataNodeStats(t.data.details.dataStatistics, uid),
            new AltNode('Raw data', 'T-'+uid+'-det-data-desc', true, true, 'rawData', t.data.details.dataStatistics?.flatTileData)
        ]));
    }
    else {
        return emptyNode();
    }
}


function dataNodeStats(dataStatistics: AltDataStatistics, uid: string): AltNode {
    const stats = new AltNode('Data statistics', 'T-'+uid+'-det-data-stats', false, true, 'altnodelist', [
        new AltNode('Genomic range', 'T-'+uid+'-det-data-stats-genomic', false, true, 'altnodelist', [
            new AltNode('Minimum', 'T-'+uid+'-det-data-stats-genomic-min', true, false, 'value', dataStatistics.genomicMin?.toString()),
            new AltNode('Maximum', 'T-'+uid+'-det-data-stats-genomic-max', true, false, 'value', dataStatistics.genomicMin?.toString())
        ]),
        new AltNode('Value range', 'T-'+uid+'-det-data-stats-value', false, true, 'altnodelist', [
            new AltNode('Minimum: ' + dataStatistics.valueMin, 'T-'+uid+'-det-data-stats-value-min', true, false, 'value', 'Found at position(s)' + dataStatistics.valueMinGenomic?.toString()),
            new AltNode('Maximum: ' + dataStatistics.valueMax, 'T-'+uid+'-det-data-stats-value-max', true, false, 'value', 'Found at position(s)' + dataStatistics.valueMaxGenomic?.toString())
        ]),
        categoriesNode(dataStatistics, uid)
    ]);
    return stats;
}


function categoriesNode(dataStatistics: AltDataStatistics, uid: string): AltNode {
    if (dataStatistics.categories) {
        return(new AltNode('Categories', 'T-'+uid+'-det-data-stats-categories', false, false, 'value', arrayToString(dataStatistics.categories)));
    } else {
        return emptyNode();
    }
}

function emptyNode() {
    return(new AltNode('', '', false, false, 'value', undefined));
}



// /**
//  * 
//  * 
//  * Structure: 
//  * 
//  * Automatic description
//  *      Alt-text
//  *          {alt-text}
//  *      Description
//  *          {long description}
//  *      Details
//  *          ?Title
//  *              {title}
//  *          ?Subtitle
//  *              {subtitle}
//  *          Composition
//  *              {composition.description}
//  *          Tracks
//  *              {tracks}
//  * @param data 
//  * @returns 
//  */
// function createTreeMUI(data: AltGoslingSpec) {
//     return (
//         <TreeView
//             className = 'tree-view'
//             aria-label="Hierarchical tree describing displayed Gosling visualization."
//             defaultCollapseIcon={<ExpandMoreIcon />}
//             defaultExpanded={['root', 'tree']}
//             defaultExpandIcon={<ChevronRightIcon />}
//         >
//             <TreeItem key='tree' nodeId='tree' label='Automatic description'>

//                 <TreeItem key={'alt'} nodeId={'alt'} label={'Alt-text'}>
//                     <TreeItem key={'alt-desc'} nodeId={'alt-desc'} label={data.alt}></TreeItem>
//                 </TreeItem>

//                 <TreeItem key={'long'} nodeId={'long'} label={'Description'}>
//                     <TreeItem key={'long-desc'} nodeId={'long-desc'} label={data.longDescription}></TreeItem>
//                 </TreeItem>
                
//                 <TreeItem key={'global-details'} nodeId={'global-details'} label={'Details'}>
        
//                     {data.title ? (
//                         <TreeItem key={'title'} nodeId={'title'} label={'Title'}>
//                             <TreeItem key={'title-desc'} nodeId={'title-desc'} label={data.title}></TreeItem>
//                         </TreeItem>
//                     ): null}

//                     {data.subtitle ? (
//                         <TreeItem key={'subtitle'} nodeId={'titsubtitlele'} label={'Subtitle'}>
//                             <TreeItem key={'subtitle-desc'} nodeId={'subtitle-desc'} label={data.subtitle}></TreeItem>
//                         </TreeItem>
//                     ): null}
                    
//                     <TreeItem key={'composition'} nodeId={'composition'} label={'Composition'}>
//                         <TreeItem key={'composition-desc'} nodeId={'composition-desc'} label={data.composition.description}></TreeItem>
//                     </TreeItem>

//                     <TreeItem key='tracks' nodeId='tracks' label={'Tracks'}>
//                         {Object.keys(data.tracks).map(t => (createTreeTrackMUI(data.tracks[t as any])))}
//                     </TreeItem>
                    
//                 </TreeItem>
            
//             </TreeItem>
    
//         </TreeView>
//     );
// }


// // function createTreeTrackMUI(t: AltTrack) {
// //     // if (t.alttype === 'ov-data') {
// //     //     return createTreeTrackMUIOverlaidData(t);
// //     // } else {
// //     //     return createTreeTrackMUISingle(t);
// //     // }
// // }


// /**
//  * 
//  * 
//  * Structure 
//  * 
//  * Track: {position}
//  *      Description:
//  *          Title
//  *          Position
//  *          Chart Type
//  *          Appearance
//  *          Track Data Stats
//  * 
//  * @param t 
//  * @returns 
//  */
// function createTreeTrackMUI(t: AltTrack) {
//     var uid = t.position.details.trackNumber as any as string;
    
//     return (
//         <TreeItem key={'T-'+uid} nodeId={'T-'+uid} label={'Track: '+ t.position.description}>
//             {createTreeItemLeaf('T-'+uid+'-desc', 'Description', t.description, true)}
//             <TreeItem key={'T-'+uid+'-details'} nodeId={'T-'+uid+'details'} label={'Details'}>  
//                 {createTreeTrackTitle(t, uid)}
//                 {createTreeTrackPosition(t, uid)}
//                 {createTreeTrackChartType(t, uid)}
//                 {createTreeTrackAppearance(t, uid)}
//                 {createTreeTrackDataStatistics(t, uid)}
//             </TreeItem>
//         </TreeItem>
//     );
// }

// // function createTreeTrackMUIOverlaidData(t: AltTrackOverlaidByData) {
// //     return (
// //         <></>
// //     )
// // }



// function createTreeTrackTitle(t: AltTrack, uid: string) {
//     if (t.title) {
//         return(
//            <TreeItem key={'T-'+uid+'details-title'} nodeId={'T-'+uid+'details-title'} label={'Title: '+t.title}></TreeItem>
//         )
//     }
//     // return(
//     //     <>
//     //         {t.title ? (
//     //                 <TreeItem key={'T-'+uid+'details-title'} nodeId={'T-'+uid+'details-title'} label={'Title: '+t.title}></TreeItem>
//     //             ): null}   
//     //     </>
//     // )
// }

// function createTreeTrackChartType(t: AltTrack, uid: string) {
//     if (t.alttype === 'single') {
//         return(
//             <>
//                 {t.charttype ? (
//                     <TreeItem key={'T-'+t.uid+'details-type'} nodeId={'T-'+t.uid+'details-type'} label={'Type: '+t.charttype}></TreeItem>
//                 ): null}
//             </>
//         )
//     } else if (t.alttype === 'ov-mark') {
//         return(
//             <>
//                 {t.charttype ? (
//                     <TreeItem key={'T-'+t.uid+'details-type'} nodeId={'T-'+t.uid+'details-type'} label={'Type: '+arrayToString(t.charttype)}></TreeItem>
//                 ): null}
//             </>
//         )
//     } else {
//         return (<></>)
//     }
// }

// function createTreeTrackPosition(t: AltTrack, uid: string) {
//     return(
//         <TreeItem key={'T-'+uid+'-details-pos'} nodeId={'T-'+uid+'-details-pos'} label={'Position'}>
//             {createTreeItemLeaf('T-'+uid+'-details-pos-desc', 'Description', t.position.description, true)}
//             {createTreeItemLeaf('T-'+uid+'-details-pos-number', 'Track number', t.position.details.trackNumber + 1, true)}
//         </TreeItem>
//     )
// }



// function createTreeTrackAppearance(t: AltTrack, uid: string) {
//     if (t.alttype === 'single' || t.alttype === 'ov-mark') {
//         return(
//             <TreeItem key={'T-'+uid+'details-app'} nodeId={'T-'+uid+'details-app'} label={'Appearance'}>
//                 {createTreeItemLeaf('T-'+uid+'-details-app-desc', 'Description', t.appearance.description, true)}
//                 <TreeItem key={'T-'+uid+'-details-app-details'} nodeId={'T-'+uid+'-details-app-details'} label={'Details'}>
//                     {t.alttype === 'ov-mark' ? (
//                         createTreeItemLeaf('T-'+uid+'-details-pos-details-mark', 'Mark', arrayToString(t.appearance.details.mark), true)
//                         ) : (createTreeItemLeaf('T-'+uid+'-details-pos-details-mark', 'Mark', t.appearance.details.mark, true))}
//                     {createTreeItemLeaf('T-'+uid+'-details-pos-details-layout', 'Layout (linear or circular)', t.appearance.details.layout, false)} 
//                     {createTreeItemLeaf('T-'+uid+'-details-pos-details-overlaid', 'Overlaid', t.appearance.details.overlaid, false)}   
//                     {t.appearance.details.encodingsDescList.map((enc, i) => createTreeItemNode('T-'+uid+'-details-pos-details-enc'+enc[0]+i, enc[0], enc[1], true))}
//                 </TreeItem>
//             </TreeItem>
//         )
//     } else {
//         return <></>
//     }
    
// }

// export function createTreeTrackDataStatistics(t: AltTrack, uid: string, dataTable = true) {
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
//                     {dataTable? (
//                         <TreeItem key={'T-'+uid+'-details-data-details-rawdata'} nodeId={'T-'+uid+'-details-data-details-rawdata'} label={'Raw data table'}>
//                             {t.data.details.dataStatistics?.flatTileData ? (
//                                 createDataTable(t.data.details.dataStatistics?.flatTileData)
//                             ): null}       
//                         </TreeItem>): null}
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

// // function createTreeTrackMUI(t: AltTrack) {
// //     return (
// //         <TreeItem key={t.uid} nodeId={t.uid} label={'Track: ' + t.uid}>
// //             <TreeItem key={t.uid + 'desc'} nodeId={t.uid + 'desc'} label={'Description: ' + t.description}></TreeItem>
// //             <TreeItem key={t.uid + 'details'} nodeId={t.uid + 'details'} label={'Details'}>     
// //                 <TreeItem key={t.uid + 'details-pos'} nodeId={t.uid + 'details-pos'} label={'Position'}>
// //                     <TreeItem key={t.uid + 'details-pos-desc'} nodeId={t.uid + 'details-pos-desc'} label={'Description: ' + t.position.description}></TreeItem>
// //                     <TreeItem key={t.uid + 'details-pos-details'} nodeId={t.uid + 'details-pos-details'} label={'Details'}>
// //                         <TreeItem key={t.uid + 'details-pos-details-colN'} nodeId={t.uid + 'details-pos-details-colN'} label={'Column number: ' + t.position.details.colNumber}></TreeItem>
// //                         <TreeItem key={t.uid + 'details-pos-details-rowN'} nodeId={t.uid + 'details-pos-details-rowN'} label={'Row number: ' + t.position.details.rowNumber}></TreeItem>
// //                     </TreeItem>
// //                 </TreeItem>
// //                 {t.title ? (
// //                         <TreeItem key={t.uid + 'details-title'} nodeId={t.uid + 'details-title'} label={'Title: ' + t.title}></TreeItem>
// //                     ): null}
// //                 {t.alttype ? (
// //                         <TreeItem key={t.uid + 'details-type'} nodeId={t.uid + 'details-type'} label={'Type: ' + t.alttype}></TreeItem>
// //                     ): null}
// //                 <TreeItem key={t.uid + 'details-app'} nodeId={t.uid + 'details-app'} label={'Appearance'}>
// //                     <TreeItem key={t.uid + 'details-app-desc'} nodeId={t.uid + 'details-app-desc'} label={'Description: ' + t.appearance.description}></TreeItem>
// //                     <TreeItem key={t.uid + 'details-app-details'} nodeId={t.uid + 'details-app-details'} label={'Details'}>
// //                         <TreeItem key={t.uid + 'details-app-details-mark'} nodeId={t.uid + 'details-app-desc-mark'} label={'Mark: ' + t.appearance.details.mark}></TreeItem>
// //                     </TreeItem>
// //                 </TreeItem>
// //                 <TreeItem key={t.uid + 'details-data'} nodeId={t.uid + 'details-data'} label={'Data'}>
// //                     <TreeItem key={t.uid + 'details-data-desc'} nodeId={t.uid + 'details-data-desc'} label={'Description: ' + t.data.description}></TreeItem>
// //                     <TreeItem key={t.uid + 'details-data-details'} nodeId={t.uid + 'details-data-details'} label={'Details'}>
// //                         <TreeItem key={t.uid + 'details-data-details-stats'} nodeId={t.uid + 'details-app-desc-stats'} label={'Computed statistics'}>
// //                             <TreeItem key={t.uid + 'details-data-details-stats-genomicrange'} nodeId={t.uid + 'details-app-desc-stats-genomicrange'} label={'Genomic range: ' + t.data.details.dataStatistics?.genomicMax}></TreeItem>
// //                         </TreeItem>
// //                     </TreeItem>
// //                 </TreeItem>

// //             </TreeItem>
// //         </TreeItem>
// //       );
// // }

// // function createTreeParent(data: any, id: string, label: string) {
// //     return (
// //         <TreeItem key={id} nodeId={id} label={label}>
// //             <TreeItem key={id} nodeId={id} label={label}></TreeItem>
// //             <TreeItem key={id} nodeId={id} label={label}></TreeItem>
// //         </TreeItem>
// //     )
// //     //give name
// //     //descr
// //     //details
// // }

// // function createTreeItemDescription(id: string, desc: string) {
// //     return (
// //         <TreeItem key={id} nodeId={id} label={'Description'}>
// //              <TreeItem key={id} nodeId={id + '-L'} label={desc}></TreeItem>
// //         </TreeItem>
// //     )
// // }

// // function createTreeItemLeaf(id: string, label: string, desc: string) {
// //     return (
// //         <TreeItem key={id} nodeId={id} label={label}>
// //              <TreeItem key={id} nodeId={id + '-L'} label={desc}></TreeItem>
// //         </TreeItem>
// //     )
// // }

// // function createTreeItemWithChildren(id: string, label: string, children: string[]) {
// //     return (
// //         <TreeItem key={id} nodeId={id} label={label}>
// //              <TreeItem key={id} nodeId={id + '-L'} label={desc}></TreeItem>
// //         </TreeItem>
// //     )
// // }


// // function createTreeItemDetails(id: string, desc: string) {
// //     return (
// //         <TreeItem key={id} nodeId={id} label={'Details'}>
// //              {/* <TreeItem key={id} nodeId={id + '-L'} label={desc}></TreeItem> */}
// //         </TreeItem>
// //     )
// // }

               
//                 {/* <TreeItem key={'desc'} nodeId={'desc'} label={'Description: ' + data.longDescription}></TreeItem>
    
//                 <TreeItem key={'global-details'} nodeId={'global-details'} label={'Details'}>
//                     {data.title ? (
//                         <TreeItem key={'title'} nodeId={'title'} label={'Title: ' + data.title}></TreeItem>
//                     ): null}
    
//                     {data.subtitle ? (
//                         <TreeItem key={'subtitle'} nodeId={'subtitle'} label={'Subtitle: ' + data.subtitle}></TreeItem>
//                     ): null}
    
//                     <TreeItem key={'composition'} nodeId={'composition'} label={'Composition'}>
//                         <TreeItem key={'composition-desc'} nodeId={'composition-desc'} label={'Description: ' + data.composition.description}></TreeItem>
//                         <TreeItem key={'composition-details'} nodeId={'composition-details'} label={'Details'}>
//                             <TreeItem key={'composition-details-nTracks'} nodeId={'composition-details-nTracks'} label={'Number of tracks: ' + data.composition.nTracks}></TreeItem>
//                         </TreeItem>
//                     </TreeItem>
    
//                     <TreeItem key='tracks' nodeId='tracks' label={'Tracks'}>
//                         {Object.keys(data.tracks).map(t => (createTreeTrackMUI(data.tracks[t as any])))}
//                     </TreeItem>
    
//                 </TreeItem>  */}


// // function createTreeLeaf(id: string, label: string) {
// //     return (
// //         <TreeItem key={id} nodeId={id} label={label}></TreeItem>
// //     )
// // }

// // export function createTreeMUI(data: AltGoslingSpec) {
// //   return (
// //     <TreeView
// //       aria-label="rich object"
// //       defaultCollapseIcon={<ExpandMoreIcon />}
// //       defaultExpanded={['root']}
// //       defaultExpandIcon={<ChevronRightIcon />}
// //       sx={{ overflow: 'scroll' }}
// //     >
// //         <TreeItem key='tree' nodeId='tree' label='Automatic description'>

// //             <TreeItem key={'alt'} nodeId={'alt'} label={'Alt: ' + data.alt}></TreeItem>
// //             <TreeItem key={'desc'} nodeId={'desc'} label={'Description: ' + data.longDescription}></TreeItem>

// //             <TreeItem key={'global-details'} nodeId={'global-details'} label={'Details'}>
// //                 {data.title ? (
// //                     <TreeItem key={'title'} nodeId={'title'} label={'Title: ' + data.title}></TreeItem>
// //                 ): null}

// //                 {data.subtitle ? (
// //                     <TreeItem key={'subtitle'} nodeId={'subtitle'} label={'Subtitle: ' + data.subtitle}></TreeItem>
// //                 ): null}

// //                 <TreeItem key={'composition'} nodeId={'composition'} label={'Composition'}>
// //                     <TreeItem key={'composition-desc'} nodeId={'composition-desc'} label={'Description: ' + data.composition.description}></TreeItem>
// //                     <TreeItem key={'composition-details'} nodeId={'composition-details'} label={'Details'}>
// //                         <TreeItem key={'composition-details-nTracks'} nodeId={'composition-details-nTracks'} label={'Number of tracks: ' + data.composition.nTracks}></TreeItem>
// //                     </TreeItem>
// //                 </TreeItem>

// //                 <TreeItem key='tracks' nodeId='tracks' label={'Tracks'}>
// //                     {Object.keys(data.tracks).map(t => (createTreeTrackMUI(data.tracks[t as any])))}
// //                 </TreeItem>

// //             </TreeItem> 
        
// //         </TreeItem>

// //     </TreeView>
// //   );
// // }
