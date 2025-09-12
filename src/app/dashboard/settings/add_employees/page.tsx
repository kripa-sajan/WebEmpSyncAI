/*"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AddEmployeePage() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    mobile: "",
    gender: "",
    role: "",
    company_id: "7",
    password: "empsyncai123@",
    biometric_id: "",
    is_whatsapp: true,
    is_sms: true,
    is_wfh: true,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/employees/add_employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to add employee: ${res.status} - ${errorText}`);
      }

      await res.json();
      setMessage("✅ Employee added successfully!");
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        mobile: "",
        gender: "",
        role: "",
        company_id: "7",
        password: "empsyncai123@",
        biometric_id: "",
        is_whatsapp: true,
        is_sms: true,
        is_wfh: true,
      });
    } catch (error: any) {
      console.error("Error adding employee:", error.message);
      setMessage(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-lg mx-auto p-6 border-l-4 border-l-blue-500">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold mb-4">Add Employee</CardTitle>
        {message && (
          <Badge
            variant={message.startsWith("✅") ? "default" : "destructive"}
            className="mb-4"
          >
            {message}
          </Badge>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            placeholder="First Name"
            required
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            placeholder="Last Name"
            required
            className="w-full border p-2 rounded"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            placeholder="Mobile"
            required
            className="w-full border p-2 rounded"
          />
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          >
            <option value="">Select Gender</option>
            <option value="M">Male</option>
            <option value="F">Female</option>
          </select>
              <select
        name="role"
        value={formData.role}
        onChange={handleChange}
        required
        className="w-full border p-2 rounded"
      >
        <option value="">Select Role</option>
        <option value="test">Test</option>
        <option value="test role">Test Role</option>
        <option value="developer">Developer</option>
      </select>
          <input
            type="text"
            name="biometric_id"
            value={formData.biometric_id}
            onChange={handleChange}
            placeholder="Biometric ID"
            required
            className="w-full border p-2 rounded"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded w-full"
          >
            {loading ? "Adding..." : "Add Employee"}
          </button>
        </form>
      </CardHeader>
    </Card>
  );
}*/
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  UserPlus, 
  User, 
  Mail, 
  Phone, 
  Briefcase, 
  Fingerprint, 
  CheckCircle, 
  AlertCircle,
  MessageSquare,
  MessageCircle,
  Home,
  Users,
  Save
} from "lucide-react";

