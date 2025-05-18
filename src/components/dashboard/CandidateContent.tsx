
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MessageSquare, Calendar, Star, Briefcase, Building, ChevronDown, ChevronUp } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import axios from "axios";
import { toast } from "sonner";

interface Offer {
  titre: string;
  contrat: string;
  description: string;
  entreprise: string;
  experience: string;
  recruteur_id: string;
}

const CandidateContent = () => {
  const [allOffers, setAllOffers] = useState<Offer[]>([]);
  const [myApplications, setMyApplications] = useState<Offer[]>([]);
  const [isLoadingOffers, setIsLoadingOffers] = useState(true);
  const [isLoadingApplications, setIsLoadingApplications] = useState(true);
  const [expandedOffers, setExpandedOffers] = useState<{[key: string]: boolean}>({});
  const [activeTab, setActiveTab] = useState("opportunities");

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        // Récupération de toutes les offres (limité aux 100 premières)
        const offersResponse = await axios.get("http://localhost:5000/api/offres/list?limit=100");
        
        if (offersResponse.data) {
          setAllOffers(offersResponse.data);
        }
        
        // Simuler les candidatures de l'utilisateur actuel (à remplacer par une vraie API)
        // Cette partie devra être remplacée par une véritable API pour récupérer les candidatures
        setMyApplications([]);
        
      } catch (error) {
        console.error("Erreur lors de la récupération des offres :", error);
        toast.error("Impossible de récupérer les offres d'emploi");
      } finally {
        setIsLoadingOffers(false);
        setIsLoadingApplications(false);
      }
    };

    fetchOffers();
  }, []);

  // Fonction pour basculer l'état d'expansion d'une offre
  const toggleOfferExpansion = (index: number) => {
    setExpandedOffers(prev => ({
      ...prev,
      [`${activeTab}-${index}`]: !prev[`${activeTab}-${index}`]
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

  const renderOffersList = (offers: Offer[], isLoading: boolean, emptyMessage: string, isApplication: boolean = false) => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-12">
          <p>Chargement des offres...</p>
        </div>
      );
    }

    if (offers.length === 0) {
      return (
        <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
          <h3 className="text-xl font-medium mb-2">{emptyMessage}</h3>
          {isApplication && <p className="text-gray-500">Vous n'avez pas encore postulé à des offres d'emploi.</p>}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {offers.map((offer, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <div 
                className="flex justify-between items-center w-full cursor-pointer" 
                onClick={() => toggleOfferExpansion(index)}
              >
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
                <div>
                  {expandedOffers[`${activeTab}-${index}`] ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </div>
              </div>
            </CardHeader>

            {expandedOffers[`${activeTab}-${index}`] && (
              <>
                <CardContent className="pb-3 pt-1">
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-sm text-gray-500 mb-1">Description</h4>
                      <p className="text-sm whitespace-pre-wrap">{offer.description}</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-x-6 gap-y-2">
                      {offer.experience && (
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-gray-500" />
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
                  {!isApplication && (
                    <Button 
                      size="sm"
                      className="bg-career-blue hover:bg-career-darkblue"
                    >
                      Postuler
                    </Button>
                  )}
                  {isApplication && (
                    <Badge className="bg-green-100 text-green-800">
                      Candidature envoyée
                    </Badge>
                  )}
                </CardFooter>
              </>
            )}
          </Card>
        ))}
      </div>
    );
  };

  return (
    <>
      <Tabs defaultValue="opportunities" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="opportunities">Explorez les opportunités du moment</TabsTrigger>
          <TabsTrigger value="matching">Matching intelligent</TabsTrigger>
          <TabsTrigger value="applications">Mes candidatures</TabsTrigger>
        </TabsList>
        
        <TabsContent value="opportunities" className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4">Explorez les opportunités du moment</h2>
          {renderOffersList(allOffers, isLoadingOffers, "Aucune offre disponible pour le moment")}
        </TabsContent>
        
        <TabsContent value="matching" className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4">Matching intelligent</h2>
          <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
            <h3 className="text-xl font-medium mb-2">Fonctionnalité à venir</h3>
            <p className="text-gray-500 mb-4">Notre système de matching intelligent est en cours de développement.</p>
            <p className="text-sm text-gray-600">Cette fonctionnalité vous permettra de découvrir les offres qui correspondent le mieux à votre profil.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="applications" className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4">Mes candidatures</h2>
          {renderOffersList(myApplications, isLoadingApplications, "Vous n'avez pas encore postulé à des offres", true)}
        </TabsContent>
      </Tabs>
    </>
  );
};

export default CandidateContent;
