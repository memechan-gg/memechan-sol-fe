import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchImage = async (url: string) => {
  const response = await axios.get(url, { responseType: "blob" });
  return URL.createObjectURL(response.data);
};

export const useCachedImage = (url: string) => {
  return useQuery({
    queryKey: ["image", url],
    queryFn: () => fetchImage(url),
    staleTime: Infinity,
  });
};
