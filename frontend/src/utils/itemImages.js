export const MAX_ITEM_IMAGES = 5;

export function getItemImages(item) {
  if (!item) return [];

  if (Array.isArray(item.image_urls) && item.image_urls.length > 0) {
    return item.image_urls.filter(Boolean);
  }

  if (item.image_url) {
    return [item.image_url];
  }

  return [];
}
