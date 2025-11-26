import { createContext, useContext, useState, useEffect, createElement } from "react";
import { httpAPIGet } from "../../services/apiService";

const DashboardContext = createContext();

export const useDashboard = () => {
    const context = useContext(DashboardContext);
    if (!context) {
        throw new Error("useDashboard debe usarse dentro de DashboardProvider");
    }
    return context;
};

export const DashboardProvider = ({ children }) => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await httpAPIGet("/dashboard");

            if (response.status === "success") {
                setDashboardData(response.data);
            } else {
                throw new Error(response.error || "Error al cargar dashboard");
            }
        } catch (err) {
            console.error("❌ Error al cargar dashboard:", err);
            setError(err.message || "Error desconocido");
        } finally {
            setLoading(false);
        }
    };

    const refreshDashboard = () => {
        fetchDashboardData();
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const value = {
        dashboardData,
        loading,
        error,
        refreshDashboard,
    };

    return createElement(DashboardContext.Provider, { value }, children);
};

