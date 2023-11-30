import Table from "@mui/material/Table";
import { TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

export const BasicTable = ({ columns, rows }) => {
    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        {columns.map((column, index) => (
                            <TableCell sx={{ width: column.width }} key={`${column.field}_${index}`}>
                                {column.headerName}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, index) => (
                        <TableRow key={`${index}`} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                            {columns.map((column) => (
                                <TableCell sx={{ width: column.width }} key={`${column.field}_${index}`} component="th" scope="row">
                                    {column.cell ? column.cell({ row: row }) : row[column.field]}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
