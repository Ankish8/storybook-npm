import * as React from "react";
import { cn } from "../../../lib/utils";
import type { VideoMediaProps } from "./types";
import { hasDisplayableVideoThumbnail } from "./utils";

const DEFAULT_MAX_HEIGHT = 280;

function resolveVideoSource(
  props: Pick<
    VideoMediaProps,
    "media" | "url" | "poster" | "thumbnailUrl" | "fileType"
  >
) {
  if ("media" in props && props.media) {
    return {
      url: props.media.url,
      poster: hasDisplayableVideoThumbnail(props.media)
        ? props.media.thumbnailUrl
        : props.poster ?? props.thumbnailUrl,
      fileType: props.media.fileType ?? props.fileType,
    };
  }

  return {
    url: props.url ?? "",
    poster: props.poster ?? props.thumbnailUrl,
    fileType: props.fileType,
  };
}

const VideoMedia = React.forwardRef<HTMLDivElement, VideoMediaProps>(
  (props, ref) => {
    const {
      media,
      url,
      poster,
      thumbnailUrl,
      fileType,
      wrapperClassName,
      wrapperStyle,
      style,
      ...rest
    } = props;

    const resolved = resolveVideoSource({
      media,
      url,
      poster,
      thumbnailUrl,
      fileType,
    });

    if (!resolved.url?.trim()) {
      return null;
    }

    const fixedHeight = wrapperStyle?.height != null;
    const usesMediaPayload = Boolean(media);
    const className = "className" in props ? props.className : undefined;

    const maxHeight =
      style?.maxHeight ??
      (fixedHeight ? undefined : `${DEFAULT_MAX_HEIGHT}px`);

    const videoElement = (
      <video
        src={resolved.url}
        poster={resolved.poster}
        controls
        playsInline
        preload="metadata"
        className="block h-auto w-auto max-w-full bg-semantic-text-primary object-contain"
        style={{
          ...(maxHeight != null ? { maxHeight } : null),
          ...(fixedHeight ? { maxHeight: "100%" } : null),
          ...style,
        }}
        {...(usesMediaPayload
          ? {}
          : (rest as Omit<
              React.VideoHTMLAttributes<HTMLVideoElement>,
              "src" | "children" | "poster"
            >))}
        data-testid={
          usesMediaPayload
            ? "video-element"
            : ((rest as { "data-testid"?: string })["data-testid"] ??
              "video-element")
        }
      >
        {resolved.fileType ? (
          <source
            data-testid="video-media-source"
            src={resolved.url}
            type={resolved.fileType}
          />
        ) : null}
      </video>
    );

    const wrapper = (
      <div
        ref={usesMediaPayload ? undefined : ref}
        className={cn(
          "relative flex w-full items-center justify-center overflow-hidden rounded-t bg-semantic-text-primary",
          wrapperClassName,
          !usesMediaPayload ? className : undefined
        )}
        style={wrapperStyle}
      >
        {videoElement}
      </div>
    );

    if (usesMediaPayload) {
      return (
        <div
          ref={ref}
          className={className}
          {...(rest as React.HTMLAttributes<HTMLDivElement>)}
        >
          {wrapper}
        </div>
      );
    }

    return wrapper;
  }
);

VideoMedia.displayName = "VideoMedia";

export { VideoMedia };
