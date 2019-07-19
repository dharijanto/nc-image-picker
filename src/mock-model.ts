import Model = NCImagePicker.Model
import NCResponse = NCImagePicker.NCResponse
import ImageObject = NCImagePicker.ImageObject
import { isNumber } from "util";

export default class MockModel implements Model {
  // Array of static images for testing-purposes
  private images = [
    'http://res.cloudinary.com/nusantara-cloud/image/upload/v1507798302/daniaja/10788-ryzen-power-campaign-imagery-1260x709.jpg',
    'http://res.cloudinary.com/nusantara-cloud/image/upload/v1507798302/daniaja/24301-ryzen3-pib-1260x709_0.jpg',
    'http://res.cloudinary.com/nusantara-cloud/image/upload/v1507798301/daniaja/734546229001_5371716434001_5371613458001-vs.jpg',
    'http://res.cloudinary.com/nusantara-cloud/image/upload/v1507779316/daniaja/AB54875.jpg',
    'http://res.cloudinary.com/nusantara-cloud/image/upload/v1507796909/daniaja/AMD-Polaris-10-and-Polaris-11-Radeon-RX-480-RX-470-RX-460-GPUs_5.jpg',
    'http://res.cloudinary.com/nusantara-cloud/image/upload/v1507796909/daniaja/AMD-Radeon-RX-Vega-64-Reference.jpg',
    'http://res.cloudinary.com/nusantara-cloud/image/upload/v1507798303/daniaja/badge-7th-gen-core-family-left-facing.png'
  ]

  getImages (): Promise<NCResponse<ImageObject[]>> {
    return Promise.resolve({
      status: true,
      data: this.images.map((url, idx) => {
        return { url, filename: '' + idx }
      }).reverse()
    })
  }

  deleteImage (filename: string): Promise<NCResponse<null>> {
    const idx = parseInt(filename)
    if (isNumber(idx) || idx >= this.images.length || idx < 0) {
      this.images.splice(this.images.length - idx - 1, 1)
      return Promise.resolve({ status: true })
    } else {
      return Promise.reject('Failed to delete image because filename is unexpected!')
    }
  }

  // No matter what image is uploaded, the same is 
  uploadImage (): Promise<NCResponse<ImageObject>> {
    const filename = '' + this.images.length
    const url = 'http://res.cloudinary.com/nusantara-cloud/image/upload/v1507798303/daniaja/amd-ryzen-pricing-100713729-orig.jpg'
    this.images.unshift(url)

    return Promise.resolve({
      status: true,
      data: { url, filename }
    })
  }
}
