import { Outlet } from "react-router-dom";
import { PublicHeader } from "./public-header";
import { Footer } from "../footer";
import { Container, Box } from "@mui/material";

export const PublicPanel = () => {
    return (
        <Box>
            <PublicHeader />
            <Container component="main" sx={{ padding: 0.5 }}>
                <Outlet />
            </Container>
            <Footer />
        </Box>
    );
};
