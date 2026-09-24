// Custom Turbopack loader for inlining small SVGs as data URIs
const { optimize } = require('svgo')
const svgToMiniDataURI = require('mini-svg-data-uri')
const { imageSize } = require('image-size')

module.exports = function (content) {
  this.cacheable?.()

  const optimized = optimize(content)
  const src = svgToMiniDataURI(optimized.data)
  const { width, height } = imageSize(Buffer.from(content))
  const result = { src, width, height }

  return `export default ${JSON.stringify(result)};`
}
