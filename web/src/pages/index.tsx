import { FormEvent, useState } from "react";
import Image from "next/image";
import { GetServerSideProps } from "next";

import { api } from "../services/api";

interface HomeProps {
  poolCount: number;
  guessCount: number;
  userCount: number;
}

import logoImg from "../assets/logo.svg";
import iconCheckImg from "../assets/icon-check.svg";
import appPreviewImg from "../assets/app-nlw-copa-preview.png";
import usersAvatarExampleImg from "../assets/users-avatar-example.png";

export default function Home({
  poolCount = 0,
  guessCount = 0,
  userCount = 0,
}: HomeProps) {
  const [poolTitle, setPoolTitle] = useState("");

  async function handleCreatePool(event: FormEvent) {
    event.preventDefault();

    if (!poolTitle.trim()) {
      return alert("Preencha o título do bolão!");
    }

    try {
      const response = await api.post("/pools", { title: poolTitle });

      if (response.status === 201) {
        const { code } = response.data;

        await navigator.clipboard.writeText(code);
        setPoolTitle("");

        alert(
          "Bolão criado com sucesso. O código foi copiado para a área de transferência!"
        );
      }
    } catch (err) {
      alert("Não foi possível criar o bolão. Tente novamente!");
    }
  }

  return (
    <div className="max-w-[1124px] h-screen mx-auto grid grid-cols-2 gap-28 items-center">
      <main>
        <Image src={logoImg} alt="Nlw Copa" />

        <h1 className="mt-14 text-white text-5xl font-bold leading-tight">
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>

        <div className="mt-10 flex items-center gap-2">
          <Image src={usersAvatarExampleImg} alt="" />

          <strong className="text-xl text-gray-100">
            <span className="text-ignite-500">+{userCount}</span> pessoas já
            estão usando
          </strong>
        </div>

        <form onSubmit={handleCreatePool} className="mt-10 flex gap-2">
          <input
            type="text"
            required
            placeholder="Qual nome do seu bolão?"
            value={poolTitle}
            onChange={(event) => setPoolTitle(event.target.value)}
            className="flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100"
          />
          <button
            type="submit"
            className="bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold text-sm uppercase hover:bg-yellow-700"
          >
            Criar meu bolão
          </button>
        </form>

        <p className="mt-4 text-gray-300 text-sm leading-relaxed">
          Após criar seu bolão, você receberá um código único que poderá usar
          para convidar outras pessoas 🚀
        </p>

        <div className="mt-10 pt-10 border-t border-gray-600 text-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Image src={iconCheckImg} alt="" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{poolCount}</span>
              <span>Bolões criados</span>
            </div>
          </div>

          <div className="w-px h-16 bg-gray-600" />

          <div className="flex items-center gap-6">
            <Image src={iconCheckImg} alt="" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{guessCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>

      <Image
        src={appPreviewImg}
        alt="Dois celulares exibindo uma prévia da aplicação móvel do nlw"
      />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const [poolCountResponse, guessCountResponse, userCountResponse] =
    await Promise.all([
      api.get("/pools/count"),
      api.get("/guesses/count"),
      api.get("/users/count"),
    ]);

  return {
    props: {
      poolCount: poolCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      userCount: userCountResponse.data.count,
    },
  };
};
