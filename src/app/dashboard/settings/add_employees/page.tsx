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
      setMessage("❌ Please fix the errors above");
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
      setMessage("✅ Employee added successfully!");
      
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
      setMessage(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = (fieldName) => 
    `w-full border p-3 rounded-lg transition-colors ${
      errors[fieldName] 
        ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-200' 
        : 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200'
    } focus:outline-none`;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Card className="max-w-2xl mx-auto shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold text-center">Add New Employee</CardTitle>
        </CardHeader>
        
        <div className="p-8">
          {message && (
            <Badge
              variant={message.startsWith("✅") ? "default" : "destructive"}
              className="mb-6 text-sm py-2 px-4"
            >
              {message}
            </Badge>
          )}

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="Enter first name"
                  className={inputClasses('first_name')}
                />
                {errors.first_name && (
                  <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Enter last name"
                  className={inputClasses('last_name')}
                />
                {errors.last_name && (
                  <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
                className={inputClasses('email')}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number *
                </label>
                <input
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="Enter mobile number"
                  className={inputClasses('mobile')}
                />
                {errors.mobile && (
                  <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender *
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={inputClasses('gender')}
                >
                  <option value="">Select Gender</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                  <option value="O">Other</option>
                </select>
                {errors.gender && (
                  <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role *
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className={inputClasses('role')}
                >
                  <option value="">Select Role</option>
                  <option value="test">Test</option>
                  <option value="test role">Test Role</option>
                  <option value="developer">Developer</option>
                  
                </select>
                {errors.role && (
                  <p className="text-red-500 text-sm mt-1">{errors.role}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Biometric ID *
                </label>
                <input
                  type="text"
                  name="biometric_id"
                  value={formData.biometric_id}
                  onChange={handleChange}
                  placeholder="Enter biometric ID"
                  className={inputClasses('biometric_id')}
                />
                {errors.biometric_id && (
                  <p className="text-red-500 text-sm mt-1">{errors.biometric_id}</p>
                )}
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Communication Preferences</h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="is_whatsapp"
                    checked={formData.is_whatsapp}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">Enable WhatsApp notifications</span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="is_sms"
                    checked={formData.is_sms}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">Enable SMS notifications</span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="is_wfh"
                    checked={formData.is_wfh}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">Work from home enabled</span>
                </label>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-lg font-medium transition-all duration-200 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding Employee...
                </span>
              ) : (
                "Add Employee"
              )}
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}