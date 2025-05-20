
import { useState, useEffect } from "react";
import axios from "axios";
import { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { toast } from "sonner";
import JobOffersList from "./JobOffersList";
import { Offer } from "./JobOfferCard";

const RecruiterContent = () => {
  const [myOffers, setMyOffers] = useState<Offer[]>([]);
  const [allOffers, setAllOffers] = useState<Offer[]>([]);
  const [recruiterId, setRecruiterId] = useState("");
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
          <JobOffersList 
            offers={myOffers} 
            isLoading={isLoadingMyOffers} 
            emptyMessage="Aucune offre publiée" 
            tabKey="myOffers"
          />
        </TabsContent>
        <TabsContent value="allOffers" className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4">Autres offres sur la plateforme</h2>
          <JobOffersList 
            offers={allOffers} 
            isLoading={isLoadingAllOffers} 
            emptyMessage="Aucune offre disponible sur la plateforme" 
            tabKey="allOffers"
          />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default RecruiterContent;
