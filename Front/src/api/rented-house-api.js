import { get, post, remove } from "./api";
import routes from "./end-points";

export const rentedHouseApi = {
    init: () => get(routes.rentedHouse.initRentedHouse),
    saveChanges: (dto) => post(routes.rentedHouse.saveChanges, dto),
    delete: (id) => remove(routes.rentedHouse.delete(id)),
};
