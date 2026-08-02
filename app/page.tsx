import Hero from "./components/Hero";
import Coding from "./components/Coding";
import WanttolearnfromAi from "./components/WanttolearnfromAi";
import MasterDsaTopics from "./components/Masterdsatopics";
import AllCodingProblems from "./components/AllCodingProblems";
import StartCodingInSeconds from "./components/Startcodinginseconds";
import TutorialsLibrary from "./components/TutorialsLibrary";
import Developer from "./components/Developer";
import Help from "./components/Help";
import LearningRoadmap from "./components/Learningroadmap";



export default function Home() {
  return (
    <>
      <Hero />
      <Coding/>
      <WanttolearnfromAi/>
      <MasterDsaTopics/>
      <AllCodingProblems/>
      <StartCodingInSeconds/>
      <TutorialsLibrary/>
      <Developer/>
      <Help/>
      <LearningRoadmap/>
      
    </>
  );
}
