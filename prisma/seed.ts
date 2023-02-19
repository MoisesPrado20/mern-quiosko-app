import { categorias } from "./data/categorias";
import { productos } from "./data/productos";
import { PrismaClient } from "@prisma/client";

// * Objeto que contiene los modelos
const prisma = new PrismaClient();

const main = async (): Promise<void> => {
  try {
    //* Agregando data de categorías en el modelo Categoria
    await prisma.categoria.createMany({
      data: categorias,
    });

    //* Agregando data de productos en el modelo Producto
    await prisma.producto.createMany({
      data: productos,
    });
  } catch (error) {
    console.log(error);
  }
}

main();