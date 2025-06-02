import { redirect } from "next/navigation";

export default function SettingsRoot() {
  redirect("/settings/my-account");
  return null;
}
