
import { useState } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, User, Video, MapPin, Clock } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format, addDays } from "date-fns";
import { fr } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const CalendarPage = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<"calendar" | "list">("calendar");

  const interviews = [
    { 
      id: 1, 
      title: "Entretien technique avec TechSolutions", 
      date: new Date(), 
      startTime: "14:00", 
      endTime: "15:00", 
      type: "video", 
      status: "confirmed",
      with: "Sophie Martin",
      location: "Lien Zoom (envoyé par email)"
    },
    { 
      id: 2, 
      title: "Premier entretien avec InnoTech", 
      date: addDays(new Date(), 2), 
      startTime: "10:30", 
      endTime: "11:30", 
      type: "inPerson", 
      status: "confirmed",
      with: "Jean Dupont",
      location: "15 Rue de la Paix, 75002 Paris"
    },
    { 
      id: 3, 
      title: "Entretien RH avec DataCorp", 
      date: addDays(new Date(), 4), 
      startTime: "15:30", 
      endTime: "16:30", 
      type: "video", 
      status: "pending",
      with: "Marie Bernard",
      location: "Google Meet (en attente de confirmation)"
    },
  ];

  const filteredInterviews = interviews.filter(interview => {
    if (view === "list") return true;
    return interview.date.toDateString() === date.toDateString();
  });

  const formatDate = (date: Date) => {
    return format(date, "d MMMM yyyy", { locale: fr });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4" />;
      case "inPerson":
        return <MapPin className="h-4 w-4" />;
      default:
        return <CalendarIcon className="h-4 w-4" />;
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-career-gray pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-1">Calendrier des entretiens</h1>
              <p className="text-gray-600">
                Gérez et planifiez vos entretiens professionnels
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={view === "calendar" ? "default" : "outline"}
                className={view === "calendar" ? "bg-career-blue hover:bg-career-darkblue" : ""}
                onClick={() => setView("calendar")}
              >
                Calendrier
              </Button>
              <Button
                variant={view === "list" ? "default" : "outline"}
                className={view === "list" ? "bg-career-blue hover:bg-career-darkblue" : ""}
                onClick={() => setView("list")}
              >
                Liste
              </Button>
              <Button className="bg-career-blue hover:bg-career-darkblue">
                Demander un entretien
              </Button>
            </div>
          </div>

          {view === "calendar" ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-1">
                <CardContent className="p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => newDate && setDate(newDate)}
                    className="w-full p-3 pointer-events-auto"
                    locale={fr}
                  />
                </CardContent>
              </Card>
              
              <Card className="lg:col-span-2">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>{formatDate(date)}</CardTitle>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={() => setDate(addDays(date, -1))}>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => setDate(addDays(date, 1))}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {filteredInterviews.length === 0 ? (
                    <div className="text-center py-12">
                      <CalendarIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-1">Aucun entretien</h3>
                      <p className="text-gray-500">
                        Vous n'avez pas d'entretien planifié pour cette date
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredInterviews.map((interview) => (
                        <Card key={interview.id}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium text-lg mb-2">{interview.title}</h3>
                                <div className="flex items-center text-gray-600 mb-2 gap-2">
                                  <Clock className="h-4 w-4" />
                                  <span>{interview.startTime} - {interview.endTime}</span>
                                </div>
                                <div className="flex items-center text-gray-600 mb-2 gap-2">
                                  <User className="h-4 w-4" />
                                  <span>Avec {interview.with}</span>
                                </div>
                                <div className="flex items-center text-gray-600 gap-2">
                                  {getTypeIcon(interview.type)}
                                  <span>{interview.location}</span>
                                </div>
                              </div>
                              
                              <Badge className={getStatusColor(interview.status)}>
                                {interview.status === "confirmed" ? "Confirmé" : "En attente"}
                              </Badge>
                            </div>
                            
                            {interview.status === "pending" && (
                              <div className="mt-4 flex gap-2">
                                <Button size="sm" className="bg-career-blue hover:bg-career-darkblue">
                                  Confirmer
                                </Button>
                                <Button size="sm" variant="outline">
                                  Proposer une autre date
                                </Button>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Tous les entretiens à venir</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {interviews.map((interview) => (
                    <div key={interview.id} className="border-b pb-4 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-lg">{interview.title}</h3>
                        <Badge className={getStatusColor(interview.status)}>
                          {interview.status === "confirmed" ? "Confirmé" : "En attente"}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 mb-2">
                        {formatDate(interview.date)} • {interview.startTime} - {interview.endTime}
                      </p>
                      
                      <div className="flex items-center text-gray-600 mb-2 gap-2">
                        <User className="h-4 w-4" />
                        <span>Avec {interview.with}</span>
                      </div>
                      
                      <div className="flex items-center text-gray-600 gap-2">
                        {getTypeIcon(interview.type)}
                        <span>{interview.location}</span>
                      </div>
                      
                      {interview.status === "pending" && (
                        <div className="mt-3 flex gap-2">
                          <Button size="sm" className="bg-career-blue hover:bg-career-darkblue">
                            Confirmer
                          </Button>
                          <Button size="sm" variant="outline">
                            Proposer une autre date
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </>
  );
};

export default CalendarPage;
