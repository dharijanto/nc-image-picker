"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jquery = require("jquery");
const presenter_1 = require("./src/presenter");
const network_model_1 = require("./src/network-model");
const mock_model_1 = require("./src/mock-model");
const bootstrap_view_1 = require("./src/bootstrap-view");
jquery.fn.NCImagePicker = function (config) {
    const rootElement = this;
    var Model = config.useMockModel ? mock_model_1.default : network_model_1.default;
    const View = config.customView || bootstrap_view_1.default;
    var model = new Model(config.postURL, config.getURL, config.deleteURL);
    var view = new View(rootElement);
    var presenter = new presenter_1.default(view, model, config.numImagesPerLoad);
    presenter.initializeElement(config.callbackFn);
};
