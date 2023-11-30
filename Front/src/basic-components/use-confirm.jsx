import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { useState } from "react";
import T from "./text";
const useConfirm = (title = <T>are-you-sure</T>, message = <T>are-you-sure-to-delete-record</T>) => {
    const [promise, setPromise] = useState(null);

    const confirm = (id) =>
        new Promise((resolve, reject) => {
            setPromise({ resolve });
        });

    const handleClose = () => {
        setPromise(null);
    };

    const handleConfirm = () => {
        promise?.resolve(true);
        handleClose();
    };

    const handleCancel = () => {
        promise?.resolve(false);
        handleClose();
    };
    // You could replace the Dialog with your library's version
    const ConfirmationDialog = () => (
        <Dialog open={promise !== null} fullWidth>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>{message}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleConfirm}>
                    <T>yes</T>
                </Button>
                <Button onClick={handleCancel}>
                    <T>cancel</T>
                </Button>
            </DialogActions>
        </Dialog>
    );
    return [ConfirmationDialog, confirm];
};

export default useConfirm;
