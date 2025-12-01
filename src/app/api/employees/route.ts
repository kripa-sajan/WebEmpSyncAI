// app/api/employees/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// Simple in-memory cache with TTL (Time To Live)
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
      return NextResponse.json({ 
        success: false, 
        error: "Unauthorized" 
      }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const company_id = body.company_id || cookieStore.get("company_id")?.value;
    const page = body.page || 1;
    const limit = body.limit || 50;
    const employee_id = body.employee_id;
    const group = body.group; // ✅ NEW: Get group filter from request

    if (!company_id) {
      return NextResponse.json({ 
        success: false, 
        error: "Missing company_id" 
      }, { status: 400 });
    }

    const apiUrl = process.env.API_URL;
    
    // ✅ FIXED: If requesting a specific employee - return consistent structure
    if (employee_id) {
      console.log(`🔍 Searching for employee ID: ${employee_id} in company ${company_id}`);
      
      // Try cache first
      const cacheKey = `employee-${company_id}-${employee_id}`;
      const cached = cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        console.log(`✅ Found employee in cache`);
        return NextResponse.json({ 
          success: true, 
          data: cached.data 
        });
      }
      
      // Efficient search
      const employee = await findEmployeeOptimized(apiUrl, token, company_id, employee_id);
      if (employee) {
        // Cache the result
        cache.set(cacheKey, {
          data: employee,
          timestamp: Date.now()
        });
        console.log(`✅ Employee found: ${employee.first_name} ${employee.last_name}`);
        return NextResponse.json({ 
          success: true, 
          data: employee 
        });
      }
      
      console.log(`❌ Employee ${employee_id} not found in company ${company_id}`);
      return NextResponse.json({ 
        success: false, 
        error: "Employee not found" 
      }, { status: 404 });
    }

    // ✅ UPDATED: For paginated requests with group filter
    console.log(`📋 Fetching paginated employees - Company: ${company_id}, Page: ${page}, Limit: ${limit}, Group: ${group || 'All'}`);
    
    const fetchUrl = `${apiUrl}/admin/users/${page}`;
    const startTime = Date.now();
    
    // ✅ UPDATED: Prepare request body with optional group filter
    const requestBody: any = { company_id, limit };
    if (group) {
      requestBody.group = group;
    }
    
    const res = await fetch(fetchUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(`❌ Failed to fetch paginated employees: ${res.status}`);
      return NextResponse.json(
        { 
          success: false,
          error: `Failed to fetch employees: ${res.status}` 
        },
        { status: res.status }
      );
    }

    const responseData = await res.json();
    let employees = responseData.data || [];
    
    // ✅ NEW: If backend doesn't support group filtering, filter on our side
    if (group && !isBackendGroupFiltered(responseData, group)) {
      const originalCount = employees.length;
      employees = employees.filter((emp: any) => emp.group === group);
      console.log(`✅ Client-side filtered to ${employees.length} employees in group: ${group} (from ${originalCount})`);
    }

    const fetchTime = Date.now() - startTime;
    console.log(`📊 Page ${page}: ${employees.length} employees (${fetchTime}ms)${group ? ` in group: ${group}` : ''}`);
    
    // ✅ REMOVED: Deduplication - using employees as-is from backend
    
    // ✅ REMOVED: Sorting - using employees in backend-sorted order

    // Cache page 1 for faster individual employee lookups (only if no group filter)
    if (page === 1 && employees.length > 0 && !group) {
      const pageCacheKey = `company-${company_id}-page1`;
      cache.set(pageCacheKey, {
        data: employees,
        timestamp: Date.now()
      });
      console.log(`💾 Cached page 1 with ${employees.length} employees`);
    }

    // ✅ UPDATED: Calculate total pages considering group filter
    let totalPages = responseData.total_page || 1;
    let totalEmployees = responseData.total || responseData.total_count || 0;
    
    // If we're filtering by group, adjust totals
    if (group && employees.length < (responseData.data?.length || 0)) {
      // This is a rough estimate - in a real scenario, you'd want the backend to provide accurate counts
      totalEmployees = employees.length; // This will be adjusted per page
      console.log(`📈 Adjusted totals for group filter: ${employees.length} employees on this page`);
    }

    return NextResponse.json({
      success: true,
      employees: employees, // ✅ CHANGED: Return employees directly without sorting
      currentPage: page,
      totalPages: totalPages,
      totalEmployees: totalEmployees,
      totalCount: totalEmployees, // Ensure this is always present
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      filteredByGroup: group || null, // ✅ NEW: Indicate if results are filtered by group
    });
  } catch (err) {
    console.error("❌ Employees API error:", err);
    return NextResponse.json(
      { 
        success: false,
        error: "Internal server error" 
      },
      { status: 500 }
    );
  }
}

