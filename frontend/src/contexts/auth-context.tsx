"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService, User } from "@/lib/auth";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (telegramData: any) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const isAuthenticated = !!user && authService.isAuthenticated();

  useEffect(() => {
    // Check if user is already logged in
    const initAuth = async () => {
      try {
        const storedUser = authService.getUser();
        const token = authService.getAccessToken();
        
        if (storedUser && token) {
          // Verify token is still valid by making a test API call
          const response = await authService.apiCall("/api/v1/users/me");
          if (response.ok) {
            setUser(storedUser);
          } else {
            // Token is invalid, clear storage
            await authService.logout();
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        await authService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (telegramData: any) => {
    try {
      const data = await authService.login(telegramData);
      
      // Store token and user data
      localStorage.setItem("access_token", data.token.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      setUser(data.user);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      // Even if logout fails, clear local state
      setUser(null);
      router.push("/");
    }
  };

  const refreshUser = async () => {
    try {
      const response = await authService.apiCall("/api/v1/users/me");
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      }
    } catch (error) {
      console.error("Refresh user error:", error);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
