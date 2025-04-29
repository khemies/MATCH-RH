
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-career-gray to-white pt-24 pb-16 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Connectez <span className="hero-text-gradient">Talents</span> et <span className="hero-text-gradient">Opportunités</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              CareerLinkMatch aide les recruteurs à trouver les candidats parfaits et les candidats à découvrir les postes qui correspondent à leurs compétences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="btn-primary-gradient text-white">
                <Link to="/register" className="w-full h-full inline-flex items-center justify-center">
                  Commencer maintenant
                </Link>
              </Button>
              <Button size="lg" variant="outline">
                <Link to="/about" className="w-full h-full inline-flex items-center justify-center">
                  En savoir plus
                </Link>
              </Button>
            </div>
          </div>

          <div className="hidden lg:block animate-fade-in">
            <img 
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3" 
              alt="Recruteurs et candidats en entretien" 
              className="rounded-lg shadow-xl"
            />
          </div>
        </div>
      </div>

      <div className="mt-16 md:mt-24">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Comment ça fonctionne</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-career-blue rounded-full flex items-center justify-center text-white font-bold mb-4">1</div>
            <h3 className="text-xl font-semibold mb-3">Créez votre profil</h3>
            <p className="text-gray-600">Inscrivez-vous en tant que candidat ou recruteur et complétez votre profil professionnel.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-career-blue rounded-full flex items-center justify-center text-white font-bold mb-4">2</div>
            <h3 className="text-xl font-semibold mb-3">Trouvez des correspondances</h3>
            <p className="text-gray-600">Notre algorithme trouve les meilleures correspondances selon les compétences et les besoins.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-career-blue rounded-full flex items-center justify-center text-white font-bold mb-4">3</div>
            <h3 className="text-xl font-semibold mb-3">Communiquez et organisez</h3>
            <p className="text-gray-600">Échangez des messages et planifiez des entretiens via notre calendrier intégré.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
