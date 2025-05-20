
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';
import { Search, FileUp, Briefcase, MapPin, Clock, Star, FileText, Download, Plus } from "lucide-react";
import ProfileCard from "@/components/profile/ProfileCard";
import ImportCSVModal from "@/components/profile/ImportCSVModal";

type Profile = {
  _id: string;
  profile: string;
  location: string;
  availability: string;
  strengths: string[];
  skills: string[];
  experience?: string;
  contract_type?: string;
  job_category?: string;
  cv_filename?: string;
  source: string;
  user_id: string;
};

const AllProfiles = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showImportModal, setShowImportModal] = useState(false);
  const [viewMode, setViewMode] = useState<"card" | "table">("card");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      setIsLoading(true);
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      const token = userData.token;
      
      if (!token) {
        toast.error("Veuillez vous connecter pour accéder aux profils");
        navigate("/login");
        return;
      }
      
      const response = await axios.get("http://localhost:5000/api/profiles/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProfiles(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des profils:", error);
      toast.error("Une erreur est survenue lors du chargement des profils");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportSuccess = () => {
    fetchProfiles();
    setShowImportModal(false);
    toast.success("Importation réussie");
  };

  const filteredProfiles = profiles.filter((profile) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      profile.profile.toLowerCase().includes(searchLower) ||
      profile.location.toLowerCase().includes(searchLower) ||
      profile.skills.some(skill => skill.toLowerCase().includes(searchLower)) ||
      (profile.experience && profile.experience.toLowerCase().includes(searchLower)) ||
      (profile.job_category && profile.job_category.toLowerCase().includes(searchLower))
    );
  });

  return (
    <>
      <Header />
      <div className="min-h-screen bg-career-lightgray pt-24 px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <h1 className="text-3xl font-bold mb-4 md:mb-0">Tous les profils</h1>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                <Input
                  placeholder="Rechercher par compétences, lieu, etc."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button onClick={() => setShowImportModal(true)} className="bg-career-blue">
                <FileUp className="mr-2 h-4 w-4" />
                Importer CSV
              </Button>
            </div>
          </div>

          <div className="mb-6">
            <Tabs defaultValue="card" onValueChange={(value) => setViewMode(value as "card" | "table")}>
              <div className="flex justify-between items-center">
                <TabsList>
                  <TabsTrigger value="card">Vue cartes</TabsTrigger>
                  <TabsTrigger value="table">Vue tableau</TabsTrigger>
                </TabsList>
                <div className="text-sm text-gray-500">
                  {filteredProfiles.length} profil(s) trouvé(s)
                </div>
              </div>
              
              <TabsContent value="card" className="mt-6">
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                      <Card key={i} className="h-64 animate-pulse bg-gray-100">
                        <div className="h-full flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : filteredProfiles.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProfiles.map((profile) => (
                      <ProfileCard key={profile._id} profile={profile} />
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <p>Aucun profil ne correspond à votre recherche</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="table" className="mt-6">
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Profil</TableHead>
                          <TableHead>Lieu</TableHead>
                          <TableHead>Disponibilité</TableHead>
                          <TableHead>Compétences</TableHead>
                          <TableHead>Expérience</TableHead>
                          <TableHead>Catégorie</TableHead>
                          <TableHead>Source</TableHead>
                          <TableHead>CV</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {isLoading ? (
                          <TableRow>
                            <TableCell colSpan={8} className="h-24 text-center">
                              Chargement des profils...
                            </TableCell>
                          </TableRow>
                        ) : filteredProfiles.length > 0 ? (
                          filteredProfiles.map((profile) => (
                            <TableRow key={profile._id}>
                              <TableCell className="font-medium max-w-[200px] truncate">
                                {profile.profile || "Non spécifié"}
                              </TableCell>
                              <TableCell>{profile.location || "Non spécifié"}</TableCell>
                              <TableCell>
                                <Badge variant={profile.availability === "immediate" ? "default" : "outline"}>
                                  {profile.availability === "immediate" ? "Immédiate" : 
                                   profile.availability === "1month" ? "1 mois" :
                                   profile.availability === "3months" ? "3 mois" : 
                                   profile.availability}
                                </Badge>
                              </TableCell>
                              <TableCell className="max-w-[150px]">
                                {profile.skills && profile.skills.length > 0 ? (
                                  <div className="flex flex-wrap gap-1">
                                    {profile.skills.slice(0, 2).map((skill, idx) => (
                                      <Badge key={idx} variant="secondary" className="text-xs">
                                        {skill}
                                      </Badge>
                                    ))}
                                    {profile.skills.length > 2 && (
                                      <Badge variant="secondary" className="text-xs">
                                        +{profile.skills.length - 2}
                                      </Badge>
                                    )}
                                  </div>
                                ) : (
                                  "Non spécifié"
                                )}
                              </TableCell>
                              <TableCell>{profile.experience || "Non spécifié"}</TableCell>
                              <TableCell>{profile.job_category || "Non spécifié"}</TableCell>
                              <TableCell>
                                <Badge variant={profile.source === "formulaire" ? "outline" : "secondary"}>
                                  {profile.source === "formulaire" ? "Formulaire" : "CSV"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {profile.cv_filename ? (
                                  <Button variant="ghost" size="sm">
                                    <Download className="h-4 w-4 mr-1" />
                                    CV
                                  </Button>
                                ) : (
                                  "Non"
                                )}
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={8} className="h-24 text-center">
                              Aucun profil ne correspond à votre recherche
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <ImportCSVModal 
        isOpen={showImportModal} 
        onClose={() => setShowImportModal(false)} 
        onSuccess={handleImportSuccess} 
      />
    </>
  );
};

export default AllProfiles;
