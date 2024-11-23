import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define el tipo de datos del contexto
interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (authenticated: boolean) => void;
}

// Crea el contexto con valores por defecto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Crea un proveedor del contexto
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

// Crea un hook para consumir el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};