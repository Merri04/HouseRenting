import { Box, Typography } from "@mui/material";
import Flex from "./display/flex";

export const DialogSection = ({ as = "body2", title, sx, children, Control, ...props }) => (
    <Box sx={{ p: 2, ...sx }}>
        <Flex direction="column" gap="1rem" justifyContent="start" alignItems="start">
            {(title || Control) && (
                <Box sx={{ py: 1, borderBottom: 1, borderBottomColor: "#bbb", width: props.width || "100%" }}>
                    <Flex direction="row" justifyContent="space-between">
                        <Typography color={props.color} variant={as} {...props}>
                            {title}
                        </Typography>
                        {Control}
                    </Flex>
                </Box>
            )}
            <Box sx={{ width: "100%" }}>{children}</Box>
        </Flex>
    </Box>
);
