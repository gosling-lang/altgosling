import type { Datum } from 'gosling.js/dist/src/gosling-schema';
import { Cell, Column, Row, Table, TableBody, TableHeader } from 'react-aria-components';

export function createDataTable(flatTileData: Datum[]) {
    return (
        <>
            <Table aria-label="RawData">
                <TableHeader>
                    {Object.keys(flatTileData[0]).map((field: string, i: number) => (<Column key={i} isRowHeader>{field}</Column>))}
                </TableHeader>
                <TableBody>
                    {flatTileData.map((row: Datum, i: number) => (
                        <Row key={"row"+i}>
                            {Object.keys(row).map((field: string, j: number) => (
                            <Cell key={"cell"+i+"+"+j}>{row[field]}</Cell>
                            ))}
                        </Row>))}
                </TableBody>
            </Table>  
        </>
    )
}