// ✅ NEW: Helper function to check if backend supports group filtering
function isBackendGroupFiltered(responseData: any, requestedGroup: string): boolean {
  // Check if the response indicates backend filtering
  // This is a simple heuristic - you might need to adjust based on your backend API
  if (responseData.filtered_by_group) return true;
  if (responseData.group_filter === requestedGroup) return true;
  
  // If all employees in response have the requested group, backend likely filtered
  const employees = responseData.data || [];
  if (employees.length > 0) {
    const allInRequestedGroup = employees.every((emp: any) => emp.group === requestedGroup);
    if (allInRequestedGroup) return true;
  }
  
  return false;
}

// ✅ IMPROVED: Optimized employee search with better logging
async function findEmployeeOptimized(
  apiUrl: string, 
  token: string, 
  company_id: string, 
  employee_id: string
): Promise<any> {
  
  console.log(`🔍 Starting optimized search for employee ${employee_id}`);
  
  // Strategy 1: Check cached page 1 first
  const page1CacheKey = `company-${company_id}-page1`;
  const cachedPage1 = cache.get(page1CacheKey);
  if (cachedPage1 && Date.now() - cachedPage1.timestamp < CACHE_TTL) {
    const employee = cachedPage1.data.find((emp: any) => 
      emp.id.toString() === employee_id || 
      emp.biometric_id?.toString() === employee_id
    );
    if (employee) {
      console.log(`✅ Found in page 1 cache`);
      return employee;
    }
  }
  
  // Strategy 2: Smart page search - check first 3 pages (most employees are here)
  const pagesToCheck = [1, 2, 3];
  let totalPages = 1;
  
  for (const page of pagesToCheck) {
    console.log(`📄 Searching page ${page} for employee ${employee_id}`);
    
    try {
      const fetchUrl = `${apiUrl}/admin/users/${page}`;
      const res = await fetch(fetchUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ company_id, limit: 100 }),
        cache: "no-store",
      });

      if (!res.ok) {
        console.log(`❌ Page ${page} fetch failed: ${res.status}`);
        continue;
      }

      const responseData = await res.json();
      const employees = responseData.data || [];
      
      if (page === 1) {
        totalPages = responseData.total_page || 1;
        console.log(`📑 Total pages: ${totalPages}`);
        
        // If total pages is large, add last few pages to search
        if (totalPages > 5) {
          // Add last 2 pages for employees who joined recently
          pagesToCheck.push(totalPages);
          if (totalPages > 1) pagesToCheck.push(totalPages - 1);
          console.log(`➕ Added pages ${totalPages - 1}, ${totalPages} to search`);
        }
      }
      
      // Search for employee with multiple ID fields
      const employee = employees.find((emp: any) => 
        emp.id.toString() === employee_id || 
        emp.biometric_id?.toString() === employee_id ||
        emp.employee_id?.toString() === employee_id
      );
      
      if (employee) {
        console.log(`🎯 FOUND on page ${page}: ${employee.first_name} ${employee.last_name}`);
        return employee;
      }
      
      // If we have many pages and didn't find in first 3, do targeted search
      if (page === 3 && totalPages > 10) {
        console.log(`⚡ Many pages detected (${totalPages}), using targeted search`);
        const found = await targetedPageSearch(apiUrl, token, company_id, employee_id, totalPages);
        if (found) return found;
      }
    } catch (error) {
      console.error(`❌ Error searching page ${page}:`, error);
      continue;
    }
  }
  
  console.log(`❌ Employee ${employee_id} not found in any searched pages`);
  return null;
}

