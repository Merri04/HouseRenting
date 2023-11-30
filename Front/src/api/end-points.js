const urls = {
    authentication: "authentication",
    users: "admin/users",
    home: "home",
    house: "house",
    houseImages: "house-images",
    rentedHouse: "rented-house",
};

const data = {
    authentication: {
        login: `${urls.authentication}/login`,
        register: `${urls.authentication}/register`,
        userInfo: `${urls.authentication}/user-info`,
    },

    home: {
        initHome: `${urls.home}/init`,
    },
    houseImage: {
        init: (houseId) => `${urls.houseImages}/init/${houseId}`,
        upload: (houseId) => `${urls.houseImages}/upload/${houseId}`,
        delete: (id) => `${urls.houseImages}/delete/${id}`,
    },
    house: {
        initHouse: `${urls.house}/init-houses`,
        detail: (id) => `${urls.house}/detail/${id}`,
        saveChanges: `${urls.house}/save-changes/`,
        delete: (id) => `${urls.house}/delete/${id}`,
    },
    rentedHouse: {
        initRentedHouse: `${urls.rentedHouse}/init`,
        saveChanges: `${urls.rentedHouse}/save-changes/`,
        delete: (id) => `${urls.rentedHouse}/delete/${id}`,
    },
};

export default data;
