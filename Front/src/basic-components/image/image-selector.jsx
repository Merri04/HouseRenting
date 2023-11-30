import { ImageAspectRatio } from "@mui/icons-material";
import { Avatar, Button, Dialog, DialogActions, DialogContent, IconButton, Stack } from "@mui/material";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import T from "../text";

export const ImageSelector = ({ show, src, as = "img", hide, onSelected }) => {
    const { t } = useTranslation();
    const fileRef = useRef();
    const [file, setFile] = useState(null);
    const minDimention = 250;
    const onImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setFile(event.target.files[0]);
        }
    };

    const clear = () => {
        setFile(null);
    };

    const selectImage = () => {
        clear();
        onSelected(file);
    };

    const onBeforeClose = () => {
        clear();
        hide();
    };

    if (!show) return "";
    return (
        <>
            <input type="file" style={{ display: "none" }} ref={fileRef} onChange={onImageChange} />
            <Dialog maxWidth="md" open={show} onClose={onBeforeClose}>
                <DialogContent sx={{ p: 2, minWidth: minDimention, minHeight: minDimention }}>
                    {as === "img" && src && (
                        <IconButton onClick={() => fileRef.current.click()}>
                            <img src={file ? URL.createObjectURL(file) : src} width={minDimention} height={minDimention} alt="" />
                        </IconButton>
                    )}
                    {as === "img" && !src && !file && <T>select-an-image</T>}
                    {as === "img" && !src && file && (
                        <IconButton onClick={() => fileRef.current.click()}>
                            <img src={URL.createObjectURL(file)} width={minDimention} height={minDimention} alt="" />
                        </IconButton>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={() => (file ? selectImage() : fileRef.current.click())}>
                        {file ? t("apply") : t("select")}
                    </Button>
                    <Button variant="outlined" onClick={() => onBeforeClose()}>
                        {t("cancel")}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
