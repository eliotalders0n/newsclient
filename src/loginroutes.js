import { Routes, Route, useLocation } from "react-router-dom";
import Landing from "./comps/pages/landingPage";
import Profile from "./comps/pages/profile";
import ReelCard from "./comps/pages/reels";
import Header from "./comps/template/head";
import Navigation from "./comps/template/navigation";
import Story from "./comps/pages/story";
import Ministries from "./comps/pages/ministires";
import Resources from "./comps/pages/resources";
import Podcast from "./comps/pages/podcast";
import PodcastList from "./comps/pages/podcastList";
import Chat from "./comps/pages/chat";
import TermsPage from "./comps/pages/terms";
import PrivacyPage from "./comps/pages/privacy";

function RoutesWrapper() {
  const location = useLocation();

  // Determine if Navigation should be displayed
  const shouldShowNavigation = !location.pathname.startsWith("/story/");

  return (
    <>
      {shouldShowNavigation && <Header />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/podcast" element={<Podcast />} />
        <Route path="/podcastlist/:ministry" element={<PodcastList />} />
        <Route path="/ministries" element={<Ministries />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/home" element={<Landing />} />
        <Route path="/reels" element={<ReelCard />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/story/:id" element={<Story />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
      </Routes>
      {shouldShowNavigation && <Navigation />}
    </>
  );
}

function LoginRoutes() {
  return <RoutesWrapper />;
}

export default LoginRoutes;
