"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
class Presenter {
    constructor(view, model, numImagesPerLoad) {
        this.model = model;
        this.view = view;
        this.numImagesPerLoad = numImagesPerLoad || 9;
    }
    initializeElement(onImageSelected) {
        this.view.initializeElement(this.onDeleteButtonClicked.bind(this), this.onLoadMoreButtonClicked.bind(this), this.onUploadButtonClicked.bind(this), onImageSelected);
        this.images = [];
        this.imagesLoaded = 0;
        this.loadImages();
    }
    loadImages() {
        return Promise.resolve().then(() => {
            // If there's no images, try to get from the internet
            if (this.images.length === 0) {
                return this.model.getImages().then(resp => {
                    if (resp.status) {
                        this.images = resp.data;
                        return;
                    }
                    else {
                        alert('Error loading image: ' + resp.errMessage);
                        console.error(resp.errMessage);
                        throw new Error(resp.errMessage);
                    }
                });
            }
            else {
                return;
            }
        }).then(() => {
            const startIdx = this.imagesLoaded;
            const endIdx = this.imagesLoaded + this.numImagesPerLoad;
            if (startIdx < this.images.length) {
                const imagesToLoad = this.images.slice(startIdx, endIdx);
                imagesToLoad.forEach(image => {
                    this.view.appendImage(image, true);
                });
                this.imagesLoaded += this.numImagesPerLoad;
            }
            else {
                alert('No more image to be loaded');
                // No more images to load
            }
        }).catch(err => {
            console.error(err);
            alert('Error loading image: internal error');
        });
    }
    onDeleteButtonClicked(filename) {
        return new Promise((resolve, reject) => {
            this.model.deleteImage(filename).then(resp => {
                resolve(resp);
            }).catch(function (err) {
                reject(err);
            });
        });
    }
    onLoadMoreButtonClicked() {
        this.loadImages();
    }
    onUploadButtonClicked(imageBinaryData) {
        return new Promise((resolve, reject) => {
            if (imageBinaryData) {
                this.model.uploadImage(imageBinaryData).then(resp => {
                    const image = resp.data;
                    this.view.appendImage(image, false);
                    resolve(resp);
                }).catch(err => {
                    reject(err);
                });
            }
            else {
                resolve({ status: false, data: { errMessage: 'Please select the upload picture' } });
            }
        });
    }
}
exports.default = Presenter;
