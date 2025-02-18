import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import Productos from './Productos';
import Remision from './Remision';
import Contratos from './Contratos';
import Consolidado from './Consolidado';
import Login from './Login';
import ProtectedRoute from './ProtectedRoute';
import Minutas from './minutas';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem('isAuthenticated') === 'true'
  );
  const [userRole, setUserRole] = useState(
    () => localStorage.getItem('userRole') || 'contratista'
  );

  useEffect(() => {
    localStorage.setItem('isAuthenticated', isAuthenticated);
    localStorage.setItem('userRole', userRole);
  }, [isAuthenticated, userRole]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    setIsAuthenticated(false);
    setUserRole('contratista');
  };

  const renderMenu = () => {
    switch (userRole) {
      case 'admin':
        return (
          <>
            <li><Link to="/productos">Productos</Link></li>
            <li><Link to="/remision">Remisión</Link></li>
            <li><Link to="/contratos">Contratos</Link></li>
            <li><Link to="/consolidado">Consolidado</Link></li>
            <li><Link to="/minutas">Minutas</Link></li>
          </>
        );
      case 'contratista':
        return (
          <>
            <li><Link to="/productos">Productos</Link></li>
            <li><Link to="/remision">Remisión</Link></li>
            <li><Link to="/contratos">Contratos</Link></li>
            <li><Link to="/consolidado">Consolidado</Link></li>
          </>
        );
      case 'proveedor':
        return (
          <>
            <li><Link to="/consolidado">Consolidado</Link></li>
            <li><Link to="/minutas">Minutas</Link></li>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Router>
      <div className="App">
        {isAuthenticated ? (
          <>
            <header className="App-header">
              <h1>Sistema de gestión de provisión de alimentos</h1>
              <button className="logout-button" onClick={handleLogout}>Cerrar Sesión</button>
              <nav>
                <ul>
                  {renderMenu()}
                </ul>
              </nav>
            </header>
            <Routes>
              <Route path="/productos" element={
                <ProtectedRoute isAuthenticated={isAuthenticated} userRole={userRole} allowedRoles={['admin', 'contratista']}>
                  <Productos />
                </ProtectedRoute>
              } />
              <Route path="/remision" element={
                <ProtectedRoute isAuthenticated={isAuthenticated} userRole={userRole} allowedRoles={['admin', 'contratista']}>
                  <Remision />
                </ProtectedRoute>
              } />
              <Route path="/contratos" element={
                <ProtectedRoute isAuthenticated={isAuthenticated} userRole={userRole} allowedRoles={['admin', 'contratista']}>
                  <Contratos />
                </ProtectedRoute>
              } />
              <Route path="/consolidado" element={
                <ProtectedRoute isAuthenticated={isAuthenticated} userRole={userRole} allowedRoles={['admin', 'contratista', 'proveedor']}>
                  <Consolidado />
                </ProtectedRoute>
              } />
              <Route path="/minutas" element={
                <ProtectedRoute isAuthenticated={isAuthenticated} userRole={userRole} allowedRoles={['admin', 'proveedor']}>
                  <Minutas />
                </ProtectedRoute>
              } />
              <Route path="*" element={<Navigate to="/consolidado" />} /> {/* Redirige a consolidado si no coincide ninguna ruta */}
            </Routes>
          </>
        ) : (
          <Routes>
            <Route path="/" element={<Login setIsAuthenticated={setIsAuthenticated} setUserRole={setUserRole} />} />
            <Route path="*" element={<Navigate to="/" />} /> {/* Redirige al login si no coincide ninguna ruta */}
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;