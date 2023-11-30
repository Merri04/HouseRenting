import { useEffect, useState } from "react";
import { Loading } from "../../basic-components/loading";
import { InitFailed } from "../../basic-components/init-failed";
import { Section } from "../../basic-components/section";
import { useTranslation } from "react-i18next";
import T from "../../basic-components/text";
import { AddOutlined, SettingsOutlined } from "@mui/icons-material";
import { BasicIconButton } from "../../basic-components/buttons/basic-icon-button";
import { ManageModal } from "./manage-modal";
import { usersApi } from "../../api/users-api";
import { useNavigate } from "react-router-dom";
import { BasicTable } from "../../basic-components/table/basic-table";

export const UsersApp = () => {
    const [model, setModel] = useState();
    const { t } = useTranslation();
    const [selectedRow, setSelectedRow] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        if (model) return;
        usersApi.init().then(setModel).catch(setModel);
    }, [model]);

    const columns = [
        { accessor: "userName", Header: <T>username</T> },
        { accessor: "firstName", Header: <T>firstname</T> },
        { accessor: "lastName", Header: <T>lastname</T> },
        {
            accessor: "id",
            width: 50,
            Cell: ({ row }) => (
                <BasicIconButton
                    color="primary"
                    variant="outlined"
                    OnClick={() => setSelectedRow(row.original)}
                    icon={<SettingsOutlined />}
                    label={<T>manage</T>}
                />
            ),
        },
    ];

    if (!model) return <Loading />;
    if (model instanceof Error) return <InitFailed ex={model} onRetry={() => setModel(null)} />;

    return (
        <Section
            as="subtitle1"
            title={t("manage-users")}
            elevation={5}
            onBack={() => navigate("/dashboard")}
            Control={<BasicIconButton variant="outlined" OnClick={() => setSelectedRow({})} icon={<AddOutlined />} label={<T>add</T>} />}>
            <BasicTable columns={columns} data={model.users} enableGlobalFilter />
            <ManageModal
                open={selectedRow != null}
                data={selectedRow}
                onClose={(user, deleted) => {
                    if (user && !deleted)
                        if (selectedRow.id)
                            setModel({ ...model, users: model.users.map((x) => (x.userName === user.userName ? user : x)) });
                        else setModel({ ...model, users: [...model.users, user] });
                    else if (user && deleted) setModel({ ...model, users: model.users.filter((x) => x.userName !== user.userName) });
                    setSelectedRow(null);
                }}
            />
        </Section>
    );
};
