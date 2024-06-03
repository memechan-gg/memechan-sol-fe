import { CoinMetadata } from "@/types/coin";
import { SocialLink } from "./social-link";

export const SocialLinks = ({ socialLinks }: { socialLinks: CoinMetadata["socialLinks"] }) => {
  if (!socialLinks || (!socialLinks.discord && !socialLinks.telegram && !socialLinks.twitter && !socialLinks.website))
    return;

  return (
    <div className="grid grid-cols-2 gap-4 my-4">
      {socialLinks.discord && <SocialLink name="Discord" url={socialLinks.discord} />}
      {socialLinks.twitter && <SocialLink name="Twitter" url={socialLinks.twitter} />}
      {socialLinks.telegram && <SocialLink name="Telegram" url={socialLinks.telegram} />}
      {socialLinks.website && <SocialLink name="Website" url={socialLinks.website} />}
    </div>
  );
};
