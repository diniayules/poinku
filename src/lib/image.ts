export async function fileToResizedDataURL(
  file: File,
  maxSize = 256,
  quality = 0.85,
): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Bukan file gambar')
  }
  const url = URL.createObjectURL(file)
  try {
    const img = await new Promise<HTMLImageElement>((res, rej) => {
      const i = new Image()
      i.onload = () => res(i)
      i.onerror = () => rej(new Error('Gagal memuat gambar'))
      i.src = url
    })
    const ratio = Math.min(1, maxSize / Math.max(img.width, img.height))
    const w = Math.round(img.width * ratio)
    const h = Math.round(img.height * ratio)
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas tidak didukung')
    ctx.drawImage(img, 0, 0, w, h)
    return canvas.toDataURL('image/webp', quality)
  } finally {
    URL.revokeObjectURL(url)
  }
}

export function isImageValue(v: string | undefined): boolean {
  return !!v && v.startsWith('data:')
}
