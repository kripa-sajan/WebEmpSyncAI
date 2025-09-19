/*"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext"; // 👈 import here

export function SwitchCompanyButton() {
  const { company, switchCompany } = useAuth(); // 👈 get company from context
  const [companies, setCompanies] = useState<{ id: string; name: string }[]>([]);
  const [selectedCompany, setSelectedCompany] = useState("");

  // Automatically select the current company from context
 useEffect(() => {
  if (company) {
    setSelectedCompany(company.id.toString());
  }
  // Only run on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);


  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await fetch("/api/companies", { method: "GET" });
        const data = await res.json();

        if (Array.isArray(data?.data)) {
          setCompanies(
            data.data.map((c: any) => ({
              id: c.id?.toString() || c.company_id?.toString(),
              name: c.name || c.company_name || "Unnamed Company",
            }))
          );
        } else {
          console.error("Unexpected companies response:", data);
          setCompanies([]);
        }
      } catch (err) {
        console.error("Failed to fetch companies:", err);
        setCompanies([]);
      }
    };

    fetchCompanies();
  }, []);

  const handleSwitch = () => {
    if (!selectedCompany) return;

    const companyObj = companies.find((c) => c.id === selectedCompany);
    if (!companyObj) return;

    switchCompany({
      id: Number(companyObj.id),
      company_name: companyObj.name,
      company_img: "",
      latitude: 0,
      longitude: 0,
      perimeter: 0,
      travel_speed_threshold: 0,
      daily_working_hours: 0,
      work_summary_interval: "",
      punch_mode: "",
      is_admin: false,
    });

    window.location.reload(); // optional
  };

  return (
    <div className="flex items-center space-x-2">
      <select
        value={selectedCompany}
        onChange={(e) => setSelectedCompany(e.target.value)}
        className="border p-1 rounded"
      >
        <option value="">Select Company</option>
        {companies.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      <Button onClick={handleSwitch} variant="outline">
        Switch
      </Button>
    </div>
  );
}*/


"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext"; // 👈 import here

export function SwitchCompanyButton() {
  const [companies, setCompanies] = useState<{ id: string; name: string }[]>([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const { switchCompany } = useAuth(); // 👈 get switchCompany from context

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await fetch("/api/companies", { method: "GET" });
        const data = await res.json();

        if (Array.isArray(data?.data)) {
          setCompanies(
            data.data.map((c: any) => ({
              id: c.id?.toString() || c.company_id?.toString(),
              name: c.name || c.company_name || "Unnamed Company",
            }))
          );
        } else {
          console.error("Unexpected companies response:", data);
          setCompanies([]);
        }
      } catch (err) {
        console.error("Failed to fetch companies:", err);
        setCompanies([]);
      }
    };

    fetchCompanies();
  }, []);

  const handleSwitch = () => {
    if (!selectedCompany) return;

    // find selected company object
    const companyObj = companies.find((c) => c.id === selectedCompany);
    if (!companyObj) return;

    // ✅ call context method to update
    switchCompany({
      id: Number(companyObj.id),
      company_name: companyObj.name,
      company_img: "",
      latitude: 0,
      longitude: 0,
      perimeter: 0,
      travel_speed_threshold: 0,
      daily_working_hours: 0,
      work_summary_interval: "",
      punch_mode: "",
      is_admin: false,
    });

    // Optional: force reload if you want backend sync
    window.location.reload();
  };

  return (
    <div className="flex items-center space-x-2">
      <select
        value={selectedCompany}
        onChange={(e) => setSelectedCompany(e.target.value)}
        className="border p-1 rounded"
      >
        <option value="">Select Company</option>
        {companies.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      <Button onClick={handleSwitch} variant="outline">
        Switch
      </Button>
    </div>
  );
}