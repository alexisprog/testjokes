import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";

export interface AuthResponse {
  user: FirebaseAuthTypes.User | null;
  error?: string;
}

export interface IAuthService {
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signUp: (
    email: string,
    password: string,
    name: string
  ) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<{
    user: FirebaseAuthTypes.User | null;
    error: string | null;
  }>;
}

const signIn = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  try {
    const userCredential = await auth().signInWithEmailAndPassword(
      email,
      password
    );
    return { user: userCredential.user };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

const signUp = async (
  email: string,
  password: string,
  name: string
): Promise<AuthResponse> => {
  try {
    const userCredential = await auth().createUserWithEmailAndPassword(
      email,
      password
    );

    await userCredential.user.updateProfile({
      displayName: name,
    });

    return { user: userCredential.user };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

const signOut = async (): Promise<void> => {
  return auth().signOut();
};

const refreshSession = async (): Promise<{
  user: FirebaseAuthTypes.User | null;
  error: string | null;
}> => {
  try {
    const currentUser = auth().currentUser;
    if (currentUser) {
      // Forzamos a Firebase a renovar el token
      await currentUser.reload();
      return { user: currentUser, error: null };
    }
    return { user: null, error: "No session found" };
  } catch (error: any) {
    return {
      user: null,
      error: error.message || "Error refreshing session",
    };
  }
};

export const authService: IAuthService = {
  signIn,
  signUp,
  signOut,
  refreshSession,
};
