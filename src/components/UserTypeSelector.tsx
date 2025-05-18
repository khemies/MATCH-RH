
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UserRound, Users } from "lucide-react";
import { Input } from "./ui/input";

interface UserTypeSelectorProps {
  userType: string;
  onChange: (type: string) => void;
  pseudo: string;
  onPseudoChange: (pseudo: string) => void;
}

const UserTypeSelector = ({ userType, onChange, pseudo, onPseudoChange }: UserTypeSelectorProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="pseudo" className="text-base">Pseudo / Nom d'utilisateur</Label>
        <Input
          id="pseudo"
          placeholder="Entrez votre pseudo"
          value={pseudo}
          onChange={(e) => onPseudoChange(e.target.value)}
          className="mb-2"
          required
        />
      </div>
      
      <div>
        <Label className="text-base mb-3 block">Je suis un:</Label>
        
        <RadioGroup value={userType} onValueChange={onChange} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Label
            htmlFor="candidate"
            className={`cursor-pointer ${userType === "candidate" ? "ring-2 ring-career-blue" : ""}`}
          >
            <Card className="p-4 h-full">
              <div className="flex flex-col items-center">
                <RadioGroupItem value="candidate" id="candidate" className="sr-only" />
                <UserRound className="h-8 w-8 mb-2 text-career-blue" />
                <span className="font-medium text-center">Candidat</span>
                <p className="text-xs text-gray-500 text-center mt-1">
                  Je cherche des opportunités professionnelles
                </p>
              </div>
            </Card>
          </Label>

          <Label
            htmlFor="recruiter"
            className={`cursor-pointer ${userType === "recruiter" ? "ring-2 ring-career-blue" : ""}`}
          >
            <Card className="p-4 h-full">
              <div className="flex flex-col items-center">
                <RadioGroupItem value="recruiter" id="recruiter" className="sr-only" />
                <Users className="h-8 w-8 mb-2 text-career-blue" />
                <span className="font-medium text-center">Recruteur</span>
                <p className="text-xs text-gray-500 text-center mt-1">
                  Je recherche des talents pour mon entreprise
                </p>
              </div>
            </Card>
          </Label>
        </RadioGroup>
      </div>
    </div>
  );
};

export default UserTypeSelector;
