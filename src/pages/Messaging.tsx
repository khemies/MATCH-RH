
import { useState } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Send, Paperclip, PhoneOutgoing, Video } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Messaging = () => {
  const [message, setMessage] = useState("");
  const [selectedChat, setSelectedChat] = useState(1);

  const contacts = [
    { id: 1, name: "Sophie Martin", role: "RH chez TechSolutions", online: true, unread: 2 },
    { id: 2, name: "Jean Dupont", role: "Recruteur chez InnoTech", online: false, unread: 0 },
    { id: 3, name: "Marie Bernard", role: "RH chez DataCorp", online: true, unread: 0 },
    { id: 4, name: "Lucas Petit", role: "Recruteur chez StartupXYZ", online: false, unread: 0 },
  ];

  const messages = [
    { id: 1, sender: "them", text: "Bonjour Thomas, j'ai consulté votre profil et je suis intéressé par votre candidature pour le poste de Développeur Full Stack.", time: "10:30" },
    { id: 2, sender: "me", text: "Bonjour Sophie, merci pour votre message ! Je suis très intéressé par cette opportunité.", time: "10:35" },
    { id: 3, sender: "them", text: "Super ! Pourriez-vous me parler un peu plus de votre expérience avec React et Node.js ?", time: "10:38" },
    { id: 4, sender: "me", text: "Bien sûr ! J'ai 3 ans d'expérience avec React sur des projets d'envergure, notamment pour une application de gestion financière utilisée par plus de 10 000 utilisateurs. Concernant Node.js, j'ai développé plusieurs API RESTful et j'ai de l'expérience avec Express et MongoDB.", time: "10:42" },
    { id: 5, sender: "them", text: "C'est exactement ce que nous recherchons. Seriez-vous disponible pour un entretien technique la semaine prochaine ?", time: "10:45" }
  ];

  const handleSendMessage = () => {
    if (message.trim() === "") return;
    // Dans une application réelle, ceci enverrait le message à une API
    setMessage("");
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-career-gray pt-16">
        <div className="h-[calc(100vh-64px)] flex">
          {/* Contact list sidebar */}
          <div className="w-full md:w-80 lg:w-96 bg-white border-r">
            <div className="p-4">
              <h2 className="text-xl font-bold mb-4">Messages</h2>
              <Input placeholder="Rechercher une conversation..." className="mb-4" />
            </div>
            <div className="overflow-y-auto h-[calc(100%-80px)]">
              {contacts.map((contact) => (
                <div 
                  key={contact.id} 
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors flex items-center space-x-3 border-b ${selectedChat === contact.id ? 'bg-blue-50' : ''}`}
                  onClick={() => setSelectedChat(contact.id)}
                >
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="h-6 w-6 text-gray-500" />
                    </div>
                    {contact.online && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="font-medium truncate">{contact.name}</p>
                      <span className="text-xs text-gray-500">12:30</span>
                    </div>
                    <p className="text-sm text-gray-500 truncate">{contact.role}</p>
                  </div>
                  {contact.unread > 0 && (
                    <span className="bg-career-blue text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {contact.unread}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Chat area */}
          <div className="hidden md:flex flex-col flex-1 bg-white">
            {/* Chat header */}
            <div className="p-4 border-b flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="h-6 w-6 text-gray-500" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                </div>
                <div>
                  <p className="font-medium">{contacts.find(c => c.id === selectedChat)?.name}</p>
                  <p className="text-sm text-gray-500">{contacts.find(c => c.id === selectedChat)?.role}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="icon">
                  <PhoneOutgoing className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon">
                  <Video className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[80%] rounded-lg p-3 ${
                        msg.sender === 'me' 
                          ? 'bg-career-blue text-white' 
                          : 'bg-white border'
                      }`}
                    >
                      <p>{msg.text}</p>
                      <p 
                        className={`text-xs mt-1 text-right ${
                          msg.sender === 'me' ? 'text-blue-100' : 'text-gray-500'
                        }`}
                      >
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Message input */}
            <div className="p-4 border-t">
              <form 
                className="flex space-x-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
              >
                <Button type="button" variant="outline" size="icon">
                  <Paperclip className="h-5 w-5" />
                </Button>
                <Input 
                  placeholder="Écrivez un message..." 
                  value={message} 
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" className="bg-career-blue hover:bg-career-darkblue">
                  <Send className="h-5 w-5" />
                </Button>
              </form>
            </div>
          </div>
          
          {/* Empty state for mobile */}
          <div className="flex flex-col flex-1 items-center justify-center bg-gray-50 md:hidden">
            <User className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">Vos messages</h3>
            <p className="text-gray-500 text-center max-w-xs mb-4">
              Sélectionnez une conversation dans la liste pour afficher les messages
            </p>
          </div>
        </div>
      </main>
    </>
  );
};

export default Messaging;
