import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Productos from './Productos';
import Remision from './Remision';
import Contratos from './Contratos';
import Consolidado from './Consolidado'; // Importa el nuevo componente
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Gestión de Productos</h1>
          <nav>
            <ul>
              <li><Link to="/">Productos</Link></li>
              <li><Link to="/remision">Remisión</Link></li>
              <li><Link to="/contratos">Contratos</Link></li>
              <li><Link to="/consolidado">Consolidado</Link></li> {/* Añade el enlace para Consolidado */}
            </ul>
          </nav>
        </header>
        <Routes>
          <Route path="/" element={<Productos />} />
          <Route path="/remision" element={<Remision />} />
          <Route path="/contratos" element={<Contratos />} />
          <Route path="/consolidado" element={<Consolidado />} /> {/* Añade la ruta para Consolidado */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;