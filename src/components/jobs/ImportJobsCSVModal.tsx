
import React, { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Upload, AlertCircle, Check } from "lucide-react";

interface ImportJobsCSVModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ImportJobsCSVModal = ({ isOpen, onClose, onSuccess }: ImportJobsCSVModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "text/csv" || droppedFile.name.endsWith(".csv")) {
        setFile(droppedFile);
      } else {
        toast.error("Format de fichier non supporté", {
          description: "Veuillez télécharger un fichier CSV.",
        });
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === "text/csv" || selectedFile.name.endsWith(".csv")) {
        setFile(selectedFile);
      } else {
        toast.error("Format de fichier non supporté", {
          description: "Veuillez télécharger un fichier CSV.",
        });
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Aucun fichier sélectionné");
      return;
    }

    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    const recruiterId = userData.id;

    if (!recruiterId) {
      toast.error("Veuillez vous connecter pour importer des offres");
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("recruiterId", recruiterId);

      await axios.post("http://localhost:5000/api/offres/import_csv", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Offres importées avec succès");
      setFile(null);
      onSuccess();
    } catch (error) {
      console.error("Erreur lors de l'importation du fichier CSV:", error);
      toast.error("Une erreur est survenue lors de l'importation du fichier");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Importer des offres depuis un fichier CSV</DialogTitle>
          <DialogDescription>
            Téléchargez un fichier CSV contenant les offres à importer dans le système.
            Le fichier doit contenir les colonnes suivantes: Nom_poste, Contrat, Description, Experience, Entreprise, missions, profil, groupe_metier, Lieu.
          </DialogDescription>
        </DialogHeader>

        <div
          className={`mt-4 p-6 border-2 border-dashed rounded-md text-center ${
            isDragging ? "border-career-blue bg-blue-50" : "border-gray-300"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="space-y-2">
            <div className="flex justify-center">
              <Upload className={`h-10 w-10 ${file ? "text-career-blue" : "text-gray-400"}`} />
            </div>
            {file ? (
              <div className="flex flex-col items-center">
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-1" />
                  <p className="text-sm font-medium">{file.name}</p>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
                <Button 
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setFile(null)}
                  className="mt-2"
                >
                  Supprimer
                </Button>
              </div>
            ) : (
              <>
                <p className="text-base font-medium">Déposez votre fichier CSV ici ou</p>
                <div>
                  <label htmlFor="csv-upload" className="inline-block bg-career-blue hover:bg-career-darkblue text-white font-medium py-2 px-4 rounded cursor-pointer text-sm">
                    Parcourir les fichiers
                  </label>
                  <input 
                    id="csv-upload" 
                    name="csv-upload" 
                    type="file" 
                    accept=".csv" 
                    onChange={handleFileChange}
                    className="hidden" 
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">Format accepté: CSV uniquement</p>
              </>
            )}
          </div>
        </div>

        {file && (
          <div className="bg-amber-50 border border-amber-200 p-3 rounded-md mt-2 flex items-start">
            <AlertCircle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800">
              Assurez-vous que votre fichier CSV contient les bonnes colonnes et format de données avant de continuer.
            </p>
          </div>
        )}

        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={onClose} disabled={isUploading}>
            Annuler
          </Button>
          <Button 
            onClick={handleUpload} 
            disabled={!file || isUploading} 
            className="bg-career-blue"
          >
            {isUploading ? "Importation en cours..." : "Importer les offres"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportJobsCSVModal;
