import * as jquery from 'jquery'
import Presenter from './src/presenter'
import NetworkModel from './src/network-model'
import MockModel from './src/mock-model'
import BootstrapBasedView from './src/bootstrap-view'

import Config = NCImagePicker.Config

jquery.fn.NCImagePicker = function (config: Config) {
  const rootElement = this
  var Model = config.useMockModel ? MockModel : NetworkModel
  const View = config.customView || BootstrapBasedView

  var model = new Model(config.postURL, config.getURL, config.deleteURL)
  var view = new View(rootElement)
  var presenter = new Presenter(view, model, config.numImagesPerLoad)

  presenter.initializeElement(config.callbackFn)
}
