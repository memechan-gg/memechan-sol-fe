import { Profile } from "@/views/profile";
import { useRouter } from "next/router";

export default function ProfileHome() {
  const router = useRouter();
  // TODO:FIX
  // refactor routing here
  let { coin } = router.query as { coin: string };

  return <Profile address={coin} coin={""} />;
}
