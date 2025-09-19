/*
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Building2, MapPin, Clock, Gauge, Shield, Calendar, Users, Settings } from "lucide-react"
import { useAuth } from "@/context/AuthContext"

export default function CompanyProfilePage() {
  const { company } = useAuth()

  if (!company) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
            <Building2 className="w-8 h-8 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">No Company Data</h3>
            <p className="text-sm text-muted-foreground">Company information is not available at the moment.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="w-20 h-20 border-4 border-background shadow-lg">
                <AvatarImage src={company.company_img || "/placeholder.svg"} alt={company.company_name} />
                <AvatarFallback className="text-2xl font-bold bg-blue-500 text-white">
                  {company.company_name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {company.is_admin && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                  <Shield className="w-3 h-3 text-white" />
                </div>
              )}
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold">{company.company_name}</h1>
                <Badge variant="outline" className="text-xs">
                  ID: {company.id}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                {company.is_admin && (
                  <Badge className="bg-blue-500 hover:bg-blue-600 text-white">
                    <Shield className="w-3 h-3 mr-1" />
                    Admin Access
                  </Badge>
                )}
                <Badge
                  variant="secondary"
                  className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                >
                  <Building2 className="w-3 h-3 mr-1" />
                  {company.punch_mode}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Location & Boundaries }
          <Card className="border-0 shadow-sm bg-card">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                Location & Boundaries
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <span className="text-sm font-medium">Latitude</span>
                  <code className="text-sm bg-background px-2 py-1 rounded border">{company.latitude}</code>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <span className="text-sm font-medium">Longitude</span>
                  <code className="text-sm bg-background px-2 py-1 rounded border">{company.longitude}</code>
                </div>
                <Separator />
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <span className="text-sm font-medium">Perimeter</span>
                  <Badge className="bg-blue-500 hover:bg-blue-600 text-white">
                    <Gauge className="w-3 h-3 mr-1" />
                    {company.perimeter} km
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Work Schedule }
          <Card className="border-0 shadow-sm bg-card">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="w-8 h-8 rounded-lg bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                </div>
                Work Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <span className="text-sm font-medium">Daily Hours</span>
                  <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">
                    <Clock className="w-3 h-3 mr-1" />
                    {company.daily_working_hours}h
                  </Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <span className="text-sm font-medium">Summary Interval</span>
                  <Badge
                    variant="outline"
                    className="border-yellow-200 text-yellow-700 dark:border-yellow-800 dark:text-yellow-300"
                  >
                    <Calendar className="w-3 h-3 mr-1" />
                    {company.work_summary_interval}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Configuration }
          <Card className="border-0 shadow-sm bg-card">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <Settings className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                System Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Admin Rights</span>
                  </div>
                  <Badge
                    className={
                      company.is_admin ? "bg-blue-500 hover:bg-blue-600 text-white" : "bg-muted text-muted-foreground"
                    }
                  >
                    {company.is_admin ? "Enabled" : "Disabled"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Punch Mode</span>
                  </div>
                  <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">{company.punch_mode}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
*/
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Building2, MapPin, Clock, Gauge, Shield, Calendar, Users, Settings, Pencil } from "lucide-react"
import { useAuth, Company } from "@/context/AuthContext"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function CompanyProfilePage() {
  const { company } = useAuth()
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState<Company | null>(company)

  if (!company || !formData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
            <Building2 className="w-8 h-8 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">No Company Data</h3>
            <p className="text-sm text-muted-foreground">Company information is not available at the moment.</p>
          </div>
        </div>
      </div>
    )
  }

  const handleChange = (field: keyof Company, value: any) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleSave = () => {
    // TODO: Call API to save company data
    console.log("Saved Company Data:", formData)
    setEditMode(false)
  }

  const handleCancel = () => {
    setFormData(company)
    setEditMode(false)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Edit / Save */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-6 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="w-20 h-20 border-4 border-background shadow-lg">
                {editMode ? (
                  <Input
                    value={formData.company_name}
                    onChange={(e) => handleChange("company_name", e.target.value)}
                    className="w-20 h-20 rounded-full text-center text-lg font-bold"
                  />
                ) : (
                  <>
                    <AvatarImage src={formData.company_img || "/placeholder.svg"} alt={formData.company_name} />
                    <AvatarFallback className="text-2xl font-bold bg-blue-500 text-white">
                      {formData.company_name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </>
                )}
              </Avatar>
              {formData.is_admin && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                  <Shield className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3">
                {!editMode && <h1 className="text-3xl font-bold">{formData.company_name}</h1>}
                <Badge variant="outline" className="text-xs">
                  ID: {formData.id}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                {formData.is_admin && (
                  <Badge className="bg-blue-500 hover:bg-blue-600 text-white">
                    <Shield className="w-3 h-3 mr-1" />
                    Admin Access
                  </Badge>
                )}
                <Badge className="bg-yellow-100 text-yellow-800">
                  <Building2 className="w-3 h-3 mr-1" />
                  {formData.punch_mode}
                </Badge>
              </div>
            </div>
          </div>

          {/* Edit / Save Buttons */}
          <div>
            {editMode ? (
              <>
                <Button size="sm" variant="outline" onClick={handleCancel} className="mr-2">
                  Cancel
                </Button>
                <Button size="sm" variant="default" onClick={handleSave}>
                  Save
                </Button>
              </>
            ) : (
              <Button size="sm" variant="outline" onClick={() => setEditMode(true)}>
                <Pencil className="w-4 h-4 mr-1" /> Edit
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-3">

          {/* Location & Boundaries */}
          <Card className="border-0 shadow-sm bg-card">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-blue-600" />
                </div>
                Location & Boundaries
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <span className="text-sm font-medium">Latitude</span>
                  {editMode ? (
                    <Input
                      value={formData.latitude}
                      onChange={(e) => handleChange("latitude", e.target.value)}
                      className="w-24 text-right"
                    />
                  ) : (
                    <code className="text-sm bg-background px-2 py-1 rounded border">{formData.latitude}</code>
                  )}
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <span className="text-sm font-medium">Longitude</span>
                  {editMode ? (
                    <Input
                      value={formData.longitude}
                      onChange={(e) => handleChange("longitude", e.target.value)}
                      className="w-24 text-right"
                    />
                  ) : (
                    <code className="text-sm bg-background px-2 py-1 rounded border">{formData.longitude}</code>
                  )}
                </div>

                <Separator />
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <span className="text-sm font-medium">Perimeter</span>
                  {editMode ? (
                    <Input
                      value={formData.perimeter}
                      onChange={(e) => handleChange("perimeter", e.target.value)}
                      className="w-24 text-right"
                    />
                  ) : (
                    <Badge className="bg-blue-500 hover:bg-blue-600 text-white">
                      <Gauge className="w-3 h-3 mr-1" />
                      {formData.perimeter} km
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Work Schedule */}
          <Card className="border-0 shadow-sm bg-card">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-yellow-600" />
                </div>
                Work Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <span className="text-sm font-medium">Daily Hours</span>
                  {editMode ? (
                    <Input
                      value={formData.daily_working_hours}
                      onChange={(e) => handleChange("daily_working_hours", e.target.value)}
                      className="w-24 text-right"
                    />
                  ) : (
                    <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">
                      <Clock className="w-3 h-3 mr-1" />
                      {formData.daily_working_hours}h
                    </Badge>
                  )}
                </div>
                <Separator />
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <span className="text-sm font-medium">Summary Interval</span>
                  {editMode ? (
                    <Input
                      value={formData.work_summary_interval}
                      onChange={(e) => handleChange("work_summary_interval", e.target.value)}
                      className="w-24 text-right"
                    />
                  ) : (
                    <Badge className="bg-yellow-100 text-yellow-800">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formData.work_summary_interval}
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Settings */}
          <Card className="border-0 shadow-sm bg-card">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Settings className="w-4 h-4 text-blue-600" />
                </div>
                System Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Admin Rights</span>
                  </div>
                  {editMode ? (
                    <Input
                      type="checkbox"
                      checked={formData.is_admin}
                      onChange={(e) => handleChange("is_admin", e.target.checked)}
                    />
                  ) : (
                    <Badge className={formData.is_admin ? "bg-blue-500 hover:bg-blue-600 text-white" : "bg-muted text-muted-foreground"}>
                      {formData.is_admin ? "Enabled" : "Disabled"}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Punch Mode</span>
                  </div>
                  {editMode ? (
                    <Input
                      value={formData.punch_mode}
                      onChange={(e) => handleChange("punch_mode", e.target.value)}
                      className="w-24 text-right"
                    />
                  ) : (
                    <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">{formData.punch_mode}</Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}
