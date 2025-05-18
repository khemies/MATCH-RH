
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import DashboardStats from "@/components/dashboard/DashboardStats";
import CandidateContent from "@/components/dashboard/CandidateContent";
import RecruiterContent from "@/components/dashboard/RecruiterContent";

const Dashboard = () => {
  const [userType, setUserType] = useState<"candidate" | "recruiter">("candidate");
  const [isLoading, setIsLoading] = useState(true);
  const [userPseudo, setUserPseudo] = useState("");
  const navigate = useNavigate();
  
  useEffect(() => {
    // Récupère le user depuis le localStorage
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    const userRole = userData?.role;
    const pseudo = userData?.pseudo || "Utilisateur";
    
    if (!userRole) {
      // Redirection vers la page de connexion si le rôle n'est pas défini
      toast.error("Veuillez vous connecter pour accéder à votre tableau de bord");
      navigate("/login");
      return;
    }
    
    // Détermine le type d'utilisateur en fonction du rôle stocké
    // Conversion du rôle stocké (candidat/recruteur) en type (candidate/recruiter)
    const type = userRole === "candidat" ? "candidate" : "recruiter";
    setUserType(type);
    setUserPseudo(pseudo);
    setIsLoading(false);
  }, [navigate]);

  const handleActionButtonClick = () => {
    if (userType === "candidate") {
      navigate("/edit-profile");
    } else {
      navigate("/add-job-offer");
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-career-gray pt-24 flex justify-center items-center">
      <p>Chargement de votre tableau de bord...</p>
    </div>;
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-career-gray pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold">
                Tableau de bord {userType === "candidate" ? "Candidat" : "Recruteur"}
              </h1>
              <p className="text-gray-600 mt-1">
                Bienvenue, <span className="font-medium text-career-blue">{userPseudo}</span>
              </p>
            </div>
            
            <Button 
              className="bg-career-blue hover:bg-career-darkblue" 
              onClick={handleActionButtonClick}
            >
              {userType === "candidate" ? "Modifier mon profil" : "Publier une offre"}
            </Button>
          </div>
          
          <DashboardStats userType={userType} />
          
          {userType === "candidate" ? (
            <CandidateContent />
          ) : (
            <RecruiterContent />
          )}
        </div>
      </main>
    </>
  );
};

export default Dashboard;
