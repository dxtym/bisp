import Image from "next/image"

type UserAvatarProps = {
  name?: string | null
  image?: string | null
  size?: number
}

export default function UserAvatar({ name, image, size = 36 }: UserAvatarProps) {
  return (
    <div
      className="rounded-full overflow-hidden bg-muted flex items-center justify-center text-sm font-medium ring-2 ring-neutral-300 ring-offset-1 ring-offset-white dark:ring-white/20 dark:ring-offset-black"
      style={{ width: size, height: size }}
    >
      {image ? (
        <Image src={image} alt={name ?? ""} width={size} height={size} className="object-cover" />
      ) : (
        <span>{name?.[0]?.toUpperCase() ?? "G"}</span>
      )}
    </div>
  )
}
