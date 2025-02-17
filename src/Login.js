import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Importa el archivo CSS
import axios from 'axios'; // Importa axios para hacer solicitudes HTTP

const Login = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3001/login', {
        Usuario: username,
        Contrasena: password
      });

      if (response.status === 200) {
        localStorage.setItem('isAuthenticated', 'true'); // Guarda el estado de autenticación en localStorage
        setIsAuthenticated(true);
        navigate('/productos');
      }
    } catch (error) {
      alert('Credenciales incorrectas');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Iniciar Sesión</h2>
        <div className="form-group">
          <label>Usuario:</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Contraseña:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit" className="login-button">Ingresar</button>
      </form>
    </div>
  );
};

export default Login;