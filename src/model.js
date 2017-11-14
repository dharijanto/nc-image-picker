var axios = require('axios')
var Promise = require('bluebird')
const axiosFileupload = require('axios-fileupload')

class Model {
  constructor (postURL, getURL, deleteURL) {
    this._postURL = postURL
    this._getURL = getURL
    this._deleteURL = deleteURL
  }

  getImages (nextCursor = '') {
    return new Promise((resolve, reject) => {
      axios.get(this._getURL + '?nextCursor=' + nextCursor)
      .then(function (response) {
        resolve(response)
      })
      .catch(function (err) {
        reject(err)
      })
    })
  }

  deleteImage (publicId) {
    return new Promise((resolve, reject) => {
      axios.get(this._deleteURL + '?publicId=' + publicId)
      .then(response => {
        resolve(response)
      })
      .catch(function (err) {
        reject(err)
      })
    })
  }

  uploadImage (image) {
    return new Promise((resolve, reject) => {
      axiosFileupload(this._postURL, image).then(resp => {
        if (resp.data.status) {
          resolve({status: true,
            data: {
              url: resp.data.data.url,
              public_id: resp.data.data.public_id,
              original_name: resp.data.data.originalName,
              created_at: resp.data.data.created_at
            }}
          )
        } else {
          resolve({status: false, errMessage: resp.data.errMessage})
        }
      }).catch(function (err) {
        reject(err)
      })
    })
  }
}

module.exports = Model
