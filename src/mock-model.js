var axios = require('axios')
var Promise = require('bluebird')

const axiosFileupload = require('axios-fileupload')

var imageData = require('./imageData.json')

class Model {
  constructor (postURL, getURL, deleteURL) {
    console.log('Construcot MockModel')
    this._postURL = postURL
    this._getURL = getURL
    this._deleteURL = deleteURL
  }

  getImages (nextCursor = '') {
    return new Promise((resolve, reject) => {
      resolve(imageData)
    })
  }

  deleteImage (publicId) {
    return new Promise((resolve, reject) => {
      resolve({status: true})
      // resolve({status: false})
    })
  }

  uploadImage (image) {
    return new Promise((resolve, reject) => {
      resolve({
        status: true,
        data: {
          url: '/img/amdpicture.jpg',
          public_id: 'amd_pic',
          original_name: 'AMD Picture Game',
          created_at: '2017-01-01'
        }
      })
    })
  }
}

module.exports = Model
