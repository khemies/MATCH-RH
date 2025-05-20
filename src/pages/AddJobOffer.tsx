
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { 
  Briefcase, 
  Building, 
  Calendar, 
  FileText, 
  MapPin, 
  Users, 
  Upload, 
  File,
  Code
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ImportJobsCSVModal from "@/components/jobs/ImportJobsCSVModal";

type JobFormValues = {
  Nom_poste: string;
  Contrat: string;
  Entreprise: string;
  Experience: string;
  missions?: string;
  profil?: string;
  Description: string;
  stack_technique?: string;
  groupe_metier?: string;
  Lieu?: string;
};

const AddJobOffer = () => {
  const [showImportModal, setShowImportModal] = useState(false);

  const form = useForm<JobFormValues>({
    defaultValues: {
      Nom_poste: "",
      Contrat: "",
      Entreprise: "",
      Experience: "",
      Description: "",
      missions: "",
      profil: "",
      stack_technique: "",
      groupe_metier: "",
      Lieu: ""
    },
  });

  const onSubmit = async (data: JobFormValues) => {
    try {
      // Récupération des données de l'utilisateur depuis localStorage
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const recruiterId = storedUser?.id;
      
      if (!recruiterId) {
        toast.error("Vous devez être connecté pour publier une offre.");
        return;
      }

      // Ajout de l'ID du recruteur aux données de l'offre
      const offerData = {
        ...data,
        recruteur_id: recruiterId
      };

      console.log("Données soumises:", offerData);

      const response = await fetch("http://localhost:5000/api/offres/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(offerData),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || "Une erreur est survenue.");
        return;
      }

      toast.success(result.message || "Offre créée avec succès");

      form.reset(); // Réinitialiser le formulaire

    } catch (error) {
      toast.error("Impossible de contacter le serveur.");
    }
  };

  const handleImportSuccess = () => {
    toast.success("Offres importées avec succès");
    setShowImportModal(false);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-career-lightgray pt-24 px-6 pb-12">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Publier une nouvelle offre d'emploi</h1>
            <Button 
              variant="outline" 
              onClick={() => setShowImportModal(true)}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Importer CSV
            </Button>
          </div>

          <Tabs defaultValue="form" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="form">Saisie manuelle</TabsTrigger>
              <TabsTrigger value="import">Importer un CSV</TabsTrigger>
            </TabsList>
            
            <TabsContent value="form">
              <Card>
                <CardHeader>
                  <CardTitle>Informations de l'offre</CardTitle>
                  <CardDescription>
                    Remplissez les détails ci-dessous pour créer une nouvelle offre d'emploi
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="Nom_poste"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Briefcase className="h-4 w-4" />
                              Nom du poste
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: Développeur Full Stack React/Node.js" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="Contrat"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              Type de contrat
                            </FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Sélectionnez le type de contrat" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="CDI">CDI</SelectItem>
                                <SelectItem value="CDD">CDD</SelectItem>
                                <SelectItem value="interim">Intérim</SelectItem>
                                <SelectItem value="stage">Stage</SelectItem>
                                <SelectItem value="alternance">Alternance</SelectItem>
                                <SelectItem value="freelance">Freelance</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="Entreprise"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Building className="h-4 w-4" />
                              Entreprise
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="Nom de votre entreprise" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="Lieu"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              Lieu du poste
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: Paris, Télétravail, etc." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="Experience"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              Expérience requise
                            </FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Niveau d'expérience requis" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Débutant accepté">Débutant accepté</SelectItem>
                                <SelectItem value="moins de 12 mois">Moins de 12 mois</SelectItem>
                                <SelectItem value="entre 12 et 24 mois">Entre 12 et 24 mois</SelectItem>
                                <SelectItem value="entre 24 et 48 mois">Entre 24 et 48 mois</SelectItem>
                                <SelectItem value="Plus 48 mois">Plus de 48 mois</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="groupe_metier"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              Groupe métier
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: Informatique, Finance, Marketing, etc." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="stack_technique"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Code className="h-4 w-4" />
                              Stack technique
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: React, Node.js, MongoDB, etc." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="missions"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              Missions principales
                            </FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Décrivez les missions principales du poste..." 
                                className="min-h-[120px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="Description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                             Description
                            </FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Décrivez le poste..." 
                                className="min-h-[120px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="profil"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              Profil recherché
                            </FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Décrivez le profil idéal pour ce poste..." 
                                className="min-h-[120px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <CardFooter className="flex justify-end pt-6 px-0">
                        <Button type="submit" className="bg-career-blue hover:bg-career-darkblue">
                          Publier l'offre
                        </Button>
                      </CardFooter>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="import">
              <Card>
                <CardHeader>
                  <CardTitle>Importer des offres</CardTitle>
                  <CardDescription>
                    Importez vos offres d'emploi en masse à partir d'un fichier CSV
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <File className="h-20 w-20 text-gray-300 mb-4" />
                  <p className="text-center mb-6">
                    Le fichier CSV doit contenir les colonnes suivantes : <br />
                    <span className="font-mono text-xs">Nom_poste, Contrat, Description, Experience, Entreprise, missions, profil, groupe_metier, Lieu</span>
                  </p>
                  <Button 
                    onClick={() => setShowImportModal(true)}
                    className="bg-career-blue hover:bg-career-darkblue"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Importer un fichier CSV
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <ImportJobsCSVModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onSuccess={handleImportSuccess}
      />
    </>
  );
};

export default AddJobOffer;
