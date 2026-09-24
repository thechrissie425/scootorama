/**
 * SvgIcon - A component for rendering monochrome SVG icons using CSS masking
 *
 * This approach allows brand SVG icons to be:
 * - Inlined as data URIs (instant rendering, no HTTP requests)
 * - Colored via CSS using currentColor
 * - Kept as static assets (no SVG-in-JS overhead)
 * - Compatible with Turbopack
 *
 * Usage:
 *   import SvgIcon from '@/components/ui/SvgIcon'
 *   import chevronLeft from '@/icons/ui/general-ui/chevron-left.svg'
 *
 *   <SvgIcon src={chevronLeft} className="text-brand-primary" />
 *   <SvgIcon src={chevronLeft} width={32} height={32} style={{ color: 'red' }} />
 */

import { type ComponentProps } from 'react'
import { type StaticImageData } from 'next/image'

type SvgIconProps = Omit<ComponentProps<'img'>, 'src'> & {
  src: StaticImageData
}

const EMPTY_SVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E`

export default function SvgIcon({
  src,
  width,
  height,
  style,
  className,
  ...props
}: SvgIconProps) {
  return (
    <img
      width={width ?? src.width}
      height={height ?? src.height}
      src={EMPTY_SVG}
      className={className}
      style={{
        ...style,
        backgroundColor: 'currentcolor',
        mask: `url("${src.src}") no-repeat center / contain`,
        WebkitMask: `url("${src.src}") no-repeat center / contain`,
      }}
      {...props}
    />
  )
}
