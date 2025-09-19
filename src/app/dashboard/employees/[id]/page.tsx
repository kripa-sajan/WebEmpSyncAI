/*se client"

import { useQueryClient } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Loader,
  Mail,
  Phone,
  UserIcon,
  MapPin,
  Activity,
  ArrowLeft,
  MessageSquare,
  Home,
} from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { useAuth, User } from "@/context/AuthContext"
import EmployeeBanner from "../EmployeeBanner"

export default function EmployeeDetailsPage() {
  const queryClient = useQueryClient()
  const params = useParams()
  const employeeId = params.id as string

  const { company, loading: authLoading } = useAuth()
  const companyId = company?.id

  if (authLoading || !employeeId || !companyId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader className="animate-spin h-8 w-8 text-blue-500" />
          <p className="text-lg text-foreground">Loading employee details...</p>
        </div>
      </div>
    )
  }

  const employee = queryClient
    .getQueryData<User[]>(["employees", companyId])
    ?.find((emp) => String(emp.id) === employeeId)
    console.log("Employee details:", employee?.first_name);
    const employeeIdNumber=Number(employeeId)
    const employeeBiometricId=Number(employee?.biometric_id)




  if (!employee) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Employee Not Found</h2>
          <p className="text-muted-foreground mb-6">The requested employee could not be found.</p>
          <Link href="/dashboard/employees">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Employees
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
   
      <div className="max-w-7xl mx-auto px-6 py-6">
        <EmployeeBanner employee={employee} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="border-l-4 border-l-yellow-500">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-foreground text-lg">
                <Mail className="h-4 w-4 text-yellow-600" />
                Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                <Mail className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium text-foreground">{employee.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                <Phone className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-xs text-muted-foreground">Mobile</p>
                  <p className="text-sm font-medium text-foreground">{employee.mobile}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-foreground text-lg">
                <UserIcon className="h-4 w-4 text-blue-600" />
                Personal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                <UserIcon className="h-4 w-4 text-yellow-600" />
                <div>
                  <p className="text-xs text-muted-foreground">Gender</p>
                  <p className="text-sm font-medium text-foreground">{employee.gender_display}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                <MapPin className="h-4 w-4 text-yellow-600" />
                <div>
                  <p className="text-xs text-muted-foreground">Group</p>
                  <p className="text-sm font-medium text-foreground">{employee.group}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-500">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-foreground text-lg">
                <MessageSquare className="h-4 w-4 text-yellow-600" />
                Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-foreground">WhatsApp</span>
                </div>
                <Badge
                  variant={employee.is_whatsapp ? "default" : "secondary"}
                  className={employee.is_whatsapp ? "bg-green-100 text-green-700 border-green-200" : ""}
                >
                  {employee.is_whatsapp ? "On" : "Off"}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm font-medium text-foreground">WFH</span>
                </div>
                <Badge
                  variant={employee.is_wfh ? "default" : "secondary"}
                  className={employee.is_wfh ? "bg-blue-100 text-blue-700 border-blue-200" : ""}
                >
                  {employee.is_wfh ? "Yes" : "No"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}*/
"use client";

import { useQueryClient } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react";
import {
  Loader,
  Mail,
  Phone,
  UserIcon,
  MapPin,
  Activity,
  ArrowLeft,
  MessageSquare,
  Home,
  Pen
} from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { useAuth, User } from "@/context/AuthContext"
import EmployeeBanner from "../EmployeeBanner"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"

export default function EmployeeDetailsPage() {
  const queryClient = useQueryClient()
  const params = useParams()
  const employeeId = params.id as string
  const { company, loading: authLoading } = useAuth()
  const companyId = company?.id

  if (authLoading || !employeeId || !companyId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader className="animate-spin h-8 w-8 text-blue-500" />
          <p className="text-lg text-foreground">Loading employee details...</p>
        </div>
      </div>
    )
  }

  const employee = queryClient
    .getQueryData<User[]>(["employees", companyId])
    ?.find((emp) => String(emp.id) === employeeId)

  if (!employee) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Employee Not Found</h2>
          <p className="text-muted-foreground mb-6">The requested employee could not be found.</p>
          <Link href="/dashboard/employees">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Employees
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const [formData, setFormData] = useState<User>(employee);
  const [editMode, setEditMode] = useState(false);

  const handleChange = (field: keyof User, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Single Edit Button */}
        <div className="flex justify-end mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditMode(!editMode)}
          >
            <Pen className="h-4 w-4 mr-1" /> {editMode ? "Cancel" : "Edit"}
          </Button>
        </div>

        {/* Employee Banner */}
        <EmployeeBanner employee={formData} editMode={editMode} onChange={handleChange} />

        {/* Other Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
          {/* Contact Card */}
          <Card className="border-l-4 border-l-yellow-500">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-foreground text-lg">
                <Mail className="h-4 w-4 text-yellow-600" />
                Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Email */}
              <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                <Mail className="h-4 w-4 text-blue-600" />
                {editMode ? (
                  <Input
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                ) : (
                  <p className="text-sm font-medium text-foreground">{formData.email}</p>
                )}
              </div>
              {/* Mobile */}
              <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                <Phone className="h-4 w-4 text-blue-600" />
                {editMode ? (
                  <Input
                    value={formData.mobile}
                    onChange={(e) => handleChange("mobile", e.target.value)}
                  />
                ) : (
                  <p className="text-sm font-medium text-foreground">{formData.mobile}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Personal Card */}
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-foreground text-lg">
                <UserIcon className="h-4 w-4 text-blue-600" />
                Personal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Gender */}
              <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                <UserIcon className="h-4 w-4 text-yellow-600" />
                {editMode ? (
                  <Select
                    value={formData.gender}
                    onValueChange={(val) => handleChange("gender", val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M">Male</SelectItem>
                      <SelectItem value="F">Female</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm font-medium text-foreground">{formData.gender_display}</p>
                )}
              </div>
              {/* Group */}
              <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                <MapPin className="h-4 w-4 text-yellow-600" />
                {editMode ? (
                  <Input
                    value={formData.group || ""}
                    onChange={(e) => handleChange("group", e.target.value)}
                  />
                ) : (
                  <p className="text-sm font-medium text-foreground">{formData.group}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Preferences Card */}
          <Card className="border-l-4 border-l-yellow-500">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-foreground text-lg">
                <MessageSquare className="h-4 w-4 text-yellow-600" />
                Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* WhatsApp */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-foreground">WhatsApp</span>
                </div>
                {editMode ? (
                  <Switch
                    checked={formData.is_whatsapp}
                    onCheckedChange={(val) => handleChange("is_whatsapp", val)}
                  />
                ) : (
                  <Badge variant={formData.is_whatsapp ? "default" : "secondary"}>
                    {formData.is_whatsapp ? "On" : "Off"}
                  </Badge>
                )}
              </div>

              {/* WFH */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm font-medium text-foreground">WFH</span>
                </div>
                {editMode ? (
                  <Switch
                    checked={formData.is_wfh}
                    onCheckedChange={(val) => handleChange("is_wfh", val)}
                  />
                ) : (
                  <Badge variant={formData.is_wfh ? "default" : "secondary"}>
                    {formData.is_wfh ? "Yes" : "No"}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Save Button */}
        {editMode && (
          <div className="mt-6 flex justify-end">
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => setEditMode(false)}
            >
              Save All Changes
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
