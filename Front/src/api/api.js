import axios from "axios";
import { apiServiceProviderUrl } from "./config";
import { Keys } from "../consts/enums";

const withCredentials = true;

const executeRequest = (method, url, data, requiredStatusCode, contentType = "application/json") => {
    const token = localStorage.getItem("token");
    const headers = { "Content-Type": contentType, authorization: "Bearer " + token };

    return new Promise((resolve, reject) => {
        axios({ url: `${apiServiceProviderUrl}/${url}`, data, withCredentials, method, headers })
            .then((response) => {
                const data = response.data;
                if (data.isSuccess) resolve(data.result);
                else handleError(method, url, data, requiredStatusCode, contentType).then(resolve).catch(reject);
            })
            .catch((error) => reject(translateErrorMessage(error.message)));
    });
};

const handleError = (method, url, result, requiredStatusCode, contentType) => {
    const token = localStorage.getItem("token");
    let headers = { "Content-Type": contentType, authorization: "Bearer " + token };

    return new Promise((resolve, reject) => {
        if (result.errorCode === "500") {
            reject(new Error(result.errorMessage));
        }
        if (result.errorCode === "401") {
            axios({ url: `${apiServiceProviderUrl}/authentication/refresh`, data: null, withCredentials, method: "get", headers })
                .then((res) => {
                    const response = res.data;
                    if (!response.isSuccess) return reject(response.errorMessage);

                    localStorage.setItem(Keys.TokenKey, response.result.token);
                    headers = { "Content-Type": contentType, authorization: "Bearer " + response.result.token };
                    axios({ url: `${apiServiceProviderUrl}/${url}`, result, withCredentials, method, headers })
                        .then((mainResponse) => {
                            const data = mainResponse.data;
                            if (data.isSuccess) resolve(data.result);
                            else {
                                reject(new Error(data.errorMessage));
                            }
                        })
                        .catch((error) => {
                            reject(new Error(error.message));
                        });
                })
                .catch(() => {
                    return reject(new Error(result.errorMessage));
                });
        } else {
            if (requiredStatusCode) reject(translateErrorMessage(result.errorMessage));
            else reject(new Error(result.errorMessage));
        }
    });
};

const translateErrorMessage = (message) => {
    if (message === "Network Error") return new Error("network-error");
    else return new Error(message);
};

export const get = (url, requiredStatusCode = false) => executeRequest("get", url, null, requiredStatusCode);
export const post = (url, data, requiredStatusCode = false) => executeRequest("post", url, data, requiredStatusCode);
export const upload = (url, data) => executeRequest("post", url, data, false, ""); //"multipart/form-data"
export const put = (url, data, requiredStatusCode = false) => executeRequest("put", url, data, requiredStatusCode);
export const remove = (url, requiredStatusCode = false) => executeRequest("delete", url, null, requiredStatusCode);
