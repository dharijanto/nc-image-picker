import axios from 'axios'
import * as FData from 'form-data'

import Model = NCImagePicker.Model
import NCResponse = NCImagePicker.NCResponse
import ImageObject = NCImagePicker.ImageObject

export default class NetworkModel implements Model {
  private postURL: string
  private getURL: string
  private deleteURL: string
  constructor (postURL, getURL, deleteURL) {
    this.postURL = postURL
    this.getURL = getURL
    this.deleteURL = deleteURL
  }

  getImages (): Promise<NCResponse<ImageObject[]>> {
    return axios.get(this.getURL).then(function (response) {
      return response.data
    })
  }

  deleteImage (filename: string): Promise<NCResponse<null>> {
    return axios.post(this.deleteURL, {filename}).then(rawResp => {
      const resp = rawResp.data
      if (resp.status) {
        return { status: true }
      } else {
        throw new Error(resp.errMessage)
      }
    })
  }

  private uploadFile (url: string, binaryData: any, name = 'file') {
    if (typeof url !== 'string') {
      throw new TypeError(`Expected a string, got ${typeof url}`)
    }
    const formData = new FData()
    formData.append(name, binaryData)
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      },
      withCredentials: true
    }
    // TODO: Should we .data the result? Cos axios returned data is wrapped under 'data' field, isn't it?
    return axios.post(url, formData, config).then(rawResp => {
      const resp = rawResp.data
      if (resp.status) {
        return resp
      } else {
        throw new Error('Failed to upload image: ' + resp.errMessage)
      }
    })
  }

  uploadImage (imageBinaryData): Promise<NCResponse<ImageObject>> {
    return this.uploadFile(this.postURL, imageBinaryData)
  }
}
