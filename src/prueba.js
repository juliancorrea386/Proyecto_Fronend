import React, { useState } from 'react';
import axios from 'axios';

const Prueba = () => {
  const [productos, setProductos] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    axios.post('http://localhost:3001/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(response => {
      setProductos(response.data);
    })
    .catch(error => {
      console.error('Error uploading file:', error);
    });
  };

  return (
    <div>
      <h1>Cargar Archivo de Productos</h1>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Valor Costo</th>
            <th>Valor Venta</th>
            <th>Estado</th>
            <th>Rubro</th>
            <th>Cantidad</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto, index) => (
            <tr key={index}>
              <td>{producto.nombre}</td>
              <td>{producto.valor_costo}</td>
              <td>{producto.valor_venta}</td>
              <td>{producto.estado}</td>
              <td>{producto.rubro_nombre}</td>
              <td>{producto.cantidad}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Prueba;