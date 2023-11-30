//houseImage
import { get, upload, remove } from "./api";
import routes from "./end-points";
const MinFileSize = 0;
const MaxFileSize = 5 * 1024 * 1024;

export const houseImagesApi = {
    init: (houseId) => get(routes.houseImage.init(houseId)),
    upload: (houseId, file) => {
        if (file.size < MinFileSize) {
            setTimeout(() => (file.value = ""), 0);
            return Promise.reject("file-is-empty");
        }
        if (file.size > MaxFileSize) {
            setTimeout(() => (file.value = ""), 0);
            return Promise.reject("file-is-too-big");
        }
        const form_data = new FormData();
        form_data.append("file", file);

        return upload(routes.houseImage.upload(houseId), form_data);
    },
    delete: (id) => remove(routes.houseImage.delete(id)),
};
