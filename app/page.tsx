import Hero from "./components/Hero";
import TrustStrip from "./components/TrustStrip";
import WhatWeOffer from "./components/WhatWeOffer";
import WhyCodeNFacts from "./components/WhyCodeNFacts";
import BuiltForCoders from "./components/BuiltForCoders";
import AdvancedCoderBackground from "./components/AdvancedCoderBackground";
import Projects from "./components/Projects";
import CoursesOverview from "./components/CoursesOverview";
import DataAIDetails from "./components/DataAIDetails";
import Points from "./components/Points";
import GetInTouch from "./components/GetInTouch";
import CodingChallenges from "./components/CodingChallenges";
import WhatWeHelp from "./components/WhatWeHelp";
import WhyNeedUs from "./components/WhyNeedUs";
import JoinCommunity from "./components/JoinCommunity";
import CertificatePreview from "./components/CertificatePreview";
import HappyLearners from "./components/HappyLearners";
import MentorshipSection from "./components/MentorShip";
import CodeNFactsAdvantage from "./components/CodeNFactsAdvantage";
import HaveAQuestion from "./components/HaveAQuestion";
import Insightful from "./components/Insightful"
import GetNotes from "./components/GetNotes";
import Issue from "./components/Issue";
import Help from "./components/Help";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <WhatWeOffer/>
      <WhyCodeNFacts/>
      <BuiltForCoders/>
      <AdvancedCoderBackground/>
      <Projects/>
      <CoursesOverview/>
      <DataAIDetails/>
      <Points/>
      <GetInTouch/>
      <CodingChallenges/>
      <WhatWeHelp/>
      <WhyNeedUs/>
      <JoinCommunity/>
      <CertificatePreview/>
      <HappyLearners/>
      <MentorshipSection/>
      <CodeNFactsAdvantage/>
      <HaveAQuestion/>
      <Insightful/>
      <GetNotes/>
      <Issue/>
      <Help/>
      {/* Next sections: Courses, About, etc */}
    </>
  );
}
