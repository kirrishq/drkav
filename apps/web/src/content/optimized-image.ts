const OPTIMIZED_IMAGE_WIDTHS = [384, 640, 768, 1024];

export function getOptimizedImageSrcSet(src: string | undefined): string | undefined {
  if (!src?.startsWith("/") && !src?.startsWith("http://") && !src?.startsWith("https://")) {
    return undefined;
  }

  const encodedSrc = encodeURIComponent(src);

  return OPTIMIZED_IMAGE_WIDTHS
    .map((width) => `/_next/image?url=${encodedSrc}&w=${width}&q=75 ${width}w`)
    .join(", ");
}
