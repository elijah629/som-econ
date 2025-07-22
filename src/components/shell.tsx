import Image from "next/image";

export function Shell({ size }: { size: number }) {
  return <Image src="https://summer.hackclub.com/shell.avif" width={size} height={size} alt="Shell"/>
}
