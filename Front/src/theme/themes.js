const fonts = ["Chilanka", "shabnam"].join(",");
export const lightTheme = {
    palette: {
        type: "light",
        primary: {
            main: "#FB8500",
        },
        secondary: {
            main: "#FB8500",
        },
        background: {
            default: "#f8f8f8",
        },
    },
    spacing: 8,
    props: {
        MuiButtonBase: {
            disableRipple: true,
        },
    },

    typography: {
        fontFamily: fonts,
        // allVariants: {
        //     color: blueGrey[100],
        // },
    },
};

export const darkTheme = {
    palette: {
        mode: "dark",
    },
    spacing: 8,
    props: {
        MuiButtonBase: {
            disableRipple: true,
        },
    },

    typography: {
        fontFamily: fonts,
        // allVariants: {
        //     color: blueGrey[100],
        // },
    },
};
