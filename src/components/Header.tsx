
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="w-full py-4 px-6 lg:px-10 bg-white shadow-sm fixed top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-career-darkblue">CareerLinkMatch</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-gray-600 hover:text-career-blue transition-colors">Accueil</Link>
          <Link to="/dashboard" className="text-gray-600 hover:text-career-blue transition-colors">Tableau de bord</Link>
          <Link to="/messaging" className="text-gray-600 hover:text-career-blue transition-colors">Messages</Link>
          <Link to="/calendar" className="text-gray-600 hover:text-career-blue transition-colors">Calendrier</Link>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="outline" asChild>
            <Link to="/login">Connexion</Link>
          </Button>
          <Button className="bg-career-blue hover:bg-career-darkblue text-white" asChild>
            <Link to="/register">S'inscrire</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
