import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './minutas.css'; // Importar el archivo CSS

const Minutas = () => {
  const [contratos, setContratos] = useState([]);
  const [rubros, setRubros] = useState([]);
  const [selectedContrato, setSelectedContrato] = useState('');
  const [selectedRubro, setSelectedRubro] = useState('');
  const [productos, setProductos] = useState([]);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [fechas, setFechas] = useState([]);
  const [cantidades, setCantidades] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    // Obtener contratos al cargar el componente
    axios.get('https://proyectobackend-production-d069.up.railway.app/contratos')
      .then(response => {
        setContratos(response.data);
      })
      .catch(error => {
        console.error('Error al obtener contratos:', error);
      });
  }, []);

  const handleContratoChange = (event) => {
    const contratoId = event.target.value;
    setSelectedContrato(contratoId);

    // Obtener rubros vinculados al contrato seleccionado
    axios.get(`https://proyectobackend-production-d069.up.railway.app/contratos/${contratoId}/rubros`)
      .then(response => {
        setRubros(response.data);
      })
      .catch(error => {
        console.error('Error al obtener rubros:', error);
      });
  };

  const handleRubroChange = (event) => {
    const rubroId = event.target.value;
    setSelectedRubro(rubroId);

    // Obtener productos vinculados al rubro seleccionado
    axios.get(`https://proyectobackend-production-d069.up.railway.app/productos/rubro/${rubroId}`)
      .then(response => {
        setProductos(response.data);
      })
      .catch(error => {
        console.error('Error al obtener productos:', error);
      });
  };

  const handleFechaInicioChange = (event) => {
    setFechaInicio(event.target.value);
  };

  const handleFechaFinChange = (event) => {
    setFechaFin(event.target.value);
  };

  const generarFechas = useCallback(() => {
    const startDate = new Date(fechaInicio);
    const endDate = new Date(fechaFin);
    const dates = [];

    // Ajustar las fechas de inicio y fin
    startDate.setDate(startDate.getDate() + 1);
    endDate.setDate(endDate.getDate() + 1);

    while (startDate <= endDate) {
      dates.push(new Date(startDate));
      startDate.setDate(startDate.getDate() + 1);
    }

    setFechas(dates);
  }, [fechaInicio, fechaFin]);

  useEffect(() => {
    if (fechaInicio && fechaFin) {
      generarFechas();
    }
  }, [fechaInicio, fechaFin, generarFechas]);

  const handleCantidadChange = (productoId, fecha, event) => {
    const value = event.target.value;
    setCantidades(prevCantidades => ({
      ...prevCantidades,
      [`${productoId}-${fecha}`]: value
    }));
  };

  return (
    <div>
      <h1>Crear Minutas</h1>
      <div>
        <label>Seleccionar Contrato:</label>
        <select value={selectedContrato} onChange={handleContratoChange}>
          <option value="">Seleccione un contrato</option>
          {contratos.map(contrato => (
            <option key={contrato.N_Contrato} value={contrato.N_Contrato}>
              {contrato.Objeto}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Seleccionar Rubro:</label>
        <select value={selectedRubro} onChange={handleRubroChange} disabled={!selectedContrato}>
          <option value="">Seleccione un rubro</option>
          {rubros.map(rubro => (
            <option key={rubro.Id_rubro} value={rubro.Id_rubro}>
              {rubro.nombre}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Fecha de Inicio:</label>
        <input type="date" value={fechaInicio} onChange={handleFechaInicioChange} disabled={!selectedRubro} />
      </div>
      <div>
        <label>Fecha de Fin:</label>
        <input type="date" value={fechaFin} onChange={handleFechaFinChange} disabled={!fechaInicio} />
      </div>
      <label>Buscar producto:</label>
      <input
        type="text"
        placeholder="Buscar por Nombre"
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Producto</th>
              {fechas.map((fecha, index) => (
                <th key={index}>{fecha.toLocaleDateString()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {productos.filter(productos =>
              productos.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
            ).map((producto, index) => (
              <tr key={index}>
                <td>{producto.nombre}</td>
                {fechas.map((fecha, index) => (
                  <td key={index}>
                    <input
                      type="number"
                      value={cantidades[`${producto.id_producto}-${fecha.toLocaleDateString()}`] || ''}
                      onChange={(event) => handleCantidadChange(producto.id_producto, fecha.toLocaleDateString(), event)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Minutas;