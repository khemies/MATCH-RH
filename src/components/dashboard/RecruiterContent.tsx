
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

interface Offer {
  id: string;
  title: string;
  typeContrat: string;
  lieu: string;
  salaire: string;
  description: string;
  datePublication: string;
}

const RecruiterContent = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [recruiterId, setRecruiterId] = useState("");

  useEffect(() => {
    // Récupération de l'utilisateur connecté depuis le localStorage
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const id = storedUser?.id || "1"; // par défaut "1" si rien trouvé
    setRecruiterId(id);

    axios.get(`http://localhost:5000/recruiter/${id}/offers`)
      .then(response => {
        setOffers(response.data);
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des offres :", error);
      });
  }, []);

  return (
    <>
      <h2 className="text-2xl font-semibold mb-4">Vos offres d'emploi actives</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        {offers.map((offer) => (
          <Card key={offer.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{offer.title}</CardTitle>
                  <CardDescription>
                    {offer.typeContrat} • {offer.lieu} • {offer.salaire}
                  </CardDescription>
                </div>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  Active
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 line-clamp-2">
                {offer.description}
              </p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <span className="text-sm text-gray-500">Publiée le {offer.datePublication}</span>
              <Button size="sm" variant="outline">
                Voir les candidats
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
};

export default RecruiterContent;
