import type { ImgHTMLAttributes } from "react";

type OptimizedImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  loading?: "eager" | "lazy";
  fetchPriority?: "high" | "low" | "auto";
  sizes?: string;
};

/**
 * Renders a responsive <picture> with AVIF and WebP sources, falling back to
 * the original image for older browsers. Assumes -sm (640w) and -md (1024w)
 * variants exist in the same public directory for every image source.
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  loading = "lazy",
  fetchPriority,
  sizes = "100vw",
  ...rest
}: OptimizedImageProps) {
  const base = src.replace(/\.(png|jpg|jpeg)$/i, "");

  const srcSet = (format: string) =>
    `${base}-sm.${format} 640w, ${base}-md.${format} 1024w`;

  return (
    <picture>
      <source
        type="image/avif"
        srcSet={srcSet("avif")}
        sizes={sizes}
      />
      <source
        type="image/webp"
        srcSet={srcSet("webp")}
        sizes={sizes}
      />
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        loading={loading}
        fetchPriority={fetchPriority}
        decoding={fetchPriority === "high" ? "sync" : "async"}
        {...rest}
      />
    </picture>
  );
}
