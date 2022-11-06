import { useState, useEffect } from "react";
import { Share } from "react-native";
import { useRoute } from "@react-navigation/native";
import { HStack, useToast, VStack } from "native-base";

import { api } from "../services/api";

import { Option } from "../components/Option";
import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { Guesses } from "../components/Guesses";
import { PoolHeader } from "../components/PoolHeader";
import { PoolCardProps } from "../components/PoolCard";
import { EmptyMyPoolList } from "../components/EmptyMyPoolList";

interface RouteParams {
  id: string;
}

export function Details() {
  const route = useRoute();
  const { id } = route.params as RouteParams;

  const toast = useToast();

  const [pool, setPool] = useState<PoolCardProps>({} as PoolCardProps);
  const [isLoadingDetailsPool, setIsLoadingDetailsPool] = useState(false);

  const [optionSelected, setOptionSelected] = useState<"guesses" | "ranking">(
    "guesses"
  );

  async function getDetailsPool() {
    try {
      setIsLoadingDetailsPool(true);
      const response = await api.get(`/pools/${id}`);

      setPool(response.data.pool);
    } catch (error) {
      console.log(error);

      toast.show({
        title: "Não foi possível carregar os detalhes do bolão",
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsLoadingDetailsPool(false);
    }
  }

  async function handleCodeShare() {
    await Share.share({
      message: pool.code,
    });
  }

  useEffect(() => {
    getDetailsPool();
  }, [id]);

  return isLoadingDetailsPool ? (
    <Loading />
  ) : (
    <VStack flex={1} bg="gray.900">
      <Header
        title={pool.title}
        showBackButton
        showShareButton
        onShare={handleCodeShare}
      />

      {pool?.participants?.length > 0 ? (
        <VStack px="5" flex={1}>
          <PoolHeader data={pool} />

          <HStack bg="gray.800" p="1" rounded="sm" mb="5">
            <Option
              title="Seus Palpites"
              isSelected={optionSelected === "guesses"}
              onPress={() => setOptionSelected("guesses")}
            />
            <Option
              title="Ranking do grupo"
              isSelected={optionSelected === "ranking"}
              onPress={() => setOptionSelected("ranking")}
            />
          </HStack>

          <Guesses poolId={pool.id} code={pool.code} />
        </VStack>
      ) : (
        <EmptyMyPoolList code={pool?.code} />
      )}
    </VStack>
  );
}
