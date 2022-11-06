import { useEffect, useState } from "react";
import { Heading, Text, useToast, VStack } from "native-base";

import { api } from "../services/api";

import { Input } from "../components/Input";
import { Header } from "../components/Header";
import { Button } from "../components/Button";

import Logo from "../assets/logo.svg";

export function New() {
  const toast = useToast();

  const [title, setTitle] = useState("");
  const [isLoadingCreatePool, setIsLoadingCreatePool] = useState(false);

  async function handleCreatePool() {
    if (!title?.trim()) {
      return toast.show({
        title: "Informe um nome para o seu bolão",
        placement: "top",
        bgColor: "red.500",
      });
    }

    try {
      setIsLoadingCreatePool(true);

      await api.post("/pools", { title });

      toast.show({
        title: "Bolão criado com sucesso!",
        placement: "top",
        bgColor: "green.500",
      });

      setTitle("");
    } catch (error) {
      console.log(error);

      toast.show({
        title: "Não foi possível criar o bolão",
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsLoadingCreatePool(false);
    }
  }

  return (
    <VStack flex={1} bg="gray.900">
      <Header title="Criar novo bolão" />

      <VStack mt="8" mx="5" alignItems="center">
        <Logo />

        <Heading
          fontFamily="heading"
          color="white"
          fontSize="xl"
          my="8"
          textAlign="center"
        >
          Crie seu próprio bolão da copa e {"\n"}
          compartilhe entre amigos!
        </Heading>

        <Input
          mb="2"
          placeholder="Qual o nome do seu bolão?"
          value={title}
          onChangeText={setTitle}
        />

        <Button
          title="CRIAR MEU BOLÃO"
          onPress={handleCreatePool}
          isLoading={isLoadingCreatePool}
        />

        <Text color="gray.200" fontSize="sm" textAlign="center" px="10" mt="4">
          Após criar seu bolão, você receberá um código único que poderá usar
          para convidar outras pessoas.
        </Text>
      </VStack>
    </VStack>
  );
}
