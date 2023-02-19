import Categoria from "./Categoria";
import useQuiosco from "@/hooks/useQuiosco";
import Image from "next/image";

export const Sidebar = () => {
  const { categorias } = useQuiosco();

  return (
    <>
      <Image
        src="/assets/img/logo.svg"
        width={300}
        height={100}
        alt="imagen logotipo"
        className="self-center"
      />

      <nav className="mt-10">
        {categorias.map(categoria => (
          <Categoria key={categoria.id} categoria={categoria} />
        ))}
      </nav>
    </>
  );
};
