
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Star, Check, User, Briefcase, FileText } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

type ProfileFormValues = {
  location: string;
  availability: string;
  profile: string;
  strengths: string[];
  skills: string;
  experience: string;
  contract_type: string;
  job_category: string;
};

interface ProfileFormFieldsProps {
  form: UseFormReturn<ProfileFormValues>;
}

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

const ProfileFormFields = ({ form }: ProfileFormFieldsProps) => {
  return (
    <>
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

      <FormField
        control={form.control}
        name="experience"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Expérience
            </FormLabel>
            <FormControl>
              <Input placeholder="Ex: 3 ans, Débutant, Senior..." {...field} />
            </FormControl>
            <FormDescription>
              Indiquez votre niveau d'expérience professionnelle.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="contract_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Type de contrat recherché
            </FormLabel>
            <FormControl>
              <Input placeholder="Ex: CDI, CDD, Freelance..." {...field} />
            </FormControl>
            <FormDescription>
              Précisez le type de contrat que vous recherchez.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="job_category"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Catégorie de métier
            </FormLabel>
            <FormControl>
              <Input placeholder="Ex: Développeur web, Designer UX, Chef de projet..." {...field} />
            </FormControl>
            <FormDescription>
              Indiquez la catégorie de métier que vous recherchez.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default ProfileFormFields;
