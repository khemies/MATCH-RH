
import LoginForm from "@/components/LoginForm";
import { useEffect } from "react";

const Login = () => {
  useEffect(() => {
    document.title = "MatchRH - Connexion";
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 pt-16 pb-8 px-4">
      <div className="w-full max-w-md">
        <LoginForm isRegister={false} />
      </div>
    </div>
  );
};

export default Login;
