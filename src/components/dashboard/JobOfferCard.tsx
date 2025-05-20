
import { useState } from "react";
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
import { ChevronDown, ChevronUp, Briefcase, Building, Clock, MapPin, Users, Code } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

// Interface for offer data
export interface Offer {
  Nom_poste: string;
  Contrat: string;
  Description: string;
  Entreprise: string;
  Experience: string;
  recruteur_id: string;
  missions?: string;
  profil?: string;
  stack_technique?: string;
  groupe_metier?: string;
  Lieu?: string;
  source?: string;
  _id?: string; // MongoDB ID
}

interface JobOfferCardProps {
  offer: Offer;
  index: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
  tabKey: string;
}

// Fonction pour formater le niveau d'expérience en format lisible
const formatExperience = (experience: string) => {
  switch(experience) {
    case "debutant": return "Débutant accepté";
    case "Débutant accepté": return "Débutant accepté";
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
    case "CDI": return "CDI";
    case "CDD": return "CDD";
    case "interim": return "Intérim";
    case "stage": return "Stage";
    case "alternance": return "Alternance";
    case "freelance": return "Freelance";
    default: return contrat || "Non précisé";
  }
};

const JobOfferCard = ({ offer, index, isExpanded, onToggleExpand, tabKey }: JobOfferCardProps) => {
  const navigate = useNavigate();

  const handleViewCandidates = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Navigate to the candidates page with the offer ID
    navigate(`/candidates/${offer._id || index}`);
  };

  return (
    <Card className="overflow-hidden">
      <div className="w-full">
        <CardHeader className="pb-2">
          <div 
            className="flex justify-between items-center w-full text-left cursor-pointer"
            onClick={onToggleExpand}
          >
            <div className="flex items-center space-x-2">
              <Briefcase className="h-5 w-5 text-career-blue" />
              <div>
                <CardTitle className="text-lg">{offer.Nom_poste}</CardTitle>
                <CardDescription className="flex items-center space-x-2 flex-wrap">
                  <Building className="h-4 w-4" />
                  <span>{offer.Entreprise}</span>
                  {offer.Contrat && (
                    <>
                      <span>•</span>
                      <Badge variant="outline">{formatContrat(offer.Contrat)}</Badge>
                    </>
                  )}
                  {offer.Lieu && (
                    <>
                      <span>•</span>
                      <span className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {offer.Lieu}
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
              {isExpanded ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </div>
          </div>
        </CardHeader>

        {isExpanded && (
          <>
            <CardContent className="pb-3 pt-1">
              <div className="space-y-3">
                {offer.Description && (
                  <div>
                    <h4 className="font-medium text-sm text-gray-500 mb-1">Description</h4>
                    <p className="text-sm whitespace-pre-wrap">{offer.Description}</p>
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

                {offer.stack_technique && (
                  <div>
                    <h4 className="font-medium text-sm text-gray-500 mb-1">Stack technique</h4>
                    <div className="flex items-center">
                      <Code className="h-4 w-4 mr-1 text-gray-500" />
                      <p className="text-sm">{offer.stack_technique}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4">
                  {offer.Experience && (
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-gray-500" />
                      <span className="text-sm">
                        Expérience: {formatExperience(offer.Experience)}
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
              <span className="text-xs text-gray-500">ID: {offer._id || index + 1}</span>
              <Button 
                variant="default"
                className="bg-career-blue hover:bg-career-darkblue"
                onClick={handleViewCandidates}
              >
                Voir les candidats correspondants
              </Button>
            </CardFooter>
          </>
        )}
      </div>
    </Card>
  );
};

export default JobOfferCard;
