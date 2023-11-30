import { post } from "./api";
import routes from "./end-points";

export const homeApi = {
    initHome: (dto) => post(routes.home.initHome, dto),
};
