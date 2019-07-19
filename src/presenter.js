var Promise = require('bluebird')

class Presenter {
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
        this._nextCursor = resp.data.next_cursor
        resp.data.forEach((data) => {
          this._view.appendImage(data)
        })
        if (resp.data.next_cursor) {
          this._view.setLoadMoreButtonVisible(resp.data.next_cursor)
        } else {
          this._view.setLoadMoreButtonVisible(false)
        }
      } else {
        alert('Error loading image: ' + resp.errMessage)
        console.error(resp.errMessage)
      }
    }).catch(err => {
      console.error(err)
      alert('Error loading image: internal error')
    })
  }

  _deleteButtonClicked (filename) {
    return new Promise((resolve, reject) => {
      this._model.deleteImage(filename).then(resp => {
        resolve(resp)
      }).catch(function (err) {
        reject(err)
      })
    })
  }

  _loadMoreClicked () {
    this._getImages(this._nextCursor)
  }

  _uploadClicked (imageBinaryData) {
    return new Promise((resolve, reject) => {
      if (imageBinaryData) {
        this._model.uploadImage(imageBinaryData).then(resp => {
          resolve(resp)
        }).catch(err => {
          reject(err)
        })
      } else {
        resolve({status: false, data: {errMessage: 'Please select the upload picture'}})
      }
    })
  }
}

module.exports = Presenter
