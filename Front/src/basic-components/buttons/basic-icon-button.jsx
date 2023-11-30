import { Button } from "@mui/material";

export const BasicIconButton = ({ variant, size = "small", color, OnClick, icon, label }) => {
    return (
        <Button color={color} size={size} variant={variant} startIcon={icon} onClick={OnClick}>
            {label}
        </Button>
    );
};
