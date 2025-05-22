// OffreMatching.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Briefcase, Building } from "lucide-react";

interface OffreMatchingProps {
  candidatId: string;  // <- on reçoit l'ID ici depuis <OffreMatching candidatId="0" />
}

interface Offre {
  _id: string;
  Nom_poste: string;
  Contrat: string;
  Description: string;
  Entreprise: string;
  Experience: string;
  Lieu: string;
  offre_id: string;
}

const OffreMatching = ({ candidatId }: OffreMatchingProps) => {
  const [offres, setOffres] = useState<Offre[]>([]);


  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const candidatId = user?.id || "0";
    const fetchMatchingOffers = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/profile/matching/${candidatId}`);
        const matching = response.data;

        const offreIds = matching.map((item: any) => item.offre_id);

        const allOffresResponse = await axios.get("http://localhost:5000/api/offres/list?limit=1000");
        const allOffres = allOffresResponse.data;

        const filteredOffres = allOffres.filter((offre: any) => offreIds.includes(offre.offre_id));
        setOffres(filteredOffres);
      } catch (error) {
        console.error("❌ Erreur lors du chargement des offres associées:", error);
      }
    };

    fetchMatchingOffers();
  }, [candidatId]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Offres associées à votre profil</h1>
      {offres.length === 0 ? (
        <p className="text-gray-500">Aucune offre ne correspond actuellement.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {offres.map((offre) => (
            <Card key={offre._id}>
              <CardHeader>
                <CardTitle>{offre.Nom_poste}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Building className="h-4 w-4" /> {offre.Entreprise}
                  <span> • </span>
                  <Badge>{offre.Contrat}</Badge>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 mb-3 whitespace-pre-wrap">{offre.Description}</p>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  Expérience : {offre.Experience || "Non précisé"}
                </div>
              </CardContent>
              <CardFooter>
                <Button size="sm">Voir détail</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default OffreMatching;
