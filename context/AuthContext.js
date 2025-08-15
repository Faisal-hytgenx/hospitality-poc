'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const users = [
  {
    id: "admin1",
    username: "admin",
    password: "admin123",
    role: "admin",
    name: "Admin User"
  },
  {
    id: "owner1",
    username: "owner",
    password: "owner123",
    role: "owner",
    name: "John Smith",
    properties: ["property1", "property2"]
  },
  {
    id: "staff1",
    username: "staff",
    password: "staff123",
    role: "staff",
    name: "Jane Doe",
    department: "housekeeping",
    assignedProperty: "property1",
    skills: ["cleaning"]
  }
];

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for saved user
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (username, password) => {
    const foundUser = users.find(
      (u) => u.username === username && u.password === password
    );
    
    if (foundUser) {
      const userInfo = { ...foundUser };
      delete userInfo.password; // Don't store password in state
      setUser(userInfo);
      localStorage.setItem('user', JSON.stringify(userInfo));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};