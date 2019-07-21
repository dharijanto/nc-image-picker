"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const FData = require("form-data");
class NetworkModel {
    constructor(postURL, getURL, deleteURL) {
        this.postURL = postURL;
        this.getURL = getURL;
        this.deleteURL = deleteURL;
    }
    getImages() {
        return axios_1.default.get(this.getURL).then(function (response) {
            return response.data;
        });
    }
    deleteImage(filename) {
        return axios_1.default.post(this.deleteURL, { filename }).then(rawResp => {
            const resp = rawResp.data;
            if (resp.status) {
                return { status: true };
            }
            else {
                throw new Error(resp.errMessage);
            }
        });
    }
    uploadFile(url, binaryData, name = 'file') {
        if (typeof url !== 'string') {
            throw new TypeError(`Expected a string, got ${typeof url}`);
        }
        const formData = new FData();
        formData.append(name, binaryData);
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            },
            withCredentials: true
        };
        // TODO: Should we .data the result? Cos axios returned data is wrapped under 'data' field, isn't it?
        return axios_1.default.post(url, formData, config).then(rawResp => {
            const resp = rawResp.data;
            if (resp.status) {
                return resp;
            }
            else {
                throw new Error('Failed to upload image: ' + resp.errMessage);
            }
        });
    }
    uploadImage(imageBinaryData) {
        return this.uploadFile(this.postURL, imageBinaryData);
    }
}
exports.default = NetworkModel;
