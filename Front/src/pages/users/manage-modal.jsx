import * as Yup from "yup";
import { Button, Dialog, DialogActions, DialogContent, IconButton, ListItemIcon, Menu, MenuItem } from "@mui/material";
import { DeleteOutline, MoreVert, PasswordOutlined } from "@mui/icons-material";
import { Form, Formik } from "formik";
import { useTranslation } from "react-i18next";
import { useNotify } from "../../hooks/use-notify";
import { DialogSection } from "../../basic-components/dialog-section";
import T from "../../basic-components/text";
import Flex from "../../basic-components/display/flex";
import { FormikTextView } from "../../basic-components/formik-inputs";
import useConfirm from "../../basic-components/use-confirm";
import { useState } from "react";
import { LoadingBtn } from "../../basic-components/buttons/loading-button";
import { usersApi } from "../../api/users-api";
import { Keys } from "../../consts/enums";

export const ManageModal = ({ data, open, onClose }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [moreAnchorEl, setMoreAnchorEl] = useState(null);
    const { t } = useTranslation();
    const notify = useNotify();
    const userSelectedLanguage = localStorage.getItem(Keys.LanguageKey);
    const [DeleteConfirmationDialog, deleteConfirm] = useConfirm(
        undefined,
        <T title={`${data?.firstName} ${data?.lastName}`}>are-you-sure-to-delete-record-@title</T>
    );

    const [ResetPassConfirmationDialog, resetPassConfirm] = useConfirm(
        undefined,
        <T title={`${data?.firstName} ${data?.lastName}`}>are-you-sure-to-reset-pass-@title</T>
    );

    const handleDelete = async () => {
        const ans = await deleteConfirm();
        if (ans) {
            usersApi
                .delete(data.id)
                .then((result) => {
                    if (result.deleted) {
                        onClose(data, true);

                        notify.warning(t("record-deleted-successfully"));
                    } else {
                        notify.error(t(result.message));
                    }
                })
                .catch(notify.error)
                .finally(() => setMoreAnchorEl(null));
        }
    };

    const resetPassword = async () => {
        const ans = await resetPassConfirm();

        if (ans) {
            usersApi
                .resetPassword(data.id)
                .then((result) => {
                    if (result.reseted) {
                        onClose();
                        notify.success(t("password-reseted-successfully"));
                    } else {
                        notify.error(t(result.message));
                    }
                })
                .catch(notify.error)
                .finally(() => setMoreAnchorEl(null));
        }
    };

    if (!data) return;

    const validationSchema = Yup.object({
        userName: Yup.string()
            .matches(/^(\+47|0047|47|0)?9\d{9}$/, t("invalid-mobile-number"))
            .required(t("required")),
        firstName: Yup.string().required(t("required")),
        lastName: Yup.string().required(t("required")),
    });

    const getDirection = () => {
        return userSelectedLanguage === "en" ? "right" : "left";
    };

    return (
        <>
            <Dialog open={open} onClose={() => onClose()}>
                <Formik
                    initialValues={{
                        firstName: data.firstName || "",
                        lastName: data.lastName || "",
                        userName: data.userName || "",
                        id: data.id,
                    }}
                    validationSchema={validationSchema}
                    onSubmit={(values) => {
                        setIsLoading(true);
                        usersApi
                            .saveChanges(values)
                            .then((model) => onClose(model.user, false))
                            .catch(notify.error)
                            .finally(() => {
                                setIsLoading(false);
                                notify.success(t("changes-were-successfully-saved"));
                            });
                    }}>
                    {(formik) => (
                        <Form>
                            <DialogSection
                                title={data.userName ? <T>edit</T> : <T>add</T>}
                                Control={
                                    data.userName ? (
                                        <Flex direction="row" gap={5}>
                                            <IconButton color="inherit" onClick={(event) => setMoreAnchorEl(event.currentTarget)}>
                                                <MoreVert />
                                            </IconButton>
                                        </Flex>
                                    ) : null
                                }>
                                <DialogContent>
                                    <FormikTextView
                                        disabled={data.userName != null}
                                        name="userName"
                                        label="username"
                                        formik={formik}
                                        focused={true}
                                    />
                                    <FormikTextView name="firstName" label="firstname" className="mt-1" formik={formik} />
                                    <FormikTextView name="lastName" label="lastname" className="mt-1" formik={formik} />
                                </DialogContent>
                                <DialogActions>
                                    <Flex gap={5}>
                                        <Button type="button" variant="outlined" onClick={() => onClose()}>
                                            <T>cancel</T>
                                        </Button>
                                        <LoadingBtn isLoading={isLoading} type="submit" variant="contained">
                                            <T>apply</T>
                                        </LoadingBtn>
                                    </Flex>
                                </DialogActions>
                            </DialogSection>
                        </Form>
                    )}
                </Formik>
            </Dialog>
            <ResetPassConfirmationDialog />
            <DeleteConfirmationDialog />
            <Menu
                open={moreAnchorEl != null}
                onClose={() => setMoreAnchorEl(null)}
                anchorEl={moreAnchorEl}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: getDirection(),
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: getDirection(),
                }}>
                <MenuItem onClick={resetPassword}>
                    <ListItemIcon>
                        <PasswordOutlined />
                    </ListItemIcon>
                    <T>reset-password</T>
                </MenuItem>
                <MenuItem onClick={handleDelete}>
                    <ListItemIcon>
                        <DeleteOutline />
                    </ListItemIcon>
                    <T>delete</T>
                </MenuItem>
            </Menu>
        </>
    );
};