export default function AddEmployeePage() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    mobile: "",
    gender: "",
    role: "",
    company_id: "7",
    password: "empsyncai123@",
    biometric_id: "",
    is_whatsapp: true,
    is_sms: true,
    is_wfh: true,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.first_name.trim()) newErrors.first_name = "First name is required";
    if (!formData.last_name.trim()) newErrors.last_name = "Last name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^\+?[\d\s-()]+$/.test(formData.mobile)) {
      newErrors.mobile = "Please enter a valid mobile number";
    }
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.role) newErrors.role = "Role is required";
    if (!formData.biometric_id.trim()) newErrors.biometric_id = "Biometric ID is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setMessage("Please fix the errors above");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/employees/add_employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(errorData.error || `Failed to add employee: ${res.status}`);
      }

      const result = await res.json();
      setMessage("Employee added successfully!");
      
      // Reset form
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        mobile: "",
        gender: "",
        role: "",
        company_id: "7",
        password: "empsyncai123@",
        biometric_id: "",
        is_whatsapp: true,
        is_sms: true,
        is_wfh: true,
      });
      setErrors({});
    } catch (error) {
      console.error("Error adding employee:", error.message);
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <UserPlus className="h-8 w-8 text-primary" />
              </div>
              Add Employee
            </h1>
            <p className="text-muted-foreground">
              Create a new employee profile with comprehensive details
            </p>
          </div>
        </div>

        <Separator className="bg-gradient-to-r from-transparent via-border to-transparent" />

        <div className="max-w-4xl mx-auto">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl">
            <CardHeader className="space-y-4">
              {message && (
                <Card className={`border-l-4 ${
                  message === "Employee added successfully!" 
                    ? 'border-green-500 bg-green-50/50 dark:bg-green-950/50' 
                    : 'border-red-500 bg-red-50/50 dark:bg-red-950/50'
                } backdrop-blur-sm`}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      {message === "Employee added successfully!" ? (
                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                      )}
                      <span className={message === "Employee added successfully!" 
                        ? 'text-green-800 dark:text-green-200' 
                        : 'text-red-800 dark:text-red-200'
                      }>
                        {message}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardHeader>

            <CardContent className="space-y-8 p-8">
              {/* Personal Information */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Personal Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <User className="h-3.5 w-3.5" />
                      First Name *
                    </label>
                    <Input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      placeholder="Enter first name"
                      className={`bg-background/50 ${errors.first_name ? 'border-red-500 focus:border-red-500' : ''}`}
                    />
                    {errors.first_name && (
                      <p className="text-red-500 text-xs">{errors.first_name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <User className="h-3.5 w-3.5" />
                      Last Name *
                    </label>
                    <Input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      placeholder="Enter last name"
                      className={`bg-background/50 ${errors.last_name ? 'border-red-500 focus:border-red-500' : ''}`}
                    />
                    {errors.last_name && (
                      <p className="text-red-500 text-xs">{errors.last_name}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5" />
                    Email Address *
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    className={`bg-background/50 ${errors.email ? 'border-red-500 focus:border-red-500' : ''}`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs">{errors.email}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5" />
                      Mobile Number *
                    </label>
                    <Input
                      type="text"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      placeholder="Enter mobile number"
                      className={`bg-background/50 ${errors.mobile ? 'border-red-500 focus:border-red-500' : ''}`}
                    />
                    {errors.mobile && (
                      <p className="text-red-500 text-xs">{errors.mobile}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Users className="h-3.5 w-3.5" />
                      Gender *
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className={`w-full p-2 border border-input rounded-md bg-background/50 text-foreground focus:border-primary focus:ring-1 focus:ring-primary ${errors.gender ? 'border-red-500 focus:border-red-500' : ''}`}
                    >
                      <option value="">Select Gender</option>
                      <option value="M">Male</option>
                      <option value="F">Female</option>
                      <option value="O">Other</option>
                    </select>
                    {errors.gender && (
                      <p className="text-red-500 text-xs">{errors.gender}</p>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Professional Information */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Briefcase className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Professional Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Briefcase className="h-3.5 w-3.5" />
                      Role *
                    </label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className={`w-full p-2 border border-input rounded-md bg-background/50 text-foreground focus:border-primary focus:ring-1 focus:ring-primary ${errors.role ? 'border-red-500 focus:border-red-500' : ''}`}
                    >
                      <option value="">Select Role</option>
                      <option value="test">Test</option>
                      <option value="test role">Test Role</option>
                      <option value="developer">Developer</option>
                      
                    </select>
                    {errors.role && (
                      <p className="text-red-500 text-xs">{errors.role}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Fingerprint className="h-3.5 w-3.5" />
                      Biometric ID *
                    </label>
                    <Input
                      type="text"
                      name="biometric_id"
                      value={formData.biometric_id}
                      onChange={handleChange}
                      placeholder="Enter biometric ID"
                      className={`bg-background/50 ${errors.biometric_id ? 'border-red-500 focus:border-red-500' : ''}`}
                    />
                    {errors.biometric_id && (
                      <p className="text-red-500 text-xs">{errors.biometric_id}</p>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Communication & Work Preferences */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <MessageSquare className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Communication & Work Preferences</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="border-border/50 bg-background/30 hover:bg-background/50 transition-colors">
                    <CardContent className="p-4">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="is_whatsapp"
                          checked={formData.is_whatsapp}
                          onChange={handleChange}
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        />
                        <div className="flex items-center gap-2">
                          <MessageCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-foreground">WhatsApp</span>
                        </div>
                      </label>
                      <p className="text-xs text-muted-foreground mt-2 ml-7">Enable WhatsApp notifications</p>
                    </CardContent>
                  </Card>

                  <Card className="border-border/50 bg-background/30 hover:bg-background/50 transition-colors">
                    <CardContent className="p-4">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="is_sms"
                          checked={formData.is_sms}
                          onChange={handleChange}
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        />
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium text-foreground">SMS</span>
                        </div>
                      </label>
                      <p className="text-xs text-muted-foreground mt-2 ml-7">Enable SMS notifications</p>
                    </CardContent>
                  </Card>

                  <Card className="border-border/50 bg-background/30 hover:bg-background/50 transition-colors">
                    <CardContent className="p-4">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="is_wfh"
                          checked={formData.is_wfh}
                          onChange={handleChange}
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        />
                        <div className="flex items-center gap-2">
                          <Home className="h-4 w-4 text-purple-600" />
                          <span className="text-sm font-medium text-foreground">WFH</span>
                        </div>
                      </label>
                      <p className="text-xs text-muted-foreground mt-2 ml-7">Work from home enabled</p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <Separator />

              {/* Submit Button */}
              <div className="flex justify-end">
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white px-8 py-3 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                  size="lg"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      Adding Employee...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Save className="h-5 w-5" />
                      Add Employee
                    </span>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}