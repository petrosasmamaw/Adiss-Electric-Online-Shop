const MAX_ITEM_IMAGES = 5;

function sanitizeImageUrls(image_urls, image_url) {
  let urls = [];

  if (Array.isArray(image_urls)) {
    urls = image_urls
      .filter((url) => typeof url === 'string' && url.trim())
      .map((url) => url.trim());
  } else if (typeof image_url === 'string' && image_url.trim()) {
    urls = [image_url.trim()];
  }

  return urls.slice(0, MAX_ITEM_IMAGES);
}

function normalizeItemRow(row) {
  if (!row) return row;

  let image_urls = Array.isArray(row.image_urls) ? row.image_urls.filter(Boolean) : [];

  if (image_urls.length === 0 && row.image_url) {
    image_urls = [row.image_url];
  }

  return {
    ...row,
    image_urls,
    image_url: image_urls[0] || row.image_url || null,
  };
}

module.exports = {
  MAX_ITEM_IMAGES,
  sanitizeImageUrls,
  normalizeItemRow,
};
