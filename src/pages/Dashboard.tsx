
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { User, Users, MessageSquare, Calendar, Star, Briefcase } from "lucide-react";

const Dashboard = () => {
  const [userType, setUserType] = useState("");
  
  useEffect(() => {
    // Dans une vrai application, cela viendrait de l'état d'authentification
    // Pour la démo, on simule un type d'utilisateur aléatoire
    setUserType(Math.random() > 0.5 ? "candidate" : "recruiter");
  }, []);

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
                Bienvenue, {userType === "candidate" ? "Thomas Dubois" : "Sophie Martin"}
              </p>
            </div>
            
            <Button className="bg-career-blue hover:bg-career-darkblue">
              {userType === "candidate" ? "Modifier mon profil" : "Publier une offre"}
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2 text-career-blue" />
                  Messages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{userType === "candidate" ? "3" : "12"}</p>
                <p className="text-sm text-gray-500">
                  {userType === "candidate" ? "nouveaux messages" : "candidats en attente de réponse"}
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" asChild className="w-full">
                  <Link to="/messaging">Voir tous les messages</Link>
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-career-blue" />
                  Entretiens
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{userType === "candidate" ? "2" : "5"}</p>
                <p className="text-sm text-gray-500">
                  entretiens planifiés cette semaine
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" asChild className="w-full">
                  <Link to="/calendar">Voir le calendrier</Link>
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  {userType === "candidate" ? (
                    <Briefcase className="h-5 w-5 mr-2 text-career-blue" />
                  ) : (
                    <Users className="h-5 w-5 mr-2 text-career-blue" />
                  )}
                  {userType === "candidate" ? "Offres correspondantes" : "Candidats potentiels"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{userType === "candidate" ? "8" : "15"}</p>
                <p className="text-sm text-gray-500">
                  {userType === "candidate" ? "offres qui correspondent à votre profil" : "candidats correspondant à vos offres"}
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  {userType === "candidate" ? "Voir les offres" : "Voir les candidats"}
                </Button>
              </CardFooter>
            </Card>
          </div>
          
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

const CandidateContent = () => {
  return (
    <>
      <h2 className="text-2xl font-semibold mb-4">Offres recommandées pour vous</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        {[1, 2, 3, 4].map((job) => (
          <Card key={job}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Développeur Full Stack</CardTitle>
                  <CardDescription>TechSolutions SA • Paris, France</CardDescription>
                </div>
                <Button variant="ghost" size="icon">
                  <Star className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 flex-wrap mb-4">
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">React</span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Node.js</span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">MongoDB</span>
              </div>
              <p className="text-sm text-gray-600 line-clamp-3">
                Nous recherchons un développeur Full Stack expérimenté pour rejoindre notre équipe dynamique. Vous travaillerez sur des projets innovants...
              </p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <span className="text-sm text-gray-500">Posté il y a 3 jours</span>
              <Button size="sm" className="bg-career-blue hover:bg-career-darkblue">
                Postuler
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <h2 className="text-2xl font-semibold mb-4">Activité récente</h2>
      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            <div className="p-4 flex items-center gap-4">
              <div className="bg-career-lightblue bg-opacity-20 p-2 rounded-full">
                <MessageSquare className="h-5 w-5 text-career-blue" />
              </div>
              <div>
                <p className="font-medium">Nouveau message de InnoTech</p>
                <p className="text-sm text-gray-500">Il y a 1 heure</p>
              </div>
            </div>
            
            <div className="p-4 flex items-center gap-4">
              <div className="bg-career-lightblue bg-opacity-20 p-2 rounded-full">
                <Calendar className="h-5 w-5 text-career-blue" />
              </div>
              <div>
                <p className="font-medium">Entretien confirmé avec DataCorp</p>
                <p className="text-sm text-gray-500">Il y a 1 jour</p>
              </div>
            </div>
            
            <div className="p-4 flex items-center gap-4">
              <div className="bg-career-lightblue bg-opacity-20 p-2 rounded-full">
                <Star className="h-5 w-5 text-career-blue" />
              </div>
              <div>
                <p className="font-medium">Candidature retenue pour le poste de Data Analyst</p>
                <p className="text-sm text-gray-500">Il y a 3 jours</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

const RecruiterContent = () => {
  return (
    <>
      <h2 className="text-2xl font-semibold mb-4">Vos offres d'emploi actives</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        {[1, 2].map((job) => (
          <Card key={job}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Ingénieur DevOps</CardTitle>
                  <CardDescription>CDI • Paris • 45K-60K €</CardDescription>
                </div>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  Active
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Vues</span>
                  <span className="font-medium">243</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Candidatures</span>
                  <span className="font-medium">18</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Correspondances</span>
                  <span className="font-medium">7</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <span className="text-sm text-gray-500">Publiée il y a 5 jours</span>
              <Button size="sm" variant="outline">
                Voir les candidats
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <h2 className="text-2xl font-semibold mb-4">Candidats recommandés</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        {[1, 2, 3].map((candidate) => (
          <Card key={candidate} className="overflow-hidden">
            <div className="h-12 bg-career-blue"></div>
            <CardHeader className="relative pt-12">
              <div className="absolute -top-8 left-4 w-16 h-16 rounded-full bg-white flex items-center justify-center border-4 border-white">
                <User className="h-10 w-10 text-career-blue" />
              </div>
              <CardTitle className="text-lg">Thomas Dubois</CardTitle>
              <CardDescription>Développeur Full Stack</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 flex-wrap mb-4">
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">React</span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Node.js</span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">TypeScript</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                5 ans d'expérience • Paris, France
              </p>
              <p className="text-sm text-gray-500 line-clamp-3">
                Développeur passionné avec expérience dans le développement web et mobile...
              </p>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button size="sm" className="bg-career-blue hover:bg-career-darkblue">
                Contacter
              </Button>
              <Button size="sm" variant="outline">
                Voir le profil
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
};

export default Dashboard;