// ✅ NEW: More efficient targeted search instead of binary search
async function targetedPageSearch(
  apiUrl: string,
  token: string,
  company_id: string,
  employee_id: string,
  totalPages: number
): Promise<any> {
  // Strategy: Check pages in chunks to find the employee faster
  const chunkSize = 5;
  const maxPagesToCheck = 10; // Don't check more than 10 pages total
  
  console.log(`🎯 Starting targeted search across ${totalPages} pages`);
  
  // Create chunks of pages to check
  const chunks = [];
  for (let i = 4; i <= Math.min(totalPages, maxPagesToCheck + 3); i += chunkSize) {
    const chunk = [];
    for (let j = i; j < i + chunkSize && j <= totalPages; j++) {
      chunk.push(j);
    }
    if (chunk.length > 0) chunks.push(chunk);
  }
  
  // Search through chunks
  for (const chunk of chunks) {
    console.log(`🔍 Checking pages: ${chunk.join(', ')}`);
    
    // Check pages in parallel for faster search
    const promises = chunk.map(async (page) => {
      try {
        const fetchUrl = `${apiUrl}/admin/users/${page}`;
        const res = await fetch(fetchUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ company_id, limit: 100 }),
          cache: "no-store",
        });

        if (!res.ok) return null;

        const responseData = await res.json();
        const employees = responseData.data || [];
        
        return employees.find((emp: any) => 
          emp.id.toString() === employee_id || 
          emp.biometric_id?.toString() === employee_id ||
          emp.employee_id?.toString() === employee_id
        ) || null;
      } catch (error) {
        console.error(`❌ Error checking page ${page}:`, error);
        return null;
      }
    });
    
    const results = await Promise.all(promises);
    const foundEmployee = results.find(emp => emp !== null);
    
    if (foundEmployee) {
      console.log(`🎯 FOUND during targeted search: ${foundEmployee.first_name} ${foundEmployee.last_name}`);
      return foundEmployee;
    }
  }
  
  console.log(`❌ Employee not found in targeted search`);
  return null;
}

// ✅ NEW: Cache cleanup function
function cleanupCache() {
  const now = Date.now();
  for (const [key, value] of cache.entries()) {
    if (now - value.timestamp > CACHE_TTL) {
      cache.delete(key);
    }
  }
}

// Run cleanup occasionally (every 10 minutes)
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupCache, 10 * 60 * 1000);
}


// // app/api/employees/route.ts

// import { NextResponse } from "next/server";
// import { cookies } from "next/headers";

// export async function POST(req: Request) {
//   try {
//     const cookieStore = await cookies();
//     const token = cookieStore.get("access_token")?.value;

//     if (!token) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const body = await req.json().catch(() => ({}));
//     const company_id = body.company_id || cookieStore.get("company_id")?.value;
//     const page = body.page || 1;
//     const limit = body.limit || 50;
//     const employee_id = body.employee_id;

//     if (!company_id) {
//       return NextResponse.json({ error: "Missing company_id" }, { status: 400 });
//     }

//     const apiUrl = process.env.API_URL;
    
//     // If requesting a specific employee, search through all pages
//     if (employee_id) {
//       let currentPage = 1;
//       let totalPages = 1;
      
//       while (currentPage <= totalPages) {
//         const fetchUrl = `${apiUrl}/admin/users/${currentPage}`;
//         const res = await fetch(fetchUrl, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({ company_id, limit: 100 }),
//           cache: "no-store",
//         });

//         if (!res.ok) {
//           return NextResponse.json(
//             { error: `Failed to fetch employees: ${res.status}` },
//             { status: res.status }
//           );
//         }

//         const responseData = await res.json();
//         const employees = responseData.data || [];
        
//         if (currentPage === 1) {
//           totalPages = responseData.total_page || 1;
//         }

//         const employee = employees.find((emp: any) => emp.id.toString() === employee_id.toString());
//         if (employee) {
//           return NextResponse.json(employee);
//         }

//         currentPage++;
//       }

//       return NextResponse.json({ error: "Employee not found" }, { status: 404 });
//     }

//     // Original paginated request
//     const fetchUrl = `${apiUrl}/admin/users/${page}`;
//     const res = await fetch(fetchUrl, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({ company_id, limit }),
//       cache: "no-store",
//     });

//     if (!res.ok) {
//       return NextResponse.json(
//         { error: `Failed to fetch employees: ${res.status}` },
//         { status: res.status }
//       );
//     }

//     const responseData = await res.json();

