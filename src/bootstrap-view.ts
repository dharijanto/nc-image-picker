var $ = require('jquery')
import View = NCImagePicker.View
import ImageObject = NCImagePicker.ImageObject

/*
This is the view implemented using bootstrap 3. Can be easily swapped
out in order to implement better-looking gallery. I'm not a designer and
this is only used for internal purposes, so I haven't bothered implementing
better-looking UI. Feel free to submit PR, though :)
*/
export default class BootstrapBasedView implements View {
  // Static HTML elements
  private uploadButton = $(`
    <div>
      <button class="btn btn-success">Upload File</button>
    </div>`)
  private modalUpload = $(`
    <div class="modal fade" role="dialog" style="overflow-y:auto;">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal">&times;</button>
            <h4 class="modal-title">Modal Upload File</h4>
          </div>
          <div class="modal-body">
            <p>Below is the button to upload file : </p>
            <form>
              <div class="form-group">
                <label for="uploadbutton">Upload File:</label>
                <input id="fileupload" type="file" name="image[]" >
              </div>
            </form>
            <div class="modal-footer">
              <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>`)
  private imagesContainer = $('<div class="row"></div>')
  private mainModal = $(`
    <div class="modal fade" role="dialog" style="overflow-y:auto;">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal">&times;</button>
            <h4 class="modal-title">Upload Image</h4>
          </div>
          <div class="modal-body" style="display: relative">
            </div>
            <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
            <button id="btn-load-more" type="button" class="btn btn-primary"> Load More </button>
          </div>
        </div>
      </div>
    </div>
    `)
  private modalDelete = $(
    `<div class="modal fade" role="dialog" style="overflow-y:auto;">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal">&times;</button>
            <h4 class="modal-title">Modal Delete</h4>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to delete this picture?</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-danger btn-delete">YES</button>
            <button type="button" class="btn btn-default" data-dismiss="modal">NO</button>
          </div>
        </div>
      </div>
    </div>`)
    private modalDeleteCompleted = $(`
      <div class="modal fade" role="dialog" style="overflow-y:auto;">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal">&times;</button>
              <h4 class="modal-title">Modal Delete Successful</h4>
            </div>
            <div class="modal-body">
              <p class="text-center">Your image has been deleted.</p>
            </div>
            <div class="modal-footer" style="text-align:center">
              <button type="button" class="btn btn-default" data-dismiss="modal">Back to Image Gallery</button>
            </div>
          </div>
        </div>
      </div>`)
    private modalDeleteFailed = $(`
      <div class="modal fade" role="dialog" style="overflow-y:auto;">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal">&times;</button>
              <h4 class="modal-title">Modal Delete Failed</h4>
            </div>
            <div class="modal-body">
              <p class="text-center">Internal Server Error!</p>
            </div>
            <div class="modal-footer" style="text-align:center">
              <button type="button" class="btn btn-default" data-dismiss="modal">Back to Image Gallery</button>
            </div>
          </div>
        </div>
      </div>`)
  private modalUploadSuccess = $(`
    <div class="modal fade" role="dialog" style="overflow-y:auto;">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal">&times;</button>
            <h4 class="modal-title">Modal Upload File Success</h4>
          </div>
          <div class="modal-body">
            <div class="info_result text-center hidden">
              <p>Image Uploaded Successfully!</p>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>`)
    private modalUploadFailed = $(`
      <div class="modal fade" role="dialog">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal">&times;</button>
              <h4 class="modal-title">Modal Upload File Failed</h4>
            </div>
            <div class="modal-body">
              <div class="info_result text-center">
                <p class="text_message_failed">Failed upload your file !</p>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>`)

  private rootElement
  private onDeleteClicked
  private onLoadMoreClicked
  private onUploadClicked
  private onImageClicked
  private currentPublicId
  private currentImageThumbnail

