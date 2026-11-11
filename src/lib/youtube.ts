export function getYouTubeId(value: string) {
  try {
    const url = new URL(value.trim());
    const host = url.hostname.replace(/^www\./, "");
    let id = "";
    if (host === "youtu.be") id = url.pathname.slice(1).split("/")[0] ?? "";
    if (["youtube.com", "m.youtube.com", "youtube-nocookie.com"].includes(host)) {
      if (url.pathname === "/watch") id = url.searchParams.get("v") ?? "";
      else id = url.pathname.split("/").filter(Boolean).at(-1) ?? "";
    }
    return /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;
  } catch {
    return null;
  }
}

export function getYouTubeEmbedUrl(value: string) {
  const id = getYouTubeId(value);
  return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
}
