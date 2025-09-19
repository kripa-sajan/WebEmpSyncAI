"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { User, useAuth } from "@/context/AuthContext";
import { useCompany } from "@/context/CompanyContext";
import { UserIcon, Activity } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation"; // ✅ import router

interface EmployeeBannerProps {
  employee: User;
  editMode?: boolean;
  onChange?: (field: keyof User, value: any) => void;
}

export default function EmployeeBanner({
  employee,
  editMode,
  onChange,
}: EmployeeBannerProps) {
  const [imageError, setImageError] = useState(false);
  const { currentCompany } = useCompany();
  const router = useRouter(); // ✅ router hook

  const showInitials = !employee.prof_img || imageError;

  const getProfileImageUrl = () => {
    if (employee.prof_img) {
      return employee.prof_img.startsWith("http")
        ? employee.prof_img
        : `${currentCompany?.mediaBaseUrl}${employee.prof_img}`;
    }
    return `${currentCompany?.mediaBaseUrl}/media/default_profile.png`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        onChange?.("prof_img", reader.result as string);
        setImageError(false);
      };
      reader.readAsDataURL(file);
    }
  };

  // ✅ Navigate to Punch History
// ✅ Navigate to Punch History with biometric_id
const handleViewPunch = () => {
  router.push(`/dashboard/employees/${employee.biometric_id}/punches`);
};

  return (
    <Card className="mb-6 border-l-4 border-l-blue-500">
      <CardHeader className="pb-4 flex justify-between items-start">
        <div className="flex items-start gap-4">
          {/* Profile image */}
          <div className="relative">
            <Avatar className="h-16 w-16 border-2 border-background shadow-lg">
              {editMode ? (
                <div className="flex flex-col items-center justify-center h-16 w-16 gap-1">
                  <Input
                    type="text"
                    value={employee.prof_img || ""}
                    placeholder="Profile Image URL"
                    onChange={(e) => onChange?.("prof_img", e.target.value)}
                    className="h-8 w-full text-xs p-1"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="text-xs"
                  />
                </div>
              ) : showInitials ? (
                <AvatarFallback className="text-lg font-bold bg-blue-100 text-blue-700 flex items-center justify-center">
                  {employee.first_name?.[0]}
                  {employee.last_name?.[0]}
                </AvatarFallback>
              ) : (
                <div className="relative h-16 w-16 rounded-full overflow-hidden">
                  <Image
                    src={getProfileImageUrl()}
                    alt={`${employee.first_name} ${employee.last_name}`}
                    fill
                    className="object-cover w-full h-full"
                    onError={() => setImageError(true)}
                  />
                </div>
              )}
            </Avatar>
            <div
              className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-background ${
                employee.is_active ? "bg-green-500" : "bg-gray-400"
              }`}
            />
          </div>

          {/* Employee details */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              {editMode ? (
                <>
                  <Input
                    value={employee.first_name}
                    onChange={(e) => onChange?.("first_name", e.target.value)}
                    placeholder="First Name"
                    className="font-bold text-xl w-32"
                  />
                  <Input
                    value={employee.last_name}
                    onChange={(e) => onChange?.("last_name", e.target.value)}
                    placeholder="Last Name"
                    className="font-bold text-xl w-32"
                  />
                </>
              ) : (
                <CardTitle className="text-xl font-bold text-foreground">
                  {employee.first_name} {employee.last_name}
                </CardTitle>
              )}

              <Badge
                variant={employee.is_active ? "default" : "secondary"}
                className="bg-blue-100 text-blue-700 border-blue-200"
              >
                {employee.is_active ? "Active" : "Inactive"}
              </Badge>
            </div>

            {editMode ? (
              <Input
                value={employee.role || ""}
                onChange={(e) => onChange?.("role", e.target.value)}
                placeholder="Role"
                className="text-lg w-48"
              />
            ) : (
              <p className="text-lg text-muted-foreground mb-2">
                {employee.role}
              </p>
            )}

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <UserIcon className="h-4 w-4" />
                ID: {employee.id}
              </span>
              <span className="flex items-center gap-1">
                <Activity className="h-4 w-4" />
                {employee.biometric_id}
              </span>
            </div>

            {/* ✅ View Punch button */}
            <button
              onClick={handleViewPunch}
              className="mt-3 px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              View Punch
            </button>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}


/*
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User } from "@/context/AuthContext"
import {
  UserIcon,
  Activity,
  Shield,
} from "lucide-react"

interface EmployeeBannerProps {
  employee: User;
}

export default function EmployeeBanner({ employee }: EmployeeBannerProps) {
  return (
    <Card className="mb-6 border-l-4 border-l-blue-500">
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          <div className="relative">
            <Avatar className="h-16 w-16 border-2 border-background shadow-lg">
              <AvatarImage
                src={employee.prof_img || "/placeholder.svg"}
                alt={`${employee.first_name} ${employee.last_name}`}
              />
              <AvatarFallback className="text-lg font-bold bg-blue-100 text-blue-700">
                {employee.first_name[0]}
                {employee.last_name[0]}
              </AvatarFallback>
            </Avatar>
            <div
              className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-background ${
                employee.is_active ? "bg-green-500" : "bg-gray-400"
              }`}
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <CardTitle className="text-xl font-bold text-foreground">
                {employee.first_name} {employee.last_name}
              </CardTitle>
              <Badge
                variant={employee.is_active ? "default" : "secondary"}
                className="bg-blue-100 text-blue-700 border-blue-200"
              >
                {employee.is_active ? "Active" : "Inactive"}
              </Badge>
              {employee.is_superuser && (
                <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
                  <Shield className="h-3 w-3 mr-1" />
                  Admin
                </Badge>
              )}
            </div>
            <p className="text-lg text-muted-foreground mb-2">{employee.role}</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <UserIcon className="h-4 w-4" />
                ID: {employee.id}
              </span>
              <span className="flex items-center gap-1">
                <Activity className="h-4 w-4" />
                {employee.biometric_id}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  )
}*/

