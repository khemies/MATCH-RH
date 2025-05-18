
import { useState, useEffect } from "react";
import axios from "axios";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Briefcase, Building, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Offer {
  titre: string;
  contrat: string;
  description: string;
  entreprise: string;
  experience: string;
  recruteur_id: string;
}

const RecruiterContent = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [recruiterId, setRecruiterId] = useState("");
  const [expandedOffers, setExpandedOffers] = useState<{[key: string]: boolean}>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        // Récupération de l'utilisateur connecté depuis le localStorage
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        const id = storedUser?.id || "1"; // par défaut "1" si rien trouvé
        setRecruiterId(id);
        
        // Appel à l'API pour récupérer les offres du recruteur
        const response = await axios.get(`http://localhost:5000/api/offres/recruiter/${id}`);
        
        if (response.data) {
          setOffers(response.data);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des offres :", error);
        toast.error("Impossible de récupérer vos offres d'emploi");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOffers();
  }, []);

  // Fonction pour basculer l'état d'expansion d'une offre
  const toggleOfferExpansion = (index: number) => {
    setExpandedOffers(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Fonction pour afficher le niveau d'expérience en format lisible
  const formatExperience = (experience: string) => {
    switch(experience) {
      case "debutant": return "Débutant accepté";
      case "1-2": return "1 à 2 ans";
      case "3-5": return "3 à 5 ans";
      case "5-10": return "5 à 10 ans";
      case "10+": return "Plus de 10 ans";
      default: return experience;
    }
  };

  // Fonction pour formater le type de contrat
  const formatContrat = (contrat: string) => {
    switch(contrat) {
      case "cdi": return "CDI";
      case "cdd": return "CDD";
      case "interim": return "Intérim";
      case "stage": return "Stage";
      case "alternance": return "Alternance";
      case "freelance": return "Freelance";
      default: return contrat || "Non précisé";
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <p>Chargement de vos offres...</p>
      </div>
    );
  }

  if (offers.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
        <h3 className="text-xl font-medium mb-2">Aucune offre publiée</h3>
        <p className="text-gray-500 mb-4">Vous n'avez pas encore publié d'offres d'emploi.</p>
        <Button 
          className="bg-career-blue hover:bg-career-darkblue"
          onClick={() => window.location.href = "/add-job-offer"}
        >
          Publier votre première offre
        </Button>
      </div>
    );
  }

  return (
    <>
      <h2 className="text-2xl font-semibold mb-4">Vos offres d'emploi actives</h2>
      <div className="space-y-4">
        {offers.map((offer, index) => (
          <Card key={index} className="overflow-hidden">
            <Collapsible
              open={expandedOffers[index] || false}
              onOpenChange={() => toggleOfferExpansion(index)}
              className="w-full"
            >
              <CardHeader className="pb-2">
                <CollapsibleTrigger className="flex justify-between items-center w-full text-left">
                  <div className="flex items-center space-x-2">
                    <Briefcase className="h-5 w-5 text-career-blue" />
                    <div>
                      <CardTitle className="text-lg">{offer.titre}</CardTitle>
                      <CardDescription className="flex items-center space-x-2">
                        <Building className="h-4 w-4" />
                        <span>{offer.entreprise}</span>
                        {offer.contrat && (
                          <>
                            <span>•</span>
                            <Badge variant="outline">{formatContrat(offer.contrat)}</Badge>
                          </>
                        )}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Badge className="mr-3 bg-green-100 text-green-800 hover:bg-green-100">
                      Active
                    </Badge>
                    {expandedOffers[index] ? (
                      <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                </CollapsibleTrigger>
              </CardHeader>

              <CollapsibleContent>
                <CardContent className="pb-3 pt-1">
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-sm text-gray-500 mb-1">Description</h4>
                      <p className="text-sm whitespace-pre-wrap">{offer.description}</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-x-6 gap-y-2">
                      {offer.experience && (
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1 text-gray-500" />
                          <span className="text-sm">
                            Expérience: {formatExperience(offer.experience)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0 flex justify-between items-center">
                  <span className="text-xs text-gray-500">ID: {index + 1}</span>
                  <Button 
                    variant="default"
                    className="bg-career-blue hover:bg-career-darkblue"
                  >
                    Voir les candidats correspondants
                  </Button>
                </CardFooter>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}
      </div>
    </>
  );
};

export default RecruiterContent;
