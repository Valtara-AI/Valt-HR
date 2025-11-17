import Image from "next/image";

type BrandLogoProps = {
  width?: number;
  height?: number;
  className?: string;
  alt?: string;
  showWordmark?: boolean; // reserved for future use
};

export default function BrandLogo({
  width = 32,
  height = 32,
  className = "",
  alt = "Valtara",
}: BrandLogoProps) {
  return (
    <div className={`flex items-center ${className}`}>
      <Image src="/valtara-logo.svg" alt={alt} width={width} height={height} />
    </div>
  );
}