/*import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User } from "@/context/AuthContext"
import {
  UserIcon,
  Activity,
  Shield,
  Users,
  Clock,
  BarChart3,
} from "lucide-react"

interface EmployeeBannerProps {
  employee: User & {
    punch_in?: string
    punch_out?: string
    avg_value?: number
  };
}

export default function EmployeeBanner({ employee }: EmployeeBannerProps) {
  return (
    <Card className="mb-6 border-l-4 border-l-blue-500">
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          {/* Profile picture }
          <div className="relative">
            <Avatar className="h-16 w-16 border-2 border-background shadow-lg">
              <AvatarImage
                src={employee.prof_img || "/placeholder.svg"}
                alt={`${employee.first_name} ${employee.last_name}`}
              />
              <AvatarFallback className="text-lg font-bold bg-blue-100 text-blue-700">
                {employee.first_name[0]}
                {employee.last_name[0]}
              </AvatarFallback>
            </Avatar>
            {/* Active status dot }
            <div
              className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-background ${
                employee.is_active ? "bg-green-500" : "bg-gray-400"
              }`}
            />
          </div>

          {/* Employee Info }
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <CardTitle className="text-xl font-bold text-foreground">
                {employee.first_name} {employee.last_name}
              </CardTitle>
              <Badge
                variant={employee.is_active ? "default" : "secondary"}
                className="bg-blue-100 text-blue-700 border-blue-200"
              >
                {employee.is_active ? "Active" : "Inactive"}
              </Badge>
              {employee.is_superuser && (
                <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
                  <Shield className="h-3 w-3 mr-1" />
                  Admin
                </Badge>
              )}
            </div>
            <p className="text-lg text-muted-foreground mb-2">{employee.role}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <UserIcon className="h-4 w-4" /> <strong>ID:</strong> {employee.id}
        </span>
        <span className="flex items-center gap-1">
          <Activity className="h-4 w-4" /> <strong>Biometric ID:</strong> {employee.biometric_id}
        </span>
        <span className="flex items-center gap-1">
          <Users className="h-4 w-4" /> <strong>Group:</strong> {employee.group || "-"}
        </span>
        <span className="flex items-center gap-1">
          <UserIcon className="h-4 w-4" /> <strong>Gender:</strong> {employee.gender_display || "-"}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-4 w-4" /> <strong>Punch In:</strong> {employee.punch_in || "-"}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-4 w-4" /> <strong>Punch Out:</strong> {employee.punch_out || "-"}
        </span>
        <span className="flex items-center gap-1 col-span-2">
          <BarChart3 className="h-4 w-4" /> <strong>Avg Value:</strong>{" "}
          {employee.avg_value ? employee.avg_value.toFixed(2) : "-"}
        </span>
      </CardContent>
    </Card>
  )
}*/
