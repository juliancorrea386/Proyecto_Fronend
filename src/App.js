import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Productos from './Productos';
import Remision from './Remision';
import Contratos from './Contratos';
import Consolidado from './Consolidado';
import Prueba from './prueba';
import Login from './Login';
import ProtectedRoute from './ProtectedRoute';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem('isAuthenticated') === 'true'
  );

  useEffect(() => {
    localStorage.setItem('isAuthenticated', isAuthenticated);
  }, [isAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="App">
        {isAuthenticated && (
          <header className="App-header">
            <h1>Sistema de gestión de provisión de alimentos</h1>
            <button className="logout-button" onClick={handleLogout}>Cerrar Sesión</button>
            <nav>
              <ul>
                <li><Link to="/productos">Productos</Link></li>
                <li><Link to="/remision">Remisión</Link></li>
                <li><Link to="/contratos">Contratos</Link></li>
                <li><Link to="/consolidado">Consolidado</Link></li>
                <li><Link to="/prueba">Prueba</Link></li>
              </ul>
            </nav>
          </header>
        )}
        <Routes>
          <Route path="/" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route
            path="/productos"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Productos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/remision"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Remision />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contratos"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Contratos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/consolidado"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Consolidado />
              </ProtectedRoute>
            }
          />
          <Route
            path="/prueba"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Prueba />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;