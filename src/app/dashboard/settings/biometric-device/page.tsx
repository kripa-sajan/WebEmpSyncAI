"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Fingerprint, 
  Plus, 
  Edit2, 
  Trash2, 
  Search, 
  Settings,
  CheckCircle,
  AlertCircle,
  X,
  Save
} from "lucide-react";

interface BiometricDevice {
  id?: string;
  device_id: string;
  device_name: string;
  location: string;
  status: 'active' | 'inactive' | 'maintenance';
  company_id: string;
  ip_address?: string;
  model?: string;
  last_sync?: string;
}

export default function BiometricDevicesPage() {
  const [devices, setDevices] = useState<BiometricDevice[]>([]);
  const [filteredDevices, setFilteredDevices] = useState<BiometricDevice[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingDevice, setEditingDevice] = useState<BiometricDevice | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState<BiometricDevice>({
    device_id: "",
    device_name: "",
    location: "",
    status: "active",
    company_id: "7", // Default company ID
    ip_address: "",
    model: "",
  });

  // Fetch devices
 const fetchDevices = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/settings/biometric-device/list?company_id=7");
      if (!res.ok) throw new Error("Failed to fetch devices");
      const data = await res.json();
      setDevices(data);
      setFilteredDevices(data);
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: 'Failed to load devices' });
      setDevices([]);
      setFilteredDevices([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  // Filter devices based on search
  useEffect(() => {
    const filtered = devices.filter(device => 
      device.device_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.device_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDevices(filtered);
  }, [searchTerm, devices]);

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
    
    if (!form.device_id.trim()) newErrors.device_id = "Device ID is required";
    if (!form.device_name.trim()) newErrors.device_name = "Device name is required";
    if (!form.location.trim()) newErrors.location = "Location is required";
    if (!form.company_id.trim()) newErrors.company_id = "Company ID is required";
    
    // Check if device ID already exists (only for new devices)
    if (!editingDevice && devices.some(d => d.device_id.toLowerCase() === form.device_id.toLowerCase())) {
      newErrors.device_id = "Device ID already exists";
    }

    // IP address validation (optional but if provided, should be valid)
    if (form.ip_address && !/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(form.ip_address)) {
      newErrors.ip_address = "Please enter a valid IP address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Reset form
  const resetForm = () => {
    setForm({
      device_id: "",
      device_name: "",
      location: "",
      status: "active",
      company_id: "7",
      ip_address: "",
      model: "",
    });
    setErrors({});
    setShowAddForm(false);
    setEditingDevice(null);
  };

  // Handle form submission (Add/Update)
  const handleSubmit = async () => {
    if (!validateForm()) {
      setMessage({ type: 'error', text: 'Please fix the errors above' });
      return;
    }

    setIsSubmitting(true);
    try {
      let res;
      if (editingDevice?.id) {
        res = await fetch(`/api/settings/biometric-device/${editingDevice.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      } else {
        res = await fetch("/api/settings/biometric-device/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }
        const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: `Device ${editingDevice ? 'updated' : 'added'} successfully!` });
        resetForm();
        fetchDevices();
      } else {
        setMessage({ type: 'error', text: data.message || `Failed to ${editingDevice ? 'update' : 'add'} device` });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Network error while saving device' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (device: BiometricDevice) => {
    if (!window.confirm(`Are you sure you want to delete "${device.device_name}"?`)) return;
    try {
      const res = await fetch(`/api/settings/biometric-device/${device.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company_id: device.company_id }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: 'Device deleted successfully!' });
        fetchDevices();
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to delete device' });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Network error while deleting device' });
    }
  };

  // Handle edit
  const handleEdit = (device: BiometricDevice) => {
    setForm({ ...device });
    setEditingDevice(device);
    setShowAddForm(true);
  };

  const handleInputChange = (field: keyof BiometricDevice, value: string) => {
    setForm({ ...form, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const getInputClasses = (fieldName: string) => 
    `transition-colors ${errors[fieldName] 
      ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
    }`;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatLastSync = (dateString?: string) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header*/ }
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <Fingerprint className="h-8 w-8 text-blue-600" />
                Biometric Devices
              </h1>
              <p className="text-gray-600 mt-2">Manage biometric devices and their configurations</p>
            </div>
            <Button 
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Device
            </Button>
          </div>
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

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search devices by name, ID, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 max-w-md"
            />
          </div>
        </div>

        {/* Add/Edit Device Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    {editingDevice ? 'Edit Device' : 'Add New Device'}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={resetForm}
                    className="text-white hover:bg-white/20"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Device ID *
                    </label>
                    <Input
                      placeholder="e.g. BIO001"
                      value={form.device_id}
                      onChange={(e) => handleInputChange('device_id', e.target.value)}
                      className={getInputClasses('device_id')}
                    />
                    {errors.device_id && (
                      <p className="text-red-500 text-xs mt-1">{errors.device_id}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Device Name *
                    </label>
                    <Input
                      placeholder="e.g. Main Entrance Scanner"
                      value={form.device_name}
                      onChange={(e) => handleInputChange('device_name', e.target.value)}
                      className={getInputClasses('device_name')}
                    />
                    {errors.device_name && (
                      <p className="text-red-500 text-xs mt-1">{errors.device_name}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location *
                    </label>
                    <Input
                      placeholder="e.g. Building A - Main Door"
                      value={form.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className={getInputClasses('location')}
                    />
                    {errors.location && (
                      <p className="text-red-500 text-xs mt-1">{errors.location}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status *
                    </label>
                    <select
                      value={form.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className={`w-full p-2 border rounded-md ${getInputClasses('status')}`}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="maintenance">Maintenance</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      IP Address
                    </label>
                    <Input
                      placeholder="e.g. 192.168.1.100"
                      value={form.ip_address}
                      onChange={(e) => handleInputChange('ip_address', e.target.value)}
                      className={getInputClasses('ip_address')}
                    />
                    {errors.ip_address && (
                      <p className="text-red-500 text-xs mt-1">{errors.ip_address}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Model
                    </label>
                    <Input
                      placeholder="e.g. ZKTeco F18"
                      value={form.model}
                      onChange={(e) => handleInputChange('model', e.target.value)}
                      className={getInputClasses('model')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company ID *
                    </label>
                    <Input
                      value={form.company_id}
                      onChange={(e) => handleInputChange('company_id', e.target.value)}
                      className={getInputClasses('company_id')}
                    />
                    {errors.company_id && (
                      <p className="text-red-500 text-xs mt-1">{errors.company_id}</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        {editingDevice ? 'Updating...' : 'Adding...'}
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Save className="h-4 w-4" />
                        {editingDevice ? 'Update Device' : 'Add Device'}
                      </span>
                    )}
                  </Button>
                  <Button variant="outline" onClick={resetForm} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Devices List */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Fingerprint className="h-5 w-5 text-blue-600" />
                Registered Devices ({filteredDevices.length})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Loading devices...</span>
              </div>
            ) : filteredDevices.length === 0 ? (
              <div className="text-center py-12">
                <Fingerprint className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No devices found</p>
                <p className="text-gray-400">
                  {searchTerm ? 'Try adjusting your search terms' : 'Add your first biometric device'}
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredDevices.map((device, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg text-gray-900">{device.device_name}</h3>
                          <Badge className={`text-xs ${getStatusColor(device.status)}`}>
                            {device.status.charAt(0).toUpperCase() + device.status.slice(1)}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-3">
                          <div>
                            <span className="text-gray-600">Device ID:</span>
                            <p className="font-medium">{device.device_id}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Location:</span>
                            <p className="font-medium">{device.location}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">IP Address:</span>
                            <p className="font-medium">{device.ip_address || 'N/A'}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Model:</span>
                            <p className="font-medium">{device.model || 'N/A'}</p>
                          </div>
                        </div>

                        <div className="text-xs text-gray-500">
                          Last sync: {formatLastSync(device.last_sync)}
                        </div>
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEdit(device)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDelete(device)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:border-red-300"
                        >
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
    </div>
  );
}
/*"use client";
import { useEffect, useState } from "react";

interface BiometricDevice {
  id: number;
  device_id: string;
  company_id: number;
}

export default function BiometricDevicePage() {
  const [devices, setDevices] = useState<BiometricDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [newDeviceId, setNewDeviceId] = useState("");
  const [companyId, setCompanyId] = useState("1"); // Default company ID

  // Fetch devices
  const fetchDevices = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/biometric-device`);
      const data = await res.json();
      setDevices(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  // Add a device
  const addDevice = async () => {
    if (!newDeviceId) return alert("Enter device_id");
    try {
      const res = await fetch(`/api/biometric-device`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ device_id: newDeviceId, company_id: companyId }),
      });
      const data = await res.json();
      alert(data.message);
      fetchDevices();
      setNewDeviceId("");
    } catch (err) {
      console.error(err);
    }
  };

  // Update a device
  const updateDevice = async (id: number) => {
    const updatedId = prompt("Enter new device_id:");
    if (!updatedId) return;
    try {
      const res = await fetch(`/api/biometric-device/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ device_id: updatedId, company_id: companyId }),
      });
      const data = await res.json();
      alert(data.message);
      fetchDevices();
    } catch (err) {
      console.error(err);
    }
  };

  // Delete a device
  const deleteDevice = async (id: number) => {
    if (!confirm("Are you sure you want to delete this device?")) return;
    try {
      const res = await fetch(`/api/biometric-device/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company_id: companyId }),
      });
      const data = await res.json();
      alert(data.message);
      fetchDevices();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Biometric Devices</h1>

      <div className="mb-6 flex gap-2">
        <input
          type="text"
          placeholder="Device ID"
          value={newDeviceId}
          onChange={(e) => setNewDeviceId(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          onClick={addDevice}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Add Device
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Device ID</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {devices.map((device) => (
              <tr key={device.id}>
                <td className="p-2 border">{device.id}</td>
                <td className="p-2 border">{device.device_id}</td>
                <td className="p-2 border flex gap-2">
                  <button
                    onClick={() => updateDevice(device.id)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteDevice(device.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {devices.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center p-4">
                  No devices found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}*/
