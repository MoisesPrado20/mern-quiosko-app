import { PrismaClient } from "@prisma/client"

export default async function handler(req, res) {
  const prisma = new PrismaClient();
  //* Obteniendo todas los productos 
  const categorias = await prisma.producto.findMany();

  res.status(200).json(categorias);
}