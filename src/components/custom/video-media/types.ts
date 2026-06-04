import type * as React from "react";
import type { MediaPayload } from "../chat-types/types";


type VideoElementProps = Omit<
  React.VideoHTMLAttributes<HTMLVideoElement>,
  "src" | "children" | "poster" | "className" | "style"
>;

type VideoMediaSharedProps = {
  poster?: string;
  /** Alias for `poster` (compose preview / legacy callers). */
  thumbnailUrl?: string;
  fileType?: string;
  wrapperClassName?: string;
  wrapperStyle?: React.CSSProperties;
  /** Passed to the `<video>` element (e.g. maxHeight override for compose preview). */
  style?: React.CSSProperties;
};

export type VideoMediaProps = VideoMediaSharedProps &
  (
    | ({
        media: MediaPayload;
        url?: never;
      } & Omit<React.HTMLAttributes<HTMLDivElement>, "children">)
    | ({
        media?: undefined;
        url: string;
        className?: string;
      } & VideoElementProps)
  );
