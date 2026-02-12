import React from 'react';
import { Job, AnalysisResult } from '../types';
import { Building2, MapPin, Banknote, CheckCircle, AlertCircle } from 'lucide-react';

interface JobCardProps {
  job: Job;
  analysis?: AnalysisResult;
  isAnalyzing: boolean;
}

const JobCard: React.FC<JobCardProps> = ({ job, analysis, isAnalyzing }) => {
  const getRatingColor = (rating: number) => {
    if (rating >= 8) return 'bg-green-100 text-green-800 border-green-200';
    if (rating >= 5) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow duration-200 flex flex-col h-full">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-bold text-gray-900 leading-tight">{job.title}</h3>
          <p className="text-sm font-medium text-gray-600 flex items-center gap-1 mt-1">
            <Building2 className="w-3 h-3" /> {job.company}
          </p>
        </div>
        {analysis && (
          <div className={`px-2.5 py-1 rounded-full text-sm font-bold border ${getRatingColor(analysis.rating)}`}>
            {analysis.rating}/10
          </div>
        )}
      </div>

      <div className="flex gap-4 mb-4 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <MapPin className="w-3 h-3" /> {job.location}
        </span>
        {job.salary && (
          <span className="flex items-center gap-1">
            <Banknote className="w-3 h-3" /> {job.salary}
          </span>
        )}
      </div>

      <div className="text-sm text-gray-700 mb-4 line-clamp-3 flex-grow">
        {job.description}
      </div>

      {isAnalyzing && (
        <div className="mt-auto pt-4 border-t border-gray-100 animate-pulse flex items-center gap-2 text-blue-600 text-sm">
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          Analyzing match...
        </div>
      )}

      {analysis && (
        <div className="mt-auto pt-4 border-t border-gray-100">
          <div className="flex items-start gap-2">
            {analysis.rating >= 8 ? (
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
            )}
            <p className="text-sm text-gray-600 italic">"{analysis.reasoning}"</p>
          </div>
          {analysis.keyMatch && (
            <div className="mt-2 text-xs font-semibold text-green-600 flex items-center gap-1">
              ✨ Recommended Apply
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default JobCard;
