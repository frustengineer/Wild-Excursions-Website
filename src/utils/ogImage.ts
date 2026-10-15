import { getImage } from 'astro:assets';

/** 1200×630 JPEG share card (WhatsApp, Facebook, X all render JPEG reliably). */
export async function ogImage(src: ImageMetadata) {
  const image = await getImage({ src, width: 1200, height: 630, format: 'jpg', quality: 85 });
  return image.src;
}
