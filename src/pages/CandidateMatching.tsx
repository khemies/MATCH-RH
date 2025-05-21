
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, MapPin, Briefcase, Clock, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Interface pour l'offre d'emploi
interface Offer {
  _id?: string;
  offre_id?: number | string;
  Nom_poste: string;
  Entreprise: string;
  Contrat: string;
  Description: string;
  Lieu?: string;
}

// Interface pour le candidat
interface Candidate {
  
  candidat_id: string;
  Profil?: string;
  Compétence?: string;
  Expérience?: string;
  score?: number;
}

const CandidateMatching = () => {
  const { offerId } = useParams<{ offerId: string }>();
  const navigate = useNavigate();
  const [offer, setOffer] = useState<Offer | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        console.log("ID MongoDB de l'offre:", offerId);
        
        // Récupération des détails de l'offre
        const offerResponse = await axios.get(`http://localhost:5000/api/offres/${offerId}`);
        setOffer(offerResponse.data);
        console.log("Détails de l'offre:", offerResponse.data);
        
        // Récupération des candidats correspondants en utilisant l'ID MongoDB de l'offre
        // Le backend s'occupera d'extraire le offre_id et de chercher les candidats avec candidat_id = offre_id
        const candidatesResponse = await axios.get(`http://localhost:5000/api/offres/candidates/matching/${offerId}`);
        console.log("Candidats reçus:", candidatesResponse.data);
        setCandidates(candidatesResponse.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
        toast.error("Impossible de récupérer les informations des candidats correspondants");
      } finally {
        setIsLoading(false);
      }
    };

    if (offerId) {
      fetchData();
    }
  }, [offerId]);

  // Fonction pour normaliser les données du candidat (pour gérer différents formats)
  const normalizeCandidate = (candidate: Candidate) => {
    return {
      
      candidat_id: candidate.candidat_id,
      Profil: candidate.Profil,
      Compétence: candidate.Compétence,
      Expérience: candidate.Expérience, 
      score: candidate.score     
    };
  };

  const handleGoBack = () => {
    navigate("/dashboard");
  };

  const handleViewDetails = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-career-gray pt-24 pb-16 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-center items-center py-12">
              <p>Chargement des données...</p>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-career-gray pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={handleGoBack}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour au tableau de bord
            </Button>
            
            {offer ? (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-2xl text-career-blue">{offer.Nom_poste}</CardTitle>
                  <CardDescription className="flex items-center space-x-2 flex-wrap text-base">
                    <Briefcase className="h-4 w-4" />
                    <span>{offer.Entreprise}</span>
                    {offer.offre_id && (
                      <>
                        <span>•</span>
                        <Badge variant="outline">ID de l'offre: {offer.offre_id}</Badge>
                      </>
                    )}
                    {offer.Contrat && (
                      <>
                        <span>•</span>
                        <Badge variant="outline">{offer.Contrat}</Badge>
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
                </CardHeader>
              </Card>
            ) : (
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg mb-6">
                <div className="flex items-center">
                  <AlertCircle className="text-amber-500 mr-2 h-5 w-5" />
                  <p>Impossible de récupérer les détails de l'offre d'emploi.</p>
                </div>
              </div>
            )}

            <h2 className="text-2xl font-semibold mb-6">Candidats correspondants</h2>

            {candidates.length > 0 ? (
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Score de correspondance</TableHead>
                        <TableHead>profile</TableHead>
                        <TableHead>Candidat</TableHead>
                        <TableHead>Expérience</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {candidates.map((candidate) => {
                        const normalizedCandidate = normalizeCandidate(candidate);
                        return (
                          <TableRow key={candidate.candidat_id}>
                            
                            <TableCell>
                              {normalizedCandidate.score ? (
                                <Badge className={`${
                                  normalizedCandidate.score *100 >= 80 ? "bg-green-100 text-green-800" : 
                                  normalizedCandidate.score *100  >= 50 ? "bg-amber-100 text-amber-800" : 
                                  "bg-gray-100 text-gray-800"
                                }`}>
                                  {(normalizedCandidate.score * 100).toFixed(1)}%
                                </Badge>
                              ) : (
                                <span className="text-gray-500">Non évalué</span>
                              )}
                            </TableCell>
                            <TableCell>{normalizedCandidate.Compétence }</TableCell>
                            <TableCell>{normalizedCandidate.candidat_id }</TableCell>
                            <TableCell>{normalizedCandidate.Expérience }</TableCell>
                            <TableCell className="text-right">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleViewDetails(normalizedCandidate)}
                                  >
                                    Voir détails
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-3xl">
                                  <DialogHeader>
                                    <DialogTitle>Détails du candidat</DialogTitle>
                                    <DialogDescription>
                                      Informations complètes sur le profil de {normalizedCandidate.candidat_id}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                    <div>
                                      <h3 className="text-lg font-medium mb-2">Informations personnelles</h3>
                                      <div className="space-y-2">
                                        <div>
                                          <span className="text-gray-500">Profile:</span>
                                          <p>{normalizedCandidate.Profil}</p>
                                        </div>
                                        
                                        
                                      </div>
                                    </div>
                                    <div>
                                      <h3 className="text-lg font-medium mb-2">Profil professionnel</h3>
                                      <div className="space-y-2">
                                        {normalizedCandidate.Profil && (
                                          <div>
                                            <span className="text-gray-500">Expérience:</span>
                                            <p>{normalizedCandidate.Expérience}</p>
                                          </div>
                                        )}
                                  
                                        {normalizedCandidate.score && (
                                          <div>
                                            <span className="text-gray-500">Score de correspondance:</span>
                                            <p className="font-medium">{normalizedCandidate.score}%</p>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  
                                </DialogContent>
                              </Dialog>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
                <h3 className="text-xl font-medium mb-2">Aucun candidat correspondant</h3>
                <p className="text-gray-500">
                  Nous n'avons pas trouvé de candidats qui correspondent à cette offre dans la base Matchrh pour le moment.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default CandidateMatching;
