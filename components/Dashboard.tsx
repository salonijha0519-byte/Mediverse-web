
import React from 'react';
import { 
  TrendingUp, 
  Droplet, 
  Heart, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MedicalReport, UserProfile } from '../types';

interface DashboardProps {
  reports: MedicalReport[];
  user: UserProfile;
}

const Dashboard: React.FC<DashboardProps> = ({ reports, user }) => {
  // Aggregate metrics from reports for the chart
  const metricsData = reports
    .flatMap(r => r.analysis?.metrics || [])
    .filter(m => m.name.toLowerCase().includes('glucose') || m.name.toLowerCase().includes('blood pressure'))
    .slice(0, 10)
    .map(m => ({
      ...m,
      // Ensure numeric value for chart
      value: parseFloat(m.value) || 0,
      timestamp: new Date(m.timestamp || Date.now()).toLocaleDateString()
    }))
    .reverse();

  const recentReports = reports.slice(0, 3);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome & Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-slate-500 text-sm font-medium mb-1">Blood Group</p>
            <h3 className="text-2xl font-bold text-slate-900">{user.bloodGroup}</h3>
          </div>
          <div className="p-3 bg-red-50 text-red-600 rounded-2xl">
            <Droplet className="w-6 h-6" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-slate-500 text-sm font-medium mb-1">Heart Rate</p>
            <h3 className="text-2xl font-bold text-slate-900">72 <span className="text-sm text-slate-400 font-normal">bpm</span></h3>
          </div>
          <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl">
            <Heart className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-slate-500 text-sm font-medium mb-1">Reports Stored</p>
            <h3 className="text-2xl font-bold text-slate-900">{reports.length}</h3>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-slate-500 text-sm font-medium mb-1">Allergies</p>
            <h3 className="text-2xl font-bold text-slate-900">{user.allergies.length}</h3>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Health Trend Chart */}
      <div className="bg-white p-6 lg:p-8 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Health Overview</h3>
            <p className="text-slate-500 text-sm">Trends based on your latest medical reports</p>
          </div>
          <TrendingUp className="text-blue-500 w-6 h-6" />
        </div>

        <div className="h-[300px] w-full">
          {metricsData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metricsData}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="timestamp" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="value" stroke="#2563eb" fillOpacity={1} fill="url(#colorVal)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <p>No health trends available yet.</p>
              <p className="text-sm">Upload reports to start tracking metrics.</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Reports List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-bold text-slate-900">Recent Reports</h3>
          {recentReports.length > 0 ? (
            <div className="space-y-3">
              {recentReports.map(report => (
                <div key={report.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-blue-200 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${report.analysis?.criticalLevel === 'High' ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-600'}`}>
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">{report.title}</h4>
                      <p className="text-xs text-slate-500">{report.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {report.analysis?.criticalLevel && (
                      <span className={`px-3 py-1 rounded-full text-xs font-medium 
                        ${report.analysis.criticalLevel === 'High' ? 'bg-red-100 text-red-700' : 
                          report.analysis.criticalLevel === 'Medium' ? 'bg-amber-100 text-amber-700' : 
                          'bg-green-100 text-green-700'}`}>
                        {report.analysis.criticalLevel} Priority
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 rounded-2xl border border-dashed border-slate-200 text-center">
              <p className="text-slate-400">No reports found.</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900">Health Reminders</h3>
          <div className="bg-indigo-600 p-6 rounded-3xl text-white shadow-lg shadow-indigo-100">
            <h4 className="font-bold mb-2">Proactive Care</h4>
            <p className="text-indigo-100 text-sm mb-4">You have no upcoming checkups. Maintain your records for better AI health tracking.</p>
            <button className="bg-white text-indigo-600 px-4 py-2 rounded-xl text-sm font-bold w-full">Schedule a Checkup</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
