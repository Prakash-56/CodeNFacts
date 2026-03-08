import React from 'react';
import { 
  Database, 
  Settings, 
  Cpu, 
  Search, 
  CheckCircle, 
  ArrowRight, 
  LineChart, 
  Server 
} from 'lucide-react';

const PipelineStep = ({ icon: Icon, title, description, isLast = false }: any) => (
  <div className="flex flex-col items-center group relative">
    <div className="z-10 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-transform group-hover:scale-110">
      <Icon size={30} />
    </div>
    
    <div className="mt-4 text-center">
      <h3 className="text-lg font-bold text-slate-800">{title}</h3>
      <p className="mt-2 max-w-[150px] text-sm text-slate-500">{description}</p>
    </div>

    {!isLast && (
      <div className="absolute left-[70%] top-8 hidden w-full border-t-2 border-dashed border-slate-300 lg:block" />
    )}
  </div>
);

const MLPipeline = () => {
  const steps = [
    {
      icon: Database,
      title: "Data Ingestion",
      description: "Collecting raw data from SQL, APIs, and CSV sources."
    },
    {
      icon: Search,
      title: "Exploration",
      description: "Feature engineering and data cleaning process."
    },
    {
      icon: Cpu,
      title: "Model Training",
      description: "Training XGBoost or Random Forest models."
    },
    {
      icon: LineChart,
      title: "Evaluation",
      description: "Validating accuracy, precision, and recall."
    },
    {
      icon: Server,
      title: "Deployment",
      description: "Hosting the model via FastAPI or Streamlit."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-16 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            CodeNFacts ML Pipeline
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            A modular end-to-end workflow for production-ready machine learning.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5 lg:gap-4">
          {steps.map((step, index) => (
            <PipelineStep 
              key={index}
              icon={step.icon}
              title={step.title}
              description={step.description}
              isLast={index === steps.length - 1}
            />
          ))}
        </div>

        <div className="mt-20 rounded-2xl bg-white p-8 shadow-sm border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Settings className="text-blue-600" /> Pipeline Status
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-500">
              <thead className="bg-slate-50 text-xs uppercase text-slate-700">
                <tr>
                  <th className="px-6 py-3">Component</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Last Run</th>
                  <th className="px-6 py-3">Artifacts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="px-6 py-4 font-medium text-slate-900">Pre-processing</td>
                  <td className="px-6 py-4"><span className="text-green-500 font-semibold">● Success</span></td>
                  <td className="px-6 py-4">2 hours ago</td>
                  <td className="px-6 py-4 text-blue-600 hover:underline cursor-pointer">features.pkl</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium text-slate-900">Training</td>
                  <td className="px-6 py-4"><span className="text-green-500 font-semibold">● Success</span></td>
                  <td className="px-6 py-4">1 hour ago</td>
                  <td className="px-6 py-4 text-blue-600 hover:underline cursor-pointer">model_v1.bin</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MLPipeline;