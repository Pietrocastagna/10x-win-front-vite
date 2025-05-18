import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

console.log("API BASE URL:", import.meta.env.VITE_API_BASE_URL);

interface User {
  id: string;
  email: string;
}

interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => ({ success: false }),
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("authToken");
      const userId = localStorage.getItem("userId");
      const email = localStorage.getItem("userEmail");
      if (token && userId) {
        setUser({ id: userId, email: email || "" });
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password,
      });

      const token = response.data.token;
      const user = response.data.user;

      if (token && user) {
        localStorage.setItem("authToken", token);
        localStorage.setItem("userId", user._id || user.id);
        localStorage.setItem("userEmail", user.email);
        setUser({ id: user._id || user.id, email: user.email });
        setIsAuthenticated(true);
        return { success: true };
      }

      return { success: false, error: "Token non trovato nella risposta" };
    } catch (err: any) {
      const message = err.response?.data?.message || "Errore login";
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userEmail");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
