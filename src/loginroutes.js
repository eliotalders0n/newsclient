import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
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

// ----------------------------------------------------------------------

function RoutesWrapper() {
  const location = useLocation();

  // Determine if Navigation should be displayed
  const shouldShowNavigation = !location.pathname.startsWith("/story/");
  return (
    <>
      {shouldShowNavigation && <Header />}
      {/* <Header /> */}
      {/* <BrowserRouter> */}
      <Routes>
        <Route exact path="/" element={<Landing />} />
        <Route exact path="/podcast" element={<Podcast />} />
        <Route exact path="/podcastlist/:ministry" element={<PodcastList />} />
        <Route path="/ministries" element={<Ministries />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/home" element={<Landing />} />
        <Route path="/reels" element={<ReelCard />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/story/:id" element={<Story />} />
      </Routes>
      {shouldShowNavigation && <Navigation />}
      {/* </BrowserRouter> */}
    </>
  );
}

function LoginRoutes() {
  return (
    <BrowserRouter>
      <RoutesWrapper />
    </BrowserRouter>
  );
}

export default LoginRoutes;
