var $ = require('jquery')

$.fn.NCImagePicker = function ({callbackFn, postURL, getURL, deleteURL}) {
  const divImage = this
  const Model = require('../mod-nc-image-picker/src/model.js')
  const View = require('../mod-nc-image-picker/src/view.js')
  const Presenter = require('./src/presenter.js')

  var model = new Model(postURL, getURL, deleteURL)
  var view = new View(divImage)
  var presenter = new Presenter(view, model)

  presenter.initializeElement(callbackFn)
}
