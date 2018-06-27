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
    public_id: string
  }
  type ImageSelectedCallback = (uploadedImageURL: ImageURL, uploadedImageId: string) => void
  type ImageDeleteClicked = (publicId: string) => Promise<NCResponse<null>>
  type ImageUploadClicked = (imageData: any) => Promise<NCResponse<ImageURL>>
  type ImageLoadMore = () => void

  interface ViewConstructor {
    new (rootElement: JQuery.Node): View
  }

  interface View {
    initializeElement (onDeleteClicked: ImageDeleteClicked,
      onLoadMoreClicked: ImageLoadMore,
      onUploadClicked: ImageUploadClicked,
      onImageSelected: ImageSelectedCallback)
    appendImage (data: ImageObject, appendOrPrepend: boolean)
    setLoadMoreButtonVisible(visible: boolean)
  }

  interface Config {
    callbackFn: ImageSelectedCallback
    postURL: string
    getURL: string
    deleteURL: string
    useMockModel?: boolean
    customView?: ViewConstructor
  }
}

interface JQuery {
  NCImagePicker: (config: NCImagePicker.Config) => void
}
