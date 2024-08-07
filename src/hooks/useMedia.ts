import { useMediaQuery } from "usehooks-ts";

export interface MediaQuery {
  isExstraSmallDevice: boolean;
  isSmallDevice: boolean;
  isMediumDevice: boolean;
  isLargeDevice: boolean;
  isExtraLargeDevice: boolean;
}

export function useMedia(): MediaQuery {
  const isExstraSmallDevice = useMediaQuery("only screen and (max-width : 400px)");
  const isSmallDevice = useMediaQuery("only screen and (max-width : 640px)");
  const isMediumDevice = useMediaQuery("only screen and (min-width : 769px) and (max-width : 992px)");
  const isLargeDevice = useMediaQuery("only screen and (min-width : 993px) and (max-width : 1200px)");
  const isExtraLargeDevice = useMediaQuery("only screen and (min-width : 1201px)");

  return {
    isExstraSmallDevice,
    isSmallDevice,
    isMediumDevice,
    isLargeDevice,
    isExtraLargeDevice,
  };
}