  constructor (rootElement) {
    const self = this
    this.rootElement = rootElement

    $(this.uploadButton).on('click', (e) => {
      this.modalUpload.modal('show')
    })

    $('body').append(this.mainModal)
    this.mainModal.find('div.modal-body').append(this.uploadButton)
    this.mainModal.find('div.modal-body').append(this.imagesContainer)

    this.mainModal.on('click', function (event) {
      const elementId = event.target.id
      if (elementId === 'btn-load-more') {
        self.onLoadMoreClicked()
      }
    })

    // Modal section
    this.currentPublicId = ''
    this.currentImageThumbnail = ''
    $(this.modalDelete).find('button.btn-delete').on('click', (e) => {
      this.onDeleteClicked(this.currentPublicId).then(resp => {
        if (resp.status) {
          this.currentImageThumbnail.remove()
          this.modalDeleteCompleted.modal('show')
          this.modalDelete.modal('hide')
        } else {
          this.modalDelete.modal('hide')
          this.modalDeleteFailed.modal('show')
        }
      }).catch(err => {
        console.error(err)
        this.modalDelete.modal('hide')
        this.modalDeleteFailed.modal('show')
      })
    })
  }

  initializeElement (onDeleteClicked, onLoadMoreClicked, onUploadClicked, onImageClicked) {
    const self = this
    $(this.rootElement).on('click', (e) => {
      this.mainModal.modal('show')
    })

    this.onDeleteClicked = onDeleteClicked
    this.onLoadMoreClicked = onLoadMoreClicked
    this.onUploadClicked = onUploadClicked
    this.onImageClicked = onImageClicked
    this.initializeModal()

    this.modalUpload.on('change', (e) => {
      var uploadFile = e.target['files'][0]
      self.onUploadClicked(uploadFile).then(resp => {
        if (resp.status) {
          var linkpicture = resp.data

          $(this.modalUploadSuccess).find('.result_image_text').val(linkpicture.url)
          $(this.modalUploadSuccess).find('.result_image').attr('src', linkpicture.url)
          $(this.modalUploadSuccess).find('.info_result').removeClass('hidden')
          this.modalUpload.modal('hide')
          this.modalUploadSuccess.modal('show')
        } else {
          if (resp.errMessage) {
            $(this.modalUploadFailed).find('.text_message_failed').text(resp.errMessage)
          } else {
            $(this.modalUploadFailed).find('.text_message_failed').text('Internal Server Error !')
          }
          this.modalUpload.modal('hide')
          this.modalUploadFailed.modal('show')
        }
      })
    })
  }

  private initializeModal () {
    $('body').append(this.modalUpload)
    $('body').append(this.modalDelete)
    $('body').append(this.modalDeleteCompleted)
  }

  appendImage (image: ImageObject, addToEnd = false) {
    var imageURL = image.url
    var imageFilename = image.filename

    var imageContainer = $('<div class="gallery_product col-md-4 filter hdpe" style="margin-top:15px;height:30%"></div>')
    var textImage = $('<div class="text-center textImage" style=""></div>')
    var overlayImage = $('<div class="overlay"> </div>')
    var imageSrc = $('<img src="' + imageURL + '" class="img-responsive" style="height: 200px; max-height: 100%; margin: auto">')
    var btnDeleteImage = $(`<div class="btn btn-danger btn-close" style="float:right" data-public-id="${imageFilename}"> <span>X</span> </div>`)
    btnDeleteImage.on('click', () => {
      this.modalDelete.modal('show')
    })
    var imageHref = $(`<a href="javascript:void(0);" class="data-image-url" data-url="${imageURL}" data-public-id="${imageFilename}">Select Image</a>`)

    textImage.append(imageHref)
    overlayImage.append(btnDeleteImage)
    overlayImage.append(textImage)
    imageContainer.append(imageSrc)
    imageContainer.append(overlayImage)

    if (addToEnd) {
      this.imagesContainer.append(imageContainer)
    } else {
      this.imagesContainer.prepend(imageContainer)
    }

    $(imageHref).on('click', (e) => {
      var imageURL = imageHref.data('url')
      var imagePublicId = imageHref.data('public-id')
      this.onImageClicked(imageURL, imagePublicId)
    })

    $(btnDeleteImage).on('click', (e) => {
      this.currentImageThumbnail = $(e.currentTarget).parent().parent()
      this.currentPublicId = $(e.currentTarget).data('public-id')
    })
  }
}
