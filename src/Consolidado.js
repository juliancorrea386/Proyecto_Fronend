// Consolidado.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

function Consolidado() {
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [contratos, setContratos] = useState([]);
  const [rubros, setRubros] = useState([]);
  const [selectedContrato, setSelectedContrato] = useState('');
  const [selectedRubro, setSelectedRubro] = useState('');
  const [consolidado, setConsolidado] = useState({});
  const [fechas, setFechas] = useState([]);
  const [valorRubro, setValorRubro] = useState(0);
  const [totalValor, setTotalValor] = useState(0);

  useEffect(() => {
    axios.get('https://proyectobackend-production-d069.up.railway.app/contratos')
      .then(response => {
        setContratos(response.data);
      })
      .catch(error => {
        console.error('Error al obtener los contratos', error);
      });
  }, []);

  useEffect(() => {
    if (selectedContrato) {
      const contrato = contratos.find(c => c.N_Contrato === selectedContrato);
      if (contrato) {
        setFechaInicio(formatDate(contrato.Fecha_inicio));
        setFechaFin(formatDate(contrato.Fecha_fin));
      }

      axios.get(`https://proyectobackend-production-d069.up.railway.app/contratos/${selectedContrato}/rubros`)
        .then(response => {
          setRubros(response.data);
        })
        .catch(error => {
          console.error('Error al obtener los rubros', error);
        });
    }
  }, [selectedContrato, contratos]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleBuscar = () => {
    axios.get(`https://proyectobackend-production-d069.up.railway.app/consolidado`, {
      params: {
        fechaInicio,
        fechaFin,
        contrato: selectedContrato,
        rubro: selectedRubro
      }
    })
      .then(response => {
        const data = response.data;
        console.log('Datos recibidos:', data); // Ver los datos recibidos

        const fechasSet = new Set(data.map(item => item.fecha.split('T')[0]));
        const fechasArray = Array.from(fechasSet).sort(); // Ordenar fechas de manera ascendente
        setFechas(fechasArray);

        const matriz = data.reduce((acc, item) => {
          const fecha = item.fecha.split('T')[0];
          if (!acc[item.producto]) {
            acc[item.producto] = { total: 0, valorTotal: 0, precio: item.valor_venta }; // Inicializar total, valorTotal y precio
          }
          if (!acc[item.producto][fecha]) {
            acc[item.producto][fecha] = 0;
          }
          acc[item.producto][fecha] += item.cantidad;
          acc[item.producto].total += item.cantidad;
          acc[item.producto].valorTotal += item.total; // Sumar el valor total
          return acc;
        }, {});

        setConsolidado(matriz);

        // Calcular el total de la columna "Total Valor"
        const totalValorSum = Object.values(matriz).reduce((sum, producto) => sum + producto.valorTotal, 0);
        setTotalValor(totalValorSum);

        if (data.length > 0) {
          setValorRubro(data[0].valor_Rubro); // Asignar valor_Rubro
        }
      })
      .catch(error => {
        console.error('Error al obtener el consolidado', error);
      });
  };

  const handleExportarExcel = () => {
    const wb = XLSX.utils.book_new();
    const wsData = [
      ['Producto', ...fechas, 'Total Cantidad', 'Precio de Venta', 'Total Valor'],
      ...Object.keys(consolidado).map(producto => [
        producto,
        ...fechas.map(fecha => consolidado[producto][fecha] || 0),
        consolidado[producto].total,
        consolidado[producto].precio,
        consolidado[producto].valorTotal
      ])
    ];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, 'Consolidado');
    XLSX.writeFile(wb, 'consolidado.xlsx');
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(value);
  };

  const valorRestante = valorRubro - totalValor;

  return (
    <div>
      <h2>Consolidado</h2>
      <div>
        <label>
          Contrato:
          <select value={selectedContrato} onChange={(e) => setSelectedContrato(e.target.value)}>
            <option value="">Seleccionar Contrato</option>
            {contratos.map((contrato, index) => (
              <option key={`${contrato.N_Contrato}-${index}`} value={contrato.N_Contrato}>{contrato.N_Contrato}</option>
            ))}
          </select>
        </label>
        <label>
          Fecha Inicio:
          <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
        </label>
        <label>
          Fecha Fin:
          <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
        </label>
        <label>
          Rubro:
          <select value={selectedRubro} onChange={(e) => setSelectedRubro(e.target.value)}>
            <option value="">Seleccionar Rubro</option>
            {rubros.map((rubro, index) => (
              <option key={`${rubro.Id_rubro}-${index}`} value={rubro.Id_rubro}>{rubro.nombre}</option>
            ))}
          </select>
        </label>
        <button onClick={handleBuscar}>Buscar</button>
        <button onClick={handleExportarExcel}>Exportar a Excel</button>
      </div>
      <div>
        <h3>Resultados Consolidados</h3>
        <table>
          <thead>
            <tr>
              <th>Producto</th>
              {fechas.map((fecha, index) => (
                <th key={`${fecha}-${index}`}>{fecha}</th>
              ))}
              <th>Total Cantidad</th>
              <th>Precio de Venta</th>
              <th>Total Valor</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(consolidado).map((producto, index) => (
              <tr key={`${producto}-${index}`}>
                <td>{producto}</td>
                {fechas.map((fecha, index) => (
                  <td key={`${producto}-${fecha}-${index}`}>
                    {consolidado[producto][fecha] || 0}
                  </td>
                ))}
                <td>{consolidado[producto].total}</td>
                <td>{formatCurrency(consolidado[producto].precio)}</td>
                <td>{formatCurrency(consolidado[producto].valorTotal)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div>
          <h4>Valor del Rubro: {formatCurrency(valorRubro)}</h4>
          <h4>Total Valor: {formatCurrency(totalValor)}</h4>
          <h4>Valor Restante del Contrato: {formatCurrency(valorRestante)}</h4>
        </div>
      </div>
    </div>
  );
}

export default Consolidado;