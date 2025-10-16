// src/components/admin/ImageCropper.js
import React, { useState, useRef } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import './ImageCropper.css';

function ImageCropper({ file, onCropComplete, onCancel }) {
  const [crop, setCrop] = useState({
    aspect: 16 / 9,
    unit: '%',
    width: 80,
    height: 45,
    x: 10,
    y: 10,
  });
  const imgRef = useRef(null);

  function handleCrop() {
    if (!imgRef.current || !crop.width || !crop.height) {
      console.error('Missing image reference or invalid crop dimensions');
      return;
    }

    const image = imgRef.current;
    const {
      naturalWidth,
      naturalHeight,
      width: displayedWidth,
      height: displayedHeight,
    } = image;

    const scaleX = naturalWidth / displayedWidth;
    const scaleY = naturalHeight / displayedHeight;

    let pixelX, pixelY, pixelW, pixelH;

    if (crop.unit === '%') {
      pixelX = Math.round((crop.x / 100) * naturalWidth);
      pixelY = Math.round((crop.y / 100) * naturalHeight);
      pixelW = Math.round((crop.width / 100) * naturalWidth);
      pixelH = Math.round((crop.height / 100) * naturalHeight);
    } else {
      pixelX = Math.round(crop.x * scaleX);
      pixelY = Math.round(crop.y * scaleY);
      pixelW = Math.round(crop.width * scaleX);
      pixelH = Math.round(crop.height * scaleY);
    }

    const canvas = document.createElement('canvas');
    canvas.width = pixelW;
    canvas.height = pixelH;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      pixelX,
      pixelY,
      pixelW,
      pixelH,
      0,
      0,
      pixelW,
      pixelH
    );

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          console.error('Canvas to Blob conversion failed');
          return;
        }
        onCropComplete(blob);
      },
      file.type || 'image/jpeg',
      0.95
    );
  }

  return (
    <div className="cropper-container">
      <h3>Crop Image</h3>
      <ReactCrop crop={crop} onChange={(newCrop) => setCrop(newCrop)}>
        <img
          ref={imgRef}
          src={URL.createObjectURL(file)}
          style={{ maxWidth: '100%', maxHeight: '500px' }}
          onLoad={() => console.log('Image loaded, ref set')}
          alt="To be cropped"
        />
      </ReactCrop>
      <div className="button-group">
        <button className="cancel-btn" onClick={onCancel}>
          Cancel
        </button>
        <button className="crop-btn" onClick={handleCrop}>
          Crop
        </button>
      </div>
    </div>
  );
}

export default ImageCropper;
