import { useEffect, useState } from "react";

import type { Datum } from '@alt-gosling/schema/gosling.schema';
import type { AltDataStatistics, AltEncodingDesc, AltGoslingSpec, AltTrack, AltTrackOverlaidByDataInd } from '@alt-gosling/schema/alt-gosling-schema';

import { arrayToString } from './util';
import { createDataTable } from './data-table';

import { TreeView } from '@mui/x-tree-view/TreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';


/* -------------------- NODE CLASS -------------------- */
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

/* ------------------------------ MAIN RENDERER ------------------------------ */
/**
 * Wrapper function to generate tree from AltGoslingSpec
 * @param altSpec AltGoslingSpec
 * @param expandedStart List of node names to be expanded when the tree is made
 * @param setExpandedAltPanelWrapper Function to edit the expanded state of parent component
 * @returns MUI TreeView
 */
export const renderAltTree = (altSpec: AltGoslingSpec, expandedStart: string[], setExpandedAltPanelWrapper: any, focusStart: string, setFocusAltPanelWrapper: any) => {
    const structure = createAltNodes(altSpec);
    return structureToTree(structure, expandedStart, setExpandedAltPanelWrapper, focusStart, setFocusAltPanelWrapper);
};


/* ------------------------------ CREATING FINAL TREE ------------------------------ */
/**
 * Given a structure, create a MUI TreeView element
 * @param structure AltNode of content for alt tree panel
 * @param expandedStart List of node names to be expanded when the tree is made
 * @param setExpandedAltPanelWrapper Function to edit the expanded state of parent component
 * @returns MUI TreeView
 */
const structureToTree = (structure: AltNode, expandedStart: string[], setExpandedAltPanelWrapper: any, focusStart: string, setFocusAltPanelWrapper: any) => {
    /**
     * Keep track of the expanded nodes.
     * The tree does not depend on these component so it does not rerender every time it is updated
     */
    const [expanded, setExpanded] = useState<string[]>(expandedStart);
    const [focus, setFocus] = useState<string>(focusStart);

    /**
     * Any time expanded is updated, call setExpandedAltPanelWrapper, which will update the state of the parent component
     */
    useEffect(() => {
        setExpandedAltPanelWrapper(expanded);
    }, [expanded]);

    /**
     * Any time focus is updated, call setFocusAltPanelWrapper, which will update the state of the parent component
     */
    useEffect(() => {
        setFocusAltPanelWrapper(focus);
    }, [focus]);
    

    /**
     * Retrieve the tree content
     */
    const treeContent = nodeToJSX(structure);
    return(
        <TreeView
            className = 'tree-view'
            aria-label='Hierarchical tree describing displayed Gosling visualization.'
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
        >{treeContent}</TreeView>
    );
};

/**
 * For structure of AltNodes, create TreeItems. 
 * If AltNode is string, create TreeItem of its content. 
 * If AltNode is altNodeList, then do the same thing for its children nodes
 * AltNode has a parameter always_show, which dictates whether if an element has no info, 
 * a comment that the information cannot be displayed is shown.
 * AltNode has a parameter collapsing, indicating if node should be returned as name: info or name /n /t info
 * @param node AltNode
 * @returns MUI TreeItem
 */
