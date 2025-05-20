
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from 'sonner';
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import CreateProfile from "./pages/CreateProfile";
import EditProfile from "./pages/EditProfile";
import AddJobOffer from "./pages/AddJobOffer";
import Messaging from "./pages/Messaging";
import Calendar from "./pages/Calendar";
import AllProfiles from "./pages/AllProfiles";
import './App.css';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-profile" element={<CreateProfile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/add-job-offer" element={<AddJobOffer />} />
          <Route path="/messaging" element={<Messaging />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/all-profiles" element={<AllProfiles />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster position="top-center" />
    </>
  );
}

export default App;
