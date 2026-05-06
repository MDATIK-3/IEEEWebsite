'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, LogOut, Users, AlertCircle, FileText, ExternalLink, Mail, Phone } from "lucide-react";
import { fetchAdminData, logoutAction } from "@/app/actions/adminAuth"; 

export default function AdminPage() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetchAdminData();
        
        if (response.status === "error") throw new Error(response.message);
        
        setData(Array.isArray(response) ? response : []);
      } catch (err) {
        if (err.message === "Unauthorized") {
          router.push("/Admin/Login"); 
        } else {
          setError(err.message || "Failed to load data.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [router]);

  const handleLogout = async () => {
    await logoutAction();
    router.push("/Admin/Login");
  };

  if (loading) return (
    <div className="flex flex-col justify-center items-center h-screen bg-slate-50 dark:bg-slate-900">
      <Loader2 className="animate-spin text-emerald-600 h-10 w-10 mb-4" />
      <p className="text-slate-600 dark:text-slate-400 font-medium animate-pulse">Loading dashboard...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-[1400px] mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl text-emerald-600 dark:text-emerald-400">
              <Users className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">Manage IEEE GUB membership applications</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
            <div className="text-sm font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-lg">
              Total: {data.length}
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-5 py-2.5 rounded-xl font-bold hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors border border-red-100 dark:border-red-900/50">
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </div>

        {error ? (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl flex items-center gap-3 border border-red-200 dark:border-red-800/50 font-medium">
            <AlertCircle className="h-6 w-6" /> {error}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                    <th className="p-5 font-bold text-sm">Applicant</th>
                    <th className="p-5 font-bold text-sm">Contact Info</th>
                    <th className="p-5 font-bold text-sm">Academics</th>
                    <th className="p-5 font-bold text-sm">Role & Motivation</th>
                    <th className="p-5 font-bold text-sm">Resume (CV)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {data.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-12 text-center text-slate-500 dark:text-slate-400">
                        <Users className="h-12 w-12 mx-auto mb-3 opacity-20" />
                        <p className="text-lg font-medium">No applications found yet.</p>
                      </td>
                    </tr>
                  ) : (
                    data.map((row, i) => {
                      // Safety fallbacks for different sheet header capitalizations
                      const getVal = (keys) => {
                        for (let key of keys) {
                          if (row[key] !== undefined) return row[key];
                        }
                        return "—";
                      };

                      const cvLink = getVal(["cvFileUrl", "CV Link", "cv", "Resume"]);

                      return (
                        <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                          
                          {/* Applicant Column */}
                          <td className="p-5 align-top">
                            <div className="font-bold text-slate-900 dark:text-white text-base">
                              {getVal(["name", "Name"])}
                            </div>
                            <div className="text-sm font-mono text-slate-500 dark:text-slate-400 mt-1 bg-slate-100 dark:bg-slate-800 inline-block px-2 py-0.5 rounded">
                              ID: {getVal(["studentId", "Student ID", "studentid"])}
                            </div>
                          </td>

                          {/* Contact Column */}
                          <td className="p-5 align-top space-y-2">
                            <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                              <Mail className="h-4 w-4 text-slate-400" />
                              <a href={`mailto:${getVal(["email", "Email"])}`} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                                {getVal(["email", "Email"])}
                              </a>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                              <Phone className="h-4 w-4 text-slate-400" />
                              <a href={`https://wa.me/${getVal(["whatsapp", "WhatsApp"]).replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                                {getVal(["whatsapp", "WhatsApp", "Phone"])}
                              </a>
                            </div>
                          </td>

                          {/* Academics Column */}
                          <td className="p-5 align-top">
                            <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                              {getVal(["semester", "Semester"])}
                            </div>
                            <div className="text-sm text-slate-600 dark:text-slate-400 mt-1 flex items-center gap-2">
                              <span className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded font-bold">
                                CGPA: {getVal(["cgpa", "CGPA"])}
                              </span>
                              <span>•</span>
                              <span>{getVal(["credits", "Credits", "Credits Completed"])} Credits</span>
                            </div>
                          </td>

                          {/* Role & Motivation Column */}
                          <td className="p-5 align-top max-w-[300px]">
                            <div className="inline-flex text-xs font-bold bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-2.5 py-1 rounded-full mb-2 border border-blue-100 dark:border-blue-800">
                              {getVal(["position", "Position"])}
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 hover:line-clamp-none transition-all cursor-pointer" title={getVal(["motivation", "Motivation"])}>
                              "{getVal(["motivation", "Motivation"])}"
                            </p>
                          </td>

                          {/* CV Column */}
                          <td className="p-5 align-top">
                            {cvLink !== "—" && cvLink.startsWith("http") ? (
                              <a 
                                href={cvLink} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:opacity-90 transition-opacity"
                              >
                                <FileText className="h-4 w-4" />
                                View PDF
                                <ExternalLink className="h-3 w-3 opacity-70" />
                              </a>
                            ) : (
                              <span className="text-sm text-slate-400 italic bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg">No CV</span>
                            )}
                          </td>

                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}