export function nodeToJSX(node: AltNode): JSX.Element {
    if (!node.children) {
        if (node.always_show) {
            node.children = 'This information cannot be displayed.';
        } else {
            return <></>;
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
            return(<TreeItem nodeId={node.key} label={node.children}></TreeItem>);
        }
    }
    
    else if (node.children_type === 'altnodelist') {
        const nodeList = node.children as AltNode[];
        const elementList = Object.keys(node.children).map((_, i) => {
            return nodeToJSX(nodeList[i]);
        });
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


// /* ------------------------------ GETTING EXPANDED ------------------------------ */
// export function getNodeNames(structure: AltNode) {
//     // get all node names
//     const all_nodes = [] as string[];
//     getNodeNamesRecursive(structure, all_nodes);
//     // filter out empty nodes
//     all_nodes.filter(n => n !== '');
//     return all_nodes;
// }

// function getNodeNamesRecursive(node: AltNode, all_nodes: string[]) {
//     all_nodes.push(node.key);
//     if (node.children_type == 'altnodelist') {
//         for (const n of (node.children as AltNode[])) {
//             getNodeNamesRecursive(n, all_nodes);
//         }
//     }
// }


/* ------------------------------ CREATING NODE STRUCTURE ------------------------------ */
function createAltNodes(altSpec: AltGoslingSpec): AltNode {
    const structure = new AltNode('Automatic description', 'tree', true, true, 'altnodelist', [
        // new AltNode('Alt-text', 'alt', true, true, 'value', altSpec.alt),
        // new AltNode('Description', 'long', true, true, 'value', altSpec.longDescription),
        // new AltNode('Details', 'details', true, true, 'altnodelist', [
            new AltNode('Title', 'title', false, true, 'value', altSpec.title),
            new AltNode('Subtitle', 'subtitle', false, true, 'value', altSpec.subtitle),
            ...trackNode(altSpec)
        // ]),
    ]);
    return(structure);
}


function trackNode(altSpec: AltGoslingSpec): Array<AltNode> {
    if (altSpec.composition.nTracks === 1) {
        return(trackNodeSingle(altSpec.tracks[0], altSpec));
    } else {
        const tracks = Object.keys(altSpec.tracks).map((_, i) => (trackNodeMulti(altSpec.tracks[i])));
        return([
            new AltNode('Composition', 'composition', true, true, 'value', altSpec.composition.description),
            new AltNode('Tracks', 'tracks', true, true, 'altnodelist', tracks)
        ]);
    }

}


function trackNodeSingle(t: AltTrack, altSpec: AltGoslingSpec): Array<AltNode> {
    let structureList;
    if (t.alttype === 'single' || t.alttype === 'ov-mark') {
        // check if track title is same as chart title. If so, don't show track title.
        if (altSpec.title && t.title && altSpec.title === t.title) {
            structureList = [
                chartTypeNode(t, '1'),
                appearanceNode(t, '1'),
                dataNode(t, '1')
            ];
        }
        else {
            structureList = [
                new AltNode('Title', 'T-1-det-title', false, true, 'value', t.title),
                chartTypeNode(t, '1'),
                appearanceNode(t, '1'),
                dataNode(t, '1')
            ];
        }
    } else {
        const structureIndList = t.tracks.map((ti, i) => new AltNode('Overlaid track ' + i, 'T-1-T-' + i, true, true, 'altnodelist', trackNodeOvData(ti, 'T-1-T-'+i)));
        structureList = [
            new AltNode('Tracks', 'T-1-T', true, true, 'altnodelist', [
                ...structureIndList
            ])];
    }
    return(structureList);
}


function trackNodeMulti(t: AltTrack): AltNode {
    const uid = t.position.details.trackNumber as any as string;
    let structure;

    if (t.alttype === 'single' || t.alttype === 'ov-mark') {
        structure = new AltNode('Track ' + t.position.description, 'T-'+uid, true, true, 'altnodelist', [
            // new AltNode('Description', 'T-'+uid+'-desc', true, true, 'value', t.description),
            // new AltNode('Details', 'T-'+uid+'-det', true, true, 'altnodelist', [
                new AltNode('Title', 'T-'+uid+'-det-title', false, true, 'value', t.title),
                new AltNode('Position', 'T-'+uid+'-det-pos', true, true, 'altnodelist', [
                    new AltNode('Description', 'T-'+uid+'-det-pos-desc', true, false, 'value', t.position.description),
                    new AltNode('Track number', 'T-'+uid+'-det-pos-trackN', true, false, 'value', (t.position.details.trackNumber + 1).toString()),
                ]),
                chartTypeNode(t, uid),
                appearanceNode(t, uid),
                dataNode(t, uid),
            // ]),
        ]);
    } else {
        const structureIndList = t.tracks.map((ti, i) => new AltNode('Overlaid track ' + i, 'T-'+uid+'-T-'+i, true, true, 'altnodelist', trackNodeOvData(ti, 'T-'+uid+'-T-'+i)));
        structure = new AltNode('Track ' + t.position.description, 'T-'+uid, true, true, 'altnodelist', [
            // new AltNode('Description', 'T-'+uid+'-desc', true, true, 'value', t.description),
            // new AltNode('Details', 'T-'+uid+'-det', true, true, 'altnodelist', [
                new AltNode('Title', 'T-'+uid+'-det-title', false, true, 'value', t.title),
                new AltNode('Position', 'T-'+uid+'-det-pos', true, true, 'altnodelist', [
                    new AltNode('Description', 'T-'+uid+'-det-pos-desc', true, false, 'value', t.position.description),
                    new AltNode('Track number', 'T-'+uid+'-det-pos-trackN', true, false, 'value', (t.position.details.trackNumber + 1).toString()),
                ]),
                new AltNode('Tracks', 'T-'+uid+'-T', true, true, 'altnodelist', [
                    ...structureIndList
                ]),
            // ]),
        ]);
    }
    return(structure);
}


function trackNodeOvData(ti: AltTrackOverlaidByDataInd, uid: string) {
    const structure = [
        // new AltNode('Description', uid+'-desc', true, true, 'value', ti.description),
        // new AltNode('Details', uid+'-det', true, true, 'altnodelist', [
            chartTypeNode(ti, uid),
            appearanceNode(ti, uid),
            dataNode(ti, uid)
        // ])
    ];
    return structure;
}


function chartTypeNode(t: AltTrack | AltTrackOverlaidByDataInd, uid: string): AltNode {
    let charttype;

    if (t.alttype === 'single' || t.alttype === 'ov-data-ind') {
        charttype = t.charttype;
    } else if (t.alttype === 'ov-mark') {
        if (t.charttype) {
            charttype = arrayToString(t.charttype);
        }
    }
    return(new AltNode('Chart Type', 'T-'+uid+'-det-type', false, true, 'value', charttype));
}


function appearanceNode(t: AltTrack | AltTrackOverlaidByDataInd, uid: string): AltNode {
    if (t.alttype === 'single' || t.alttype === 'ov-mark') {
        return(
            new AltNode('Appearance', 'T-'+uid+'-det-app', false, true, 'altnodelist', [
                // new AltNode('Description', 'T-'+uid+'-det-app-desc', false, true, 'value', t.appearance.description),
                // new AltNode('Details', 'T-'+uid+'-det-app-det', false, true, 'altnodelist', [
                    markNode(t, uid),
                    new AltNode('Layout', 'T-'+uid+'-det-app-lay', false, true, 'value', `A ${t.appearance.details.layout} layout is used. The visualization is 2D.`),
                    // new AltNode('overlaid', 'T-'+uid+'-det-app-overlaid', false, false, 'value', t.appearance.details.overlaid.toString()),
                    ...encodingNode(t, uid)
                // ]),
            ])
        );
    } else if (t.alttype === 'ov-data-ind') {
        return(
            new AltNode('Appearance', 'T-'+uid+'-det-app', false, true, 'altnodelist', [
                // new AltNode('Description', 'T-'+uid+'-det-app-desc', false, true, 'value', t.appearance.description),
                // new AltNode('Details', 'T-'+uid+'-det-app-det', false, true, 'altnodelist', [
                    markNode(t, uid),
                    new AltNode('Layout (linear or circular)', 'T-'+uid+'-det-app-lay', false, false, 'value', t.appearance.details.layout),
                    new AltNode('overlaid', 'T-'+uid+'-det-app-overlaid', false, false, 'value', t.appearance.details.overlaid.toString()),
                    ...encodingNode(t, uid)
                // ]),
            ])
        );
    } else {
        return emptyNode();
    }
}


function markNode(t: AltTrack | AltTrackOverlaidByDataInd, uid: string): AltNode {
    let mark;
    if (t.alttype === 'single' || t.alttype === 'ov-data-ind') {
        mark = `The mark used is ${t.appearance.details.mark}.`;
    }
    if (t.alttype === 'ov-mark') {
        mark = `The marks used are ${arrayToString([t.appearance.details.mark, ...t.appearance.details.markByTrack])}.`;
    } else {
        return emptyNode();
    }
    return(new AltNode('Mark', 'T-'+uid+'-det-pos-app-mark', false, true, 'value', mark));
}


//   {t.appearance.details.encodingsDescList.map((enc, i) => createTreeItemNode('T-'+uid+'-details-pos-details-enc'+enc[0]+i, enc[0], enc[1], true))}
function encodingNode(t: AltTrack | AltTrackOverlaidByDataInd, uid: string): Array<AltNode> {
    if (t.alttype === 'single' || t.alttype === 'ov-mark' || t.alttype === 'ov-data-ind') {
        const nodeList = t.appearance.details.encodingsDescList.map((enc, i) => {
            if (enc.dataDesc) {
                return new AltNode(enc.channel, 'T-'+uid+'-det-pos-enc'+enc.channel+i, false, true, 'altnodelist', [
                    new AltNode(enc.desc, 'T-'+uid+'-det-pos-enc'+enc.channel+''+i+'value', false, false, 'value', enc.desc),
                    ...enc.dataDesc.map((encDataDesc, j) => {
                        if (encDataDesc.length > 2) {
                            return new AltNode(encDataDesc[0], 'T-'+uid+'-det-pos-enc'+enc.channel+''+i+j, false, true, 'altnodelist', 
                                encDataDesc.slice(1).map((encDataDescList, k) => new AltNode(encDataDescList[0], 'T-'+uid+'-det-pos-enc'+enc.channel+''+i+j+k, false, false, 'value', encDataDescList)));
                        } else {
                            return new AltNode(encDataDesc[0], 'T-'+uid+'-det-pos-enc'+enc.channel+''+i+j, false, true, 'value', encDataDesc[1]);
                        }
                        
                    })
                ])
            } else {
                return new AltNode(enc.channel, 'T-'+uid+'-det-pos-enc'+enc.channel+i, false, true, 'value', enc.desc);
            }
        });
        return nodeList;
    }
    else {
        return [emptyNode()];
    }
}


function dataNode(t: AltTrack | AltTrackOverlaidByDataInd, uid: string): AltNode {
    if ((t.alttype === 'single' || t.alttype === 'ov-mark' || t.alttype === 'ov-data-ind') && t.data.details.dataStatistics) {
        return (new AltNode('Data', 'T-'+uid+'-det-data', true, true, 'altnodelist', [
            new AltNode('Description', 'T-'+uid+'-det-data-desc', true, true, 'value', t.data.description),
            dataNodeStats(t.data.details.dataStatistics, uid),
            new AltNode('Raw data', 'T-'+uid+'-det-data-raw-data', true, true, 'rawData', t.data.details.dataStatistics?.flatTileData)
        ]));
    }
    else {
        return emptyNode();
    }
}

function descList(uid: string, descList?: string[][], ): Array<AltNode> {
    if (descList) {
        const nodeList = descList.map((n, i) => {
            return new AltNode(n[0], 'T-'+uid+'-det-pos-enc'+n[0]+i, false, false, 'value', n[1]);
        });
        return nodeList;
    } else {
        return [emptyNode()];
    }
}


export function dataNodeStats(dataStatistics: AltDataStatistics, uid: string): AltNode {
    const stats = new AltNode('Data statistics', 'T-'+uid+'-det-data-stats', false, true, 'altnodelist', [
        new AltNode('Genomic range', 'T-'+uid+'-det-data-stats-genomic', false, true, 'altnodelist', [
            ...descList('T-'+uid+'-det-data-stats-genomic', dataStatistics.genomicDescList)
            // new AltNode('Minimum', 'T-'+uid+'-det-data-stats-genomic-min', true, false, 'value', dataStatistics.genomicMin?.toString()),
            // new AltNode('Maximum', 'T-'+uid+'-det-data-stats-genomic-max', true, false, 'value', dataStatistics.genomicMax?.toString())
        ]),
        new AltNode('Value range', 'T-'+uid+'-det-data-stats-value', false, true, 'altnodelist', [
            ...descList('T-'+uid+'-det-data-stats-value', dataStatistics.valueDescList)
            // new AltNode('Minimum: ' + dataStatistics.valueMin, 'T-'+uid+'-det-data-stats-value-min', true, false, 'value', 'Found at position(s)' + dataStatistics.valueMinGenomic?.toString()),
            // new AltNode('Maximum: ' + dataStatistics.valueMax, 'T-'+uid+'-det-data-stats-value-max', true, false, 'value', 'Found at position(s)' + dataStatistics.valueMaxGenomic?.toString())
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

