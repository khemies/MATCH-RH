
import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Star, FileText, Download } from "lucide-react";

type ProfileProps = {
  profile: {
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
  };
};

const ProfileCard = ({ profile }: ProfileProps) => {
  const getAvailabilityLabel = (availability: string) => {
    switch (availability) {
      case "immediate": return "Immédiate";
      case "1month": return "1 mois";
      case "3months": return "3 mois";
      case "flexible": return "Flexible";
      default: return availability;
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-lg line-clamp-2">
              {profile.job_category || "Candidat"}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {profile.experience || "Expérience non spécifiée"}
            </p>
          </div>
          <Badge variant={profile.source === "formulaire" ? "outline" : "secondary"}>
            {profile.source === "formulaire" ? "Formulaire" : "CSV"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow pb-2">
        <div className="space-y-4">
          <div className="text-sm line-clamp-3">
            {profile.profile || "Description non spécifiée"}
          </div>

          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <MapPin className="h-4 w-4 mr-2 text-gray-500" />
              <span>{profile.location || "Lieu non spécifié"}</span>
            </div>
            <div className="flex items-center text-sm">
              <Clock className="h-4 w-4 mr-2 text-gray-500" />
              <span>Disponibilité: {getAvailabilityLabel(profile.availability)}</span>
            </div>
            {profile.contract_type && (
              <div className="flex items-center text-sm">
                <FileText className="h-4 w-4 mr-2 text-gray-500" />
                <span>Contrat: {profile.contract_type}</span>
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center mb-2">
              <Star className="h-4 w-4 mr-2 text-gray-500" />
              <span className="text-sm font-medium">Compétences</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {profile.skills && profile.skills.length > 0 ? (
                profile.skills.slice(0, 4).map((skill, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-gray-500">Non spécifiées</span>
              )}
              {profile.skills && profile.skills.length > 4 && (
                <Badge variant="secondary" className="text-xs">
                  +{profile.skills.length - 4}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between">
        <Button variant="outline" size="sm">
          Voir détails
        </Button>
        {profile.cv_filename && (
          <Button variant="ghost" size="sm">
            <Download className="h-4 w-4 mr-1" />
            CV
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProfileCard;
