import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, LogOut, User, Trash } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userPseudo, setUserPseudo] = useState<string>("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    if (userData.token) {
      setIsLoggedIn(true);
      setUserRole(userData.role);
      setUserPseudo(userData.pseudo || "Utilisateur");
    } else {
      setIsLoggedIn(false);
      setUserRole(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUserRole(null);
    toast.success("Déconnexion réussie");
    navigate("/");
  };

  const handleDeleteProfile = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      const token = userData.token;
      
      if (!token) {
        toast.error("Veuillez vous connecter pour effectuer cette action");
        return;
      }
      
      const response = await axios.delete("http://localhost:5000/api/profiles/delete", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.status === 200) {
        toast.success("Votre profil a été supprimé avec succès");
        setConfirmDelete(false);
        // Rediriger vers la page de création de profil après la suppression
        navigate("/create-profile");
      } else {
        toast.error("Une erreur est survenue lors de la suppression du profil");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du profil:", error);
      toast.error("Une erreur est survenue lors de la suppression du profil");
    }
  };

  // Liens de navigation selon le rôle (candidat ou recruteur)
  const getNavLinks = () => {
    const role = userData?.role;

    if (role === "recruiter") {
      return [
        { href: "/dashboard", label: "Tableau de bord" },
        { href: "/add-job-offer", label: "Ajouter une offre" },
        { href: "/all-profiles", label: "Tous les profils" }, // Nouveau lien
        { href: "/messaging", label: "Messagerie" },
        { href: "/calendar", label: "Calendrier" },
      ];
    } else if (role === "candidate") {
      return [
        { href: "/dashboard", label: "Tableau de bord" },
        { href: "/edit-profile", label: "Mon profil" },
        { href: "/messaging", label: "Messagerie" },
        { href: "/calendar", label: "Calendrier" },
      ];
    }
    return [];
  };

  return (
    <header className="w-full py-4 px-6 lg:px-10 bg-white shadow-sm fixed top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-career-darkblue">MatchRH</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {getNavLinks().map((link, index) => (
            <Link key={index} to={link.href} className="text-gray-600 hover:text-career-blue transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 hidden md:inline-block">
                Bonjour, {userPseudo}
              </span>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    <span className="hidden md:inline">Options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  {userRole === "candidat" && (
                    <DropdownMenuItem onClick={() => navigate("/edit-profile")} className="cursor-pointer">
                      <User className="h-4 w-4 mr-2" />
                      Modifier mon profil
                    </DropdownMenuItem>
                  )}
                  
                  {userRole === "candidat" && (
                    <>
                      <DropdownMenuItem className="cursor-pointer text-red-500" onClick={() => setConfirmDelete(true)}>
                        <Trash className="h-4 w-4 mr-2" />
                        Supprimer mon profil
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  
                  <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <>
              <Button variant="outline" asChild>
                <Link to="/login">Connexion</Link>
              </Button>
              <Button className="bg-career-blue hover:bg-career-darkblue text-white" asChild>
                <Link to="/register">S'inscrire</Link>
              </Button>
            </>
          )}
        </div>
      </div>
      
      {/* Dialogue de confirmation de suppression de profil */}
      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer mon profil</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer votre profil ? Cette action est irréversible et toutes vos données de profil seront perdues.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeleteProfile}>
              Oui, supprimer mon profil
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Header;
