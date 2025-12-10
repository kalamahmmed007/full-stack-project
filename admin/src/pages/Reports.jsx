// src/pages/Reports.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../config"; // adjust path if needed
import { toast } from "react-toastify";
import {
    BarChart3,
    FileBarChart,
    Package,
    Users,
    Warehouse,
    FileText,
    Upload,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const reportsList = [
    { name: "Sales Report", icon: <BarChart3 className="h-6 w-6" />, path: "/admin/reports/sales" },
    { name: "Revenue Report", icon: <FileBarChart className="h-6 w-6" />, path: "/admin/reports/revenue" },
    { name: "Product Report", icon: <Package className="h-6 w-6" />, path: "/admin/reports/products" },
    { name: "Customer Report", icon: <Users className="h-6 w-6" />, path: "/admin/reports/customers" },
    { name: "Inventory Report", icon: <Warehouse className="h-6 w-6" />, path: "/admin/reports/inventory" },
    { name: "Tax Report", icon: <FileText className="h-6 w-6" />, path: "/admin/reports/tax" },
    { name: "Export Data", icon: <Upload className="h-6 w-6" />, path: "/admin/reports/export" },
];

const Reports = () => {
    const [loading, setLoading] = useState(false);
    const [reportData, setReportData] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchReports = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${backendUrl}/reports`); // assuming your API returns summary stats
                setReportData(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                toast.error("Failed to fetch report data");
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <h1 className="mb-6 text-2xl font-bold">Reports</h1>
            {loading ? (
                <p className="text-gray-500">Loading...</p>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {reportsList.map((report) => (
                        <div
                            key={report.name}
                            onClick={() => navigate(report.path)}
                            className="flex cursor-pointer items-center justify-between rounded-lg bg-white p-4 shadow transition hover:shadow-lg"
                        >
                            <div className="flex items-center gap-4">
                                <div className="rounded-lg bg-blue-50 p-3">{report.icon}</div>
                                <div>
                                    <p className="font-semibold">{report.name}</p>
                                    <p className="text-sm text-gray-500">
                                        {reportData[report.name?.toLowerCase().replace(/ /g, "_")] || 0} records
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Reports;