//     // Sort employees alphabetically by first name, then last name
//     const sortedEmployees = (responseData.data || []).sort((a: any, b: any) => {
//       const nameA = `${a.first_name || ''} ${a.last_name || ''}`.toLowerCase();
//       const nameB = `${b.first_name || ''} ${b.last_name || ''}`.toLowerCase();
//       return nameA.localeCompare(nameB);
//     });



// // Update to use the correct field name:
//       return NextResponse.json({
//         employees: sortedEmployees,
//         currentPage: page,
//         totalPages: responseData.total_page,
//         totalEmployees: responseData.total || 0, // FIXED: Use "total" not "total_count"
//         hasNextPage: page < responseData.total_page,
//         hasPrevPage: page > 1,
//       });
//   } catch (err) {
//     console.error("Users API error:", err);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

// // app/api/employees/route.ts
// import { NextResponse } from "next/server";
// import { cookies } from "next/headers";

// // Simple in-memory cache with TTL (Time To Live)
// const cache = new Map();
// const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// export async function POST(req: Request) {
//   try {
//     const cookieStore = await cookies();
//     const token = cookieStore.get("access_token")?.value;

//     if (!token) {
//       return NextResponse.json({ 
//         success: false, 
//         error: "Unauthorized" 
//       }, { status: 401 });
//     }

//     const body = await req.json().catch(() => ({}));
//     const company_id = body.company_id || cookieStore.get("company_id")?.value;
//     const page = body.page || 1;
//     const limit = body.limit || 50;
//     const employee_id = body.employee_id;

//     if (!company_id) {
//       return NextResponse.json({ 
//         success: false, 
//         error: "Missing company_id" 
//       }, { status: 400 });
//     }

//     const apiUrl = process.env.API_URL;
    
//     // ✅ FIXED: If requesting a specific employee - return consistent structure
//     if (employee_id) {
//       console.log(`🔍 Searching for employee ID: ${employee_id} in company ${company_id}`);
      
//       // Try cache first
//       const cacheKey = `employee-${company_id}-${employee_id}`;
//       const cached = cache.get(cacheKey);
//       if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
//         console.log(`✅ Found employee in cache`);
//         return NextResponse.json({ 
//           success: true, 
//           data: cached.data 
//         });
//       }
      
//       // Efficient search
//       const employee = await findEmployeeOptimized(apiUrl, token, company_id, employee_id);
//       if (employee) {
//         // Cache the result
//         cache.set(cacheKey, {
//           data: employee,
//           timestamp: Date.now()
//         });
//         console.log(`✅ Employee found: ${employee.first_name} ${employee.last_name}`);
//         return NextResponse.json({ 
//           success: true, 
//           data: employee 
//         });
//       }
      
//       console.log(`❌ Employee ${employee_id} not found in company ${company_id}`);
//       return NextResponse.json({ 
//         success: false, 
//         error: "Employee not found" 
//       }, { status: 404 });
//     }

//     // ✅ FIXED: For paginated requests - return consistent structure
//     console.log(`📋 Fetching paginated employees - Company: ${company_id}, Page: ${page}, Limit: ${limit}`);
    
//     const fetchUrl = `${apiUrl}/admin/users/${page}`;
//     const startTime = Date.now();
    
//     const res = await fetch(fetchUrl, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({ company_id, limit }),
//       cache: "no-store",
//     });

//     if (!res.ok) {
//       console.error(`❌ Failed to fetch paginated employees: ${res.status}`);
//       return NextResponse.json(
//         { 
//           success: false,
//           error: `Failed to fetch employees: ${res.status}` 
//         },
//         { status: res.status }
//       );
//     }

//     const responseData = await res.json();
//     const employees = responseData.data || [];
    
//     const fetchTime = Date.now() - startTime;
//     console.log(`📊 Page ${page}: ${employees.length} employees (${fetchTime}ms)`);
    
//     // Fast deduplication for current page only
//     const uniqueEmployees = deduplicateEmployees(employees);
//     console.log(`🔄 After deduplication: ${uniqueEmployees.length} unique employees`);
    
//     // Fast sorting
//     const sortedEmployees = sortEmployeesFast(uniqueEmployees, limit);

