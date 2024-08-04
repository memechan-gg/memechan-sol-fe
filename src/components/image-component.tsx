import { useCachedImage } from "@/hooks/useCachedImage";
import Skeleton from "react-loading-skeleton";

export const ImageComponent = ({
  imageUrl,
  altText,
  className,
}: {
  imageUrl: string;
  altText: string;
  className: string;
}) => {
  const { data: imageSrc, isLoading, isError } = useCachedImage(imageUrl);

  if (isLoading)
    <div className={className}>
      <Skeleton count={1} height={"92px"} baseColor="#242424" highlightColor="#353535" />
    </div>;
  if (isError || (!isLoading && imageSrc === undefined))
    return <img src="/android-chrome-512x512.png" alt={altText} className={className} />;

  return <img src={imageSrc} alt={altText} className={className} />;
};
