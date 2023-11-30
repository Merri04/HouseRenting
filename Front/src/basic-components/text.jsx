import { Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";

const T = ({ as = "body2", append, className, sx, label, children, ...props }) => {
    const { t } = useTranslation();

    let translatedChildren = typeof children === "string" ? t(children) : children;
    if (props && translatedChildren) {
        var words = translatedChildren.split(" ");

        words.forEach((word) => {
            if (word.includes("@")) {
                try {
                    translatedChildren = translatedChildren.split(word).join(props[word.replace("@", "")]);
                } catch {}
            }
        });
    }

    return (
        <>
            <Typography color={props.color} className={className} variant={as} component={"span"} sx={sx} {...props}>
                {label && <T append=" : ">{label}</T>} {translatedChildren}
            </Typography>
            {append && <span>{append}</span>}
        </>
    );
};

export default T;
