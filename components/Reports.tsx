
import React, { useState } from 'react';
import { 
  Upload, 
  Plus, 
  Loader2, 
  FileText, 
  ExternalLink, 
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react';
import { MedicalReport } from '../types';
import { analyzeReport } from '../services/geminiService';

interface ReportsProps {
  reports: MedicalReport[];
  onAddReport: (report: MedicalReport) => void;
  ownerId: string;
}

const Reports: React.FC<ReportsProps> = ({ reports, onAddReport, ownerId }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedReport, setSelectedReport] = useState<MedicalReport | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64Data = (reader.result as string).split(',')[1];
        const analysis = await analyzeReport(base64Data, file.type);
        
        const newReport: MedicalReport = {
          id: Date.now().toString(),
          ownerId: ownerId,
          title: file.name,
          date: new Date().toLocaleDateString(),
          fileType: file.type,
          content: reader.result as string,
          analysis,
          isEmergency: analysis.criticalLevel === 'High'
        };
        
        onAddReport(newReport);
        setIsUploading(false);
      };
    } catch (error) {
      console.error("Upload failed", error);
      setIsUploading(false);
      alert("Failed to analyze report. Please try again.");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Your Medical Archive</h2>
          <p className="text-slate-500">All your health records in one secure location.</p>
        </div>
        <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-100 transition-all">
          <Plus className="w-5 h-5" />
          <span>Upload Report</span>
          <input type="file" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
        </label>
      </div>

      {isUploading && (
        <div className="bg-blue-50 border border-blue-100 p-8 rounded-3xl flex flex-col items-center justify-center text-center space-y-4">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          <div>
            <h3 className="text-lg font-bold text-blue-900">AI is analyzing your report...</h3>
            <p className="text-blue-600">Extracting metrics and summarizing findings from your document.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map(report => (
          <div 
            key={report.id} 
            onClick={() => setSelectedReport(report)}
            className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col h-full"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl ${report.isEmergency ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                <FileText className="w-6 h-6" />
              </div>
              <span className="text-xs font-medium text-slate-400">{report.date}</span>
            </div>
            
            <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
              {report.title}
            </h3>
            
            {report.analysis && (
              <p className="text-sm text-slate-500 line-clamp-3 mb-4 flex-grow">
                {report.analysis.summary}
              </p>
            )}

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
              <span className={`text-xs px-2 py-1 rounded-full font-bold uppercase
                ${report.analysis?.criticalLevel === 'High' ? 'bg-red-100 text-red-600' : 
                  report.analysis?.criticalLevel === 'Medium' ? 'bg-amber-100 text-amber-600' : 
                  'bg-green-100 text-green-700'}`}>
                {report.analysis?.criticalLevel || 'Normal'}
              </span>
              <button className="text-blue-600 text-sm font-bold flex items-center gap-1">
                Details <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}

        {reports.length === 0 && !isUploading && (
          <div className="col-span-full py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center text-center">
            <Upload className="w-12 h-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-500">No reports uploaded yet</h3>
            <p className="text-slate-400 max-w-xs mx-auto">Upload your first medical report to see the magic of AI health tracking.</p>
          </div>
        )}
      </div>

      {selectedReport && (
        <div className="fixed inset-0 bg-slate-900/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-3xl rounded-3xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-slate-900">{selectedReport.title}</h2>
              <button onClick={() => setSelectedReport(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>
            
            <div className="p-6 space-y-8">
              {selectedReport.content.startsWith('data:image') && (
                <div className="rounded-2xl overflow-hidden border border-slate-100 bg-slate-50">
                  <img src={selectedReport.content} alt="Report Scan" className="w-full h-auto" />
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <CheckCircle className="text-green-500 w-5 h-5" />
                    AI Summary
                  </h3>
                  <p className="text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl">
                    {selectedReport.analysis?.summary}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-bold text-slate-900 mb-3">Key Metrics</h4>
                    <div className="space-y-2">
                      {selectedReport.analysis?.metrics.map((m, i) => (
                        <div key={i} className="flex justify-between p-3 bg-white border border-slate-100 rounded-xl shadow-sm">
                          <span className="text-slate-500 text-sm font-medium">{m.name}</span>
                          <span className="text-slate-900 font-bold">{m.value} {m.unit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 mb-3">Recommendations</h4>
                    <ul className="space-y-2">
                      {selectedReport.analysis?.recommendations.map((r, i) => (
                        <li key={i} className="flex gap-2 text-sm text-slate-600 bg-blue-50/50 p-3 rounded-xl">
                          <AlertCircle className="w-4 h-4 text-blue-500 shrink-0" />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex justify-end">
              <button onClick={() => setSelectedReport(null)} className="px-6 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
