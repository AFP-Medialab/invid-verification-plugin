## Details

By default, the export takes into account the current screen pixel density so that the image is of the same quality of the screen.  If the `maxWidth` or `maxHeight` options are specified, then the screen pixel density is ignored so that the image can fit in the specified dimensions.

<span class="important-indicator"></span> Specifying `output:'blob-promise'` is the only way to make this function non-blocking.  Other outputs may hang the browser until finished, especially for a large image.

<span class="important-indicator"></span> The JPEG format is lossy, whereas PNG is not.  This means that `cy.jpg()` is useful for cases where filesize is more important than pixel-perfect images.  JPEG compression will make your images (especially edge lines) blurry and distorted.


## Examples

```js
var jpg64 = cy.jpg();

// put the png data in an img tag
document.querySelector('#jpg-eg').setAttribute('src', jpg64);
```

Example image tag:

<img id="jpg-eg"></img>
