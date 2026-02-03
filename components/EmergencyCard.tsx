
import React from 'react';
import { 
  ShieldAlert, 
  Droplet, 
  User, 
  Phone, 
  Download, 
  QrCode,
  FileText,
  AlertTriangle
} from 'lucide-react';
import { UserProfile, MedicalReport } from '../types';

interface EmergencyCardProps {
  user: UserProfile;
  reports: MedicalReport[];
}

const EmergencyCard: React.FC<EmergencyCardProps> = ({ user, reports }) => {
  const criticalReports = reports.filter(r => r.isEmergency || r.analysis?.criticalLevel === 'High');

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Urgent Header */}
        <div className="bg-red-600 p-6 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-8 h-8" />
            <h2 className="text-xl font-bold uppercase tracking-widest">Emergency Medical ID</h2>
          </div>
          <QrCode className="w-8 h-8" />
        </div>

        <div className="p-8 space-y-8">
          {/* Identity Section */}
          <div className="flex flex-col sm:flex-row gap-6">
            <img 
              src={user.profilePic || 'https://picsum.photos/200'} 
              alt="Profile" 
              className="w-32 h-32 rounded-3xl object-cover border-4 border-slate-50 shadow-sm"
            />
            <div className="space-y-4 flex-1">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Patient Name</p>
                <h3 className="text-2xl font-bold text-slate-900">{user.name}</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Blood Group</p>
                  <p className="text-xl font-bold text-red-600 flex items-center gap-1">
                    <Droplet className="w-5 h-5" /> {user.bloodGroup}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Date of Birth</p>
                  <p className="text-lg font-bold text-slate-900">Jan 12, 1990</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
            {/* Allergies */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" /> Critical Allergies
              </h4>
              <div className="flex flex-wrap gap-2">
                {user.allergies.map((a, i) => (
                  <span key={i} className="bg-amber-50 text-amber-700 px-3 py-1 rounded-lg text-sm font-bold border border-amber-100">
                    {a}
                  </span>
                ))}
              </div>
            </div>

            {/* Chronic Conditions */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-blue-500" /> Chronic Conditions
              </h4>
              <div className="flex flex-wrap gap-2">
                {user.chronicConditions.map((c, i) => (
                  <span key={i} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-sm font-bold border border-blue-100">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Linked Critical Reports */}
          {criticalReports.length > 0 && (
            <div className="pt-6 border-t border-slate-100">
              <h4 className="text-sm font-bold text-slate-900 mb-4">Critical Medical History</h4>
              <div className="space-y-3">
                {criticalReports.map(report => (
                  <div key={report.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-3">
                      <FileText className="text-slate-400 w-5 h-5" />
                      <div>
                        <p className="text-sm font-bold text-slate-800">{report.title}</p>
                        <p className="text-xs text-slate-500">{report.date}</p>
                      </div>
                    </div>
                    <button className="text-red-600 text-sm font-bold">Access Link</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Emergency Contacts */}
          <div className="pt-6 border-t border-slate-100">
            <h4 className="text-sm font-bold text-slate-900 mb-4">Emergency Contact</h4>
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-2xl border border-green-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-600 text-white rounded-lg">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">Sarah Doe (Spouse)</p>
                  <p className="text-sm text-slate-600">+1 (555) 123-4567</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="p-6 bg-slate-50 flex flex-col sm:flex-row gap-4 border-t border-slate-100">
          <button className="flex-1 flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-100 transition-colors">
            <Download className="w-5 h-5" /> Save to Phone
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg">
            <QrCode className="w-5 h-5" /> Print Physical Card
          </button>
        </div>
      </div>

      <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 flex gap-4">
        <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl h-fit">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-bold text-blue-900 mb-1">Authorized Access Only</h4>
          <p className="text-sm text-blue-700">This card contains sensitive medical information. It is designed to be accessible by emergency responders via a secure lookup using your unique Mediverse ID or NFC scan.</p>
        </div>
      </div>
    </div>
  );
};

export default EmergencyCard;