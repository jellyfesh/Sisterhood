/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { Intro } from './components/Intro';
import { AppLayout } from './components/AppLayout';
import { WorldMap } from './components/WorldMap';
import { Camera, CheckCircle2, User } from 'lucide-react';

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [activeTab, setActiveTab] = useState('map');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [profile, setProfile] = useState({
    name: 'Elena',
    bio: 'New in New York! Looking for friends to explore libraries with.',
    interests: ['Reading', 'Hiking', 'Cooking', 'Art'],
    avatar: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBegin = () => {
    setShowIntro(false);
  };

  if (showIntro) {
    return <Intro onBegin={handleBegin} />;
  }

  return (
    <AppLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'map' && <WorldMap />}
      {activeTab === 'forum' && (
        <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
            <h2 className="text-4xl font-display text-[#5A5A40]">Community Forum</h2>
            <p className="font-hand text-xl text-[#8E9299]">Share your story, ask for advice, or just say hello.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mt-8">
                {['Legal Aid', 'Housing', 'Job Search', 'Language Exchange'].map(topic => (
                    <div key={topic} className="p-8 bg-[#FDFBF7] rough-border paper-shadow hover:bg-[#FFB7B2] transition-colors cursor-pointer">
                        <h3 className="text-2xl font-display">{topic}</h3>
                        <p className="font-hand text-sm opacity-70">12 new discussions today</p>
                    </div>
                ))}
            </div>
        </div>
      )}
      {activeTab === 'resources' && (
        <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
            <h2 className="text-4xl font-display text-[#5A5A40]">Resources</h2>
            <p className="font-hand text-xl text-[#8E9299]">Everything you need to navigate your new home.</p>
            <div className="w-full space-y-4 text-left mt-8">
                {[
                    { title: "Legal Rights for New Arrivals", cat: "Legal" },
                    { title: "Local Job Boards & Skill Training", cat: "Jobs" },
                    { title: "Emergency Healthcare Contacts", cat: "Health" },
                    { title: "Budget Friendly Grocery Guide", cat: "Lifestyle" }
                ].map((res, i) => (
                    <div key={i} className="flex justify-between items-center p-4 border-b-2 border-[#D1D1D1] hover:bg-[#FDFBF7] transition-colors cursor-pointer group">
                        <div>
                            <span className="text-xs uppercase font-bold text-[#FFB7B2]">{res.cat}</span>
                            <h4 className="text-xl font-display group-hover:underline">{res.title}</h4>
                        </div>
                        <span className="text-2xl">→</span>
                    </div>
                ))}
            </div>
        </div>
      )}
      {activeTab === 'profile' && (
        <div className="flex flex-col items-center justify-center min-h-full gap-6 text-center py-8">
            <div className="relative group">
                <div className="w-32 h-32 bg-[#E2F0CB] rounded-full paper-shadow flex items-center justify-center overflow-hidden border-4 border-white relative">
                    {profile.avatar ? (
                        <img 
                            src={profile.avatar} 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                        />
                    ) : (
                        <div className="w-full h-full bg-[#F1C27D] flex items-center justify-center" style={{ clipPath: 'polygon(10% 0, 90% 10%, 100% 50%, 80% 90%, 20% 100%, 0 60%)' }}>
                            <User size={48} className="text-white/40" />
                        </div>
                    )}
                    
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                        <Camera className="text-white" size={24} />
                    </button>
                </div>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                                setProfile(prev => ({ ...prev, avatar: reader.result as string }));
                            };
                            reader.readAsDataURL(file);
                        }
                    }}
                />
            </div>

            <div className="flex flex-col items-center">
                <h2 className="text-4xl font-display text-[#5A5A40]">My Profile</h2>
                <p className="font-hand text-[#8E9299]">Show the sisterhood who you are</p>
            </div>

            <div className="space-y-4 w-full max-w-md">
                <div className="flex flex-col items-start gap-1">
                    <label className="font-hand text-sm text-[#5A5A40]">Preferred Name</label>
                    <input 
                        className="w-full p-3 bg-[#FDFBF7] border-2 border-[#D1D1D1] rough-border font-hand text-lg focus:outline-none focus:border-[#FFB7B2]" 
                        value={profile.name}
                        onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                    />
                </div>
                <div className="flex flex-col items-start gap-1">
                    <label className="font-hand text-sm text-[#5A5A40]">Bio</label>
                    <textarea 
                        className="w-full p-3 bg-[#FDFBF7] border-2 border-[#D1D1D1] rough-border h-24 font-hand text-lg focus:outline-none focus:border-[#FFB7B2]" 
                        value={profile.bio}
                        onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                    />
                </div>
                <div className="flex flex-col items-start gap-1">
                    <label className="font-hand text-sm text-[#5A5A40]">Interests</label>
                    <div className="flex flex-wrap gap-2 py-2">
                        {['Reading', 'Hiking', 'Cooking', 'Art', 'Travel', 'Music'].map(tag => {
                            const isSelected = profile.interests.includes(tag);
                            return (
                                <button 
                                    key={tag} 
                                    onClick={() => {
                                        setProfile(prev => ({
                                            ...prev,
                                            interests: isSelected 
                                                ? prev.interests.filter(t => t !== tag)
                                                : [...prev.interests, tag]
                                        }));
                                    }}
                                    className={`px-4 py-1 rough-border text-sm font-hand transition-all ${
                                        isSelected ? 'bg-[#FFB7B2] paper-shadow -translate-y-0.5' : 'bg-[#B5EAD7] opacity-60 hover:opacity-100'
                                    }`}
                                >
                                    {tag}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center gap-4 w-full">
                <button 
                    disabled={isSaving}
                    onClick={() => {
                        setIsSaving(true);
                        // Simulate network request
                        setTimeout(() => {
                            setIsSaving(false);
                            setShowSuccess(true);
                            setTimeout(() => setShowSuccess(false), 3000);
                        }, 1000);
                    }}
                    className={`px-12 py-3 rounded-full font-display text-xl paper-shadow transition-all relative overflow-hidden ${
                        isSaving ? 'bg-gray-200' : 'bg-[#FFB7B2] hover:scale-105 active:scale-95'
                    }`}
                >
                    {isSaving ? (
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-[#5A5A40]/30 border-t-[#5A5A40] rounded-full animate-spin" />
                            <span>Saving...</span>
                        </div>
                    ) : 'Save Changes'}
                </button>
                
                {showSuccess && (
                     <div className="flex items-center gap-2 text-green-600 font-hand text-lg">
                         <CheckCircle2 size={20} />
                         <span>Profile updated successfully!</span>
                     </div>
                )}
            </div>
        </div>
      )}
    </AppLayout>
  );
}
