import { get, post, remove } from "./api";
import routes from "./end-points";

export const usersApi = {
    init: () => get(routes.admin.users.init),
    saveChanges: (dto) => post(routes.admin.users.saveChanges, dto),
    delete: (id) => remove(routes.admin.users.delete(id)),
    resetPassword: (id) => get(routes.admin.users.resetPassword(id)),
};
