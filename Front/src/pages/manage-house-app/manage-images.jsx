import { Button, Card, CardActions, CardMedia, Dialog, DialogContent, Grid, IconButton, Stack } from "@mui/material";
import useConfirm from "../../basic-components/use-confirm";
import T from "../../basic-components/text";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNotify } from "../../hooks/use-notify";
import { houseImagesApi } from "../../api/house-image-api";
import { DialogSection } from "../../basic-components/dialog-section";
import { InitFailed } from "../../basic-components/init-failed";
import { Delete } from "@mui/icons-material";
import { BasicIconButton } from "../../basic-components/buttons/basic-icon-button";
import { ImageSelector } from "../../basic-components/image/image-selector";
import { LoadingButton } from "@mui/lab";

export const ManageImages = ({ houseId, open, onClose }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [showImageSelector, setShowImageSelector] = useState(false);
    const [model, setModel] = useState(false);
    const { t } = useTranslation();
    const notify = useNotify();
    const [ConfirmationDialog, confirm] = useConfirm(undefined, <T>are-you-sure-to-delete-image</T>);

    const init = () => {
        houseImagesApi.init(houseId).then(setModel).catch(setModel);
    };

    useEffect(() => {
        if (!open || model) return;
        init();
    }, [open, model]);

    if (!model) return "";

    const handleDelete = async (imageId) => {
        const ans = await confirm();
        if (ans) {
            houseImagesApi
                .delete(imageId)
                .then((result) => {
                    if (result.deleted) {
                        //onClose(data.house, true);
                        init();
                        notify.warning(t("record-deleted-successfully"));
                    } else {
                        notify.error(t(result.message));
                    }
                })
                .catch(notify.error);
        }
    };

    return (
        <Dialog scroll="paper" open={open} onClose={() => onClose()}>
            <DialogSection
                title={<T>manage-house-images</T>}
                Control={
                    <Stack flex flexDirection="row" gap={1}>
                        <Button size="small" variant="outlined" onClick={onClose}>
                            <T>cancel</T>
                        </Button>
                        <LoadingButton loading={isLoading} size="small" variant="contained" onClick={() => setShowImageSelector(true)}>
                            <T>upload</T>
                        </LoadingButton>
                    </Stack>
                }>
                <DialogContent>
                    <ImageSelector
                        as="img"
                        show={showImageSelector}
                        hide={() => setShowImageSelector(false)}
                        onSelected={(file) => {
                            if (file) {
                                setIsLoading(true);
                                houseImagesApi
                                    .upload(houseId, file)
                                    .then((res) => {
                                        if (res.uploaded) init();
                                        else notify.error(res.message);
                                    })
                                    .catch(notify.error)
                                    .finally(() => {
                                        setIsLoading(false);
                                        setShowImageSelector(false);
                                    });
                            }
                        }}
                        //src={`data:image/png;base64,${x.image.imageUrl}`}
                    />
                    <Grid container>
                        {model.images.map((image) => (
                            <Grid item md={4} xs={12}>
                                <Card sx={{ m: 1 }}>
                                    <CardMedia component="img" src={`data:image/png;base64,${image.imageUrl}`} />
                                    <CardActions>
                                        <Button
                                            onClick={() => handleDelete(image.id)}
                                            color="error"
                                            variant="outlined"
                                            size="small"
                                            startIcon={<Delete fontSize="small" color="error" />}>
                                            <T>delete</T>
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </DialogContent>
            </DialogSection>
            <ConfirmationDialog />
        </Dialog>
    );
};
