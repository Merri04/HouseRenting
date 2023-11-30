import { createContext, useContext, useState } from "react";
import { Backdrop, CircularProgress } from "@mui/material";
import { useSnackbar } from "notistack";

const MessageContext = createContext();
const useMessage = () => useContext(MessageContext);

const MessageStatuses = {
    Error: "error",
    Success: "success",
    Warning: "warning",
    Info: "info",
};

const MessageProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    const AddMessage = (status, message) => {
        enqueueSnackbar(message, { variant: status });
    };

    return (
        <MessageContext.Provider
            value={{
                AddMessage,
                MessageStatuses,
                ShowLoading: () => setLoading(true),
                HideLoading: () => setLoading(false),
            }}>
            {loading && (
                <Backdrop
                    sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: "rgba(0,0,0,0.8)" }}
                    open
                    onClick={() => setLoading(false)}>
                    <CircularProgress />
                </Backdrop>
            )}
            {children}
        </MessageContext.Provider>
    );
};

export { MessageProvider, useMessage };
