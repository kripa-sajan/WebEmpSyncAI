/*"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export function SwitchCompanyButton() {
  const [companies, setCompanies] = useState<any[]>([]); // 👈 always default to []
  const [selectedCompany, setSelectedCompany] = useState("");

useEffect(() => {
  const fetchCompanies = async () => {
    try {
      const res = await fetch("/api/companies", { method: "GET" });
      const data = await res.json();

      console.log("🔍 /api/companies response:", data);

      // Case A: API returns array directly
      if (Array.isArray(data)) {
        setCompanies(data);

      // Case B: API wraps inside .companies
      } else if (Array.isArray(data?.companies)) {
        setCompanies(
          data.companies.map((c: any) => ({
            id: c.id || c.company_id,
            name: c.name || c.company_name,
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
    console.log("Switching to company:", selectedCompany);
    // TODO: save selected company in context/localStorage and reload data
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

export function SwitchCompanyButton() {
  const [companies, setCompanies] = useState<{ id: string; name: string }[]>([]);
  const [selectedCompany, setSelectedCompany] = useState("");

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await fetch("/api/companies", { method: "GET" });
        const data = await res.json();

        console.log("🔍 /api/companies response:", data);

        // Expecting data to be like { success: true, data: [ { id, name }, ... ] }
        if (Array.isArray(data?.data)) {
          setCompanies(data.data.map((c: any) => ({
            id: c.id?.toString() || c.company_id?.toString(),
            name: c.name || c.company_name || "Unnamed Company",
          })));
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
    console.log("Switching to company:", selectedCompany);
    // TODO: save selected company in context/localStorage and reload dashboard data
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
