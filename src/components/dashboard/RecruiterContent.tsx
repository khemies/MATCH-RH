
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
import { ChevronDown, ChevronUp, Briefcase, Building, Clock, MapPin, Users, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface Offer {
  titre: string;
  contrat: string;
  description: string;
  entreprise: string;
  experience: string;
  recruteur_id: string;
  missions?: string;
  profil?: string;
  groupe_metier?: string;
  lieu?: string;
  source?: string;
}

const RecruiterContent = () => {
  const [myOffers, setMyOffers] = useState<Offer[]>([]);
  const [allOffers, setAllOffers] = useState<Offer[]>([]);
  const [recruiterId, setRecruiterId] = useState("");
  const [expandedOffers, setExpandedOffers] = useState<{[key: string]: boolean}>({});
  const [isLoadingMyOffers, setIsLoadingMyOffers] = useState(true);
  const [isLoadingAllOffers, setIsLoadingAllOffers] = useState(true);
  const [activeTab, setActiveTab] = useState("myOffers");

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        // Récupération de l'utilisateur connecté depuis le localStorage
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        const id = storedUser?.id || "1"; // par défaut "1" si rien trouvé
        setRecruiterId(id);
        
        // Appel à l'API pour récupérer les offres du recruteur
        const myOffersResponse = await axios.get(`http://localhost:5000/api/offres/recruiter/${id}`);
        
        if (myOffersResponse.data) {
          console.log("Offres récupérées:", myOffersResponse.data);
          setMyOffers(myOffersResponse.data);
        }
        
        // Récupérer les 100 premières offres de la plateforme
        const allOffersResponse = await axios.get("http://localhost:5000/api/offres/list?limit=100");
        
        if (allOffersResponse.data) {
          console.log("Toutes les offres:", allOffersResponse.data);
          setAllOffers(allOffersResponse.data);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des offres :", error);
        toast.error("Impossible de récupérer les offres d'emploi");
      } finally {
        setIsLoadingMyOffers(false);
        setIsLoadingAllOffers(false);
      }
    };

    fetchOffers();
  }, []);

  // Fonction pour basculer l'état d'expansion d'une offre
  const toggleOfferExpansion = (tabKey: string, index: number) => {
    setExpandedOffers(prev => ({
      ...prev,
      [`${tabKey}-${index}`]: !prev[`${tabKey}-${index}`]
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

  // Fonction pour rendre la liste des offres
  const renderOffersList = (offers: Offer[], isLoading: boolean, emptyMessage: string, tabKey: string) => {
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
          {tabKey === "myOffers" && (
            <>
              <p className="text-gray-500 mb-4">Vous n'avez pas encore publié d'offres d'emploi.</p>
              <Button 
                className="bg-career-blue hover:bg-career-darkblue"
                onClick={() => window.location.href = "/add-job-offer"}
              >
                Publier votre première offre
              </Button>
            </>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {offers.map((offer, index) => (
          <Card key={index} className="overflow-hidden">
            <div className="w-full">
              <CardHeader className="pb-2">
                <div 
                  className="flex justify-between items-center w-full text-left cursor-pointer"
                  onClick={() => toggleOfferExpansion(tabKey, index)}
                >
                  <div className="flex items-center space-x-2">
                    <Briefcase className="h-5 w-5 text-career-blue" />
                    <div>
                      <CardTitle className="text-lg">{offer.titre}</CardTitle>
                      <CardDescription className="flex items-center space-x-2 flex-wrap">
                        <Building className="h-4 w-4" />
                        <span>{offer.entreprise}</span>
                        {offer.contrat && (
                          <>
                            <span>•</span>
                            <Badge variant="outline">{formatContrat(offer.contrat)}</Badge>
                          </>
                        )}
                        {offer.lieu && (
                          <>
                            <span>•</span>
                            <span className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {offer.lieu}
                            </span>
                          </>
                        )}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {offer.source && (
                      <Badge className="mr-2 bg-blue-100 text-blue-800 hover:bg-blue-100">
                        {offer.source === "formulaire" ? "Formulaire" : "CSV"}
                      </Badge>
                    )}
                    <Badge className="mr-3 bg-green-100 text-green-800 hover:bg-green-100">
                      Active
                    </Badge>
                    {expandedOffers[`${tabKey}-${index}`] ? (
                      <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                </div>
              </CardHeader>

              {expandedOffers[`${tabKey}-${index}`] && (
                <>
                  <CardContent className="pb-3 pt-1">
                    <div className="space-y-3">
                      {offer.description && (
                        <div>
                          <h4 className="font-medium text-sm text-gray-500 mb-1">Description</h4>
                          <p className="text-sm whitespace-pre-wrap">{offer.description}</p>
                        </div>
                      )}
                      
                      {offer.missions && (
                        <div>
                          <h4 className="font-medium text-sm text-gray-500 mb-1">Missions</h4>
                          <p className="text-sm whitespace-pre-wrap">{offer.missions}</p>
                        </div>
                      )}
                      
                      {offer.profil && (
                        <div>
                          <h4 className="font-medium text-sm text-gray-500 mb-1">Profil recherché</h4>
                          <p className="text-sm whitespace-pre-wrap">{offer.profil}</p>
                        </div>
                      )}
                      
                      <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4">
                        {offer.experience && (
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1 text-gray-500" />
                            <span className="text-sm">
                              Expérience: {formatExperience(offer.experience)}
                            </span>
                          </div>
                        )}
                        
                        {offer.groupe_metier && (
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1 text-gray-500" />
                            <span className="text-sm">
                              Groupe métier: {offer.groupe_metier}
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
                </>
              )}
            </div>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <>
      <Tabs defaultValue="myOffers" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="myOffers">Mes offres d'emploi</TabsTrigger>
          <TabsTrigger value="allOffers">Autres offres sur la plateforme</TabsTrigger>
        </TabsList>
        <TabsContent value="myOffers" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Mes offres d'emploi</h2>
            <Button 
              onClick={() => window.location.href = "/add-job-offer"}
              className="bg-career-blue hover:bg-career-darkblue"
            >
              <FileText className="mr-2 h-4 w-4" />
              Ajouter une offre
            </Button>
          </div>
          {renderOffersList(myOffers, isLoadingMyOffers, "Aucune offre publiée", "myOffers")}
        </TabsContent>
        <TabsContent value="allOffers" className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4">Autres offres sur la plateforme</h2>
          {renderOffersList(allOffers, isLoadingAllOffers, "Aucune offre disponible sur la plateforme", "allOffers")}
        </TabsContent>
      </Tabs>
    </>
  );
};

export default RecruiterContent;
