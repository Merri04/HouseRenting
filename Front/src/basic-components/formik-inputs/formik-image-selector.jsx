import { Field } from "formik";
import { useState } from "react";
import { ImageSelector } from "../image/image-selector";
import { Button, FormControl, FormLabel, Stack } from "@mui/material";
import T from "../text";
import Flex from "../display/flex";
import { Upload, UploadFile } from "@mui/icons-material";

export const FormikImageSelector = ({ name, label, className }) => {
    const [showPosterImageSelector, setShowPosterImageSelector] = useState();
    return (
        <Stack>
            <FormControl className={className}>
                <FormLabel>
                    <T>{label}</T>
                </FormLabel>
                <Field
                    name={name}
                    render={({ field, form }) => (
                        <>
                            <Stack direction="row" justifyContent="start" alignItems="center" gap={1}>
                                {field.value && (
                                    <img
                                        onClick={() => setShowPosterImageSelector(true)}
                                        style={{ maxWidth: 250, maxHeight: 100 }}
                                        src={field.value instanceof File ? URL.createObjectURL(field.value) : field.value}
                                        className="rounded"
                                        alt=""
                                    />
                                )}
                                <Button variant="outlined" onClick={() => setShowPosterImageSelector(true)} startIcon={<UploadFile />}>
                                    <T append="...">select</T>
                                </Button>
                            </Stack>
                            <ImageSelector
                                as="img"
                                show={showPosterImageSelector}
                                hide={() => setShowPosterImageSelector(false)}
                                onSelected={(file) => {
                                    if (file) form.setFieldValue("poster", file);
                                    setShowPosterImageSelector(false);
                                }}
                                src={field.value}
                            />
                        </>
                    )}
                />
            </FormControl>
        </Stack>
    );
};
