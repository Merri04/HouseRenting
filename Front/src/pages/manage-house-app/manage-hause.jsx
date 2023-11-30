import { useEffect, useState } from "react";
import { Loading } from "../../basic-components/loading";
import { houseApi } from "../../api/house-api";
import { InitFailed } from "../../basic-components/init-failed";
import T from "../../basic-components/text";
import { Link, useNavigate } from "react-router-dom";
import { Section } from "../../basic-components/section";
import { BasicIconButton } from "../../basic-components/buttons/basic-icon-button";
import { AddOutlined, Delete, Edit, Image } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { BasicTable } from "../../basic-components/table/basic-table";
import { IconButton, Stack } from "@mui/material";
import { ManageModal } from "./manage-modal";
import { ManageImages } from "./manage-images";

export const ManageHause = () => {
    const [model, setModel] = useState();
    const [selectedRow, setSelectedRow] = useState();
    const [showImagesModal, setShowImagesModal] = useState();
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        if (model) return;
        houseApi.init().then(setModel).catch(setModel);
    }, [model]);

    if (!model) return <Loading />;
    if (model instanceof Error) return <InitFailed ex={model} onRetry={() => setModel(null)} hideGoBack={false} />;

    const columns = [
        {
            accessor: "title",
            Header: <T>title</T>,
            Cell: ({ row }) => (
                <Link className="text-link" to={`/House/${row.original.id}`}>
                    {row.original.title}
                </Link>
            ),
        },
        {
            accessor: "price",
            Header: <T>price</T>,
            Cell: ({ row }) => `${row.original.price} $`,
        },
        { accessor: "typeTitle", Header: <T>type</T> },
        { accessor: "fromDate", Header: <T>from-date</T> },
        { accessor: "toDate", Header: <T>to-date</T> },
        {
            accessor: "id",
            Header: "",
            Cell: ({ row }) => (
                <Stack flex flexDirection="row" gap={2}>
                    <IconButton onClick={() => setSelectedRow(row.original)}>
                        <Edit color="error" fontSize="small" />
                    </IconButton>
                    <IconButton onClick={() => setShowImagesModal(row.original)}>
                        <Image color="info" fontSize="small" />
                    </IconButton>
                </Stack>
            ),
        },
    ];

    return (
        <Section
            as="subtitle1"
            title={t("my-houses")}
            elevation={5}
            onBack={() => navigate("/")}
            Control={<BasicIconButton variant="outlined" OnClick={() => setSelectedRow({})} icon={<AddOutlined />} label={<T>add</T>} />}>
            <BasicTable columns={columns} data={model.houses} enableGlobalFilter />
            <ManageModal
                open={selectedRow != null}
                data={{ house: selectedRow, houseTypes: model.houseTypes }}
                onClose={(house, deleted) => {
                    if (house && !deleted)
                        if (selectedRow.id) {
                            setModel({ ...model, houses: model.houses.map((x) => (x.id === house.id ? house : x)) });
                        } else {
                            setModel({ ...model, houses: [...model.houses, house] });
                        }
                    else if (house && deleted) setModel({ ...model, houses: model.houses.filter((x) => x.id !== house.id) });
                    setSelectedRow(null);
                }}
            />
            <ManageImages open={showImagesModal != null} onClose={() => setShowImagesModal(null)} houseId={showImagesModal?.id} />
        </Section>
    );
};
