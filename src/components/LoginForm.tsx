
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import UserTypeSelector from "./UserTypeSelector";
import { toast } from 'sonner';
import axios from "axios";

const LoginForm = ({ isRegister = false }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("");
  const [pseudo, setPseudo] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!email || !password || (isRegister && (!userType || !pseudo))) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
  
    const url = isRegister
      ? "http://localhost:5000/api/auth/register"
      : "http://localhost:5000/api/auth/login";
  
    // Conversion du type d'utilisateur pour correspondre au format du backend
    const role = userType === "candidate" ? "candidat" : "recruteur";
    
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          ...(isRegister ? { role, pseudo } : {}),
        }),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        toast.error(data.error || "Une erreur est survenue");
        return;
      }
  
      toast.success(data.message || "Succès !");
  
      // Stockage des données utilisateur dans le localStorage
      if (!isRegister) {
        const userData = {
          id: data.user_id,
          role: data.role,
          token: data.token,
          pseudo: data.pseudo
        };
        
        localStorage.setItem("user", JSON.stringify(userData));
        
        // Si l'utilisateur est un candidat, vérifier s'il a déjà un profil
        if (data.role === "candidat") {
          try {
            const profileRes = await axios.get("http://localhost:5000/api/profiles/check", {
              headers: {
                Authorization: `Bearer ${data.token}`
              }
            });
            
            if (profileRes.data.exists) {
              // Profil existe, redirection vers le dashboard
              navigate("/dashboard");
            } else {
              // Pas de profil, redirection vers la page de création de profil
              navigate("/create-profile");
            }
          } catch (error) {
            console.error("Erreur lors de la vérification du profil:", error);
            // En cas d'erreur, rediriger vers le tableau de bord par défaut
            navigate("/dashboard");
          }
        } else {
          // Si c'est un recruteur, rediriger directement vers le dashboard
          navigate("/dashboard");
        }
      } else {
        // Si l'utilisateur vient de s'inscrire, rediriger vers la page de connexion
        navigate("/login");
      }
    } catch (error) {
      toast.error("Erreur de connexion au serveur");
    }
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
            pseudo={pseudo}
            onPseudoChange={setPseudo}
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
            Vous avez déjà un compte ?{" "}
            <Link to="/login" className="text-career-blue hover:underline">
              Se connecter
            </Link>
          </p>
        ) : (
          <p className="text-sm text-gray-600">
            Vous n'avez pas de compte ?{" "}
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
