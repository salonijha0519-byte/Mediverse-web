
import React, { useState } from 'react';
import { Camera, Save, User, Mail, Droplets, ShieldCheck } from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileProps {
  user: UserProfile;
  onUpdate: (user: UserProfile) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdate }) => {
  const [formData, setFormData] = useState<UserProfile>(user);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleListChange = (name: 'allergies' | 'chronicConditions', value: string) => {
    const items = value.split(',').map(item => item.trim());
    setFormData(prev => ({ ...prev, [name]: items }));
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700"></div>
        
        <div className="px-8 pb-8">
          <div className="relative -mt-16 mb-8 flex items-end gap-6">
            <div className="relative group">
              <img 
                src={formData.profilePic || 'https://picsum.photos/200'} 
                alt="Profile" 
                className="w-32 h-32 rounded-3xl border-4 border-white shadow-xl object-cover"
              />
              <button className="absolute bottom-2 right-2 p-2 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition-colors">
                <Camera className="w-5 h-5" />
              </button>
            </div>
            <div className="pb-2">
              <h2 className="text-2xl font-bold text-slate-900">{formData.name}</h2>
              <p className="text-slate-500">{formData.email}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400" /> Full Name
                </label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" /> Email Address
                </label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  disabled
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-slate-400" /> Blood Group
                </label>
                <select 
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all appearance-none bg-white"
                >
                  {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-slate-400" /> Chronic Conditions
                </label>
                <input 
                  type="text" 
                  placeholder="E.g. Asthma, Diabetes (comma separated)"
                  value={formData.chronicConditions.join(', ')}
                  onChange={(e) => handleListChange('chronicConditions', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Allergies</label>
              <textarea 
                rows={3}
                placeholder="List any known allergies separated by commas"
                value={formData.allergies.join(', ')}
                onChange={(e) => handleListChange('allergies', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
              ></textarea>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-slate-100">
              <div className="text-sm text-slate-500">
                Your medical profile is encrypted and only accessible to you and authorized emergency responders.
              </div>
              <button 
                type="submit"
                className={`
                  flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all shadow-lg
                  ${isSaved ? 'bg-green-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100'}
                `}
              >
                {isSaved ? (
                  <>Profile Updated!</>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
