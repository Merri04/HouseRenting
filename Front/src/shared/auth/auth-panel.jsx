import { Container, Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import { Footer } from "../footer";
import { AuthHeader } from "./auth-header";

export const AuthPanel = () => {
    return (
        <Box>
            <AuthHeader />
            <Container component="main" sx={{ padding: 0.5 }} maxWidth="xs">
                <Outlet />
            </Container>
            <Footer />
        </Box>
    );
};
