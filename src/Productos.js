import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function Productos() {
  const [productos, setProductos] = useState([]);
  const [rubros, setRubros] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [newProduct, setNewProduct] = useState({
    nombre: '',
    valor_costo: '',
    valor_venta: '',
    estado: '',
    Id_rubro: ''
  });
  const [editProduct, setEditProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    axios.get('https://proyecto_backend.railway.internal/productos')
      .then(response => {
        setProductos(response.data);
      })
      .catch(error => {
        console.error('Error al obtener los productos', error);
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
    if (editProduct) {
      setEditProduct({ ...editProduct, [name]: value });
    } else {
      setNewProduct({ ...newProduct, [name]: value });
    }
  };

  const handleEditClick = (producto) => {
    setEditProduct({ ...producto, Id_rubro: producto.Id_rubro || '' });
    setShowPopup(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const productToSave = editProduct ? editProduct : newProduct;
    const url = editProduct ? `https://proyectobackend-production-d069.up.railway.app/${editProduct.id_producto}` : 'https://proyectobackend-production-d069.up.railway.app/productos';
    const method = editProduct ? axios.put : axios.post;
    
    method(url, productToSave)
      .then(response => {
        if (editProduct) {
          setProductos(productos.map(p => p.id_producto === editProduct.id_producto ? response.data : p));
        } else {
          setProductos([...productos, response.data]);
        }
        setShowPopup(false);
        setNewProduct({
          nombre: '',
          valor_costo: '',
          valor_venta: '',
          estado: '',
          Id_rubro: ''
        });
        setEditProduct(null);
      })
      .catch(error => {
        console.error('Error al guardar el producto', error);
      });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(value);
  };

  return (
    <div>
      <h2>Lista de Productos</h2>
      <input
        type="text"
        placeholder="Buscar por ID, Nombre o Rubro"
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <button onClick={() => { setShowPopup(true); setEditProduct(null); }}>Crear Nuevo Producto</button>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Valor Costo</th>
            <th>Valor Venta</th>
            <th>Estado</th>
            <th>Rubro</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos
            .filter(producto =>
              producto.id_producto.toString().includes(searchTerm) ||
              producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
              producto.rubro_nombre.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((producto,index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{producto.nombre}</td>
                <td>{formatCurrency(producto.valor_costo)}</td>
                <td>{formatCurrency(producto.valor_venta)}</td>
                <td>{producto.estado}</td>
                <td>{producto.rubro_nombre}</td>
                <td>
                  <button
                    style={{ backgroundColor: 'lightblue', border: 'none', padding: '5px 10px', cursor: 'pointer' }}
                    onClick={() => handleEditClick(producto)}
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {showPopup && (
        <div className="popup">
          <div className="popup-inner">
            <h2>{editProduct ? 'Editar Producto' : 'Crear Nuevo Producto'}</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Nombre:
                <input
                  type="text"
                  name="nombre"
                  value={editProduct ? editProduct.nombre : newProduct.nombre}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Valor Costo:
                <input
                  type="number"
                  name="valor_costo"
                  value={editProduct ? editProduct.valor_costo : newProduct.valor_costo}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Valor Venta:
                <input
                  type="number"
                  name="valor_venta"
                  value={editProduct ? editProduct.valor_venta : newProduct.valor_venta}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Estado:
                <input
                  type="text"
                  name="estado"
                  value={editProduct ? editProduct.estado : newProduct.estado}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Rubro:
                <select
                  name="Id_rubro"
                  value={editProduct ? editProduct.Id_rubro : newProduct.Id_rubro}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Seleccionar Rubro</option>
                  {rubros.map(rubro => (
                    <option key={rubro.Id_rubro} value={rubro.Id_rubro}>{rubro.nombre}</option>
                  ))}
                </select>
              </label>
              <button type="submit">Guardar</button>
              <button type="button" onClick={() => { setShowPopup(false); setEditProduct(null); }}>Cancelar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Productos;
