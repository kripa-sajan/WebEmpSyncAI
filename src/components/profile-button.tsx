"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

export function ProfileButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/dashboard/profile")}
      className="flex items-center gap-2 hover:opacity-80 transition-opacity"
    >
      <Avatar className="h-8 w-8">
        <AvatarImage src="/admin-profile.png" alt="Admin" />
        <AvatarFallback>AD</AvatarFallback>
      </Avatar>
    </button>
  );
}