//     // Cache page 1 for faster individual employee lookups
//     if (page === 1 && employees.length > 0) {
//       const pageCacheKey = `company-${company_id}-page1`;
//       cache.set(pageCacheKey, {
//         data: employees,
//         timestamp: Date.now()
//       });
//       console.log(`💾 Cached page 1 with ${employees.length} employees`);
//     }

//     return NextResponse.json({
//       success: true,
//       employees: sortedEmployees,
//       currentPage: page,
//       totalPages: responseData.total_page || 1,
//       totalEmployees: responseData.total || responseData.total_count || 0,
//       totalCount: responseData.total || responseData.total_count || 0, // Ensure this is always present
//       hasNextPage: page < (responseData.total_page || 1),
//       hasPrevPage: page > 1,
//     });
//   } catch (err) {
//     console.error("❌ Employees API error:", err);
//     return NextResponse.json(
//       { 
//         success: false,
//         error: "Internal server error" 
//       },
//       { status: 500 }
//     );
//   }
// }

// // ✅ IMPROVED: Optimized employee search with better logging
// async function findEmployeeOptimized(
//   apiUrl: string, 
//   token: string, 
//   company_id: string, 
//   employee_id: string
// ): Promise<any> {
  
//   console.log(`🔍 Starting optimized search for employee ${employee_id}`);
  
//   // Strategy 1: Check cached page 1 first
//   const page1CacheKey = `company-${company_id}-page1`;
//   const cachedPage1 = cache.get(page1CacheKey);
//   if (cachedPage1 && Date.now() - cachedPage1.timestamp < CACHE_TTL) {
//     const employee = cachedPage1.data.find((emp: any) => 
//       emp.id.toString() === employee_id || 
//       emp.biometric_id?.toString() === employee_id
//     );
//     if (employee) {
//       console.log(`✅ Found in page 1 cache`);
//       return employee;
//     }
//   }
  
//   // Strategy 2: Smart page search - check first 3 pages (most employees are here)
//   const pagesToCheck = [1, 2, 3];
//   let totalPages = 1;
  
//   for (const page of pagesToCheck) {
//     console.log(`📄 Searching page ${page} for employee ${employee_id}`);
    
//     try {
//       const fetchUrl = `${apiUrl}/admin/users/${page}`;
//       const res = await fetch(fetchUrl, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ company_id, limit: 100 }),
//         cache: "no-store",
//       });

//       if (!res.ok) {
//         console.log(`❌ Page ${page} fetch failed: ${res.status}`);
//         continue;
//       }

//       const responseData = await res.json();
//       const employees = responseData.data || [];
      
//       if (page === 1) {
//         totalPages = responseData.total_page || 1;
//         console.log(`📑 Total pages: ${totalPages}`);
        
//         // If total pages is large, add last few pages to search
//         if (totalPages > 5) {
//           // Add last 2 pages for employees who joined recently
//           pagesToCheck.push(totalPages);
//           if (totalPages > 1) pagesToCheck.push(totalPages - 1);
//           console.log(`➕ Added pages ${totalPages - 1}, ${totalPages} to search`);
//         }
//       }
      
//       // Search for employee with multiple ID fields
//       const employee = employees.find((emp: any) => 
//         emp.id.toString() === employee_id || 
//         emp.biometric_id?.toString() === employee_id ||
//         emp.employee_id?.toString() === employee_id
//       );
      
//       if (employee) {
//         console.log(`🎯 FOUND on page ${page}: ${employee.first_name} ${employee.last_name}`);
//         return employee;
//       }
      
//       // If we have many pages and didn't find in first 3, do targeted search
//       if (page === 3 && totalPages > 10) {
//         console.log(`⚡ Many pages detected (${totalPages}), using targeted search`);
//         const found = await targetedPageSearch(apiUrl, token, company_id, employee_id, totalPages);
//         if (found) return found;
//       }
//     } catch (error) {
//       console.error(`❌ Error searching page ${page}:`, error);
//       continue;
//     }
//   }
  
//   console.log(`❌ Employee ${employee_id} not found in any searched pages`);
//   return null;
// }

// // ✅ NEW: More efficient targeted search instead of binary search
// async function targetedPageSearch(
//   apiUrl: string,
//   token: string,
//   company_id: string,
//   employee_id: string,
//   totalPages: number
// ): Promise<any> {
//   // Strategy: Check pages in chunks to find the employee faster
//   const chunkSize = 5;
//   const maxPagesToCheck = 10; // Don't check more than 10 pages total
  
