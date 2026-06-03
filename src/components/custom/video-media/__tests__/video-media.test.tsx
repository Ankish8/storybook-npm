import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { VideoMedia } from "../video-media";
import { hasDisplayableVideoThumbnail, urlPathWithoutQuery } from "../utils";

describe("VideoMedia", () => {
  it("renders a native video from url props", () => {
    render(
      <VideoMedia
        url="https://example.com/video.mp4"
        poster="https://example.com/poster.jpg"
        fileType="video/mp4"
      />
    );

    const video = screen.getByTestId("video-element");
    expect(video).toBeInTheDocument();
    expect(video).toHaveAttribute("src", "https://example.com/video.mp4");
    expect(video).toHaveAttribute("poster", "https://example.com/poster.jpg");
    expect(video).toHaveAttribute("controls");
    expect(video).toHaveAttribute("playsinline");
    expect(screen.getByTestId("video-media-source")).toHaveAttribute(
      "type",
      "video/mp4"
    );
  });

  it("uses media payload thumbnail when it is displayable", () => {
    render(
      <VideoMedia
        media={{
          url: "https://example.com/video.mp4",
          thumbnailUrl: "https://example.com/thumb.jpg",
        }}
      />
    );

    expect(screen.getByTestId("video-element")).toHaveAttribute(
      "poster",
      "https://example.com/thumb.jpg"
    );
  });

  it("falls back to poster when media thumbnail is the video url", () => {
    render(
      <VideoMedia
        media={{
          url: "https://example.com/video.mp4",
          thumbnailUrl: "https://example.com/video.mp4",
          fileType: "video/mp4",
        }}
        poster="https://example.com/fallback.jpg"
      />
    );

    expect(screen.getByTestId("video-element")).toHaveAttribute(
      "poster",
      "https://example.com/fallback.jpg"
    );
  });

  it("applies custom className to direct url wrapper", () => {
    const { container } = render(
      <VideoMedia url="https://example.com/video.mp4" className="custom-class" />
    );

    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("applies media payload props to the outer wrapper", () => {
    render(
      <VideoMedia
        media={{ url: "https://example.com/video.mp4" }}
        className="outer-class"
        data-testid="video-wrapper"
      />
    );

    const wrapper = screen.getByTestId("video-wrapper");
    expect(wrapper).toHaveClass("outer-class");
    expect(screen.getByTestId("video-element")).toBeInTheDocument();
  });

  it("passes video attributes through for direct url usage", () => {
    render(
      <VideoMedia
        url="https://example.com/video.mp4"
        data-testid="custom-video"
        muted
        loop
      />
    );

    const video = screen.getByTestId("custom-video");
    expect(video).toHaveProperty("muted", true);
    expect(video).toHaveProperty("loop", true);
  });

  it("forwards ref to the rendered wrapper", () => {
    const ref = vi.fn();

    render(<VideoMedia url="https://example.com/video.mp4" ref={ref} />);

    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });

  it("does not render without a usable url", () => {
    const { container } = render(<VideoMedia url="   " />);

    expect(container.firstChild).toBeNull();
  });
});

describe("video media utils", () => {
  it("strips query and hash from a url path", () => {
    expect(urlPathWithoutQuery(" https://example.com/video.mp4?token=1#x ")).toBe(
      "https://example.com/video.mp4"
    );
  });

  it("rejects video thumbnails that are not displayable images", () => {
    expect(
      hasDisplayableVideoThumbnail({
        url: "https://example.com/video.mp4",
        thumbnailUrl: "https://example.com/thumb.webm",
        fileType: "video/mp4",
      })
    ).toBe(false);
  });
});
