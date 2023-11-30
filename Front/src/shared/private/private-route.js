import React from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { Keys } from "../../consts/enums";

export const PrivateRoute = ({ isAuthenticated }) => {
    const prevLocation = useLocation();
    return isAuthenticated === true ? <Outlet /> : <Navigate to={`/login?${Keys.ReturnUrl}=${prevLocation.pathname}`} />;
};
