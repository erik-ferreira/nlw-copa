import { StatusBar } from "react-native";
import { NativeBaseProvider } from "native-base";
import {
  useFonts,
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
} from "@expo-google-fonts/roboto";

import { New } from "./src/pages/New";
import { Find } from "./src/pages/Find";
import { Pools } from "./src/pages/Pools";
import { SignIn } from "./src/pages/SignIn";

import { AppProvider } from "./src/components";
import { Loading } from "./src/components/Loading";

import { theme } from "./src/styles/theme";

export default function App() {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
  });

  return (
    <NativeBaseProvider theme={theme}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <AppProvider>{!fontsLoaded ? <Loading /> : <SignIn />}</AppProvider>
    </NativeBaseProvider>
  );
}
