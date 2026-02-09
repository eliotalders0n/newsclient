const codecTests = [
  { codec: "av01.0.01M.08", type: "video/mp4", label: "av1" },
  { codec: "hvc1.1.6.L93.B0", type: "video/mp4", label: "hevc" },
  { codec: "vp09.00.10.08", type: "video/webm", label: "vp9" },
  { codec: "avc1.640028", type: "video/mp4", label: "h264" },
];

let cachedCodecs = null;

/**
 * Detect which video codecs the browser supports.
 * Returns an object like { av1: true, hevc: false, vp9: true, h264: true }.
 */
export function getSupportedCodecs() {
  if (cachedCodecs) return cachedCodecs;

  const video = document.createElement("video");
  cachedCodecs = {};
  for (const { codec, type, label } of codecTests) {
    cachedCodecs[label] = video.canPlayType(`${type}; codecs="${codec}"`) !== "";
  }
  return cachedCodecs;
}

/**
 * Return the best codec label the browser can handle,
 * ordered by compression efficiency: av1 > hevc > vp9 > h264.
 */
export function getBestCodec() {
  const supported = getSupportedCodecs();
  if (supported.av1) return "av1";
  if (supported.hevc) return "hevc";
  if (supported.vp9) return "vp9";
  return "h264";
}

/**
 * Use the Network Information API (where available) to return a quality tier.
 * Falls back to "high" when the API is unavailable.
 */
export function getNetworkQuality() {
  const conn = navigator.connection || navigator.mozConnection;
  if (!conn) return "high";

  if (conn.saveData) return "low";

  const ect = conn.effectiveType;
  if (ect === "slow-2g" || ect === "2g") return "low";
  if (ect === "3g") return "medium";
  return "high";
}

/**
 * Choose the ideal vertical resolution for reels based on the device screen
 * and current network conditions.
 */
export function getOptimalResolution() {
  const quality = getNetworkQuality();
  const screenH = window.screen.height * (window.devicePixelRatio || 1);

  if (quality === "low") return 360;
  if (quality === "medium") return 480;

  // High-quality path — match the physical screen
  if (screenH <= 720) return 480;
  if (screenH <= 1080) return 720;
  return 1080;
}

/**
 * Given a Firebase Storage download URL for the original video, build an
 * ordered list of <source> candidates.
 *
 * If transcoded variants exist in Storage they follow the naming convention:
 *   {original_path}_720p.mp4  / _480p.mp4  / _360p.mp4
 *   {original_path}_720p.webm / _480p.webm / _360p.webm
 *
 * The function constructs candidate URLs but the <video> element will simply
 * skip any source that 404s and try the next one — so this is safe even before
 * server-side transcoding is in place.
 *
 * @param {string} originalUrl  The raw Firebase Storage download URL
 * @returns {{ src: string, type: string }[]}
 */
export function buildVideoSources(originalUrl) {
  if (!originalUrl) return [];

  const resolution = getOptimalResolution();
  const codecs = getSupportedCodecs();
  const sources = [];

  // Try to build variant URLs from the original Firebase Storage URL.
  // Firebase download URLs look like:
  //   https://firebasestorage.googleapis.com/v0/b/{bucket}/o/{encodedPath}?alt=media&token={token}
  const variantUrl = (res, ext) => {
    try {
      const url = new URL(originalUrl);
      const pathParam = url.pathname; // /v0/b/bucket/o/encoded%2Fpath.mp4
      const dotIdx = pathParam.lastIndexOf(".");
      if (dotIdx === -1) return null;
      const base = pathParam.slice(0, dotIdx);
      const newPath = `${base}_${res}p.${ext}`;
      url.pathname = newPath;
      return url.toString();
    } catch {
      return null;
    }
  };

  // Prefer modern codecs in smaller containers when supported
  if (codecs.vp9) {
    const webm = variantUrl(resolution, "webm");
    if (webm) sources.push({ src: webm, type: 'video/webm; codecs="vp9,opus"' });
  }

  // H.264 variant at the chosen resolution
  const mp4Variant = variantUrl(resolution, "mp4");
  if (mp4Variant) {
    sources.push({ src: mp4Variant, type: 'video/mp4; codecs="avc1.640028,mp4a.40.2"' });
  }

  // Always include the original as the final fallback
  sources.push({ src: originalUrl, type: "video/mp4" });

  return sources;
}

/**
 * Derive a poster/thumbnail URL from the video URL.
 * If a _poster.jpg variant exists alongside the video in Storage it will load;
 * otherwise the browser just shows a black frame (which matches our dark UI).
 */
export function getPosterUrl(videoUrl) {
  if (!videoUrl) return undefined;
  try {
    const url = new URL(videoUrl);
    const dotIdx = url.pathname.lastIndexOf(".");
    if (dotIdx === -1) return undefined;
    url.pathname = url.pathname.slice(0, dotIdx) + "_poster.jpg";
    return url.toString();
  } catch {
    return undefined;
  }
}

/**
 * Determine the ideal preload strategy for a video element.
 * Active reels should preload aggressively; others should only fetch metadata.
 */
export function getPreloadStrategy(isActive) {
  if (isActive) return "auto";
  const quality = getNetworkQuality();
  return quality === "high" ? "metadata" : "none";
}
