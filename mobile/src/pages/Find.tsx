import { useState } from "react";
import { Heading, useToast, VStack } from "native-base";
import { useNavigation } from "@react-navigation/native";

import { api } from "../services/api";

import { Input } from "../components/Input";
import { Header } from "../components/Header";
import { Button } from "../components/Button";

export function Find() {
  const toast = useToast();
  const navigation = useNavigation();

  const [code, setCode] = useState("");
  const [isLoadingJoinPool, setIsLoadingJoinPool] = useState(false);

  async function handleJoinPool() {
    try {
      setIsLoadingJoinPool(true);

      if (!code.trim()) {
        return toast.show({
          title: "Informe o código",
          placement: "top",
          bgColor: "red.500",
        });
      }

      await api.post("/pools/join", { code: code.toUpperCase() });

      toast.show({
        title: "Você entrou no bolão com sucesso!",
        placement: "top",
        bgColor: "green.500",
      });

      navigation.navigate("pools");
    } catch (error) {
      console.log(error);

      let message = error?.response?.data?.message;

      if (message === "Pool not found.") {
        message = "Bolão não encontrado!";
      } else if (message === "You already joined this pool.") {
        message = "Você já está nesse bolão";
      } else {
        message = "Não foi possível criar o bolão";
      }

      toast.show({
        title: message,
        placement: "top",
        bgColor: "red.500",
      });

      setIsLoadingJoinPool(false);
    }
  }

  return (
    <VStack flex={1} bg="gray.900">
      <Header title="Buscar por código" showBackButton />

      <VStack mt="8" mx="5" alignItems="center">
        <Heading
          fontFamily="heading"
          color="white"
          fontSize="xl"
          mb="8"
          textAlign="center"
        >
          Encontre um bolão através de {"\n"}
          seu código único
        </Heading>

        <Input
          mb="2"
          placeholder="Qual o nome do seu bolão?"
          autoCapitalize="characters"
          value={code}
          onChangeText={setCode}
        />

        <Button
          title="BUSCAR POR CÓDIGO"
          onPress={handleJoinPool}
          isLoading={isLoadingJoinPool}
        />
      </VStack>
    </VStack>
  );
}
