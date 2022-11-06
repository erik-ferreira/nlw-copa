import { useState, useEffect } from "react";
import { FlatList, useToast } from "native-base";

import { api } from "../services/api";

import { Game, GameProps } from "./Game";

interface Props {
  poolId: string;
}

export function Guesses({ poolId }: Props) {
  const toast = useToast();

  const [games, setGames] = useState<GameProps[]>([]);
  const [isLoadingGames, setIsLoadingGames] = useState(false);
  const [firstTeamPoints, setFirstTeamPoints] = useState("");
  const [secondTeamPoints, setSecondTeamPoints] = useState("");

  async function getGames() {
    try {
      setIsLoadingGames(true);
      const response = await api.get(`/pools/${poolId}/games`);

      console.log("GAMES", response.data);
      setGames(response.data.games);
    } catch (error) {
      console.log(error);

      toast.show({
        title: "Não foi possível carregar os jogos",
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsLoadingGames(false);
    }
  }

  useEffect(() => {
    getGames();
  }, [poolId]);

  return (
    <FlatList
      data={games}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Game
          data={item}
          setFirstTeamPoints={setFirstTeamPoints}
          setSecondTeamPoints={setSecondTeamPoints}
          onGuessConfirm={() => {}}
        />
      )}
      // ListEmptyComponent={() => <EmptyPoolList />}
      // showsVerticalScrollIndicator={false}
      _contentContainerStyle={{ pb: "24" }}
      // px="5"
    />
  );
}
