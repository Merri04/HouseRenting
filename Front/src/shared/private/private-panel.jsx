import { Outlet } from "react-router-dom";
import { PrivateHeader } from "./private-header";
import { Footer } from "../footer";
import { Container, Box } from "@mui/material";

export const PrivatePanel = () => {
    return (
        <Box>
            <PrivateHeader />
            <Container component="main" sx={{ padding: 0.5 }}>
                <Outlet />
            </Container>
            <Footer />
        </Box>
    );
};
