import { TreeView } from "@mui/x-tree-view/TreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import { Box } from "@mui/material";
import React from "react";
import { ChevronLeft, ChevronRight, Directions, ExpandMore } from "@mui/icons-material";
import { Keys } from "../../consts/enums";
import { useDirection } from "../../hooks/user-direction";

export const TreeShow = ({ data, onSelected }) => {
    const { direction } = useDirection();
    if (!data) return "";

    data = transformModelToTreeView(data);

    return (
        <Box sx={{ flexGrow: 1, maxWidth: 300 }}>
            <TreeView
                aria-label="file system navigator"
                defaultCollapseIcon={<ExpandMore />}
                defaultExpandIcon={direction === "rtl" ? <ChevronLeft /> : <ChevronRight />}>
                <CustomTreeView data={data} onSelected={onSelected} />
            </TreeView>
        </Box>
    );
};

const CustomTreeView = ({ data, onSelected }) => {
    const renderTree = (nodes) => (
        <TreeItem key={nodes.id} nodeId={nodes.id} label={nodes.title} onClick={() => onSelected(nodes)}>
            {Array.isArray(nodes.children) ? nodes.children.map((node) => renderTree(node)) : null}
        </TreeItem>
    );

    return data.map((node) => renderTree(node));
};

const transformModelToTreeView = (inputModel) => {
    const map = new Map();

    // Create a map with references to each object based on their id
    inputModel.forEach((node) => {
        map.set(node.id, { ...node, children: [] });
    });

    // Build the tree structure using parentid references
    const tree = [];
    map.forEach((node) => {
        if (node.parentId !== null) {
            map.get(node.parentId)?.children?.push(node);
        } else {
            tree.push(node);
        }
    });

    return tree;
};
