import { useState, useEffect, useCallback } from "react";
import { Octicons } from "@expo/vector-icons";
import { VStack, Icon, useToast, FlatList } from "native-base";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

import { api } from "../services/api";

import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { EmptyPoolList } from "../components/EmptyPoolList";
import { PoolCard, PoolCardPros } from "../components/PoolCard";

export function Pools() {
  const toast = useToast();
  const navigation = useNavigation();

  const [isLoadingPools, setIsLoadingPools] = useState(false);
  const [pools, setPools] = useState<PoolCardPros[]>([]);

  async function getPools() {
    try {
      setIsLoadingPools(true);
      const response = await api.get("/pools");

      setPools(response.data.pools);
    } catch (error) {
      console.log(error);

      toast.show({
        title: "Não foi possível criar o bolão",
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsLoadingPools(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      getPools();
    }, [])
  );

  return (
    <VStack flex={1} bg="gray.900">
      <Header title="Meus bolões" />

      <VStack
        mt="6"
        mx="5"
        borderBottomWidth="1"
        borderBottomColor="gray.600"
        pb="4"
        mb="4"
      >
        <Button
          title="BUSCAR BOLÃO POR CÓDIGO"
          leftIcon={
            <Icon as={Octicons} name="search" color="black" size="md" />
          }
          onPress={() => navigation.navigate("find")}
        />
      </VStack>

      {isLoadingPools ? (
        <Loading />
      ) : (
        <FlatList
          data={pools}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <PoolCard data={item} />}
          ListEmptyComponent={() => <EmptyPoolList />}
          showsVerticalScrollIndicator={false}
          _contentContainerStyle={{ pb: "24" }}
          px="5"
        />
      )}
    </VStack>
  );
}
