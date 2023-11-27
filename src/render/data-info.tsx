import type { AltTrack } from '../schema/alt-gosling-schema';
import { createDataTable } from './data-table';

import { TreeView } from '@mui/x-tree-view/TreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';


export function createTreeTrackDataStatistics(t: AltTrack, uid: string, dataTable = true) {
    if (t.alttype === 'single' || t.alttype === 'ov-mark') {
        return (
            (
                <TreeItem key={'T-'+uid+'details-data'} nodeId={'T-'+uid+'details-data'} label={'Data'}>
                    {createTreeItemLeaf('T-'+uid+'-details-data-desc', 'Description', t.data.description, true)}
                    <TreeItem key={'T-'+uid+'-details-data-details-stats'} nodeId={'T-'+uid+'-details-data-details-stats'} label={'Data statistics'}>
                        <TreeItem key={'T-'+uid+'-details-data-details-stats-genomic'} nodeId={'T-'+uid+'-details-data-details-stats-genomic'} label={'Genomic range'}>
                            {createTreeItemLeaf('T-'+uid+'-details-data-details-stats-genomic-min', 'Minimum', t.data.details.dataStatistics?.genomicMin, false)}    
                            {createTreeItemLeaf('T-'+uid+'-details-data-details-stats-genomic-max', 'Maximum', t.data.details.dataStatistics?.genomicMax, false)}
                        </TreeItem>
                        <TreeItem key={'T-'+uid+'-details-data-details-stats-value'} nodeId={'T-'+uid+'-details-data-details-stats-value'} label={'Value range'}>
                            <TreeItem key={'T-'+uid+'-details-data-details-stats-value-min'} nodeId={'T-'+uid+'-details-data-details-stats-value-min'} label={'Minimum: ' + t.data.details.dataStatistics?.valueMin}>
                                {createTreeItemLeaf('T-'+uid+'-details-data-details-stats-value-min-genomic', 'Found at position(s)', t.data.details.dataStatistics?.valueMinGenomic?.toString(), false)}    
                            </TreeItem>
                            <TreeItem key={'T-'+uid+'-details-data-details-stats-value-max'} nodeId={'T-'+uid+'-details-data-details-stats-value-max'} label={'Maxmimum: ' + t.data.details.dataStatistics?.valueMax}>
                                {createTreeItemLeaf('T-'+uid+'-details-data-details-stats-value-max-genomic', 'Found at position(s)', t.data.details.dataStatistics?.valueMaxGenomic?.toString(), false)}    
                            </TreeItem>
                        </TreeItem>

                        {t.data.details.dataStatistics?.categories ? (
                            <TreeItem key={'T-'+uid+'-details-data-details-stats-category'} nodeId={'T-'+uid+'-details-data-details-stats-category'} label={'Categories'}>
                                {createTreeItemLeaf('T-'+uid+'-details-data-details-stats-category-list', 'Categories', arrayToString(t.data.details.dataStatistics.categories), false)}    
                            </TreeItem>
                        ): null}
                    </TreeItem>
                    {dataTable? (
                        <TreeItem key={'T-'+uid+'-details-data-details-rawdata'} nodeId={'T-'+uid+'-details-data-details-rawdata'} label={'Raw data table'}>
                            {t.data.details.dataStatistics?.flatTileData ? (
                                createDataTable(t.data.details.dataStatistics?.flatTileData)
                            ): null}       
                        </TreeItem>): null}
                </TreeItem>
            )
        )
    } else {
        return (<></>)
    }
}


// data
    // description
        // range of things sentence
        // .. gen min
        // .. gen max
    // raw data 
        // table