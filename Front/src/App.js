import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./pages/lunch-app/home";
import { Login } from "./pages/authentication-app/login";
import { Register } from "./pages/authentication-app/register";
import { PublicPanel } from "./shared/public/public-panel";
import { PrivatePanel } from "./shared/private/private-panel";
import { PrivateRoute } from "./shared/private/private-route";
import { NotFound } from "./pages/not-found";
import { useApp } from "./providers/app-provider";
import { AuthPanel } from "./shared/auth/auth-panel";
import { House } from "./pages/hauses-app/house";
import { ManageHause } from "./pages/manage-house-app/manage-hause";
import { RentedHauses } from "./pages/rented-house/rented-house-app";

const App = () => {
    const { isAuthenticated } = useApp();

    return (
        <Router>
            <Routes>
                <Route element={<PublicPanel />}>
                    <Route exact path="/" element={<Home />} />
                    <Route exact path="/home" element={<Home />} />
                    <Route exact path="/House/:id" element={<House />} />
                </Route>
                <Route element={<AuthPanel />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Route>
                <Route element={<PrivateRoute isAuthenticated={isAuthenticated} />}>
                    <Route element={<PrivatePanel />}>{<Route exact path="/Houses" element={<ManageHause />} />}</Route>
                    <Route element={<PrivatePanel />}>{<Route exact path="/RentedHouses" element={<RentedHauses />} />}</Route>
                </Route>
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
};

export default App;
