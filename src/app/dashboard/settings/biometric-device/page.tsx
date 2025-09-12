"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
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
  Save,
  MapPin,
  Monitor,
  Wifi,
  Activity,
  Clock,
  Building
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
  const [currentPage, setCurrentPage] = useState(1);

  const [form, setForm] = useState<BiometricDevice>({
    device_id: "",
    device_name: "",
    location: "",
    status: "active",
    company_id: "7", // Default company ID
    ip_address: "",
    model: "",
  });

  // Fetch devices (paginated)
  const fetchDevices = async (page = 1) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/settings/biometric-device/page/${page}`);
      if (!res.ok) throw new Error("Failed to fetch devices");
      const data = await res.json();
      setDevices(data?.devices || data); // in case API returns { devices, totalPages }
      setFilteredDevices(data?.devices || data);
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
    fetchDevices(currentPage);
  }, [currentPage]);

  // Filter devices based on search
  useEffect(() => {
    const filtered = devices.filter(device => 
      (device.device_name ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (device.device_id ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (device.location ?? '').toLowerCase().includes(searchTerm.toLowerCase())
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

    // IP address validation
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
        res = await fetch("/api/settings/biometric-device", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: `Device ${editingDevice ? 'updated' : 'added'} successfully!` });
        resetForm();
        fetchDevices(currentPage);
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
        fetchDevices(currentPage);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/10 text-green-600 border-green-200 dark:bg-green-500/20 dark:text-green-400 dark:border-green-800';
      case 'inactive': return 'bg-gray-500/10 text-gray-600 border-gray-200 dark:bg-gray-500/20 dark:text-gray-400 dark:border-gray-800';
      case 'maintenance': return 'bg-yellow-500/10 text-yellow-600 border-yellow-200 dark:bg-yellow-500/20 dark:text-yellow-400 dark:border-yellow-800';
      default: return 'bg-gray-500/10 text-gray-600 border-gray-200 dark:bg-gray-500/20 dark:text-gray-400 dark:border-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Activity className="h-3 w-3" />;
      case 'inactive': return <X className="h-3 w-3" />;
      case 'maintenance': return <Settings className="h-3 w-3" />;
      default: return <Activity className="h-3 w-3" />;
    }
  };

  const formatLastSync = (dateString?: string) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Fingerprint className="h-8 w-8 text-primary" />
              </div>
              Biometric Devices
            </h1>
            <p className="text-muted-foreground">
              Manage biometric devices and their configurations
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="px-3 py-1">
              {filteredDevices.length} Device{filteredDevices.length !== 1 ? 's' : ''}
            </Badge>
            <Button 
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Device
            </Button>
          </div>
        </div>

        <Separator className="bg-gradient-to-r from-transparent via-border to-transparent" />

        {/* Message Display */}
        {message && (
          <Card className={`border-l-4 ${
            message.type === 'success' 
              ? 'border-green-500 bg-green-50/50 dark:bg-green-950/50' 
              : 'border-red-500 bg-red-50/50 dark:bg-red-950/50'
          } backdrop-blur-sm`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                {message.type === 'success' ? (
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                )}
                <span className={message.type === 'success' 
                  ? 'text-green-800 dark:text-green-200' 
                  : 'text-red-800 dark:text-red-200'
                }>
                  {message.text}
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search Bar */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="p-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search devices by name, ID, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background/50"
              />
            </div>
          </CardContent>
        </Card>

        {/* Add/Edit Device Modal */}
        <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background/95 backdrop-blur-md border border-border/50">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-foreground">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Settings className="h-5 w-5 text-primary" />
                  </div>
                  {editingDevice ? 'Edit Device' : 'Add New Device'}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={resetForm}
                  className="hover:bg-secondary"
                >
                  <X className="h-4 w-4" />
                </Button>
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Settings className="h-3.5 w-3.5" />
                    Device ID *
                  </label>
                  <Input
                    placeholder="e.g. BIO001"
                    value={form.device_id}
                    onChange={(e) => handleInputChange('device_id', e.target.value)}
                    className={`bg-background/50 ${errors.device_id ? 'border-red-500 focus:border-red-500' : ''}`}
                  />
                  {errors.device_id && (
                    <p className="text-red-500 text-xs">{errors.device_id}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Monitor className="h-3.5 w-3.5" />
                    Device Name *
                  </label>
                  <Input
                    placeholder="e.g. Main Entrance Scanner"
                    value={form.device_name}
                    onChange={(e) => handleInputChange('device_name', e.target.value)}
                    className={`bg-background/50 ${errors.device_name ? 'border-red-500 focus:border-red-500' : ''}`}
                  />
                  {errors.device_name && (
                    <p className="text-red-500 text-xs">{errors.device_name}</p>
                  )}
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5" />
                    Location *
                  </label>
                  <Input
                    placeholder="e.g. Building A - Main Door"
                    value={form.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className={`bg-background/50 ${errors.location ? 'border-red-500 focus:border-red-500' : ''}`}
                  />
                  {errors.location && (
                    <p className="text-red-500 text-xs">{errors.location}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Activity className="h-3.5 w-3.5" />
                    Status *
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full p-2 border border-input rounded-md bg-background/50 text-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Wifi className="h-3.5 w-3.5" />
                    IP Address
                  </label>
                  <Input
                    placeholder="e.g. 192.168.1.100"
                    value={form.ip_address}
                    onChange={(e) => handleInputChange('ip_address', e.target.value)}
                    className={`bg-background/50 ${errors.ip_address ? 'border-red-500 focus:border-red-500' : ''}`}
                  />
                  {errors.ip_address && (
                    <p className="text-red-500 text-xs">{errors.ip_address}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Monitor className="h-3.5 w-3.5" />
                    Model
                  </label>
                  <Input
                    placeholder="e.g. ZKTeco F18"
                    value={form.model}
                    onChange={(e) => handleInputChange('model', e.target.value)}
                    className="bg-background/50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Building className="h-3.5 w-3.5" />
                    Company ID *
                  </label>
                  <Input
                    value={form.company_id}
                    onChange={(e) => handleInputChange('company_id', e.target.value)}
                    className={`bg-background/50 ${errors.company_id ? 'border-red-500 focus:border-red-500' : ''}`}
                  />
                  {errors.company_id && (
                    <p className="text-red-500 text-xs">{errors.company_id}</p>
                  )}
                </div>
              </div>

              <Separator />

              <div className="flex gap-3">
                <Button 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
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
            </div>
          </DialogContent>
        </Dialog>

        {/* Devices List */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <Fingerprint className="h-5 w-5 text-primary" />
              Registered Devices ({filteredDevices.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center space-x-3 text-muted-foreground">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
                  <span>Loading devices...</span>
                </div>
              </div>
            ) : filteredDevices.length === 0 ? (
              <div className="text-center py-12">
                <Fingerprint className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-muted-foreground text-lg mb-2">No devices found</p>
                <p className="text-muted-foreground/70">
                  {searchTerm ? 'Try adjusting your search terms' : 'Add your first biometric device'}
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredDevices.map((device, index) => (
                  <Card key={index} className="group hover:shadow-lg transition-all duration-200 border-border/50 bg-background/50 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-primary/10">
                              <Fingerprint className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg text-foreground">{device.device_name}</h3>
                              <Badge variant="outline" className="text-xs mt-1">
                                ID: {device.device_id}
                              </Badge>
                            </div>
                            <Badge className={`text-xs flex items-center gap-1 ${getStatusColor(device.status || 'inactive')}`}>
                              {getStatusIcon(device.status || 'inactive')}
                              {(device.status || 'inactive').charAt(0).toUpperCase() + (device.status || 'inactive').slice(1)}
                            </Badge>

                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-4">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <MapPin className="h-3.5 w-3.5" />
                              <span className="font-medium text-foreground">{device.location}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Wifi className="h-3.5 w-3.5" />
                              <span className="font-medium text-foreground">{device.ip_address || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Monitor className="h-3.5 w-3.5" />
                              <span className="font-medium text-foreground">{device.model || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Clock className="h-3.5 w-3.5" />
                              <span className="font-medium text-foreground">{formatLastSync(device.last_sync)}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 ml-4">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleEdit(device)}
                            className="h-9 w-9 p-0 hover:bg-primary hover:text-primary-foreground transition-colors"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleDelete(device)}
                            className="h-9 w-9 p-0 hover:bg-destructive hover:text-destructive-foreground transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}