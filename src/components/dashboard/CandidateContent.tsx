
import { Link } from "react-router-dom";
import { MessageSquare, Calendar, Star } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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

export default CandidateContent;
