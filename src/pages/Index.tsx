
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-16">
        <Hero />
        
        <section className="py-16 px-6 bg-career-lightgray">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Pourquoi choisir MatchRH?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-3 text-career-darkblue">Matching intelligent</h3>
                <p className="text-gray-600">Notre algorithme analyse les compétences et l'expérience pour créer des correspondances optimales.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-3 text-career-darkblue">Communication simplifiée</h3>
                <p className="text-gray-600">Messagerie intégrée pour faciliter les échanges entre candidats et recruteurs.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-3 text-career-darkblue">Planification d'entretiens</h3>
                <p className="text-gray-600">Calendrier intégré pour organiser et confirmer les entretiens sans friction.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-3 text-career-darkblue">Profils détaillés</h3>
                <p className="text-gray-600">Mettez en valeur vos compétences ou vos besoins de recrutement avec précision.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-3 text-career-darkblue">Interface intuitive</h3>
                <p className="text-gray-600">Une expérience utilisateur fluide et agréable pour tous les utilisateurs.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-3 text-career-darkblue">Analyse de données</h3>
                <p className="text-gray-600">Statistiques et insights pour optimiser vos recherches et candidatures.</p>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Prêt à transformer votre processus de recrutement?</h2>
            <p className="text-lg text-gray-600 mb-8">
              Rejoignez MatchRH aujourd'hui et découvrez une nouvelle façon de connecter talents et opportunités.
            </p>
            <Button className="bg-career-blue hover:bg-career-darkblue text-white text-lg px-8 py-6">
              <Link to="/register" className="w-full h-full inline-flex items-center justify-center">
                S'inscrire gratuitement
              </Link>
            </Button>
          </div>
        </section>
        
        <footer className="bg-career-dark text-white py-12 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-xl mb-4">MatchRH</h3>
              <p className="text-gray-300">
                La plateforme qui révolutionne la mise en relation entre candidats et recruteurs.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Liens rapides</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-300 hover:text-white">Accueil</Link></li>
                <li><Link to="/about" className="text-gray-300 hover:text-white">À propos</Link></li>
                <li><Link to="/contact" className="text-gray-300 hover:text-white">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Légal</h4>
              <ul className="space-y-2">
                <li><Link to="/terms" className="text-gray-300 hover:text-white">Conditions d'utilisation</Link></li>
                <li><Link to="/privacy" className="text-gray-300 hover:text-white">Politique de confidentialité</Link></li>
                <li><Link to="/cookies" className="text-gray-300 hover:text-white">Cookies</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <address className="text-gray-300 not-italic">
                <p>Email: info@matchrh.com</p>
                <p>Tél: +33 01 23 45 67 89</p>
              </address>
            </div>
          </div>
          
          <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
            <p>© {new Date().getFullYear()} MatchRH. Tous droits réservés.</p>
          </div>
        </footer>
      </main>
    </>
  );
};

export default Index;
