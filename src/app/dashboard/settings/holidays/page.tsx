/*"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function HolidayPage() {
  const [holidays, setHolidays] = useState<any[]>([]);
  const [form, setForm] = useState({
    leave_type: "",
    short_name: "",
    monthly_limit: "",
    yearly_limit: "",
    initial_credit: "",
  });

  // Fetch holidays
  const fetchHolidays = async () => {
    try {
      const res = await fetch("/api/holiday");
      const data = await res.json();
      if (res.ok) {
        setHolidays(data);
      }
    } catch (error) {
      console.error("Failed to load holidays", error);
    }
  };

  useEffect(() => {
    fetchHolidays();
  }, []);

  // Submit new holiday
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/settings/holiday", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setForm({
          leave_type: "",
          short_name: "",
          monthly_limit: "",
          yearly_limit: "",
          initial_credit: "",
        });
        fetchHolidays(); // reload list
      }
    } catch (err) {
      console.error("Error submitting holiday", err);
    }
  };

  return (
    <div className="p-6 grid grid-cols-2 gap-6">
      {/* Holiday List }
      <Card>
        <CardHeader>
          <CardTitle>Holiday List</CardTitle>
        </CardHeader>
        <CardContent>
          {holidays.length === 0 ? (
            <p>No holidays found.</p>
          ) : (
            <ul className="space-y-2">
              {holidays.map((h, i) => (
                <li key={i} className="p-2 border rounded-md">
                  <strong>{h.leave_type}</strong> ({h.short_name}) - Limit:{" "}
                  {h.monthly_limit}/{h.yearly_limit}, Credit:{" "}
                  {h.initial_credit}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Add Holiday Form }
      <Card>
        <CardHeader>
          <CardTitle>Add Holiday</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              placeholder="Leave Type"
              value={form.leave_type}
              onChange={(e) => setForm({ ...form, leave_type: e.target.value })}
            />
            <Input
              placeholder="Short Name"
              value={form.short_name}
              onChange={(e) => setForm({ ...form, short_name: e.target.value })}
            />
            <Input
              placeholder="Monthly Limit"
              type="number"
              value={form.monthly_limit}
              onChange={(e) =>
                setForm({ ...form, monthly_limit: e.target.value })
              }
            />
            <Input
              placeholder="Yearly Limit"
              type="number"
              value={form.yearly_limit}
              onChange={(e) =>
                setForm({ ...form, yearly_limit: e.target.value })
              }
            />
            <Input
              placeholder="Initial Credit"
              type="number"
              value={form.initial_credit}
              onChange={(e) =>
                setForm({ ...form, initial_credit: e.target.value })
              }
            />
            <Button type="submit" className="w-full">
              Add Holiday
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
*/

/*"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit2, Calendar, Clock, CreditCard, Plus, AlertCircle, CheckCircle } from "lucide-react";

interface Holiday {
  id?: string;
  leave_type: string;
  short_name: string;
  monthly_limit: string;
  yearly_limit: string;
  initial_credit: string;
}

export default function HolidayPage() {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [form, setForm] = useState<Holiday>({
    leave_type: "",
    short_name: "",
    monthly_limit: "",
    yearly_limit: "",
    initial_credit: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch holidays
  const fetchHolidays = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/holiday");
      const data = await res.json();
      if (res.ok) {
        setHolidays(data);
        setMessage({ type: 'success', text: `Loaded ${data.length} holiday types` });
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to load holidays' });
      }
    } catch (error) {
      console.error("Failed to load holidays", error);
      setMessage({ type: 'error', text: 'Network error while loading holidays' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHolidays();
  }, []);

  // Clear message after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!form.leave_type.trim()) newErrors.leave_type = "Leave type is required";
    if (!form.short_name.trim()) newErrors.short_name = "Short name is required";
    if (!form.monthly_limit || Number(form.monthly_limit) < 0) {
      newErrors.monthly_limit = "Valid monthly limit is required";
    }
    if (!form.yearly_limit || Number(form.yearly_limit) < 0) {
      newErrors.yearly_limit = "Valid yearly limit is required";
    }
    if (!form.initial_credit || Number(form.initial_credit) < 0) {
      newErrors.initial_credit = "Valid initial credit is required";
    }

    // Check if monthly limit exceeds yearly limit
    if (form.monthly_limit && form.yearly_limit && 
        Number(form.monthly_limit) * 12 > Number(form.yearly_limit)) {
      newErrors.yearly_limit = "Yearly limit should be at least 12x monthly limit";
    }

    // Check if short name already exists
    if (form.short_name && holidays.some(h => h.short_name.toLowerCase() === form.short_name.toLowerCase())) {
      newErrors.short_name = "Short name already exists";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit new holiday
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setMessage({ type: 'error', text: 'Please fix the errors above' });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/holiday", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setForm({
          leave_type: "",
          short_name: "",
          monthly_limit: "",
          yearly_limit: "",
          initial_credit: "",
        });
        setErrors({});
        setMessage({ type: 'success', text: 'Holiday type added successfully!' });
        fetchHolidays();
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to add holiday type' });
      }
    } catch (err) {
      console.error("Error submitting holiday", err);
      setMessage({ type: 'error', text: 'Network error while adding holiday type' });
    } finally {
      setIsSubmitting(false);
    }
  };*/
  "use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit2, Calendar, Clock, CreditCard, Plus, AlertCircle, CheckCircle } from "lucide-react";

