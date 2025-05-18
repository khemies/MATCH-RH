
import { MessageSquare, Calendar, Users, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface DashboardStatsProps {
  userType: "candidate" | "recruiter";
}

const DashboardStats = ({ userType }: DashboardStatsProps) => {
  return (
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
  );
};

export default DashboardStats;
