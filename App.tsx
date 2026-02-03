
import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  FileText, 
  User, 
  MessageSquare, 
  Share2,
  LogOut, 
  Menu,
  CreditCard,
  ShieldCheck
} from 'lucide-react';
import { View, UserProfile, MedicalReport, SharedReport } from './types';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import Reports from './components/Reports';
import Chatbot from './components/Chatbot';
import EmergencyCard from './components/EmergencyCard';
import SharingHub from './components/SharingHub';
import Auth from './components/Auth';

const STORAGE_USERS = 'mediverse_db_users';
const STORAGE_CURRENT_USER = 'mediverse_session';
const STORAGE_REPORTS = 'mediverse_db_reports';
const STORAGE_SHARED = 'mediverse_db_shared';

const App: React.FC = () => {
  const [view, setView] = useState<View>(View.DASHBOARD);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [reports, setReports] = useState<MedicalReport[]>([]);
  const [sharedWithMe, setSharedWithMe] = useState<SharedReport[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    try {
      const session = localStorage.getItem(STORAGE_CURRENT_USER);
      if (session) {
        const loggedInUser = JSON.parse(session);
        if (loggedInUser && loggedInUser.id) {
          setUser(loggedInUser);
          setIsLoggedIn(true);
          loadUserData(loggedInUser.id);
        }
      }
    } catch (e) {
      console.error("Failed to load session", e);
      localStorage.removeItem(STORAGE_CURRENT_USER);
    }
  }, []);

  const loadUserData = (userId: string) => {
    try {
      const allReports: MedicalReport[] = JSON.parse(localStorage.getItem(STORAGE_REPORTS) || '[]');
      const userReports = allReports.filter(r => r.ownerId === userId);
      setReports(userReports);

      const allShared: SharedReport[] = JSON.parse(localStorage.getItem(STORAGE_SHARED) || '[]');
      const userShared = allShared.filter(s => s.toId === userId);
      setSharedWithMe(userShared);
    } catch (e) {
      console.error("Failed to load user data", e);
    }
  };

  const handleLogin = (userData: UserProfile) => {
    setUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem(STORAGE_CURRENT_USER, JSON.stringify(userData));
    loadUserData(userData.id);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem(STORAGE_CURRENT_USER);
    setView(View.DASHBOARD);
  };

  const updateProfile = (updatedUser: UserProfile) => {
    setUser(updatedUser);
    localStorage.setItem(STORAGE_CURRENT_USER, JSON.stringify(updatedUser));
    try {
      const users: UserProfile[] = JSON.parse(localStorage.getItem(STORAGE_USERS) || '[]');
      const updatedUsers = users.map(u => u.id === updatedUser.id ? updatedUser : u);
      localStorage.setItem(STORAGE_USERS, JSON.stringify(updatedUsers));
    } catch (e) {
      console.error("Failed to update profile in DB", e);
    }
  };

  const addReport = (newReport: MedicalReport) => {
    const updatedReports = [newReport, ...reports];
    setReports(updatedReports);
    try {
      const allReports: MedicalReport[] = JSON.parse(localStorage.getItem(STORAGE_REPORTS) || '[]');
      localStorage.setItem(STORAGE_REPORTS, JSON.stringify([newReport, ...allReports]));
    } catch (e) {
      console.error("Failed to save report", e);
    }
  };

  const handleShare = (targetUserId: string, reportIds: string[]) => {
    if (!user) return;
    try {
      const allShared: SharedReport[] = JSON.parse(localStorage.getItem(STORAGE_SHARED) || '[]');
      
      const newShares: SharedReport[] = reportIds.map(rid => {
        const report = reports.find(r => r.id === rid)!;
        return {
          id: Math.random().toString(36).substr(2, 9),
          reportId: rid,
          fromId: user.id,
          toId: targetUserId,
          sharedAt: new Date().toISOString(),
          reportData: report
        };
      });

      localStorage.setItem(STORAGE_SHARED, JSON.stringify([...newShares, ...allShared]));
    } catch (e) {
      console.error("Failed to share reports", e);
    }
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  if (!isLoggedIn) {
    return <Auth onLogin={handleLogin} />;
  }

  const navItems = [
    { id: View.DASHBOARD, label: 'Dashboard', icon: Activity },
    { id: View.REPORTS, label: 'Medical Reports', icon: FileText },
    { id: View.SHARING, label: 'Sharing Hub', icon: Share2 },
    { id: View.EMERGENCY, label: 'Emergency Card', icon: CreditCard },
    { id: View.CHAT, label: 'AI Health Chat', icon: MessageSquare },
    { id: View.PROFILE, label: 'My Profile', icon: User },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {isSidebarOpen && <div className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden" onClick={toggleSidebar} />}
      <aside className={`fixed lg:static inset-y-0 left-0 w-72 bg-white border-r border-slate-200 z-50 transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center gap-3 px-2 mb-10">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-100"><Activity className="text-white w-6 h-6" /></div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">Mediverse</span>
          </div>
          <nav className="flex-1 space-y-2">
            {navItems.map((item) => (
              <button key={item.id} onClick={() => { setView(item.id); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 group ${view === item.id ? 'bg-blue-600 text-white shadow-xl shadow-blue-200/50' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}>
                <item.icon className={`w-5 h-5 ${view === item.id ? 'text-white' : 'text-slate-400 group-hover:text-blue-600'}`} />
                <span className="font-semibold">{item.label}</span>
              </button>
            ))}
          </nav>
          <div className="mt-auto pt-6 border-t border-slate-100">
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-colors font-semibold"><LogOut className="w-5 h-5" /><span>Sign Out</span></button>
          </div>
        </div>
      </aside>
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={toggleSidebar} className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl"><Menu className="w-6 h-6" /></button>
            <h2 className="text-xl font-bold text-slate-900 capitalize">{view === View.SHARING ? 'Sharing Hub' : view.replace(/([A-Z])/g, ' $1').trim()}</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:block text-right">
              <div className="text-sm font-bold text-slate-900">{user?.name}</div>
              <div className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full inline-block">ID: {user?.id.toUpperCase()}</div>
            </div>
            <img src={user?.profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id}`} className="w-12 h-12 rounded-2xl border-2 border-white shadow-sm ring-1 ring-slate-100" alt="Profile" />
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-6 lg:p-10">
          {view === View.DASHBOARD && <Dashboard reports={reports} user={user!} />}
          {view === View.REPORTS && <Reports reports={reports} onAddReport={addReport} ownerId={user!.id} />}
          {view === View.PROFILE && <Profile user={user!} onUpdate={updateProfile} />}
          {view === View.CHAT && <Chatbot reports={reports} />}
          {view === View.EMERGENCY && <EmergencyCard user={user!} reports={reports} />}
          {view === View.SHARING && <SharingHub user={user!} myReports={reports} sharedWithMe={sharedWithMe} onShare={handleShare} />}
        </div>
      </main>
    </div>
  );
};

export default App;
