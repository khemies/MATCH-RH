import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Calendar,
  Star,
  Check,
  User,
  Briefcase,
  FileText
} from "lucide-react";
import { UseFormReturn } from "react-hook-form";

type ProfileFormValues = {
  location: string;
  availability: string;
  profile: string;
  strengths: string; // modifié de string[] vers string
  skills: string;
  experience: string;
  contract_type: string;
  job_category: string;
};

interface ProfileFormFieldsProps {
  form: UseFormReturn<ProfileFormValues>;
}

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
              {["immediate", "1month", "3months", "flexible"].map((val) => (
                <Button
                  key={val}
                  type="button"
                  variant={field.value === val ? "default" : "outline"}
                  onClick={() => field.onChange(val)}
                  className={field.value === val ? "bg-career-blue" : ""}
                >
                  {val === "immediate"
                    ? "Immédiate"
                    : val === "1month"
                    ? "1 mois"
                    : val === "3months"
                    ? "3 mois"
                    : "Flexible"}
                </Button>
              ))}
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
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Points forts
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="Décrivez vos points forts (ex: autonomie, communication...)"
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Vous pouvez écrire vos qualités personnelles, soft skills ou atouts distinctifs.
            </FormDescription>
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
