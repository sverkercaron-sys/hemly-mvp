export function toOptimizedImageUrl(url: string, width = 1200, quality = 70) {
  if (!url) return url;

  if (url.includes("/storage/v1/object/public/property-images/")) {
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}width=${width}&quality=${quality}`;
  }

  return url;
}
