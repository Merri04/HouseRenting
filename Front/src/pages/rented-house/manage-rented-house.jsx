import * as Yup from "yup";
import { Dialog, DialogContent } from "@mui/material";
import { Cancel, CheckCircle, DeleteOutline } from "@mui/icons-material";
import { Form, Formik } from "formik";
import { useTranslation } from "react-i18next";
import { useNotify } from "../../hooks/use-notify";
import { DialogSection } from "../../basic-components/dialog-section";
import { BasicIconButton } from "../../basic-components/buttons/basic-icon-button";
import T from "../../basic-components/text";
import Flex from "../../basic-components/display/flex";
import { FormikTextView } from "../../basic-components/formik-inputs";
import useConfirm from "../../basic-components/use-confirm";
import { LoadingBtn } from "../../basic-components/buttons/loading-button";
import { useState } from "react";
import { FormikDateView } from "../../basic-components/formik-inputs/formik-date-view";
import { rentedHouseApi } from "../../api/rented-house-api";

export const ManageRentedHouse = ({ rentedHouse, house, open, onClose }) => {
    const [isLoading, setIsLoading] = useState(false);
    const { t } = useTranslation();
    const notify = useNotify();

    const [ConfirmationDialog, confirm] = useConfirm(undefined, <T title={rentedHouse?.houseTitle}>are-you-sure-to-delete-house-@title</T>);

    const handleDelete = async () => {
        const ans = await confirm();
        if (ans) {
            rentedHouseApi
                .delete(rentedHouse.id)
                .then((result) => {
                    if (result.deleted) {
                        onClose(null, true);
                        notify.warning(t("record-deleted-successfully"));
                    } else {
                        notify.error(t(result.message));
                    }
                })
                .catch(notify.error);
        }
    };

    if (!rentedHouse) return;

    const validationSchema = Yup.object({
        numbers: Yup.number().required(t("required")),
        fromDate: Yup.date().required(t("required")),
        toDate: Yup.date().required(t("required")),
    });

    return (
        <>
            <Dialog scroll="paper" open={open} onClose={() => onClose()}>
                <Formik
                    initialValues={{
                        id: rentedHouse.id,
                        title: rentedHouse.houseTitle,
                        numbers: rentedHouse.numbers || 1,
                        fromDate: rentedHouse.fromDate || house.fromDate,
                        toDate: rentedHouse.toDate || house.toDate,
                        hauseId: rentedHouse.hauseId,
                        userId: rentedHouse.userId,
                    }}
                    validationSchema={validationSchema}
                    onSubmit={(values) => {
                        setIsLoading(true);
                        var dto = {
                            id: values.id,
                            numbers: values.numbers || 1,
                            fromDate: values.fromDate,
                            toDate: values.toDate,
                            hauseId: values.hauseId,
                            userId: values.userId,
                        };
                        rentedHouseApi
                            .saveChanges(dto)
                            .then((model) => onClose(model.rentedHause, false))
                            .catch(notify.error)
                            .finally(() => {
                                setIsLoading(false);
                                notify.success(t("changes-were-successfully-saved"));
                            });
                    }}>
                    {(formik) => (
                        <Form>
                            <DialogSection
                                title={rentedHouse.id ? <T>edit</T> : <T>add</T>}
                                Control={
                                    <Flex gap={5}>
                                        {rentedHouse.id ? (
                                            <BasicIconButton
                                                color="error"
                                                variant="outlined"
                                                OnClick={handleDelete}
                                                icon={<DeleteOutline />}
                                                label={<T>delete</T>}
                                            />
                                        ) : null}
                                        <LoadingBtn
                                            size="small"
                                            type="button"
                                            variant="outlined"
                                            onClick={() => onClose()}
                                            icon={<Cancel />}>
                                            <T>cancel</T>
                                        </LoadingBtn>

                                        <LoadingBtn
                                            type="submit"
                                            variant="contained"
                                            isLoading={isLoading}
                                            icon={<CheckCircle />}
                                            size="small">
                                            <T>apply</T>
                                        </LoadingBtn>
                                    </Flex>
                                }>
                                <DialogContent>
                                    <FormikTextView name="numbers" label="numbers" className="mt-1" focused formik={formik} />
                                    <FormikDateView name="fromDate" label="from-date" className="mt-1" formik={formik} />
                                    <FormikDateView name="toDate" label="to-date" className="mt-1" formik={formik} />
                                </DialogContent>
                            </DialogSection>
                        </Form>
                    )}
                </Formik>
            </Dialog>
            <ConfirmationDialog />
        </>
    );
};
