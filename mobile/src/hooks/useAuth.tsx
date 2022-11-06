import { createContext, useContext, useState, useEffect } from "react";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";

import { api } from "../services/api";

WebBrowser.maybeCompleteAuthSession();

import { ProviderProps } from "./types";

interface UserProps {
  name: string;
  avatarUrl: string;
}

interface AuthContextData {
  user: UserProps;
  signIn: () => Promise<void>;
  isUserLoading: boolean;
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: ProviderProps) {
  const [user, setUser] = useState<UserProps>({} as UserProps);
  const [isUserLoading, setIsUserLoading] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: process.env.GOOGLE_CLIENT_ID,
    redirectUri: "https://auth.expo.io/@erik_ferreira/nlwcopamobileerik",
    scopes: ["profile", "email"],
  });

  async function signIn() {
    try {
      setIsUserLoading(true);

      await promptAsync();
    } catch (err) {
      console.log(err);

      throw err;
    } finally {
      setIsUserLoading(false);
    }
  }

  async function signInWithGoogle(access_token: string) {
    try {
      setIsUserLoading(true);

      const tokenResponse = await api.post("/users", { access_token });

      if (tokenResponse.status === 200) {
        // to insert token in request
        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${tokenResponse.data?.token}`;

        const userInfoResponse = await api.get("/me");

        setUser(userInfoResponse.data?.user);
      }
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setIsUserLoading(false);
    }
  }

  useEffect(() => {
    if (response?.type === "success" && response.authentication?.accessToken) {
      signInWithGoogle(response.authentication.accessToken);
    }
  }, [response]);

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        isUserLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  return context;
}
