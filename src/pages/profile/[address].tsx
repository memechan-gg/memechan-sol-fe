import { Profile } from "@/views/profile";
import { useRouter } from "next/router";

export default function ProfilePage() {
  const router = useRouter();
  let { address } = router.query as { address: string };

  return <Profile address={address} />;
}
