import React from "react";
import { Box } from "@mui/material";

const Flex = ({ direction = "row", justifyContent = "space-between", alignItems = "center", gap = "1rem", className, sx, children }) => {
    const style = {
        display: "flex",
        flexDirection: direction,
        justifyContent: justifyContent,
        alignItems: alignItems,
        gap: gap,
        //border: "1px solid red",
    };

    return (
        <Box sx={sx} className={className} style={style}>
            {children}
        </Box>
    );
};

export default Flex;
