var Promise = require('bluebird')

class PresenterController {
  constructor (view, model) {
    this._model = model
    this._view = view
    this._nextCursor = null
  }

  initializeElement (callbackFn) {
    this._view.initializeElement(this._deleteButtonClicked.bind(this), this._loadMoreClicked.bind(this), this._uploadClicked.bind(this), callbackFn)
    this._getImages()
  }

  _getImages (nextCursor = '') {
    return this._model.getImages(nextCursor).then(resp => {
      if (resp.status) {
        this._nextCursor = resp.data.data.next_cursor
        resp.data.data.resources.forEach((data) => {
          this._view.appendImage(data)
        })
        if (resp.data.data.next_cursor) {
          this._view.loadMoreButtonVisible(resp.data.data.next_cursor)
        } else {
          this._view.loadMoreButtonVisible(false)
        }
      } else {
        alert('Whoops!! Image is not loaded properly.')
      }
    }).catch(function (err) {
      alert('Image failed to load. Internal server error.')
    })
  }

  _deleteButtonClicked (publicId) {
    return new Promise((resolve, reject) => {
      this._model.deleteImage(publicId).then(resp => {
        if (resp.status) {
          resolve(resp)
        } else {
          reject(resp)
        }
      }).catch(function (err) {
        reject(err)
      })
    })
  }

  _loadMoreClicked () {
    this._getImages(this._nextCursor)
  }

  _uploadClicked (image) {
    return new Promise((resolve, reject) => {
      this._model.uploadImage(image).then(resp => {
        if (resp.status) {
          resolve(resp)
        } else {
          reject(resp)
        }
      })
    })
  }
}

module.exports = PresenterController
