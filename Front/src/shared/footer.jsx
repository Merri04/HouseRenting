import { Box, Paper } from "@mui/material";
import T from "../basic-components/text";
import settings from "../app/settings";

export const Footer = () => {
    return "";
    return (
        <Paper component="footer" square variant="outlined">
            <Box
                sx={{
                    flexGrow: 1,
                    justifyContent: "center",
                    display: "flex",
                    my: 1,
                }}>
                <T>{settings.appName}</T>
            </Box>

            <Box
                color="inherit"
                sx={{
                    flexGrow: 1,
                    justifyContent: "center",
                    display: "flex",
                    mb: 2,
                }}>
                <T love="❤" author={settings.author}>
                    made-with-@love-by-@author
                </T>
            </Box>
        </Paper>
    );
};
