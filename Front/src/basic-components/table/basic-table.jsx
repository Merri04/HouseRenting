import * as React from "react";
import { Table, TableBody, TableContainer, TableCell, TableHead, TableRow } from "@mui/material";
import { useAsyncDebounce, useGlobalFilter, useSortBy, useTable } from "react-table";
import { Search } from "../../shared/search/search";

export const BasicTable = ({ data, columns, enableGlobalFilter = false }) => {
    const tableApi = useTable({ columns, data }, useGlobalFilter, useSortBy);
    const onChange = useAsyncDebounce((value) => tableApi.setGlobalFilter(value || undefined), 200);
    return (
        <React.Fragment>
            {enableGlobalFilter && <Search onChange={onChange} />}
            <TableContainer>
                <Table {...tableApi.getTableProps()}>
                    <TableHead>
                        {tableApi.headerGroups.map((headerGroup) => (
                            <TableRow {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column) => (
                                    <TableCell {...column.getHeaderProps()}>{column.render("Header")}</TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableHead>
                    <TableBody {...tableApi.getTableBodyProps()}>
                        {tableApi.rows.map((row, rowIndex) => {
                            tableApi.prepareRow(row);
                            return (
                                <TableRow key={`row_${rowIndex}`} {...row.getRowProps()}>
                                    {row.cells.map((cell, cellIndex) => (
                                        <TableCell key={`cell_${cellIndex}`} {...cell.getCellProps()}>
                                            {cell.render("Cell")}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </React.Fragment>
    );
};
