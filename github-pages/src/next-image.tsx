import type { CSSProperties, ImgHTMLAttributes } from "react";

type StaticImageProps = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "src" | "width" | "height"
> & {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  priority?: boolean;
  fill?: boolean;
};

export default function StaticImage({
  priority,
  fill,
  loading,
  style,
  alt,
  ...props
}: StaticImageProps) {
  const fillStyle: CSSProperties | undefined = fill
    ? {
        ...style,
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%"
      }
    : style;

  return (
    // GitHub Pages serves the original optimized portfolio assets directly.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...props}
      alt={alt}
      loading={priority ? "eager" : loading}
      fetchPriority={priority ? "high" : undefined}
      style={fillStyle}
    />
  );
}
