
import LoginForm from "@/components/LoginForm";
import { useEffect } from "react";

const Register = () => {
  useEffect(() => {
    document.title = "MatchRH - Inscription";
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 pt-16 pb-8 px-4">
      <div className="w-full max-w-md">
        <LoginForm isRegister={true} />
      </div>
    </div>
  );
};

export default Register;
