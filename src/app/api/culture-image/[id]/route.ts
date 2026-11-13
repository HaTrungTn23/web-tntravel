import { getCultureImage } from "@/data/cultureImageGalleries";

const fallbackPath = "/images/culture/am-thuc-thai-nguyen.webp";

async function serveLocalImage(request: Request, path: string) {
  const response = await fetch(new URL(path, request.url));
  if (!response.ok) return new Response(null, { status: 404 });
  return new Response(response.body, {
    headers: {
      "Content-Type": response.headers.get("content-type") ?? "image/webp",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const requestedIndex = Number(new URL(request.url).searchParams.get("index") ?? 0);
  const imageUrl = getCultureImage(id, Number.isInteger(requestedIndex) && requestedIndex >= 0 ? requestedIndex : 0);

  if (!imageUrl) {
    return serveLocalImage(request, fallbackPath);
  }

  if (imageUrl.startsWith("/")) {
    return serveLocalImage(request, imageUrl);
  }

  try {
    const url = new URL(imageUrl);
    if (url.hostname === "thainguyentourism.vn") {
      url.pathname = url.pathname.replace(/^\/files\/([^/]+)\/\/uploads\/\1\//, "/uploads/$1/");
    }
    const allowedHosts = new Set([
      "thainguyentourism.vn",
      "dltm-cdn.vnptit3.vn",
      "media.vov.vn",
      "imgchinhsachcuocsong.vnanet.vn",
      "baothainguyen.vn",
      "cdn.baothainguyen.vn",
      "danviet.ex-cdn.com",
      "cdn.tienphong.vn",
      "cms.thainguyen.vn",
      "vannghethainguyen.vn",
      "cdn-i.doisongphapluat.com.vn",
      "images2.thanhnien.vn",
    ]);
    if (!allowedHosts.has(url.hostname)) {
      return serveLocalImage(request, fallbackPath);
    }

    const response = await fetch(url, {
      headers: { Accept: "image/avif,image/webp,image/*,*/*", "User-Agent": "Mozilla/5.0 ThaiNguyenCultureGuide/1.0" },
      next: { revalidate: 86400 },
    });
    const contentType = response.headers.get("content-type") ?? "";
    if (!response.ok || !contentType.startsWith("image/")) {
      return serveLocalImage(request, fallbackPath);
    }

    return new Response(response.body, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    });
  } catch {
    return serveLocalImage(request, fallbackPath);
  }
}
