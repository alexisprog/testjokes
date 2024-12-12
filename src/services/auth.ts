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

export const authService: IAuthService = {
  signIn,
  signUp,
  signOut,
};
