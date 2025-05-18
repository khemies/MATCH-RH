
import React from "react";
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
import { Briefcase, Building, Calendar, FileText } from "lucide-react";

type JobFormValues = {
  title: string;
  contract: string;
  description: string;
  company: string;
  experience: string;
};

const AddJobOffer = () => {
  const form = useForm<JobFormValues>({
    defaultValues: {
      title: "",
      contract: "",
      description: "",
      company: "",
      experience: "",
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
        recruiterId: recruiterId
      };

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

  return (
    <>
      <Header />
      <div className="min-h-screen bg-career-lightgray pt-24 px-6 pb-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Publier une nouvelle offre d'emploi</h1>

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
                    name="title"
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
                    name="contract"
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
                            <SelectItem value="cdi">CDI</SelectItem>
                            <SelectItem value="cdd">CDD</SelectItem>
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
                    name="company"
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
                    name="experience"
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
                            <SelectItem value="debutant">Débutant accepté</SelectItem>
                            <SelectItem value="1-2">1 à 2 ans</SelectItem>
                            <SelectItem value="3-5">3 à 5 ans</SelectItem>
                            <SelectItem value="5-10">5 à 10 ans</SelectItem>
                            <SelectItem value="10+">Plus de 10 ans</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Description du poste
                        </FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Décrivez les responsabilités, les exigences et les avantages du poste..." 
                            className="min-h-[200px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Soyez précis pour attirer les meilleurs candidats.
                        </FormDescription>
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
        </div>
      </div>
    </>
  );
};

export default AddJobOffer;
