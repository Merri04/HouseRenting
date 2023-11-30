import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AppProvider } from "./providers/app-provider";
import CssBaseline from "@mui/material/CssBaseline";

import "./index.css";
import { SnackbarProvider } from "notistack";
import { MessageProvider } from "./providers/message-provider";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <>
        <SnackbarProvider maxSnack={3}>
            <MessageProvider>
                <AppProvider>
                    <CssBaseline />
                    <App />
                </AppProvider>
            </MessageProvider>
        </SnackbarProvider>
    </>
);
