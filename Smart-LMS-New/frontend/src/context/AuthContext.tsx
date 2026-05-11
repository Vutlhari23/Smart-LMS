import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";

interface AuthState {
  user: { email: string; role: "student" | "lecturer" } | null;
  token: string | null;
  login: (email: string, role: "student" | "lecturer", token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{
    email: string;
    role: "student" | "lecturer";
  } | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("smart_lms_token");
    const storedRole = localStorage.getItem("smart_lms_role");
    const storedEmail = localStorage.getItem("smart_lms_email");
    if (storedToken && storedRole && storedEmail) {
      setToken(storedToken);
      setUser({
        email: storedEmail,
        role: storedRole as "student" | "lecturer",
      });
    }
  }, []);

  const login = (
    email: string,
    role: "student" | "lecturer",
    token: string,
  ) => {
    localStorage.setItem("smart_lms_token", token);
    localStorage.setItem("smart_lms_role", role);
    localStorage.setItem("smart_lms_email", email);
    setToken(token);
    setUser({ email, role });
    navigate(
      role === "lecturer" ? "/lecturer/dashboard" : "/student/dashboard",
    );
  };

  const logout = () => {
    localStorage.removeItem("smart_lms_token");
    localStorage.removeItem("smart_lms_role");
    localStorage.removeItem("smart_lms_email");
    setToken(null);
    setUser(null);
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
