import { useCachedImage } from "@/hooks/useCachedImage";

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

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading image</div>;

  return <img src={imageSrc} alt={altText} className={className} />;
};
