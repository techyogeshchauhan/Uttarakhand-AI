import React, { useState, useEffect } from 'react';
import { User, Mail, Globe, Camera, Save, Loader2 } from 'lucide-react';

interface UserProfile {
  _id: string;
  email: string;
  name: string;
  language: string;
  avatar?: string;
  created_at: string;
  stats: {
    total_chats: number;
    total_feedback: number;
    positive_feedback: number;
    negative_feedback: number;
  };
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    language: 'english',
    avatar: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setProfile(data.data.user);
        setFormData({
          name: data.data.user.name,
          language: data.data.user.language,
          avatar: data.data.user.avatar || ''
        });
      }
    } catch (error) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (data.success) {
        setProfile(data.data.user);
        setSuccess('Profile updated successfully!');
        setEditing(false);
        
        // Update localStorage
        localStorage.setItem('user', JSON.stringify(data.data.user));
      } else {
        setError(data.error || 'Failed to update profile');
      }
    } catch (error) {
      setError('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-stone-600">Failed to load profile</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-stone-800 mb-6">Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="relative inline-block mb-4">
                {formData.avatar ? (
                  <img
                    src={formData.avatar}
                    alt={profile.name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-emerald-100"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-emerald-100 flex items-center justify-center border-4 border-emerald-200">
                    <User className="w-16 h-16 text-emerald-600" />
                  </div>
                )}
                
                {editing && (
                  <label className="absolute bottom-0 right-0 bg-emerald-600 text-white p-2 rounded-full cursor-pointer hover:bg-emerald-700 transition-colors">
                    <Camera className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              
              <h2 className="text-xl font-bold text-stone-800 mb-1">{profile.name}</h2>
              <p className="text-stone-500 text-sm mb-4">{profile.email}</p>
              
              <div className="text-xs text-stone-400">
                Member since {new Date(profile.created_at).toLocaleDateString()}
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
              <h3 className="font-semibold text-stone-800 mb-4">Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-stone-600 text-sm">Total Chats</span>
                  <span className="font-semibold text-stone-800">{profile.stats.total_chats}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-600 text-sm">Feedback Given</span>
                  <span className="font-semibold text-stone-800">{profile.stats.total_feedback}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-600 text-sm">Positive</span>
                  <span className="font-semibold text-emerald-600">{profile.stats.positive_feedback}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-600 text-sm">Negative</span>
                  <span className="font-semibold text-red-600">{profile.stats.negative_feedback}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-stone-800">Profile Information</h3>
                {!editing && (
                  <button
                    onClick={() => setEditing(true)}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    Edit Profile
                  </button>
                )}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                  <p className="text-sm">{error}</p>
                </div>
              )}

              {success && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg mb-4">
                  <p className="text-sm">{success}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={!editing}
                    className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-stone-50 disabled:text-stone-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full px-4 py-3 border border-stone-300 rounded-lg bg-stone-50 text-stone-600"
                  />
                  <p className="text-xs text-stone-500 mt-1">Email cannot be changed</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-2">
                    <Globe className="w-4 h-4 inline mr-2" />
                    Preferred Language
                  </label>
                  <select
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                    disabled={!editing}
                    className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-stone-50 disabled:text-stone-600"
                  >
                    <option value="english">English</option>
                    <option value="hindi">Hindi (हिंदी)</option>
                    <option value="garhwali">Garhwali (गढ़वाली)</option>
                    <option value="kumaoni">Kumaoni (कुमाऊँनी)</option>
                  </select>
                </div>

                {editing && (
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex-1 bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          Save Changes
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(false);
                        setFormData({
                          name: profile.name,
                          language: profile.language,
                          avatar: profile.avatar || ''
                        });
                        setError('');
                        setSuccess('');
                      }}
                      className="px-6 py-3 border border-stone-300 text-stone-700 rounded-lg font-semibold hover:bg-stone-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
