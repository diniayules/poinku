import { isImageValue } from '../lib/image'

type Props = {
  value: string
  imgSize: number
  imgRadius?: string | number
}

export function EmojiOrImg({ value, imgSize, imgRadius = '50%' }: Props) {
  if (isImageValue(value)) {
    return (
      <img
        src={value}
        alt=""
        className="emoji-img"
        style={{
          width: imgSize,
          height: imgSize,
          borderRadius: imgRadius,
          objectFit: 'cover',
          display: 'inline-block',
          verticalAlign: 'middle',
        }}
      />
    )
  }
  return <>{value}</>
}
