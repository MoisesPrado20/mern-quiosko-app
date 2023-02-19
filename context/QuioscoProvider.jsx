import { createContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from "react-toastify";

const QuioscoContext = createContext();

const QuioscoProvider = ({ children }) => {
  const [categorias, setCategorias] = useState([]);
  const [categoriaActual, setCategoriaActual] = useState({});
  const [producto, setProducto] = useState({});
  const [modal, setModal] = useState(false);
  const [pedido, setPedido] = useState([]);
  const [nombre, setNombre] = useState("");
  const [total, setTotal] = useState(0);

  const router = useRouter();

  const obtenerCategorias = async () => {
    const { data } = await axios("/api/categorias");

    setCategorias(data);
  };

  //* Obteniendo categorias
  useEffect(() => {
    obtenerCategorias();
  }, []);

  //* Obteniendo primera categoría despues de que carguen todas las categorías
  useEffect(() => {
    setCategoriaActual(categorias[0]);
  }, [categorias]);

  //* Actualizando total cuando se agregue un nuevo producto al pedido
  useEffect(() => {
    const nuevoTotal = pedido.reduce((total, { precio, cantidad }) => total + (precio * cantidad), 0);
    setTotal(nuevoTotal);
  }, [pedido]);

  

  const handleClickCategoria = (id) => {
    const categoria = categorias.filter((categoria) => categoria.id === id);
    setCategoriaActual(...categoria);

    router.push('/'); 
  };

  const handleSetProducto = (producto) => setProducto(producto);

  const handleChangeModal = () => setModal(!modal);

  const handleAgregarPedido = ({ categoriaId, ...producto }) => {
    if (pedido.some((productoState) => productoState.id === producto.id)) {
      //* Actualizar la cantidad
      const pedidoActualizado = pedido.map((productoState) =>
        productoState.id === producto.id ? producto : productoState
      );
      setPedido(pedidoActualizado);
      //* Agregando toast al actualizar  un pedido
      toast.success("Guardado correctamente");
    } else {
      setPedido([...pedido, producto]);
      //* Agregando toast al crear un pedido
      toast.success("Agregado al Pedido");
    }

    setModal(false);
  };

  const handleEditarCantidades = (id) => {
    const productoActualizar = pedido.filter(producto => producto.id === id);
    setProducto(...productoActualizar);
    setModal(!modal);

  }

  const handleEliminarProducto = (id) => {
    const pedidoActualizado = pedido.filter(producto => producto.id !== id);
    setPedido(pedidoActualizado);
  };

   const colocarOrden = async(e) => {
    e.preventDefault();

    try {
    //* Pasando pedido, nombre y total como data de petición POST para insertar en la tabla 'orden'  
      await axios.post("/api/ordenes", {
        nombre,
        fecha: Date.now().toString(),
        total,
        pedido,
      });
        

      //* Resetear la app  
      setCategoriaActual(categorias[0]); 
      setPedido([])
      setNombre('');
      setTotal(0);

      toast.success('Pedido Realizado Correctamente');

      //* Redireccionando al inicio 
      setTimeout(() => {
        router.push('/');
      },3000);
    } catch (error) {
    console.log(error);
    }
   };


  const data = {
    categorias,
    categoriaActual,
    handleClickCategoria,
    producto,
    handleSetProducto,
    modal,
    handleChangeModal,
    pedido,
    handleAgregarPedido,
    handleEditarCantidades,
    handleEliminarProducto,
    nombre,
    setNombre,
    colocarOrden,
    total,
  };

  return (
    <QuioscoContext.Provider value={data}>{children}</QuioscoContext.Provider>
  );
};

export { QuioscoProvider };

export default QuioscoContext;
