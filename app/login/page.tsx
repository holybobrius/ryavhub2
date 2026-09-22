import { getCurrentUser } from "@/features/auth/getCurrentUser";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/");
  }
  return <div>LoginPage</div>;
}
