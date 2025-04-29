
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import UserTypeSelector from "./UserTypeSelector";
import { toast } from 'sonner';

const LoginForm = ({ isRegister = false }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || (isRegister && !userType)) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    // Dans une application réelle, ceci serait connecté à une API d'authentification
    toast.success(isRegister ? "Compte créé avec succès!" : "Connexion réussie!");
    
    // Simuler une redirection vers le tableau de bord
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 1500);
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md animate-fade-in">
      <h2 className="text-2xl font-bold text-center mb-6">
        {isRegister ? "Créer un compte" : "Connexion"}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {isRegister && (
          <UserTypeSelector 
            userType={userType} 
            onChange={(type) => setUserType(type)} 
          />
        )}
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="votre@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Mot de passe</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        
        {!isRegister && (
          <div className="text-right">
            <Link to="/forgot-password" className="text-sm text-career-blue hover:underline">
              Mot de passe oublié?
            </Link>
          </div>
        )}
        
        <Button type="submit" className="w-full bg-career-blue hover:bg-career-darkblue">
          {isRegister ? "S'inscrire" : "Se connecter"}
        </Button>
      </form>
      
      <div className="mt-4 text-center">
        {isRegister ? (
          <p className="text-sm text-gray-600">
            Vous avez déjà un compte?{" "}
            <Link to="/login" className="text-career-blue hover:underline">
              Se connecter
            </Link>
          </p>
        ) : (
          <p className="text-sm text-gray-600">
            Vous n'avez pas de compte?{" "}
            <Link to="/register" className="text-career-blue hover:underline">
              S'inscrire
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginForm;
