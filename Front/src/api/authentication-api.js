import { get, post } from "./api";
import routes from "./end-points";

export const authenticationApi = {
    login: (dto) => post(routes.authentication.login, dto, true),
    register: (dto) => post(routes.authentication.register, dto, true),
    userInfo: () => get(routes.authentication.userInfo, true),
};
