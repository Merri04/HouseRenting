import { LoadingButton } from "@mui/lab";

export const LoadingBtn = ({
    onClick,
    isLoading,
    className,
    sx,
    variant = "contained",
    type = "button",
    color = "primary",
    size,
    icon,
    children,
}) => {
    return (
        <LoadingButton
            startIcon={icon}
            className={className}
            variant={variant}
            type={type}
            loading={isLoading}
            sx={sx}
            size={size}
            color={color}
            onClick={onClick}
            disabled={isLoading}>
            {children}
        </LoadingButton>
    );
};
