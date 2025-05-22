
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { toast } from 'sonner';
import { Edit, Upload } from "lucide-react";
import ProfileFormFields from "@/components/profile/ProfileFormFields";

type ProfileFormValues = {
  location: string;
  availability: string;
  profile: string;
  strengths: string;
  skills: string;
  experience: string;
  contract_type: string;
  job_category: string;
};

const EditProfile = () => {
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvFileName, setCvFileName] = useState<string>("");

  const form = useForm<ProfileFormValues>({
    defaultValues: {
      location: "",
      availability: "immediate",
      profile: "",
      strengths: "",
      skills: "",
      experience: "",
      contract_type: "",
      job_category: ""
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        const token = userData.token;
        
        if (!token) {
          toast.error("Veuillez vous connecter pour accéder à votre profil");
          return;
        }
        
        const response = await axios.get("http://localhost:5000/api/profiles/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const profileData = response.data;
        form.reset({
          location: profileData.location || "",
          availability: profileData.availability || "immediate",
          profile: profileData.profile || "",
          strengths: profileData.strengths || [],
          skills: Array.isArray(profileData.skills) ? profileData.skills.join(", ") : profileData.skills || "",
          experience: profileData.experience || "",
          contract_type: profileData.contract_type || "",
          job_category: profileData.job_category || ""
        });

        if (profileData.cv_filename) {
          setCvFileName(profileData.cv_filename);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du profil :", error);
      }
    };

    fetchProfile();
  }, []);

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
        toast.error("Veuillez vous connecter pour modifier votre profil");
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

      toast.success("Profil mis à jour avec succès !");
    } catch (error) {
      toast.error("Une erreur est survenue lors de la mise à jour du profil.");
      console.error("Erreur de soumission :", error);
    }
  };
  
  return (
    <>
      <Header />
      <div className="min-h-screen bg-career-lightgray pt-24 px-6 pb-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
            <Edit className="h-6 w-6" />
            Modifier votre profil
          </h1>

          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
              <CardDescription>
                Mettez à jour vos informations pour optimiser vos chances de correspondance avec les offres
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <ProfileFormFields form={form} />

                  {/* Section de téléchargement du CV */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 font-medium text-sm mb-1.5">
                      <Upload className="h-4 w-4" />
                      CV
                    </div>
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

                  <CardFooter className="flex justify-end pt-6 px-0">
                    <Button type="submit" className="bg-career-blue hover:bg-career-darkblue">
                      Enregistrer les modifications
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

export default EditProfile;
