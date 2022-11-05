import { createContext, useContext, useState, useEffect } from "react";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";

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
    clientId:
      "632240029735-t4qtfjc4rm9aumbm8fik5nmbkig7s3po.apps.googleusercontent.com",
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

  async function signInWithGoogle(accessToken: string) {
    // console.log("token", accessToken);
  }

  useEffect(() => {
    if (response?.type === "success" && response.authentication?.accessToken) {
      signInWithGoogle(response.authentication.accessToken);
    }
  }, [response]);

  return (
    <AuthContext.Provider
      value={{
        user: {
          name: "Erik Ferreira",
          avatarUrl: "https://github.com/erik-ferreira.png",
        },
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
