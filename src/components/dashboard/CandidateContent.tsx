import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Calendar, Briefcase, Building } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import OffreMatching from "@/pages/OffreMatching";


interface Offer {
  _id: string;
  offre_id: string;
  Nom_poste: string;
  Contrat: string;
  Description: string;
  Experience: string;
  Entreprise: string;
  Lieu?: string;
  Departement?: string;
}

const CandidateContent = () => {
  const [allOffers, setAllOffers] = useState<Offer[]>([]);
  const [myApplications, setMyApplications] = useState<Offer[]>([]);
  const [isLoadingOffers, setIsLoadingOffers] = useState(true);
  const [isLoadingApplications, setIsLoadingApplications] = useState(true);
  const [expandedOffers, setExpandedOffers] = useState<{ [key: string]: boolean }>({});
  const [activeTab, setActiveTab] = useState("opportunities");

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/offres/list?limit=100");
        setAllOffers(response.data || []);
        setMyApplications([]); // Remplacer plus tard par une vraie API
      } catch (error) {
        toast.error("Erreur lors de la récupération des offres");
        console.error(error);
      } finally {
        setIsLoadingOffers(false);
        setIsLoadingApplications(false);
      }
    };
    fetchOffers();
  }, []);

  const toggleOfferExpansion = (index: number) => {
    setExpandedOffers((prev) => ({
      ...prev,
      [`${activeTab}-${index}`]: !prev[`${activeTab}-${index}`],
    }));
  };

  const formatExperience = (exp: string) => exp || "Non précisé";
  const formatContrat = (type: string) => type || "Non précisé";

  const renderOffersList = (offers: Offer[], isLoading: boolean, emptyMessage: string, isApplication = false) => {
    if (isLoading) {
      return <div className="py-12 text-center">Chargement des offres...</div>;
    }
    if (offers.length === 0) {
      return (
        <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
          <h3 className="text-xl font-medium mb-2">{emptyMessage}</h3>
          {isApplication && <p className="text-gray-500">Aucune candidature trouvée.</p>}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {offers.map((offer, index) => (
          <Card key={offer._id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleOfferExpansion(index)}>
                <div className="flex items-center space-x-2">
                  <Briefcase className="h-5 w-5 text-career-blue" />
                  <div>
                    <CardTitle className="text-lg">{offer.Nom_poste}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      {offer.Entreprise}
                      {offer.Contrat && <><span>•</span><Badge variant="outline">{formatContrat(offer.Contrat)}</Badge></>}
                    </CardDescription>
                  </div>
                </div>
                {expandedOffers[`${activeTab}-${index}`] ? <ChevronUp /> : <ChevronDown />}
              </div>
            </CardHeader>

            {expandedOffers[`${activeTab}-${index}`] && (
              <>
                <CardContent className="pt-1 pb-3">
                  <div className="space-y-2">
                    <div>
                      <h4 className="font-medium text-sm text-gray-500 mb-1">Description</h4>
                      <p className="text-sm whitespace-pre-wrap">{offer.Description}</p>
                    </div>
                    <div className="text-sm text-gray-600">
                      {offer.Experience && (
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                          Expérience : {formatExperience(offer.Experience)}
                        </div>
                      )}
                      {offer.Lieu && <div>Localisation : {offer.Lieu}</div>}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0 flex justify-between items-center">
                  <span className="text-xs text-gray-500">ID Offre: {offer.offre_id}</span>
                  {!isApplication ? (
                    <Button size="sm" className="bg-career-blue hover:bg-career-darkblue">
                      Postuler
                    </Button>
                  ) : (
                    <Badge className="bg-green-100 text-green-800">Candidature envoyée</Badge>
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
    <Tabs defaultValue="opportunities" onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-3 mb-6">
        <TabsTrigger value="opportunities">Offres disponibles</TabsTrigger>
        <TabsTrigger value="matching">Matching intelligent</TabsTrigger>
        <TabsTrigger value="applications">Mes candidatures</TabsTrigger>
      </TabsList>

      <TabsContent value="opportunities">
        <h2 className="text-2xl font-semibold mb-4">Explorez les opportunités du moment</h2>
        {renderOffersList(allOffers, isLoadingOffers, "Aucune offre disponible pour le moment")}
      </TabsContent>
      <TabsContent value="matching" className="space-y-4">
        <h2 className="text-2xl font-semibold mb-4">Matching intelligent</h2>
        <OffreMatching candidatId="0" />
      </TabsContent>


      <TabsContent value="applications">
        <h2 className="text-2xl font-semibold mb-4">Mes candidatures</h2>
        {renderOffersList(myApplications, isLoadingApplications, "Vous n'avez pas encore postulé", true)}
      </TabsContent>
    </Tabs>
  );
};

export default CandidateContent;
