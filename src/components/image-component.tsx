import { useCachedImage } from "@/hooks/useCachedImage";
import { useTheme } from "next-themes";
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
  const { theme } = useTheme();
  const { data: imageSrc, isLoading, isError } = useCachedImage(imageUrl);
  if (isLoading)
    return (
      <div className={className + " flex justify-center items-center pb-1"}>
        <Skeleton
          count={1}
          height={"90px"}
          width={"90px"}
          baseColor={theme === "light" ? "#bc6857" : "#3e3e3e"}
          highlightColor={theme === "light" ? "#e5ad90" : "#979797"}
        />
      </div>
    );
  if (isError || (!isLoading && imageSrc === undefined))
    return <img src="/android-chrome-512x512.png" alt={altText} className={className} />;

  return <img src={imageSrc} alt={altText} className={className} />;
};
