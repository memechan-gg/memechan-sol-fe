import { Profile } from "@/views/profile";
import { useRouter } from "next/router";

export default function ProfilePage() {
  const router = useRouter();
  let { address, coin } = router.query as { address: string; coin: string };

  return <Profile address={address} coin={coin} />;
}
