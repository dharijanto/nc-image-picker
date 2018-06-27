var $ = require('jquery')

class View {
  constructor (divId) {
    const self = this
    this._rootElement = divId
    this._UploadandViewGallery = $('<div> <button class="btn btn-success" data-toggle="modal" data-target="#___fileupload">Upload File</button> </div>')
    this._imageInitialization = $('<div class="row"></div>')

    this._modalContentImage = $('<div id="modalUpload" class="modal fade" role="dialog" style="overflow-y:auto;"> <div class="modal-dialog"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal">&times;</button> <h4 class="modal-title">Modal Upload Image</h4> </div> <div class="modal-body"></div> <div class="modal-footer"> <button type="button" class="btn btn-default" data-dismiss="modal">Close</button> </div></div></div></div>')
    $('body').append(this._modalContentImage)
    this._modalContentImage.find('div.modal-body').append(this._UploadandViewGallery)
    this._modalContentImage.find('div.modal-body').append(this._imageInitialization)
    this._buttonNextCursor = $('<button class="btn btn-primary" data-next="">LOAD MORE</button>')
    this._linkInsideTextImage = $('<a href="javascript:void(0);" class="data-image-url" data-url="">Click to trigger Callback !!</a>')

    this._buttonNextCursor.on('click', (e) => {
      this._onLoadMoreClicked()
    })

    // Modal section
    this._modalDelete = $('<!-- Modal Delete File--><div id="___deletepicture" class="modal fade" role="dialog"> <div class="modal-dialog"> <!-- Modal content--> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal">&times;</button> <h4 class="modal-title">Modal Delete</h4> </div> <div class="modal-body"> <p>Are you sure you want to delete this picture?</p> </div> <div class="modal-footer"> <button type="button" class="btn btn-danger btn-delete">YES</button> <button type="button" class="btn btn-default" data-dismiss="modal">NO</button> </div> </div> </div></div>')
    this._modalDeleteCompleted = $('<div class="modal fade" role="dialog"> <div class="modal-dialog"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal">&times;</button> <h4 class="modal-title">Modal Delete Successful</h4> </div><div class="modal-body"> <p class="text-center">Your image has been deleted.</p></div><div class="modal-footer" style="text-align:center"> <button type="button" class="btn btn-default" data-dismiss="modal">Back to Image Gallery</button> </div></div></div></div>')
    this._modalDeleteFailed = $('<div class="modal fade" role="dialog"> <div class="modal-dialog"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal">&times;</button> <h4 class="modal-title">Modal Delete Failed</h4> </div><div class="modal-body"> <p class="text-center">Internal Server Error!</p></div><div class="modal-footer" style="text-align:center"> <button type="button" class="btn btn-default" data-dismiss="modal">Back to Image Gallery</button> </div></div></div></div>')
    this._modalUpload = $('<!-- Modal Upload File--><div id="___fileupload" class="modal fade" role="dialog"> <div class="modal-dialog"> <!-- Modal content--> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal">&times;</button> <h4 class="modal-title">Modal Upload File</h4> </div> <div class="modal-body"> <p>Below is the button to upload file : </p> <form><div class="form-group"><label for="uploadbutton">Upload File:</label><input id="fileupload" type="file" name="image[]" ></div> </form>  <div class="modal-footer"> <button type="button" class="btn btn-default" data-dismiss="modal">Close</button> </div> </div> </div></div>')
    this._modalUploadSuccess = $('<div id="___fileuploadsuccess" class="modal fade" role="dialog"> <div class="modal-dialog"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal">&times;</button> <h4 class="modal-title">Modal Upload File Success</h4> </div><div class="modal-body"> <div class="info_result text-center hidden"> <p>Success upload your file ! Below is your link : </p> <!-- <img src="" class="img-responsive result_image" style="margin:0 auto;"> <input type="text" readonly value="" class="form-control result_image_text"> --> </div></div><div class="modal-footer"> <button type="button" class="btn btn-default" data-dismiss="modal">Close</button> </div></div></div></div>')
    this._modalUploadFailed = $('<div id="___fileuploadfailed" class="modal fade" role="dialog"> <div class="modal-dialog"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal">&times;</button> <h4 class="modal-title">Modal Upload File Failed</h4> </div><div class="modal-body"> <div class="info_result text-center"> <p class="text_message_failed">Failed upload your file !</p></div></div><div class="modal-footer"> <button type="button" class="btn btn-default" data-dismiss="modal">Close</button> </div></div></div></div>')

    this._publicId = ''
    this._imgThumbnail = ''
    $(this._modalDelete).find('button.btn-delete').on('click', (e) => {
      this._onDeleteClicked(this._publicId).then(resp => {
        if (resp.status) {
          this._imgThumbnail.remove()
          this._modalDeleteCompleted.modal('show')
          this._modalDelete.modal('hide')
        } else {
          this._modalDelete.modal('hide')
          this._modalDeleteFailed.modal('show')
        }
      }).catch(err => {
        console.error(err)
        self._modalDelete.modal('hide')
        self._modalDeleteFailed.modal('show')
      })
    })
  }

