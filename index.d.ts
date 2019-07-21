// Type definitions for NCImagePicker 1.2
// Project: https://github.com/nusantara-cloud/nc-input-library
// Definitions by: Denny Harijanto <https://github.com/nusantara-cloud>
// TypeScript Version: 2.9

/// <reference types="jquery" />
/// <reference types="bluebird" />

declare namespace NCImagePicker {
  interface NCResponse<T> {
    status: boolean
    data?: T
    errMessage?: string
    errCode?: number
  }

  type ImageURL = string
  interface ImageObject {
    url: ImageURL
    thumbnailURL?: ImageURL
    filename: string
  }
  type ImageSelectedCallback = (uploadedImageURL: ImageURL, uploadedImageId: string) => void
  type ImageDeleteClicked = (filename: string) => Promise<NCResponse<null>>
  type ImageUploadClicked = (imageBinaryData: string) => Promise<NCResponse<ImageURL>>
  type ImageLoadMore = () => Promise<NCResponse<ImageObject[]>>

  interface ViewConstructor {
    new (rootElement: JQuery.Node): View
  }

  interface NCResponse<T> {
    status: boolean,
    data?: T,
    errMessage?: string
    errCode?: number
  }

  interface View {
    initializeElement (
      onDeleteClicked: ImageDeleteClicked,
      onLoadMoreClicked: ImageLoadMore,
      onUploadClicked: ImageUploadClicked,
      onImageSelected: ImageSelectedCallback)
    appendImage (data: ImageObject, addToEnd?: boolean)
  }

  interface Model {
    getImages (): Promise<NCResponse<ImageObject[]>>
    deleteImage (filename: string): Promise<NCResponse<null>>
    uploadImage (imageBinaryData: string): Promise<NCResponse<ImageObject>>
  }

  interface Config {
    callbackFn: ImageSelectedCallback
    postURL: string
    getURL: string
    deleteURL: string
    useMockModel?: boolean
    customView?: ViewConstructor
    numImagesPerLoad?: number
  }
}

interface JQuery {
  NCImagePicker: (config: NCImagePicker.Config) => void
}
