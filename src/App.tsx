/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { Intro } from './components/Intro';
import { AppLayout } from './components/AppLayout';
import { WorldMap } from './components/WorldMap';
import { Camera, CheckCircle2, User, Users } from 'lucide-react';
import { useLanguage } from './contexts/LanguageContext';
import { cn } from './lib/utils';

export default function App() {
  const { t } = useLanguage();
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
  const [joinedGroups, setJoinedGroups] = useState<string[]>([]);

  const toggleGroup = (groupId: string) => {
    setJoinedGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId) 
        : [...prev, groupId]
    );
  };

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
        <div className="flex flex-col h-full gap-8 py-8 w-full max-w-4xl mx-auto px-4 overflow-y-auto">
            <div className="text-center">
                <h2 className="text-4xl font-display text-[#5A5A40]">{t('forum.title')}</h2>
                <p className="font-hand text-xl text-[#8E9299]">{t('forum.subtitle')}</p>
            </div>

            <div className="space-y-4">
                <h3 className="text-2xl font-display text-[#5A5A40] border-b-2 border-[#D1D1D1] pb-2">
                    {t('forum.groups.title')}
                </h3>
                <p className="font-hand text-lg text-[#8E9299]">
                    {t('forum.groups.subtitle')}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(t('forum.groups.list') as any[]).map(group => {
                        const isJoined = joinedGroups.includes(group.id);
                        return (
                            <div key={group.id} className="p-6 bg-white rough-border paper-shadow flex flex-col justify-between gap-4">
                                <div className="space-y-2">
                                    <h4 className="text-xl font-display text-[#5A5A40]">{group.title}</h4>
                                    <p className="font-hand text-base text-[#8E9299] line-clamp-2">{group.description}</p>
                                    <div className="flex items-center gap-2 text-xs font-hand text-[#FFB7B2]">
                                        <Users size={14} />
                                        <span>{isJoined ? 43 : 42} {t('forum.groups.members')}</span>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => toggleGroup(group.id)}
                                    className={cn(
                                        "w-full py-2 rounded-full font-display text-lg transition-all paper-shadow border-2",
                                        isJoined 
                                            ? "bg-white border-[#B5EAD7] text-[#5A5A40] hover:bg-red-50 hover:border-red-200 hover:text-red-500"
                                            : "bg-[#FFB7B2] border-transparent text-white hover:scale-105"
                                    )}
                                >
                                    {isJoined ? t('forum.groups.leave') : t('forum.groups.join')}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-2xl font-display text-[#5A5A40] border-b-2 border-[#D1D1D1] pb-2">
                    {t('forum.topics_title')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { title: t('forum.topics.legal'), tag: 'legal' },
                      { title: t('forum.topics.housing'), tag: 'housing' },
                      { title: t('forum.topics.jobs'), tag: 'jobs' },
                      { title: t('forum.topics.language'), tag: 'language' }
                    ].map(topic => (
                        <div key={topic.tag} className="p-8 bg-white rough-border paper-shadow hover:bg-[#FFDAC1] transition-colors cursor-pointer group">
                            <h3 className="text-2xl font-display text-[#5A5A40] group-hover:scale-105 transition-transform">{topic.title}</h3>
                            <p className="font-hand text-sm opacity-60">12 {t('forum.discussions')}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      )}
      {activeTab === 'resources' && (
        <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
            <h2 className="text-4xl font-display text-[#5A5A40]">{t('resources.title')}</h2>
            <p className="font-hand text-xl text-[#8E9299]">{t('resources.subtitle')}</p>
            <div className="w-full space-y-4 text-left mt-8">
                {(t('resources.items') as any[]).map((res, i) => (
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
                <h2 className="text-4xl font-display text-[#5A5A40]">{t('profile.title')}</h2>
                <p className="font-hand text-[#8E9299]">{t('profile.subtitle')}</p>
            </div>

            <div className="space-y-4 w-full max-w-md">
                <div className="flex flex-col items-start gap-1">
                    <label className="font-hand text-sm text-[#5A5A40]">{t('profile.labels.name')}</label>
                    <input 
                        className="w-full p-3 bg-[#FDFBF7] border-2 border-[#D1D1D1] rough-border font-hand text-lg focus:outline-none focus:border-[#FFB7B2]" 
                        value={profile.name}
                        onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                    />
                </div>
                <div className="flex flex-col items-start gap-1">
                    <label className="font-hand text-sm text-[#5A5A40]">{t('profile.labels.bio')}</label>
                    <textarea 
                        className="w-full p-3 bg-[#FDFBF7] border-2 border-[#D1D1D1] rough-border h-24 font-hand text-lg focus:outline-none focus:border-[#FFB7B2]" 
                        value={profile.bio}
                        onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                    />
                </div>
                <div className="flex flex-col items-start gap-1">
                    <label className="font-hand text-sm text-[#5A5A40]">{t('profile.labels.interests')}</label>
                    <div className="flex flex-wrap gap-2 py-2">
                        {(t('profile.tags') as string[]).map(tag => {
                            const isSelected = profile.interests.includes(tag);
                            return (
                                <button 
                                    key={tag} 
                                    onClick={() => {
                                        setProfile(prev => {
                                            const updatedInterests = isSelected 
                                                ? prev.interests.filter(t => t !== tag)
                                                : [...prev.interests, tag];
                                            return { ...prev, interests: updatedInterests };
                                        });
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
                            <span>{t('profile.saving')}</span>
                        </div>
                    ) : t('profile.save')}
                </button>
                
                {showSuccess && (
                     <div className="flex items-center gap-2 text-green-600 font-hand text-lg">
                         <CheckCircle2 size={20} />
                         <span>{t('profile.success')}</span>
                     </div>
                )}
            </div>
        </div>
      )}
    </AppLayout>
  );
}
