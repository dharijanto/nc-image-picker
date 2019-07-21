# Nusantara-Cloud's Image Picker
Is a simple and straight-forward image picker library for retrieving, uploading, and deleting images from an image gallery.

## Screenshot

## Usage
From the backend side, there are 3 REST API endpoints the need to be implemented:
### End-point for Retrieveing All Images
This is a GET an point that returns JSON data in the following format:
```
NCResponse<ImageObject[]>
```
When the optional thumbanailURL is provided, the gallery will use it for the thumbanil.
This is useful to save on bandwidth and improve load time.

### End-point for Uploading an Image
This is a POST endpoint that expects the image in terms of ```multipart/form-data```
with the image identified by key ```file```

For NodeJS-based server, it can be easily implemented using multer library. (see: https://www.npmjs.com/package/multer)

### End-point for Deleting an Image
This is a POST endpoint that expects a JSON data with the following format:
```
{ filename: 'image to be deleted' }
```
Where filename is the one returned when retrieving all the images.