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
  const { data: imageSrc, isLoading, error } = useCachedImage(imageUrl);

  if (isLoading)
    <div className={className}>
      <Skeleton count={1} height={"92px"} baseColor="#242424" highlightColor="#353535" />
    </div>;
  if (error) return <div>Error loading image</div>;

  return <img src={imageSrc} alt={altText} className={className} />;
};
