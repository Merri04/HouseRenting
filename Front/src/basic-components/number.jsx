import { useTheme } from "@emotion/react";
import React from "react";

export const N = ({ as, className, style, children, ...props }) => {
    const theme = useTheme();

    if (children === undefined) children = "";
    else if (typeof children === "number") children = localNumbers(theme.direction, numberWithCommas(children));
    else if (typeof children === "string") children = localNumbers(theme.direction, numberWithCommas(children));

    if (!as) {
        if (className || style) as = "span";
        else return children;
    }
    return React.createElement(as, { ...props, className, style }, children);
};

function localNumbers(direction, txt) {
    if (txt === undefined || txt === null || txt === "") return txt;
    if (typeof txt === "number") txt = txt.toString();
    else if (typeof txt !== "string") return txt;
    if (direction !== "rtl") return txt;
    const res = [...txt].map((x) => (x < "0" || x > "9" ? x : String.fromCharCode(1632 + +x)));
    return res.join("");
}

function numberWithCommas(x) {
    return x?.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}
