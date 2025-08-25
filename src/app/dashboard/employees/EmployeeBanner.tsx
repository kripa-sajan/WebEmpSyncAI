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
}
