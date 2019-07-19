var jquery = require('jquery')
var Presenter = require('./src/presenter.js')
import NetworkModel from './src/network-model'
import MockModel from './src/mock-model'
var DefaultView = require('./src/view.js')

jquery.fn.NCImagePicker = function ({callbackFn, postURL, getURL, deleteURL, useMockModel = false, customView}) {
  const rootElement = this
  var Model = useMockModel ? MockModel : NetworkModel
  const View = customView || DefaultView

  var model = new Model(postURL, getURL, deleteURL)
  var view = new View(rootElement)
  var presenter = new Presenter(view, model)

  presenter.initializeElement(callbackFn)
}
