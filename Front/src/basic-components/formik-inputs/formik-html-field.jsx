import { Field } from "formik";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { Keys } from "../../consts/enums";
import { FormControl, FormLabel } from "@mui/material";
import T from "../text";

export const FormikHtmlField = ({ name, label, className }) => (
    <FormControl className={className}>
        <FormLabel>
            <T>{label}</T>
        </FormLabel>
        <Field
            name={name}
            render={({ field, form }) => (
                <CKEditor
                    editor={ClassicEditor}
                    data={field.value}
                    onChange={(event, editor) => {
                        form.setFieldValue(field.name, editor.getData());
                    }}
                    config={{ language: localStorage.getItem(Keys.LanguageKey) }}
                />
            )}
        />
    </FormControl>
);
