
import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from 'sonner';
import { User, MapPin, Calendar, Star, Check, Edit, FileText, Upload } from "lucide-react";

type ProfileFormValues = {
  location: string;
  availability: string;
  profile: string;
  strengths: string[];
  skills: string;
};

const strengthsList = [
  "Autonomie",
  "Capacité d'adaptation",
  "Communication",
  "Créativité",
  "Esprit d'équipe",
  "Leadership",
  "Organisation",
  "Résolution de problèmes"
];

const CreateProfile = () => {
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvFileName, setCvFileName] = useState<string>("");
  const navigate = useNavigate();

  const form = useForm<ProfileFormValues>({
    defaultValues: {
      location: "",
      availability: "immediate",
      profile: "",
      strengths: [],
      skills: ""
    },
  });

  const handleCvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === "application/pdf" || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        setCvFile(file);
        setCvFileName(file.name);
        toast("CV téléchargé", {
          description: `Le fichier ${file.name} a été téléchargé avec succès.`,
        });
      } else {
        toast.error("Format de fichier non supporté", {
          description: "Veuillez télécharger un fichier PDF ou DOCX.",
        });
      }
    }
  };

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      const token = userData.token;
      const userId = userData.id;

      if (!token || !userId) {
        toast.error("Veuillez vous connecter pour créer votre profil");
        navigate("/login");
        return;
      }

      const formData = new FormData();
      const dataWithUserId = {
        ...data,
        user_id: userId
      };
      
      formData.append("data", JSON.stringify(dataWithUserId));
      
      if (cvFile) {
        formData.append("cv", cvFile);
      }

      await axios.put("http://localhost:5000/api/profiles/upload_cv", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Profil créé avec succès !");
      
      // Rediriger vers le tableau de bord après la création du profil
      navigate("/dashboard");
      
    } catch (error) {
      toast.error("Une erreur est survenue lors de la création du profil.");
      console.error("Erreur de soumission :", error);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-career-lightgray pt-24 px-6 pb-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
            <User className="h-6 w-6" />
            Compléter votre profil
          </h1>
          
          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
              <CardDescription>
                Remplissez votre profil pour augmenter vos chances de trouver le poste idéal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Lieu de travail souhaité
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Paris, Lyon, Télétravail..." {...field} />
                        </FormControl>
                        <FormDescription>
                          Vous pouvez indiquer une ville, une région ou préciser si vous recherchez du télétravail.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="availability"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Disponibilité
                        </FormLabel>
                        <div className="flex flex-wrap gap-4">
                          <Button 
                            type="button"
                            variant={field.value === "immediate" ? "default" : "outline"}
                            onClick={() => field.onChange("immediate")}
                            className={field.value === "immediate" ? "bg-career-blue" : ""}
                          >
                            Immédiate
                          </Button>
                          <Button 
                            type="button"
                            variant={field.value === "1month" ? "default" : "outline"}
                            onClick={() => field.onChange("1month")}
                            className={field.value === "1month" ? "bg-career-blue" : ""}
                          >
                            1 mois
                          </Button>
                          <Button 
                            type="button"
                            variant={field.value === "3months" ? "default" : "outline"}
                            onClick={() => field.onChange("3months")}
                            className={field.value === "3months" ? "bg-career-blue" : ""}
                          >
                            3 mois
                          </Button>
                          <Button 
                            type="button"
                            variant={field.value === "flexible" ? "default" : "outline"}
                            onClick={() => field.onChange("flexible")}
                            className={field.value === "flexible" ? "bg-career-blue" : ""}
                          >
                            Flexible
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-3">
                    <FormLabel className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      CV
                    </FormLabel>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <div className="space-y-2">
                        <div className="flex justify-center">
                          <Upload className="h-10 w-10 text-gray-400" />
                        </div>
                        {cvFileName ? (
                          <div className="flex flex-col items-center">
                            <p className="text-sm font-medium">CV téléchargé: {cvFileName}</p>
                            <Button 
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setCvFile(null);
                                setCvFileName("");
                              }}
                              className="mt-2"
                            >
                              Supprimer
                            </Button>
                          </div>
                        ) : (
                          <>
                            <p className="text-base font-medium">Déposez votre CV ici ou</p>
                            <div>
                              <label htmlFor="cv-upload" className="inline-block bg-career-blue hover:bg-career-darkblue text-white font-medium py-2 px-4 rounded cursor-pointer text-sm">
                                Parcourir les fichiers
                              </label>
                              <input 
                                id="cv-upload" 
                                name="cv-upload" 
                                type="file" 
                                accept=".pdf,.docx" 
                                onChange={handleCvUpload}
                                className="hidden" 
                              />
                            </div>
                            <p className="text-xs text-gray-500 mt-2">Formats acceptés : PDF, DOCX (max 5MB)</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="profile"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Profil
                        </FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Décrivez votre parcours professionnel, vos objectifs et ce que vous recherchez..." 
                            className="min-h-[150px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Une description claire de votre profil augmente vos chances d'être contacté.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="strengths"
                    render={() => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Star className="h-4 w-4" />
                          Points forts
                        </FormLabel>
                        <div className="grid grid-cols-2 gap-2">
                          {strengthsList.map((strength) => (
                            <FormField
                              key={strength}
                              control={form.control}
                              name="strengths"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={strength}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(strength)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, strength])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== strength
                                                )
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">{strength}</FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="skills"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Check className="h-4 w-4" />
                          Compétences
                        </FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Entrez vos compétences séparées par des virgules (ex: JavaScript, React, Python...)" 
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Listez vos compétences techniques et non-techniques, séparées par des virgules.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <CardFooter className="flex justify-end pt-6 px-0">
                    <Button type="submit" className="bg-career-blue hover:bg-career-darkblue">
                      Créer mon profil
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default CreateProfile;
