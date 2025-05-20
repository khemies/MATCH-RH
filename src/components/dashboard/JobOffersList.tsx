
import { useState } from "react";
import JobOfferCard, { Offer } from "./JobOfferCard";

interface JobOffersListProps {
  offers: Offer[];
  isLoading: boolean;
  emptyMessage: string;
  tabKey: string;
}

const JobOffersList = ({ offers, isLoading, emptyMessage, tabKey }: JobOffersListProps) => {
  const [expandedOffers, setExpandedOffers] = useState<{[key: string]: boolean}>({});

  // Fonction pour basculer l'état d'expansion d'une offre
  const toggleOfferExpansion = (index: number) => {
    setExpandedOffers(prev => ({
      ...prev,
      [`${tabKey}-${index}`]: !prev[`${tabKey}-${index}`]
    }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <p>Chargement des offres...</p>
      </div>
    );
  }

  if (offers.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
        <h3 className="text-xl font-medium mb-2">{emptyMessage}</h3>
        {tabKey === "myOffers" && (
          <>
            <p className="text-gray-500 mb-4">Vous n'avez pas encore publié d'offres d'emploi.</p>
            <button 
              className="bg-career-blue hover:bg-career-darkblue text-white px-4 py-2 rounded"
              onClick={() => window.location.href = "/add-job-offer"}
            >
              Publier votre première offre
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {offers.map((offer, index) => (
        <JobOfferCard 
          key={index}
          offer={offer}
          index={index}
          isExpanded={!!expandedOffers[`${tabKey}-${index}`]}
          onToggleExpand={() => toggleOfferExpansion(index)}
          tabKey={tabKey}
        />
      ))}
    </div>
  );
};

export default JobOffersList;
