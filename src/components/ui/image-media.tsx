import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * ImageMedia component for displaying images in chat messages.
 *
 * @example
 * ```tsx
 * <ImageMedia src="https://example.com/photo.jpg" />
 * <ImageMedia src="https://example.com/photo.jpg" alt="A sunset" />
 * <ImageMedia src="https://example.com/photo.jpg" maxHeight={400} />
 * <ImageMedia src="https://example.com/photo.jpg" maxHeight="50vh" />
 * ```
 */
export interface ImageMediaProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Image source URL */
  src: string;
  /** Alt text for the image */
  alt?: string;
  /** Maximum height of the image. Defaults to 280px */
  maxHeight?: number | string;
}

const ImageMedia = React.forwardRef(
  ({ className, src, alt = "Image", maxHeight = 280, ...props }: ImageMediaProps, ref: React.Ref<HTMLDivElement>) => {
    const maxHeightStyle =
      typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight;

    return (
      <div ref={ref} className={cn("relative", className)} {...props}>
        <img
          src={src}
          alt={alt}
          className="w-full rounded-t object-cover"
          style={{ maxHeight: maxHeightStyle }}
        />
      </div>
    );
  }
);
ImageMedia.displayName = "ImageMedia";

export { ImageMedia };
