var $ = require('jquery')
var Presenter = require('./src/presenter.js')
var DefaultModel = require('./src/model.js')
var MockModel = require('./src/mock-model.js')
var DefaultView = require('./src/view.js')

$.fn.NCImagePicker = function ({callbackFn, postURL, getURL, deleteURL, useMockModel = false, customView}) {
  const divImage = this
  var Model = useMockModel ? MockModel : DefaultModel
  const View = customView || DefaultView

  var model = new Model(postURL, getURL, deleteURL)
  var view = new View(divImage)
  var presenter = new Presenter(view, model)

  presenter.initializeElement(callbackFn)
}
