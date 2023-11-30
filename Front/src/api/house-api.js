import { get, post, remove } from "./api";
import routes from "./end-points";

export const houseApi = {
    init: () => get(routes.house.initHouse),
    detail: (id) => get(routes.house.detail(id)),
    saveChanges: (dto) => post(routes.house.saveChanges, dto),
    delete: (id) => remove(routes.house.delete(id)),
};