  initializeElement (onDeleteClicked, onLoadMoreClicked, onUploadClicked, callbackFn) {
    const self = this
    $(this._rootElement).on('click', (e) => {
      this._modalContentImage.modal('show')
    })

    this._onDeleteClicked = onDeleteClicked
    this._onLoadMoreClicked = onLoadMoreClicked
    self._onUploadClicked = onUploadClicked
    this._callbackFn = callbackFn
    this._initializeModal()

    this._modalUpload.on('change', (e) => {
      var uploadFile = e.target.files[0]
      self._onUploadClicked(uploadFile).then(resp => {
        if (resp.status) {
          var linkpicture = resp.data

          $(this._modalUploadSuccess).find('.result_image_text').val(linkpicture.url)
          $(this._modalUploadSuccess).find('.result_image').attr('src', linkpicture.url)
          $(this._modalUploadSuccess).find('.info_result').removeClass('hidden')
          this.appendImage(linkpicture, 1)
          this._modalUpload.modal('hide')
          this._modalUploadSuccess.modal('show')
        } else {
          if (resp.errMessage) {
            $(this._modalUploadFailed).find('.text_message_failed').text(resp.errMessage)
          } else {
            $(this._modalUploadFailed).find('.text_message_failed').text('Internal Server Error !')
          }
          this._modalUpload.modal('hide')
          this._modalUploadFailed.modal('show')
        }
      })
    })
  }

  _initializeModal () {
    $('body').append(this._modalUpload)
    $('body').append(this._modalDelete)
    $('body').append(this._modalDeleteCompleted)
  }

  appendImage (dataImage, latest = false) {
    var imageURL = dataImage.url
    var imagePublicId = dataImage.public_id

    var imageData = $('<div class="gallery_product col-md-4 filter hdpe" style="margin-top:15px;height:30%"></div>')
    var textImage = $('<div class="text-center textImage" style=""></div>')
    var overlayImage = $('<div class="overlay" > </div>')
    var imageSrc = $('<img src="' + imageURL + '" class="img-responsive" style="max-height:100%">')
    var btnDeleteImage = $(`<div class="btn btn-danger btn-close" style="float:right" data-toggle="modal" data-target="#___deletepicture" data-public-id="'${imagePublicId}'"> <span>X</span> </div>`)
    var imageHref = $(`<a href="javascript:void(0);" class="data-image-url" data-url="${imageURL}" data-public-id="${imagePublicId}">Select Image</a>`)

    textImage.append(imageHref)
    overlayImage.append(btnDeleteImage)
    overlayImage.append(textImage)
    imageData.append(imageSrc)
    imageData.append(overlayImage)

    if (latest === false) {
      this._imageInitialization.append(imageData)
    } else {
      this._imageInitialization.prepend(imageData)
    }

    $(imageHref).on('click', (e) => {
      var imageURL = imageHref.data('url')
      var imagePublicId = imageHref.data('public-id')
      this._callbackFn(imageURL, imagePublicId)
    })

    $(btnDeleteImage).on('click', (e) => {
      this._imgThumbnail = $(e.currentTarget).parent().parent()
      this._publicId = $(e.currentTarget).data('public-id')
    })
  }

  setLoadMoreButtonVisible (dataCursor) {
    if (dataCursor === false) {
      this._buttonNextCursor.parent().empty()
    } else {
      this._buttonNextCursor.attr('data-next', dataCursor)
      var divNextCursor = $('<div class="text-center"></div>')
      divNextCursor.append(this._buttonNextCursor)
      this._modalContentImage.find('div.modal-body').append(divNextCursor)
    }
  }
}

module.exports = View
