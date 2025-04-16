import React, { createContext, useContext, useState, useEffect } from 'react';
import { generatePassword } from '../utils/passwordGenerator';

export interface AdminUser {
  id: string;
  username: string;
  password: string;
  multiLogin: boolean;
  active: boolean;
  lastLoginIp?: string;
}

type AdminContextType = {
  admins: AdminUser[];
  addAdmin: (username: string, password?: string, multiLogin?: boolean) => void;
  updateAdmin: (admin: AdminUser) => void;
  deleteAdmin: (id: string) => void;
  toggleAdminStatus: (id: string) => void;
  toggleMultiLogin: (id: string) => void;
  canLogin: (username: string, password: string, ip: string) => boolean;
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmins = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmins must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admins, setAdmins] = useState<AdminUser[]>(() => {
    const savedAdmins = localStorage.getItem('admins');
    return savedAdmins ? JSON.parse(savedAdmins) : [{
      id: '1',
      username: 'darknes',
      password: 'darknes',
      multiLogin: true,
      active: true
    }];
  });

  useEffect(() => {
    localStorage.setItem('admins', JSON.stringify(admins));
  }, [admins]);

  const addAdmin = (username: string, password?: string, multiLogin: boolean = false) => {
    const newAdmin: AdminUser = {
      id: Date.now().toString(),
      username,
      password: password || generatePassword(),
      multiLogin,
      active: true
    };
    setAdmins([...admins, newAdmin]);
  };

  const updateAdmin = (updatedAdmin: AdminUser) => {
    setAdmins(admins.map(admin => 
      admin.id === updatedAdmin.id ? updatedAdmin : admin
    ));
  };

  const deleteAdmin = (id: string) => {
    setAdmins(admins.filter(admin => admin.id !== id));
  };

  const toggleAdminStatus = (id: string) => {
    setAdmins(admins.map(admin =>
      admin.id === id ? { ...admin, active: !admin.active } : admin
    ));
  };

  const toggleMultiLogin = (id: string) => {
    setAdmins(admins.map(admin =>
      admin.id === id ? { ...admin, multiLogin: !admin.multiLogin } : admin
    ));
  };

  const canLogin = (username: string, password: string, ip: string) => {
    const admin = admins.find(a => a.username === username && a.password === password);
    if (!admin || !admin.active) return false;

    if (!admin.multiLogin && admin.lastLoginIp && admin.lastLoginIp !== ip) {
      return false;
    }

    setAdmins(admins.map(a =>
      a.id === admin.id ? { ...a, lastLoginIp: ip } : a
    ));

    return true;
  };

  return (
    <AdminContext.Provider value={{
      admins,
      addAdmin,
      updateAdmin,
      deleteAdmin,
      toggleAdminStatus,
      toggleMultiLogin,
      canLogin
    }}>
      {children}
    </AdminContext.Provider>
  );
};