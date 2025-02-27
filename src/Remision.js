import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import { PDFDownloadLink, Document, Page, Text, View, Image } from '@react-pdf/renderer';

import pdfStyles from "./pdfStyles"; // Importa los estilos


function Remision() {
  const [remisiones, setRemisiones] = useState([]);
  const [contratos, setContratos] = useState([]);
  const [rubros, setRubros] = useState([]);
  const [, setProductos] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showRemisionPopup, setShowRemisionPopup] = useState(false);
  const [selectedRemision, setSelectedRemision] = useState(null);
  const [newRemision, setNewRemision] = useState({
    fecha: '',
    N_Contrato: '',
    Id_rubro: '',
    productos: [],
    isEditing: false,
    id_remision: null
  });
  

  const [searchTerm, setSearchTerm] = useState('');
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  const handleProductSearchChange = (e) => {
    setProductSearchTerm(e.target.value);
  };
  useEffect(() => {
    if (newRemision.N_Contrato) {
      axios.get(`https://proyectobackend-production-d069.up.railway.app/contratos/${newRemision.N_Contrato}/rubros`)
        .then(response => {
          setRubros(response.data);
        })
        .catch(error => {
          console.error('Error al obtener los rubros', error);
        });
    }

    if (newRemision.Id_rubro) {
      axios.get(`https://proyectobackend-production-d069.up.railway.app/productos/rubro/${newRemision.Id_rubro}`)
        .then(response => {
          setProductos(response.data);
        })
        .catch(error => {
          console.error('Error al obtener los productos', error);
        });
    }
    axios.get('https://proyectobackend-production-d069.up.railway.app/remisiones')
      .then(response => {
        setRemisiones(response.data);
      })
      .catch(error => {
        console.error('Error al obtener las remisiones', error);
      });

    axios.get('https://proyectobackend-production-d069.up.railway.app/contratos')
      .then(response => {
        setContratos(response.data);
      })
      .catch(error => {
        console.error('Error al obtener los contratos', error);
      });
  }, [newRemision.N_Contrato, newRemision.Id_rubro]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRemision({ ...newRemision, [name]: value });

    if (name === 'N_Contrato' && value) {
      axios.get(`https://proyectobackend-production-d069.up.railway.app/contratos/${value}/rubros`)
        .then(response => {
          setRubros(response.data);
          setNewRemision(prevState => ({
            ...prevState,
            N_Contrato: value,
            Id_rubro: '',
            productos: []
          }));
          setProductos([]);
        })
        .catch(error => {
          console.error('Error al obtener los rubros', error);
        });
    }

    if (name === 'Id_rubro' && value) {
      axios.get(`https://proyectobackend-production-d069.up.railway.app/productos/rubro/${value}`)
        .then(response => {
          setProductos(response.data);
          setNewRemision(prevState => ({
            ...prevState,
            Id_rubro: value,
            productos: response.data.map(producto => ({ ...producto, cantidad: 0 }))
          }));
        })
        .catch(error => {
          console.error('Error al obtener los productos', error);
        });
    }
  };

  const handleCancel = () => {
    setShowPopup(false);
    setNewRemision({
      fecha: '',
      N_Contrato: '',
      Id_rubro: '',
      productos: [],
      isEditing: false,
      id_remision: null,
      searchTerm: ''
    });
    setProductos([]);
  };
  const MyDocument = ({ remision }) => (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        <Image src="/banner.png" style={pdfStyles.image} />
        <Text style={{ fontSize: 15, textAlign: 'center', marginBottom: 10 }}>
          REMISION PEDIDOS {remision[0].rubro} SERVICIO DE ALIMENTACION HDMI
        </Text>
        <Text style={{ fontSize: 14 }}>No de remision: 00{remision[0].id_remision}</Text>
        <Text style={{ fontSize: 14 }}>Fecha: {formatDate(remision[0].fecha)}</Text>
        <View style={pdfStyles.table}>
          <View style={pdfStyles.tableRow}>
            <View style={pdfStyles.tableColNoRemision}>
              <Text style={pdfStyles.tableCell}>No</Text>
            </View>
            <View style={pdfStyles.tableColNombre}>
              <Text style={pdfStyles.tableCell}>Nombre</Text>
            </View>
            <View style={pdfStyles.tableColCantidad}>
              <Text style={pdfStyles.tableCell}>Cantidad Requerida</Text>
            </View>
            <View style={pdfStyles.tableColRecibidas}>
              <Text style={pdfStyles.tableCell}>Recibidas</Text>
            </View>
            <View style={pdfStyles.tableColPendientes}>
              <Text style={pdfStyles.tableCell}>Pendientes</Text>
            </View>
          </View>
          {remision
            .filter(producto => producto.cantidad > 0)
            .map((producto, index) => (
              <View style={pdfStyles.tableRow} key={index} wrap={false}>
                <View style={pdfStyles.tableColNoRemision}>
                  <Text style={pdfStyles.tableCell}>{index + 1}</Text>
                </View>
                <View style={pdfStyles.tableColNombre}>
                  <Text style={pdfStyles.tableCell}>{producto.producto}</Text>
                </View>
                <View style={pdfStyles.tableColCantidad}>
                  <Text style={pdfStyles.tableCell}>{producto.cantidad}</Text>
                </View>
                <View style={pdfStyles.tableColRecibidas}>
                  <Text style={pdfStyles.tableCell}></Text>
                </View>
                <View style={pdfStyles.tableColPendientes}>
                  <Text style={pdfStyles.tableCell}></Text>
                </View>
              </View>
            ))}
        </View>
        <View style={pdfStyles.signatureSection}>
          <View style={pdfStyles.signature}>
            <Text>____________________</Text>
            <Text>Firma de quien recibe</Text>
            <Text>Servicio De Alimentación</Text>
          </View>
          <View style={pdfStyles.signature}>
            <Text>____________________</Text>
            <Text>Firma de quien entrega</Text>
            <Text>Freskohogar</Text>
          </View>
        </View>
      </Page>
    </Document>
  );

  const handleProductChange = (id_producto, value, field) => {
    setNewRemision(prevState => ({
      ...prevState,
      productos: prevState.productos.map(producto =>
        producto.id_producto === id_producto
          ? {
            ...producto,
            [field]: parseFloat(value) || 0, // Asegurarse de que el valor sea un número válido
            total: field === 'cantidad' || field === 'valor_venta'
              ? (parseFloat(value) || 0) * (field === 'cantidad' ? producto.valor_venta : producto.cantidad)
              : producto.total
          }
          : producto
      )
    }));
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    const productosValidos = newRemision.productos.map(producto => ({
      ...producto,
      cantidad: producto.cantidad || 0, // Asegurarse de que la cantidad sea un número válido
      total: producto.cantidad * producto.valor_venta || 0 // Calcular el total correctamente
    }));

    const remisionValida = {
      ...newRemision,
      productos: productosValidos
    };

    if (newRemision.isEditing) {
      axios.put(`https://proyectobackend-production-d069.up.railway.app/remisiones_Edit/${newRemision.id_remision}`, remisionValida)
        .then(response => {
          const updatedRemisiones = remisiones.map(rem =>
            rem.id_remision === newRemision.id_remision ? response.data : rem
          );
          setRemisiones(updatedRemisiones);
          setShowPopup(false);
          setNewRemision({
            fecha: '',
            N_Contrato: '',
            Id_rubro: '',
            productos: [],
            isEditing: false,
            id_remision: null
          });
          setProductos([]);
        })
        .catch(error => {
          console.error('Error al actualizar la remisión', error);
        });
    } else {
      axios.post('https://proyectobackend-production-d069.up.railway.app/remisiones', remisionValida)
        .then(response => {
          setRemisiones([...remisiones, response.data]);
          setShowPopup(false);
          setNewRemision({
            fecha: '',
            N_Contrato: '',
            Id_rubro: '',
            productos: [],
            isEditing: false,
            id_remision: null
          });
          setProductos([]);
        })
        .catch(error => {
          console.error('Error al crear la remisión', error);
        });
    }
  };

  const handleViewRemision = (id_remision) => {
    axios.get(`https://proyectobackend-production-d069.up.railway.app/remisiones/${id_remision}`)
      .then(response => {
        setSelectedRemision(response.data);
        setShowRemisionPopup(true);
      })
      .catch(error => {
        console.error('Error al obtener la remisión', error);
      });
  };

  const handleEditRemision = (remision) => {
    axios.get(`https://proyectobackend-production-d069.up.railway.app/remisiones_Edit/${remision.id_remision}`)
      .then(response => {
        const remisionData = response.data;
        setNewRemision({
          fecha: remisionData[0].fecha.split('T')[0],
          N_Contrato: remisionData[0].N_Contrato,
          Id_rubro: remisionData[0].Id_rubro,
          productos: remisionData.map(producto => ({
            id_producto: producto.id_producto,
            nombre: producto.producto,
            cantidad: producto.cantidad,
            valor_costo: producto.precio_costo,
            valor_venta: producto.precio_venta,
            estado: producto.estado
          })),
          isEditing: true,
          id_remision: remision.id_remision
        });
        setShowPopup(true);
      })
      .catch(error => {
        console.error('Error al obtener la remisión', error);
      });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${day}-${month}-${year}`;
  };

  /*const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(value);
  };*/

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('Id_rubro', newRemision.Id_rubro); // Añadir Id_rubro al formData

    axios.post('https://proyectobackend-production-d069.up.railway.app/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(response => {
        setNewRemision(prevState => ({
          ...prevState,
          productos: response.data
        }));
      })
      .catch(error => {
        console.error('Error uploading file:', error);
      });
  };
  return (
    <div>
      <h2>Lista de Remisiones</h2>
      <input
        type="text"
        placeholder="Buscar por N_Contrato, ID o Rubro"
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <button onClick={() => setShowPopup(true)}>Crear Nueva Remisión</button>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Contrato</th>
            <th>Rubro</th>
            <th>Ver</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {remisiones
            .filter(remision =>
              remision.N_Contrato?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              remision.id_remision?.toString().includes(searchTerm) ||
              remision.rubro_nombre?.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .sort((a, b) => new Date(b.fecha) - new Date(a.fecha)) // Ordenar por fecha
            .map((remision, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{formatDate(remision.fecha)}</td>
                <td>{remision.N_Contrato}</td>
                <td>{remision.rubro_nombre}</td>
                <td>
                  <button onClick={() => handleViewRemision(remision.id_remision)}>Ver Remisión</button>
                </td>
                <td>
                  <button onClick={() => handleEditRemision(remision)}>Editar</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      {showPopup && (
        <div className="popup">
          <div className="popup-inner">
            <h2>{selectedRemision ? 'Editar Remisión' : 'Crear Nueva Remisión'}</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Fecha:
                <input type="date" name="fecha" value={newRemision.fecha} onChange={handleInputChange} required />
              </label>
              <label>
                Contrato:
                <select name="N_Contrato" value={newRemision.N_Contrato} onChange={handleInputChange} required>
                  <option value="">Seleccionar Contrato</option>
                  {contratos.map(contrato => (
                    <option key={contrato.N_Contrato} value={contrato.N_Contrato}>{contrato.N_Contrato}</option>
                  ))}
                </select>
              </label>
              <label>
                Rubro:
                <select name="Id_rubro" value={newRemision.Id_rubro} onChange={handleInputChange} required>
                  <option value="">Seleccionar Rubro</option>
                  {rubros.map(rubro => (
                    <option key={rubro.Id_rubro} value={rubro.Id_rubro}>{rubro.nombre}</option>
                  ))}
                </select>
              </label>
              {newRemision.productos.length > 0 && (
                <div>
                  <h3>Productos Relacionados</h3>
                  <input
                    type="text"
                    placeholder="Buscar productos"
                    value={productSearchTerm}
                    onChange={handleProductSearchChange}
                  />
                  <label>
                    Cargar Archivo
                    <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
                  </label>
                  <table>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Valor Costo</th>
                        <th>Valor Venta</th>
                        <th>Estado</th>
                        <th>Cantidad</th>
                      </tr>
                    </thead>
                    <tbody>
                      {newRemision.productos.filter(producto =>
                        producto.nombre?.toLowerCase().includes(productSearchTerm.toLowerCase())
                      ).map((producto, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{producto.nombre}</td>
                          <td>
                            <input
                              type="decimal"
                              value={producto.valor_costo || 0}
                              onChange={(e) => handleProductChange(producto.id_producto, e.target.value, 'valor_costo')}
                              min="0"
                            />
                          </td>
                          <td>
                            <input
                              type="decimal"
                              value={producto.valor_venta || 0}
                              onChange={(e) => handleProductChange(producto.id_producto, e.target.value, 'valor_venta')}
                              min="0"
                            />
                          </td>
                          <td>{producto.estado}</td>
                          <td>
                            <input
                              type="decimal"
                              value={producto.cantidad || 0}
                              onChange={(e) => handleProductChange(producto.id_producto, e.target.value, 'cantidad')}
                              min="0"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <button type="submit">Guardar</button>
              <button type="button" onClick={handleCancel}>Cancelar</button>
            </form>
          </div>
        </div>
      )}

      {showRemisionPopup && selectedRemision && (
        <div className="popup">
          <div className="popup-inner">
            <h2>REMISION PEDIDOS {selectedRemision[0].rubro} SERVICIO DE ALIMENTACION HDMI</h2>
            <p><strong>No de remision:</strong>00{selectedRemision[0].id_remision}</p>
            <p><strong>Fecha:</strong> {formatDate(selectedRemision[0].fecha)}</p>
            <h3>Productos</h3>
            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nombre</th>
                  <th>Cantidad Requerida</th>
                  <th>Recibidas</th>
                  <th>Pendientes</th>
                </tr>
              </thead>
              <tbody>
                {selectedRemision
                  .filter(item => item.cantidad > 0)
                  .map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.producto}</td>
                      <td>{item.cantidad}</td>
                      <td></td>
                      <td></td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <div className="signature-section">
              <div>
                <p>____________________</p>
                <p>Firma de quien recibe</p>
                <p>Servicio De Alimentación</p>
              </div>
              <div>
                <p>____________________</p>
                <p>Firma de quien entrega</p>
                <p>Freskohogar</p>
              </div>
            </div>
            <PDFDownloadLink
              document={<MyDocument remision={selectedRemision} />}
              fileName={`remision_${selectedRemision[0].id_remision}.pdf`}
            >
              {({ blob, url, loading, error }) =>
                loading ? 'Generando PDF...' : 'Descargar PDF'
              }
            </PDFDownloadLink>
            <button onClick={() => setShowRemisionPopup(false)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Remision;