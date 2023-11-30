import { Field } from "formik";
import { TreeShow } from "../tree/tree-view";
import { Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormLabel, Stack } from "@mui/material";
import T from "../text";
import { useEffect, useState } from "react";
import { DeleteOutline } from "@mui/icons-material";
import Flex from "../display/flex";

export const FormikTreeViewSelect = ({ list, name, label, selectedValue, minWidth = 100, asModal = false, className, formik }) => {
    const [selectedNode, setSelectedNode] = useState(selectedValue ? list.find((x) => x.id === selectedValue) : null);
    const [show, setShow] = useState(false);

    // useEffect(() => {
    //     formik.setFieldValue(name, selectedNode);
    // }, [selectedNode]);

    if (!asModal)
        return (
            <Stack>
                <FormControl sx={{ minWidth: minWidth }} className={className}>
                    <FormLabel>
                        <T>{label}</T>
                    </FormLabel>
                    <Field
                        name={name}
                        render={({ field, form }) => <TreeShow data={list} onSelected={(node) => form.setFieldValue(name, node.id)} />}
                    />
                </FormControl>
            </Stack>
        );
    else {
        return (
            <Stack>
                <FormControl sx={{ minWidth: minWidth }} className={className}>
                    <FormLabel>
                        <T>{label}</T>
                    </FormLabel>
                    <Field
                        name={name}
                        render={({ field, form }) => (
                            <>
                                <FormLabel>
                                    {!selectedNode && (
                                        <>
                                            <Button variant="text" onClick={() => setShow(true)}>
                                                <T append="...">select</T>
                                            </Button>
                                        </>
                                    )}
                                    {selectedNode && (
                                        <Chip
                                            size="small"
                                            deleteIcon={<DeleteOutline />}
                                            label={selectedNode.title}
                                            onDelete={() => {
                                                setSelectedNode(null);
                                                form.setFieldValue(name, null);
                                                formik && formik.setFieldValue(name, null);
                                            }}
                                        />
                                    )}
                                </FormLabel>
                                <Dialog open={show} onClose={() => setShow(false)}>
                                    <DialogTitle>
                                        <T title={label}>select-a-@title</T>
                                    </DialogTitle>
                                    <DialogContent sx={{ minWidth: 600 }}>
                                        <TreeShow
                                            data={list}
                                            onSelected={(node) => {
                                                form.setFieldValue(name, node.id);
                                                formik && formik.setFieldValue(name, node.id);
                                                setSelectedNode(node);
                                            }}
                                        />
                                    </DialogContent>
                                    <DialogActions>
                                        <Flex>
                                            <Button
                                                size="small"
                                                onClick={() => {
                                                    setSelectedNode(null);
                                                    setShow(false);
                                                }}>
                                                <T>clear</T>
                                            </Button>
                                        </Flex>
                                    </DialogActions>
                                </Dialog>
                            </>
                        )}
                    />
                </FormControl>
            </Stack>
        );
    }
};
