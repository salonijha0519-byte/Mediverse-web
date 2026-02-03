
import React, { useState } from 'react';
import { 
  QrCode, 
  Scan, 
  Search, 
  FileText, 
  ArrowRight, 
  CheckCircle2, 
  ShieldAlert,
  Download,
  Clock,
  ExternalLink,
  X,
  User,
  ShieldCheck,
  Lock,
  Loader2
} from 'lucide-react';
import { UserProfile, MedicalReport, SharedReport } from '../types';

interface SharingHubProps {
  user: UserProfile;
  myReports: MedicalReport[];
  sharedWithMe: SharedReport[];
  onShare: (targetUserId: string, reportIds: string[]) => void;
}

const SharingHub: React.FC<SharingHubProps> = ({ user, myReports, sharedWithMe, onShare }) => {
  const [activeTab, setActiveTab] = useState<'received' | 'send'>('received');
  const [searchId, setSearchId] = useState('');
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [sharingToUser, setSharingToUser] = useState<UserProfile | null>(null);
  const [viewingShared, setViewingShared] = useState<SharedReport | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleFindUser = () => {
    const users: UserProfile[] = JSON.parse(localStorage.getItem('mediverse_db_users') || '[]');
    const found = users.find(u => u.id.toLowerCase() === searchId.toLowerCase());
    if (found) {
      if (found.id === user.id) {
        alert("You cannot share with yourself.");
        return;
      }
      setSharingToUser(found);
    } else {
      alert("Mediverse ID not found. Ensure the user is registered.");
    }
  };

  const simulateScan = () => {
    setIsScanning(true);
    // Request camera permission as specified in metadata.json
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        setTimeout(() => {
          setIsScanning(false);
          // Auto-fill a demo ID if found or just prompt user
          setSearchId('G' + Math.random().toString(36).substr(2, 5).toUpperCase());
          // Stop stream
          stream.getTracks().forEach(track => track.stop());
        }, 2500);
      })
      .catch(() => {
        setIsScanning(false);
        alert("Camera access denied. Please enter the ID manually.");
      });
  };

  const toggleReportSelection = (id: string) => {
    setSelectedReports(prev => 
      prev.includes(id) ? prev.filter(rid => rid !== id) : [...prev, id]
    );
  };

  const executeShare = () => {
    if (!sharingToUser) return;
    onShare(sharingToUser.id, selectedReports);
    alert(`Successfully shared ${selectedReports.length} reports with ${sharingToUser.name}`);
    setSharingToUser(null);
    setSelectedReports([]);
    setSearchId('');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm w-fit mx-auto lg:mx-0">
        <button 
          onClick={() => setActiveTab('received')}
          className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'received' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-500 hover:text-slate-900'}`}
        >
          Received Files
        </button>
        <button 
          onClick={() => setActiveTab('send')}
          className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'send' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-500 hover:text-slate-900'}`}
        >
          Send Securely
        </button>
      </div>

      {activeTab === 'received' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Download className="w-5 h-5 text-blue-500" /> Recent Transfers
            </h3>
            
            {sharedWithMe.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sharedWithMe.map(shared => (
                  <div key={shared.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col group hover:border-blue-200 transition-all">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 line-clamp-1">{shared.reportData.title}</h4>
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase">
                          From ID: {shared.fromId.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                       <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-wider">
                          <Clock className="w-3 h-3" /> {new Date(shared.sharedAt).toLocaleDateString()}
                        </span>
                        <button 
                          onClick={() => setViewingShared(shared)}
                          className="text-blue-600 text-xs font-bold flex items-center gap-1 hover:underline"
                        >
                          View <ExternalLink className="w-3 h-3" />
                        </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-20 rounded-[3rem] border-2 border-dashed border-slate-200 text-center space-y-4">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto">
                  <Clock className="text-slate-300 w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">No shared files yet</h4>
                  <p className="text-slate-400 max-w-xs mx-auto text-sm mt-1">When doctors or partners share files with your Mediverse ID, they will appear here instantly.</p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <ShieldAlert className="w-32 h-32" />
              </div>
              <div className="flex items-center justify-between mb-8 relative z-10">
                <h4 className="font-bold text-slate-400 uppercase text-xs tracking-widest">Digital Ledger ID</h4>
                <div className="px-2 py-1 bg-green-500/20 text-green-400 rounded-lg text-[10px] font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Encrypted
                </div>
              </div>
              
              <div className="bg-white p-3 rounded-3xl mb-8 mx-auto w-44 h-44 flex items-center justify-center shadow-inner relative z-10 group cursor-pointer">
                <div className="w-full h-full border-2 border-slate-100 rounded-2xl relative flex items-center justify-center overflow-hidden">
                   <div className="grid grid-cols-4 gap-2 p-4 opacity-40 group-hover:opacity-60 transition-opacity">
                     {[...Array(16)].map((_, i) => <div key={i} className={`w-full h-full bg-slate-900 rounded-sm ${Math.random() > 0.5 ? 'visible' : 'invisible'}`}></div>)}
                   </div>
                   <div className="absolute inset-0 flex items-center justify-center">
                      <QrCode className="w-10 h-10 text-slate-900" />
                   </div>
                </div>
              </div>

              <div className="text-center space-y-1 relative z-10">
                <h3 className="text-3xl font-mono font-bold tracking-[0.2em]">{user.id.toUpperCase()}</h3>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Share this ID to receive files</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <Lock className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Privacy Guarantee</h4>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Mediverse uses decentralized identifiers. Sharing is per-file; no one can access your profile or other reports without your explicit signature.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto space-y-10">
          {!sharingToUser ? (
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl text-center space-y-10 relative overflow-hidden">
              {isScanning && (
                <div className="absolute inset-0 bg-blue-600/10 backdrop-blur-sm z-20 flex flex-col items-center justify-center space-y-4 animate-in fade-in">
                  <div className="relative">
                    <div className="w-24 h-24 border-4 border-blue-600 rounded-3xl animate-pulse"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                    </div>
                  </div>
                  <p className="text-blue-600 font-bold">Scanning for Mediverse IDs...</p>
                </div>
              )}

              <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center mx-auto shadow-inner">
                <Scan className="w-12 h-12" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-slate-900">Send Secure Health Records</h3>
                <p className="text-slate-500 max-w-sm mx-auto">Transfer specific reports to healthcare providers or trusted contacts using their Vault ID.</p>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex gap-3">
                  <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-blue-600 transition-colors" />
                    <input 
                      type="text" 
                      placeholder="Enter Recipient ID" 
                      value={searchId}
                      onChange={e => setSearchId(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 transition-all font-mono font-bold uppercase tracking-widest"
                    />
                  </div>
                  <button 
                    onClick={handleFindUser}
                    className="bg-blue-600 text-white px-8 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center gap-2"
                  >
                    Find <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex items-center gap-4 py-2">
                  <div className="h-px bg-slate-100 flex-1"></div>
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">or scan qr</span>
                  <div className="h-px bg-slate-100 flex-1"></div>
                </div>

                <button 
                  onClick={simulateScan}
                  className="w-full flex items-center justify-center gap-3 py-4 border-2 border-dashed border-slate-200 rounded-2xl hover:bg-slate-50 hover:border-blue-300 transition-all font-bold text-slate-500"
                >
                  <Scan className="w-5 h-5" /> Open Scanner
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-[3rem] border border-blue-100 shadow-xl space-y-8 animate-in zoom-in-95">
              <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center">
                    <User className="text-blue-600 w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900">{sharingToUser.name}</h4>
                    <p className="text-sm font-bold text-blue-600 uppercase tracking-widest">ID: {sharingToUser.id}</p>
                  </div>
                </div>
                <button onClick={() => setSharingToUser(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              <div className="space-y-4">
                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 px-2">
                  Select Reports to Share ({selectedReports.length})
                </h5>
                <div className="grid grid-cols-1 gap-3 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
                  {myReports.length > 0 ? myReports.map(report => (
                    <div 
                      key={report.id}
                      onClick={() => toggleReportSelection(report.id)}
                      className={`p-5 rounded-[1.5rem] border-2 transition-all cursor-pointer flex items-center justify-between group
                        ${selectedReports.includes(report.id) ? 'border-blue-600 bg-blue-50/50' : 'border-slate-100 bg-white hover:border-blue-200'}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${selectedReports.includes(report.id) ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm line-clamp-1">{report.title}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">{report.date}</p>
                        </div>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                        ${selectedReports.includes(report.id) ? 'bg-blue-600 border-blue-600 scale-110 shadow-lg' : 'border-slate-200 group-hover:border-blue-300'}`}>
                        {selectedReports.includes(report.id) && <CheckCircle2 className="w-4 h-4 text-white" />}
                      </div>
                    </div>
                  )) : (
                    <div className="p-8 text-center text-slate-400 text-sm">No reports available to share.</div>
                  )}
                </div>
              </div>

              <button 
                disabled={selectedReports.length === 0}
                onClick={executeShare}
                className="w-full bg-slate-900 hover:bg-black disabled:bg-slate-200 text-white py-4 rounded-2xl font-bold shadow-xl transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
              >
                Send Securely <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Shared Report Viewer Modal */}
      {viewingShared && (
        <div className="fixed inset-0 bg-slate-900/70 z-[60] flex items-center justify-center p-4 backdrop-blur-md">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 overflow-hidden">
             <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{viewingShared.reportData.title}</h2>
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Shared by ID: {viewingShared.fromId.toUpperCase()}</p>
                </div>
                <button onClick={() => setViewingShared(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X className="w-6 h-6 text-slate-400" />
                </button>
             </div>
             <div className="p-8 max-h-[70vh] overflow-y-auto space-y-8">
                <div className="bg-blue-50 p-6 rounded-[2rem] border border-blue-100">
                  <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5" /> AI Clinical Insights
                  </h4>
                  <p className="text-sm text-blue-700 leading-relaxed font-medium">{viewingShared.reportData.analysis?.summary}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                    <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Vital Indicators</h5>
                    <div className="space-y-3">
                      {viewingShared.reportData.analysis?.metrics.map((m, i) => (
                        <div key={i} className="flex justify-between items-center text-sm bg-white p-3 rounded-xl shadow-sm border border-slate-100">
                          <span className="text-slate-500 font-medium">{m.name}</span>
                          <span className="font-bold text-slate-900">{m.value} <span className="text-[10px] text-slate-400">{m.unit}</span></span>
                        </div>
                      ))}
                      {!viewingShared.reportData.analysis?.metrics.length && <p className="text-xs text-slate-400">No specific metrics extracted.</p>}
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 flex flex-col justify-center items-center text-center space-y-4">
                    <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Critical Alert Status</h5>
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center border-4 ${viewingShared.reportData.analysis?.criticalLevel === 'High' ? 'border-red-600 bg-red-50' : 'border-green-600 bg-green-50'}`}>
                       <ShieldAlert className={`w-10 h-10 ${viewingShared.reportData.analysis?.criticalLevel === 'High' ? 'text-red-600' : 'text-green-600'}`} />
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase ${viewingShared.reportData.analysis?.criticalLevel === 'High' ? 'bg-red-600 text-white shadow-lg shadow-red-200' : 'bg-green-600 text-white shadow-lg shadow-green-200'}`}>
                      {viewingShared.reportData.analysis?.criticalLevel} Risk
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">Automated Recommendations</h5>
                  <div className="grid grid-cols-1 gap-3">
                    {viewingShared.reportData.analysis?.recommendations.map((rec, i) => (
                      <div key={i} className="flex gap-3 text-sm text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                        <span className="font-medium">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
             </div>
             <div className="p-8 border-t border-slate-100 flex justify-end bg-slate-50">
                <button onClick={() => setViewingShared(null)} className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold hover:bg-black transition-all shadow-xl active:scale-[0.98]">
                  Close Preview
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SharingHub;