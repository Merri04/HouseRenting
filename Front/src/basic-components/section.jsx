import { Box, Divider, IconButton, Paper, Typography } from "@mui/material";
import Flex from "./display/flex";
import React from "react";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { useDirection } from "../hooks/user-direction";
import { grey } from "@mui/material/colors";

export const Section = ({
    as = "body2",
    hideBorder = false,
    onBack,
    title,
    sx,
    variant = "elevation",
    children,
    elevation = 1,
    Control,
    ...props
}) => {
    const { direction } = useDirection();
    return (
        <Paper sx={{ my: 2, p: 2, ...sx }} variant={variant} elevation={elevation}>
            <Flex Flex direction="column" gap="1rem" justifyContent="start" alignItems="start">
                {(title || Control) && (
                    <Box sx={{ py: 1, width: props.width || "100%" }}>
                        <Flex direction="row" justifyContent="space-between">
                            <Flex alignItems="center" justifyContent="start">
                                {onBack && (
                                    <IconButton size="small" color={props.color} onClick={onBack}>
                                        {direction === "rtl" ? <ArrowForwardIos /> : <ArrowBackIos />}
                                    </IconButton>
                                )}

                                <Typography color={props.color} variant={as} {...props}>
                                    {title}
                                </Typography>
                            </Flex>

                            {Control}
                        </Flex>
                        {!hideBorder && <Divider sx={{ mt: 1, backgroundColor: grey[200] }} />}
                    </Box>
                )}
                <Box sx={{ width: "100%" }}>{children}</Box>
            </Flex>
        </Paper>
    );
};
