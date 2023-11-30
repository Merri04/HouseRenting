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

import { houseApi } from "../../api/house-api";
import { FormikSelectView } from "../../basic-components/formik-inputs/formik-select-view";
import { FormikDateView } from "../../basic-components/formik-inputs/formik-date-view";

export const ManageModal = ({ data, open, onClose }) => {
    const [isLoading, setIsLoading] = useState(false);
    const { t } = useTranslation();
    const notify = useNotify();

    const [ConfirmationDialog, confirm] = useConfirm(undefined, <T title={data?.house?.title}>are-you-sure-to-delete-record-@title</T>);

    const handleDelete = async () => {
        const ans = await confirm();
        if (ans) {
            houseApi
                .delete(data.house.id)
                .then((result) => {
                    if (result.deleted) {
                        onClose(data.house, true);
                        notify.warning(t("record-deleted-successfully"));
                    } else {
                        notify.error(t(result.message));
                    }
                })
                .catch(notify.error);
        }
    };

    if (!data?.house) return;

    const validationSchema = Yup.object({
        price: Yup.number().required(t("required")),
        title: Yup.string().required(t("required")),
        description: Yup.string().required(t("required")),
        fromDate: Yup.date().required(t("required")),
        toDate: Yup.date().required(t("required")),
    });

    return (
        <>
            <Dialog scroll="paper" open={open} onClose={() => onClose()}>
                <Formik
                    initialValues={{
                        id: data.house.id,
                        title: data.house.title,
                        price: data.house.price || 0,
                        typeId: data.house.typeId,
                        description: data.house.description || "",
                        address: data.house.address || "",
                        fromDate: data.house.fromDate,
                        toDate: data.house.toDate,
                    }}
                    validationSchema={validationSchema}
                    onSubmit={(values) => {
                        setIsLoading(true);
                        var dto = {
                            id: values.id,
                            title: values.title,
                            price: values.price,
                            typeId: values.typeId,
                            address: values.address,
                            description: values.description,
                            fromDate: values.fromDate,
                            toDate: values.toDate,
                        };
                        houseApi
                            .saveChanges(dto)
                            .then((model) => onClose(model.house, false))
                            .catch(notify.error)
                            .finally(() => {
                                setIsLoading(false);
                                notify.success(t("changes-were-successfully-saved"));
                            });
                    }}>
                    {(formik) => (
                        <Form>
                            <DialogSection
                                title={data.house.id ? <T>edit</T> : <T>add</T>}
                                Control={
                                    <Flex gap={5}>
                                        {data.house.id ? (
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
                                    <FormikTextView name="title" label="title" formik={formik} focused={true} />
                                    <FormikTextView name="price" label="price" className="mt-1" formik={formik} />
                                    <FormikSelectView items={data.houseTypes} name="typeId" label="type" className="mt-1" formik={formik} />
                                    <FormikDateView name="fromDate" label="from-date" className="mt-1 full-width" formik={formik} />
                                    <FormikDateView name="toDate" label="to-date" className="mt-1 full-width" formik={formik} />
                                    <FormikTextView name="address" label="address" formik={formik} className="mt-1" />
                                    <FormikTextView name="description" label="description" formik={formik} className="mt-1 full-width" />
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
