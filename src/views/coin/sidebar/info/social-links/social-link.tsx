import { getUrlWithProtocol } from "@/utils/getUrlWithProtocol";

export const SocialLink = ({ name, url }: { name: string; url: string }) => {
  const urlWithProtocol = getUrlWithProtocol(url);

  return (
    <div className="flex flex-col gap-1">
      <div className="text-xs font-bold text-regular">{name}</div>
      <div className="text-xs font-normal text-regular truncate hover:underline">
        <a href={urlWithProtocol} target="_blank">
          {urlWithProtocol}
        </a>
      </div>
    </div>
  );
};
