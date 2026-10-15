import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Users, FileSignature, ArrowLeft, Lock, Unlock, Eye, EyeOff, Loader2 } from 'lucide-react';
import logo from '../assets/logo.png'
import FestiveBackground from '../components/FestiveBackground';
import EventSettingsForm from '../components/organizer/EventSettingsForm';
import FacultyManagement from '../components/organizer/FacultyManagement';
import SignatureOverview from '../components/organizer/SignatureOverview';
import { getLocalEventConfig, saveLocalEventConfig } from '../data/eventConfig';
import {
  fetchEvent,
  updateEvent,
  fetchFaculty,
  verifyOrganizerPassword,
  checkOrganizerAuth,
  clearOrganizerToken,
  getOrganizerToken,
} from '../services/api';

export default function OrganizerPage() {
  const navigate = useNavigate();

  // Authentication state
  const [unlocked, setUnlocked] = useState(false);
  const [enteredPassword, setEnteredPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Active tab state: 'settings' | 'faculty' | 'signatures'
  const [activeTab, setActiveTab] = useState('settings');

  // Event config & faculty dataset
  const [eventConfig, setEventConfig] = useState(getLocalEventConfig());
  const [facultyList, setFacultyList] = useState([]);

  // Check existing session token on mount
  useEffect(() => {
    const token = getOrganizerToken();
    if (token) {
      checkOrganizerAuth()
        .then(() => setUnlocked(true))
        .catch(() => clearOrganizerToken());
    }
  }, []);

  // Fetch event config from MongoDB backend
  useEffect(() => {
    fetchEvent()
      .then((data) => {
        if (data && data.title) {
          setEventConfig((prev) => ({ ...prev, ...data }));
          saveLocalEventConfig(data);
        }
      })
      .catch((err) => {
        console.error('Failed to load event config:', err);
      });
  }, []);

  // Fetch faculty members from MongoDB backend
  const loadFacultyData = () => {
    fetchFaculty()
      .then((data) => {
        if (Array.isArray(data)) {
          setFacultyList(data);
        } else {
          setFacultyList([]);
        }
      })
      .catch((err) => {
        console.error('Failed to load faculty from backend:', err);
        setFacultyList([]);
      });
  };

  useEffect(() => {
    loadFacultyData();
  }, []);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!enteredPassword.trim()) {
      setAuthError('Please enter the organizer password.');
      return;
    }

    setAuthLoading(true);
    setAuthError('');

    try {
      await verifyOrganizerPassword(enteredPassword.trim());
      setUnlocked(true);
      setEnteredPassword('');
    } catch (err) {
      setAuthError(err?.response?.data?.message || 'Incorrect password. Access denied.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    clearOrganizerToken();
    setUnlocked(false);
  };

  const handleConfigUpdate = async (newConfig) => {
    const res = await updateEvent(newConfig);
    const updated = res.event || newConfig;
    setEventConfig(updated);
    saveLocalEventConfig(updated);
    return updated;
  };

  const handleUpdateFaculty = (updatedList) => {
    setFacultyList(updatedList);
  };

  const handleAddFaculty = (newMember) => {
    setFacultyList((prev) => [newMember, ...prev]);
    loadFacultyData();
  };

  const handleDeleteFaculty = (deletedId) => {
    setFacultyList((prev) => prev.filter((f) => f._id !== deletedId));
  };

  return (
    <FestiveBackground variant="ivory" centeredMandala={true}>
      {/* Top festive strip */}
      <div
        className="h-1.5"
        style={{
          background: 'linear-gradient(90deg, #d4a017, #ff6f00, #e91e63, #9c27b0, #d4a017)',
        }}
      />

      {/* Top Header Navigation */}
      <header className="px-4 py-4 max-w-5xl mx-auto w-full flex items-center justify-between border-b border-[#d4a017]/25">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 font-mukta text-sm text-[#3d1070] hover:text-[#e91e63] font-semibold transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Home</span>
          </button>
          <span className="text-[#d4a017]/40">|</span>
          <button
            onClick={() => navigate('/faculty')}
            className="inline-flex items-center gap-1.5 font-mukta text-sm text-[#5e35b1] hover:text-[#e91e63] font-semibold transition-colors cursor-pointer"
          >
            <span>Faculty Directory</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          {unlocked && (
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/80 hover:bg-white text-[#3d1070] border border-[#d4a017]/40 font-mukta text-xs font-semibold shadow-sm transition-colors cursor-pointer mr-2"
              title="Lock Organizer Panel"
            >
              <Lock size={13} />
              <span>Lock Panel</span>
            </button>
          )}

          <img src={logo} alt="ACET" className="w-10 h-10 object-contain filter drop-shadow-sm" />
          <div className="text-right">
            <p className="font-mukta font-bold text-sm text-[#3d1070]">
              Organizer Control Panel
            </p>
            <p className="font-mukta text-[11px] text-[#7e57c2]">
              ACET College, Aligarh
            </p>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">

        {/* ── Password Authentication Screen (Backend Protected) ── */}
        {!unlocked ? (
          <div className="max-w-md mx-auto my-12 p-8 rounded-2xl bg-white/95 border border-[#d4a017]/40 text-center animate-slide-up shadow-2xl">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 bg-amber-50 border border-amber-300 text-[#ff6f00]">
              <Lock size={26} />
            </div>

            <h2 className="font-display font-bold text-2xl text-[#3d1070] mb-2">
              Organizer Access
            </h2>
            <p className="font-mukta text-sm text-[#7e57c2] mb-6">
              Enter the ACET Dandiya Celebration organizer password to access event settings, faculty management, and signature logs.
            </p>

            <form onSubmit={handlePasswordSubmit} className="space-y-4 text-left">
              <div>
                <label
                  htmlFor="organizer-auth-pass"
                  className="block font-mukta text-xs uppercase tracking-wider text-[#3d1070] font-semibold mb-1.5"
                >
                  Organizer Password
                </label>
                <div className="relative">
                  <input
                    id="organizer-auth-pass"
                    type={showPassword ? 'text' : 'password'}
                    value={enteredPassword}
                    onChange={(e) => {
                      setEnteredPassword(e.target.value);
                      setAuthError('');
                    }}
                    placeholder="Enter organizer password"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#d4a017]/40 bg-[#fffefb] text-[#2b0452] placeholder-[#7e57c2]/50 text-sm focus:border-[#d4a017] focus:ring-2 focus:ring-[#d4a017]/20 outline-none pr-10"
                    autoFocus
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#7e57c2] hover:text-[#3d1070]"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {authError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-mukta text-xs">
                  {authError}
                </div>
              )}

              <button
                type="submit"
                disabled={authLoading}
                className="w-full btn-primary py-3 rounded-xl font-mukta font-bold text-sm shadow-lg cursor-pointer disabled:opacity-75"
              >
                {authLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Verifying Credentials…
                  </>
                ) : (
                  <>
                    <Unlock size={16} />
                    Unlock Organizer Settings
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* ── Unlocked 3-Tab Organizer Interface ── */
          <div className="space-y-6 animate-fade-in">

            {/* Tab Navigation Header */}
            <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-white/80 border border-[#d4a017]/35 shadow-sm">
              <button
                type="button"
                onClick={() => setActiveTab('settings')}
                className={`flex-1 min-w-36 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-mukta font-bold text-sm transition-all cursor-pointer ${
                  activeTab === 'settings'
                    ? 'bg-gradient-to-r from-[#ff6f00] to-[#e91e63] text-white shadow-md'
                    : 'text-[#3d1070] hover:text-[#e91e63] hover:bg-white/60'
                }`}
              >
                <Settings size={16} />
                <span>1. Event Settings</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('faculty')}
                className={`flex-1 min-w-36 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-mukta font-bold text-sm transition-all cursor-pointer ${
                  activeTab === 'faculty'
                    ? 'bg-gradient-to-r from-[#ff6f00] to-[#e91e63] text-white shadow-md'
                    : 'text-[#3d1070] hover:text-[#e91e63] hover:bg-white/60'
                }`}
              >
                <Users size={16} />
                <span>2. Faculty Members ({facultyList.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('signatures')}
                className={`flex-1 min-w-36 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-mukta font-bold text-sm transition-all cursor-pointer ${
                  activeTab === 'signatures'
                    ? 'bg-gradient-to-r from-[#ff6f00] to-[#e91e63] text-white shadow-md'
                    : 'text-[#3d1070] hover:text-[#e91e63] hover:bg-white/60'
                }`}
              >
                <FileSignature size={16} />
                <span>
                  3. Signatures ({facultyList.filter((f) => f.invitation?.status === 'signed').length})
                </span>
              </button>
            </div>

            {/* Tab Content Display */}
            {activeTab === 'settings' && (
              <EventSettingsForm config={eventConfig} onUpdate={handleConfigUpdate} />
            )}

            {activeTab === 'faculty' && (
              <FacultyManagement
                facultyList={facultyList}
                onUpdateFaculty={handleUpdateFaculty}
                onAddFaculty={handleAddFaculty}
                onDeleteFaculty={handleDeleteFaculty}
              />
            )}

            {activeTab === 'signatures' && (
              <SignatureOverview facultyList={facultyList} />
            )}

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="text-center py-5 text-xs text-[#7e57c2] font-mukta border-t border-[#d4a017]/20">
        ACET College, Aligarh · Dandiya Celebration 2026 Organizer Interface
      </footer>
    </FestiveBackground>
  );
}
