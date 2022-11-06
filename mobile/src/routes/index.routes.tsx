import { Box } from "native-base";
import { NavigationContainer } from "@react-navigation/native";

import { useAuth } from "../hooks/useAuth";

import { AppRoutes } from "./app.routes";
import { SignIn } from "../pages/SignIn";

export function Routes() {
  const { user } = useAuth();

  return (
    <Box flex={1} bg="gray.900">
      <NavigationContainer>
        {user?.name ? <AppRoutes /> : <SignIn />}
      </NavigationContainer>
    </Box>
  );
}