interface Holiday {
  id?: string;
  leave_type: string;
  short_name: string;
  monthly_limit: string;
  yearly_limit: string;
  initial_credit: string;
  company_id?: string; // added for API
}

export default function HolidayPage() {
  const companyId = "7"; // replace with dynamic company ID if needed

  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [form, setForm] = useState<Holiday>({
    leave_type: "",
    short_name: "",
    monthly_limit: "",
    yearly_limit: "",
    initial_credit: "",
    company_id: companyId,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch holidays
  const fetchHolidays = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/settings/holiday/${companyId}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setHolidays(data.data);
        setMessage({ type: 'success', text: `Loaded ${data.data.length} holiday types` });
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to load holidays' });
      }
    } catch (error) {
      console.error("Failed to load holidays", error);
      setMessage({ type: 'error', text: 'Network error while loading holidays' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHolidays();
  }, []);
// 1️⃣ Validation function
const validateForm = () => {
  const newErrors: Record<string, string> = {};

  if (!form.leave_type.trim()) newErrors.leave_type = "Leave type is required";
  if (!form.short_name.trim()) newErrors.short_name = "Short name is required";
  if (!form.monthly_limit || Number(form.monthly_limit) < 0) newErrors.monthly_limit = "Valid monthly limit is required";
  if (!form.yearly_limit || Number(form.yearly_limit) < 0) newErrors.yearly_limit = "Valid yearly limit is required";
  if (!form.initial_credit || Number(form.initial_credit) < 0) newErrors.initial_credit = "Valid initial credit is required";

  if (form.monthly_limit && form.yearly_limit && Number(form.monthly_limit) * 12 > Number(form.yearly_limit)) {
    newErrors.yearly_limit = "Yearly limit should be at least 12x monthly limit";
  }

  if (form.short_name && holidays.some(h => h.short_name.toLowerCase() === form.short_name.toLowerCase())) {
    newErrors.short_name = "Short name already exists";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

// 2️⃣ Then handle submit
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!validateForm()) {
    setMessage({ type: 'error', text: 'Please fix the errors above' });
    return;
  }

  setIsSubmitting(true);
  try {
    const res = await fetch(`/api/settings/holiday/${companyId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok && data.success) {
      setForm({
        leave_type: "",
        short_name: "",
        monthly_limit: "",
        yearly_limit: "",
        initial_credit: "",
        company_id: companyId,
      });
      setErrors({});
      setMessage({ type: 'success', text: 'Holiday type added successfully!' });
      fetchHolidays();
    } else {
      setMessage({ type: 'error', text: data.message || 'Failed to add holiday type' });
    }
  } catch (err) {
    console.error("Error submitting holiday", err);
    setMessage({ type: 'error', text: 'Network error while adding holiday type' });
  } finally {
    setIsSubmitting(false);
  }
};

  

  const handleInputChange = (field: keyof Holiday, value: string) => {
    setForm({ ...form, [field]: value });
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const getInputClasses = (fieldName: string) => 
    `transition-colors ${errors[fieldName] 
      ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
    }`;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="h-8 w-8 text-blue-600" />
            Holiday Management
          </h1>
          <p className="text-gray-600 mt-2">Manage leave types and their allocations</p>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg border-l-4 flex items-center gap-2 ${
            message.type === 'success' 
              ? 'bg-green-50 border-green-400 text-green-700' 
              : 'bg-red-50 border-red-400 text-red-700'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Holiday List - Takes 2/3 width on large screens */}
          <div className="xl:col-span-2">
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Calendar className="h-5 w-5" />
                  Holiday Types ({holidays.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-gray-600">Loading holiday types...</span>
                  </div>
                ) : holidays.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No holiday types found</p>
                    <p className="text-gray-400">Create your first holiday type using the form</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {holidays.map((holiday, index) => (
                      <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <h3 className="font-semibold text-lg text-gray-900">{holiday.leave_type}</h3>
                              <Badge variant="secondary" className="text-xs">
                                {holiday.short_name}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-blue-500" />
                                <span className="text-gray-600">Monthly:</span>
                                <span className="font-medium">{holiday.monthly_limit}</span>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-green-500" />
                                <span className="text-gray-600">Yearly:</span>
                                <span className="font-medium">{holiday.yearly_limit}</span>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <CreditCard className="h-4 w-4 text-purple-500" />
                                <span className="text-gray-600">Credit:</span>
                                <span className="font-medium">{holiday.initial_credit}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-2 ml-4">
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                              <Edit2 className="h-3 w-3" />
                            </Button>
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Add Holiday Form - Takes 1/3 width on large screens */}
          <div className="xl:col-span-1">
            <Card className="shadow-lg border-0 sticky top-6">
              <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Plus className="h-5 w-5" />
                  Add Holiday Type
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Leave Type *
                    </label>
                    <Input
                      placeholder="e.g. Annual Leave"
                      value={form.leave_type}
                      onChange={(e) => handleInputChange('leave_type', e.target.value)}
                      className={getInputClasses('leave_type')}
                    />
                    {errors.leave_type && (
                      <p className="text-red-500 text-xs mt-1">{errors.leave_type}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Short Name *
                    </label>
                    <Input
                      placeholder="e.g. AL"
                      value={form.short_name}
                      onChange={(e) => handleInputChange('short_name', e.target.value.toUpperCase())}
                      className={getInputClasses('short_name')}
                      maxLength={5}
                    />
                    {errors.short_name && (
                      <p className="text-red-500 text-xs mt-1">{errors.short_name}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Monthly Limit *
                      </label>
                      <Input
                        placeholder="2"
                        type="number"
                        min="0"
                        value={form.monthly_limit}
                        onChange={(e) => handleInputChange('monthly_limit', e.target.value)}
                        className={getInputClasses('monthly_limit')}
                      />
                      {errors.monthly_limit && (
                        <p className="text-red-500 text-xs mt-1">{errors.monthly_limit}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Yearly Limit *
                      </label>
                      <Input
                        placeholder="24"
                        type="number"
                        min="0"
                        value={form.yearly_limit}
                        onChange={(e) => handleInputChange('yearly_limit', e.target.value)}
                        className={getInputClasses('yearly_limit')}
                      />
                      {errors.yearly_limit && (
                        <p className="text-red-500 text-xs mt-1">{errors.yearly_limit}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Initial Credit *
                    </label>
                    <Input
                      placeholder="0"
                      type="number"
                      min="0"
                      value={form.initial_credit}
                      onChange={(e) => handleInputChange('initial_credit', e.target.value)}
                      className={getInputClasses('initial_credit')}
                    />
                    {errors.initial_credit && (
                      <p className="text-red-500 text-xs mt-1">{errors.initial_credit}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Credit given to new employees
                    </p>
                  </div>

                  <Button 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Adding...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Add Holiday Type
                      </span>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}