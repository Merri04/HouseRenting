import styled from "@emotion/styled";
import { InputBase } from "@mui/material";

export const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",
    "& .MuiInputBase-input": {
        padding: theme.spacing(1, 0), // Adjust padding for top and bottom
        paddingInline: theme.spacing(1), // Use logical properties for padding
        // vertical padding + font size from searchIcon
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
        transition: theme.transitions.create("width"),
        width: "100%",
        [theme.breakpoints.up("md")]: {
            width: "20ch",
        },
    },
}));
