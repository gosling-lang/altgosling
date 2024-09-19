import type { Datum } from '@altgosling/schema/alt-gosling-schema';
import { Cell, Column, Row, Table, TableBody, TableHeader } from 'react-aria-components';
import { summarizeValueDataTable } from './util';

export function createDataTable(flatTileData: Datum[], dataTableRoundValues?: boolean) {
    const tableStyle = {
        fontSize: "0.75em",
        fontFamily: "sans-serif",
        margin: "25px 0",
        borderCollapse: "collapse",
        boxShadow: "0 0 20px rgba(0, 0, 0, 0.15)"
    };

    const tableStyleHead = {
        backgroundColor: "#000000",
        color: "#ffffff"
    };

    const tableStyleCells = {
        padding: "12px 15px"
    };

    const tableStyleBody = {
        borderBottom: "1px solid #000000"
    };

    const tableStyleBodyEven = {
        backgroundColor: "#e3e3e3"
    };

    return (
        <>
            <Table aria-label="RawData" style={tableStyle}>
                <TableHeader style={tableStyleHead}>
                    {Object.keys(flatTileData[0]).map((field: string, i: number) => (
                        <Column key={i} isRowHeader style={tableStyleCells}>{field}</Column>
                    ))}
                </TableHeader>
                <TableBody>
                    {flatTileData.map((row: Datum, i: number) => (
                        <Row key={"row"+i} style={i % 2 === 0 ? { ...tableStyleBody, ...tableStyleBodyEven } : tableStyleBody}>
                            {Object.keys(row).map((field: string, j: number) => (
                                <Cell key={"cell"+i+"+"+j} style={tableStyleCells}>{dataTableRoundValues === false ? row[field] : summarizeValueDataTable(row[field])}</Cell>
                            ))}
                        </Row>))}
                </TableBody>
            </Table>
        </>
    );
}
