"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
class MockModel {
    constructor() {
        // Array of static images for testing-purposes
        this.images = [
            'http://res.cloudinary.com/nusantara-cloud/image/upload/v1507798302/daniaja/10788-ryzen-power-campaign-imagery-1260x709.jpg',
            'http://res.cloudinary.com/nusantara-cloud/image/upload/v1507798302/daniaja/24301-ryzen3-pib-1260x709_0.jpg',
            'http://res.cloudinary.com/nusantara-cloud/image/upload/v1507798301/daniaja/734546229001_5371716434001_5371613458001-vs.jpg',
            'http://res.cloudinary.com/nusantara-cloud/image/upload/v1507779316/daniaja/AB54875.jpg',
            'http://res.cloudinary.com/nusantara-cloud/image/upload/v1507796909/daniaja/AMD-Polaris-10-and-Polaris-11-Radeon-RX-480-RX-470-RX-460-GPUs_5.jpg',
            'http://res.cloudinary.com/nusantara-cloud/image/upload/v1507796909/daniaja/AMD-Radeon-RX-Vega-64-Reference.jpg',
            'http://res.cloudinary.com/nusantara-cloud/image/upload/v1507798303/daniaja/badge-7th-gen-core-family-left-facing.png'
        ];
    }
    getImages() {
        return Promise.resolve({
            status: true,
            data: this.images.map((url, idx) => {
                return { url, filename: '' + idx };
            }).reverse()
        });
    }
    deleteImage(filename) {
        const idx = parseInt(filename);
        if (util_1.isNumber(idx) || idx >= this.images.length || idx < 0) {
            this.images.splice(this.images.length - idx - 1, 1);
            return Promise.resolve({ status: true });
        }
        else {
            return Promise.reject('Failed to delete image because filename is unexpected!');
        }
    }
    // No matter what image is uploaded, the same one is returned
    uploadImage() {
        const filename = '' + this.images.length;
        const url = 'http://res.cloudinary.com/nusantara-cloud/image/upload/v1507798303/daniaja/amd-ryzen-pricing-100713729-orig.jpg';
        this.images.unshift(url);
        return Promise.resolve({
            status: true,
            data: { url, filename }
        });
    }
}
exports.default = MockModel;
