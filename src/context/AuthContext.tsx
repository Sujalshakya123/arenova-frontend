import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { registerUnauthorizedHandler } from "../api/axios";

type User = {
  id: string;
  username: string;
  email: string;
  role: string;
  status?: string;
};

type AuthContextType = {
  token: string | null;
  userDTO: User | null;
  profileImage: string | null;
  isAuthenticated: boolean;
  login: (jwtToken: string, userData: User) => void;
  logout: () => void;
  setProfileImage: (image: string | null) => void;
  updateUser: (updates: Partial<Pick<User, "username" | "email">>) => void;
};

type AuthProviderProps = {
  children: ReactNode;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getProfileImageKey = (email: string) => `profileImage_${email}`;

const loadProfileImage = (email?: string) => {
  if (!email) return null;
  return localStorage.getItem(getProfileImageKey(email));
};

const isTokenExpired = (jwtToken: string) => {
  try {
    const decoded = jwtDecode<{ exp?: number }>(jwtToken);
    if (!decoded.exp) return false;
    return decoded.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
};

export const hasValidAuthToken = (jwtToken: string | null | undefined) =>
  Boolean(jwtToken && !isTokenExpired(jwtToken));

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const initialToken = localStorage.getItem("token");
  const validInitialToken =
    initialToken && !isTokenExpired(initialToken) ? initialToken : null;

  const [token, setToken] = useState<string | null>(validInitialToken);

  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [profileImage, setProfileImageState] = useState<string | null>(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return null;
    const parsed = JSON.parse(storedUser) as User;
    return loadProfileImage(parsed.email);
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token);
  const logoutRef = useRef<() => void>(() => {});

  useEffect(() => {
    if (initialToken && isTokenExpired(initialToken)) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }, [initialToken]);

  useEffect(() => {
    registerUnauthorizedHandler(() => {
      toast.info("Your session expired. Please sign in again.", {
        autoClose: 4000,
      });
      logoutRef.current();
    });
  }, []);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      setIsAuthenticated(false);
      setUser(null);
      setProfileImageState(null);
    }
  }, [token, user]);

  useEffect(() => {
    if (user?.email) {
      setProfileImageState(loadProfileImage(user.email));
    }
  }, [user?.email]);

  const login = (jwtToken: string, userData: User) => {
    setToken(jwtToken);
    setUser(userData);
    setProfileImageState(loadProfileImage(userData.email));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setProfileImageState(null);

    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  logoutRef.current = logout;

  const setProfileImage = (image: string | null) => {
    setProfileImageState(image);

    if (!user?.email) return;

    if (image) {
      localStorage.setItem(getProfileImageKey(user.email), image);
    } else {
      localStorage.removeItem(getProfileImageKey(user.email));
    }
  };

  const updateUser = (updates: Partial<Pick<User, "username" | "email">>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...updates };
      localStorage.setItem("user", JSON.stringify(next));
      return next;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        userDTO: user,
        profileImage,
        isAuthenticated,
        login,
        logout,
        setProfileImage,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};
