import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function Contratos() {
  const [contratos, setContratos] = useState([]);
  const [rubros, setRubros] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [newContrato, setNewContrato] = useState({
    N_Contrato: '',
    Objeto: '',
    Clase_de_contrato: '',
    Fecha_inicio: '',
    Fecha_fin: '',
    valor_contrato: '',
    valor_consumido: '',
    estado: '',
    rubros: []
  });
  const [selectedRubro, setSelectedRubro] = useState({
    Id_rubro: '',
    Valor_Rubro: '',
    Valor_Rubro_Consumido: ''
  });

  useEffect(() => {
    axios.get('https://proyectobackend-production-d069.up.railway.app/contratos')
      .then(response => {
        setContratos(response.data);
      })
      .catch(error => {
        console.error('Error al obtener los contratos', error);
      });

    axios.get('https://proyectobackend-production-d069.up.railway.app/rubros')
      .then(response => {
        setRubros(response.data);
      })
      .catch(error => {
        console.error('Error al obtener los rubros', error);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewContrato({ ...newContrato, [name]: value });
  };

  const handleRubroChange = (e) => {
    const { name, value } = e.target;
    setSelectedRubro({ ...selectedRubro, [name]: value });
  };

  const addRubro = () => {
    if (selectedRubro.Id_rubro) {
      setNewContrato({
        ...newContrato,
        rubros: [...newContrato.rubros, selectedRubro]
      });
      setSelectedRubro({
        Id_rubro: '',
        Valor_Rubro: '',
        Valor_Rubro_Consumido: ''
      });
    } else {
      console.error('El rubro seleccionado no tiene un ID válido');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('https://proyectobackend-production-d069.up.railway.app/contratos', newContrato)
      .then(response => {
        setContratos([...contratos, response.data]);
        setShowPopup(false);
        setNewContrato({
          N_Contrato: '',
          Objeto: '',
          Clase_de_contrato: '',
          Fecha_inicio: '',
          Fecha_fin: '',
          valor_contrato: '',
          valor_consumido: '',
          estado: '',
          rubros: []
        });
      })
      .catch(error => {
        console.error('Error al crear el contrato', error);
      });
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(value);
  };

  return (
    <div>
      <h2>Lista de Contratos</h2>
      <button onClick={() => setShowPopup(true)}>Crear Nuevo Contrato</button>
        <table>
          <thead>
            <tr>
              <th>N° Contrato</th>
              <th className="narrow-column">Objeto</th>
              <th>Clase de Contrato</th>
              <th>Fecha Inicio</th>
              <th>Fecha Fin</th>
              <th>Valor Contrato</th>
              <th>Valor Consumido</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {contratos.map(contrato => (
              <tr key={contrato.N_Contrato}>
                <td>{contrato.N_Contrato}</td>
                <td className="narrow-column">{contrato.Objeto}</td>
                <td>{contrato.Clase_de_contrato}</td>
                <td>{formatDate(contrato.Fecha_inicio)}</td>
                <td>{formatDate(contrato.Fecha_fin)}</td>
                <td>{formatCurrency(contrato.valor_contrato)}</td>
                <td>{formatCurrency(contrato.valor_consumido)}</td>
                <td>{contrato.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      {showPopup && (
        <div className="popup">
          <div className="popup-inner">
            <h2>Crear Nuevo Contrato</h2>
            <form onSubmit={handleSubmit}>
              <label>
                N° Contrato:
                <input type="text" name="N_Contrato" value={newContrato.N_Contrato} onChange={handleInputChange} required />
              </label>
              <label>
                Objeto:
                <input type="text" name="Objeto" value={newContrato.Objeto} onChange={handleInputChange} required />
              </label>
              <label>
                Clase de Contrato:
                <input type="text" name="Clase_de_contrato" value={newContrato.Clase_de_contrato} onChange={handleInputChange} required />
              </label>
              <label>
                Fecha Inicio:
                <input type="date" name="Fecha_inicio" value={newContrato.Fecha_inicio} onChange={handleInputChange} required />
              </label>
              <label>
                Fecha Fin:
                <input type="date" name="Fecha_fin" value={newContrato.Fecha_fin} onChange={handleInputChange} required />
              </label>
              <label>
                Valor Contrato:
                <input type="number" name="valor_contrato" value={newContrato.valor_contrato} onChange={handleInputChange} required />
              </label>
              <label>
                Valor Consumido:
                <input type="number" name="valor_consumido" value={newContrato.valor_consumido} onChange={handleInputChange} required />
              </label>
              <label>
                Estado:
                <input type="text" name="estado" value={newContrato.estado} onChange={handleInputChange} required />
              </label>

              <h3>Agregar Rubro al Contrato</h3>
              <label>
                Rubro:
                <select name="Id_rubro" value={selectedRubro.Id_rubro} onChange={handleRubroChange} >
                  <option value="">Seleccione un rubro</option>
                  {rubros.map(rubro => (
                    <option key={rubro.Id_rubro} value={rubro.Id_rubro}>{rubro.nombre}</option>
                  ))}
                </select>
              </label>
              <label>
                Valor Rubro:
                <input type="number" name="Valor_Rubro" value={selectedRubro.Valor_Rubro} onChange={handleRubroChange} />
              </label>
              <label>
                Valor Rubro Consumido:
                <input type="number" name="Valor_Rubro_Consumido" value={selectedRubro.Valor_Rubro_Consumido} onChange={handleRubroChange} />
              </label>
              <button type="button" onClick={addRubro}>Agregar Rubro</button>

              <ul>
                {newContrato.rubros.map((rubro, index) => (
                  <li key={index}>
                    Rubro ID: {rubro.Id_rubro}, Valor: {rubro.Valor_Rubro}, Valor Consumido: {rubro.Valor_Rubro_Consumido}
                  </li>
                ))}
              </ul>

              <button type="submit">Guardar</button>
              <button type="button" onClick={() => setShowPopup(false)}>Cancelar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Contratos;