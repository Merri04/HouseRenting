import { Search as SearchIcon } from "@mui/icons-material";
import { Grid, IconButton, InputBase, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export const Search = ({ onChange }) => {
    const [value, setValue] = useState("");
    useEffect(() => {
        onChange && onChange(value);
    }, [value]);

    const { t } = useTranslation();

    return (
        <Grid container>
            <Grid item xs={12} xl={3}>
                <Paper component="form" sx={{ display: "flex", alignItems: "center", width: "100%", px: 1 }}>
                    <InputBase sx={{ ml: 1, flex: 1 }} placeholder={t("search")} value={value} onChange={(e) => setValue(e.target.value)} />
                    <IconButton type="button" aria-label="search">
                        <SearchIcon />
                    </IconButton>
                </Paper>
            </Grid>
        </Grid>
    );
};