//   console.log(`🎯 Starting targeted search across ${totalPages} pages`);
  
//   // Create chunks of pages to check
//   const chunks = [];
//   for (let i = 4; i <= Math.min(totalPages, maxPagesToCheck + 3); i += chunkSize) {
//     const chunk = [];
//     for (let j = i; j < i + chunkSize && j <= totalPages; j++) {
//       chunk.push(j);
//     }
//     if (chunk.length > 0) chunks.push(chunk);
//   }
  
//   // Search through chunks
//   for (const chunk of chunks) {
//     console.log(`🔍 Checking pages: ${chunk.join(', ')}`);
    
//     // Check pages in parallel for faster search
//     const promises = chunk.map(async (page) => {
//       try {
//         const fetchUrl = `${apiUrl}/admin/users/${page}`;
//         const res = await fetch(fetchUrl, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({ company_id, limit: 100 }),
//           cache: "no-store",
//         });

//         if (!res.ok) return null;

//         const responseData = await res.json();
//         const employees = responseData.data || [];
        
//         return employees.find((emp: any) => 
//           emp.id.toString() === employee_id || 
//           emp.biometric_id?.toString() === employee_id ||
//           emp.employee_id?.toString() === employee_id
//         ) || null;
//       } catch (error) {
//         console.error(`❌ Error checking page ${page}:`, error);
//         return null;
//       }
//     });
    
//     const results = await Promise.all(promises);
//     const foundEmployee = results.find(emp => emp !== null);
    
//     if (foundEmployee) {
//       console.log(`🎯 FOUND during targeted search: ${foundEmployee.first_name} ${foundEmployee.last_name}`);
//       return foundEmployee;
//     }
//   }
  
//   console.log(`❌ Employee not found in targeted search`);
//   return null;
// }

// // ✅ FIXED: Fast deduplication using Map
// function deduplicateEmployees(employees: any[]): any[] {
//   if (!employees || employees.length === 0) return [];
  
//   if (employees.length <= 100) {
//     // For small arrays, use simple approach
//     const seen = new Set();
//     return employees.filter(emp => {
//       if (!emp || !emp.id) return false;
//       if (seen.has(emp.id)) return false;
//       seen.add(emp.id);
//       return true;
//     });
//   } else {
//     // For large arrays, use Map for better performance
//     const map = new Map();
//     employees.forEach(emp => {
//       if (emp && emp.id && !map.has(emp.id)) {
//         map.set(emp.id, emp);
//       }
//     });
//     return Array.from(map.values());
//   }
// }

// // ✅ FIXED: Optimized sorting with null checks
// function sortEmployeesFast(employees: any[], limit: number): any[] {
//   if (!employees || employees.length === 0) return [];
  
//   // For pagination, we only need to sort the current page's data
//   if (employees.length <= 100) {
//     // For small datasets, use full sort with null checks
//     return employees.sort((a, b) => {
//       const nameA = `${a.first_name || ''} ${a.last_name || ''}`.toLowerCase().trim();
//       const nameB = `${b.first_name || ''} ${b.last_name || ''}`.toLowerCase().trim();
//       return nameA.localeCompare(nameB);
//     });
//   } else {
//     // For large datasets, use faster comparison
//     return employees.sort((a, b) => {
//       // Compare by first name first, then last name
//       const firstNameA = (a.first_name || '').toLowerCase();
//       const firstNameB = (b.first_name || '').toLowerCase();
      
//       if (firstNameA !== firstNameB) {
//         return firstNameA.localeCompare(firstNameB);
//       }
      
//       const lastNameA = (a.last_name || '').toLowerCase();
//       const lastNameB = (b.last_name || '').toLowerCase();
//       return lastNameA.localeCompare(lastNameB);
//     });
//   }
// }

// // ✅ NEW: Cache cleanup function (optional)
// function cleanupCache() {
//   const now = Date.now();
//   for (const [key, value] of cache.entries()) {
//     if (now - value.timestamp > CACHE_TTL) {
//       cache.delete(key);
//     }
//   }
// }

// // Run cleanup occasionally (every 10 minutes)
// setInterval(cleanupCache, 10 * 60 * 1000);