var axios = require('axios')
var FormData = require('form-data')
var Promise = require('bluebird')

class Model {
  _fileUpload (url, file, name = 'file') {
    if (typeof url !== 'string') {
      throw new TypeError(`Expected a string, got ${typeof url}`)
    }
    const formData = new FormData()
    formData.append(name, file)
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      },
      withCredentials: true
    }
    return axios.post(url, formData, config)
  }

  constructor (postURL, getURL, deleteURL) {
    this._postURL = postURL
    this._getURL = getURL
    this._deleteURL = deleteURL
  }

  getImages (nextCursor = '') {
    return new Promise((resolve, reject) => {
      axios.get(this._getURL + '?nextCursor=' + nextCursor).then(function (response) {
        resolve(response.data)
      }).catch(function (err) {
        reject(err)
      })
    })
  }

  deleteImage (filename) {
    return new Promise((resolve, reject) => {
      axios.post(this._deleteURL, {filename}).then(response => {
        resolve(response)
      }).catch(function (err) {
        reject(err)
      })
    })
  }

  uploadImage (image) {
    return new Promise((resolve, reject) => {
      this._fileUpload(this._postURL, image).then(resp => {
        resolve(resp.data)
      }).catch(err => {
        reject(err)
      })
    })
  }
}

module.exports = Model
