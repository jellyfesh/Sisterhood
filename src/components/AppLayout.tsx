import React from 'react';
import { PaperCutout } from './PaperCutout';
import { cn } from '../lib/utils';
import { Globe, Users, MessageSquare, BookOpen, User } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Language } from '../i18n/translations';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const AppLayout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  const { language, setLanguage, t } = useLanguage();

  const tabs = [
    { id: 'map', icon: Globe, label: t('tabs.map') },
    { id: 'forum', icon: MessageSquare, label: t('tabs.forum') },
    { id: 'resources', icon: BookOpen, label: t('tabs.resources') },
    { id: 'profile', icon: User, label: t('tabs.profile') },
  ];

  const isMap = activeTab === 'map';

  return (
    <div className={cn(
        "min-h-screen bg-[#FDFBF7] flex flex-col items-center transition-all duration-500",
        isMap ? "p-0 overflow-hidden h-[100dvh]" : "p-4 md:p-8 space-y-6"
    )}>
      {/* Header */}
      <div className={cn(
          "transition-all duration-500 z-50",
          isMap ? "fixed top-6 left-8 right-8 md:left-12 md:right-12 flex justify-between items-start pointer-events-none" : "w-full max-w-6xl flex justify-between items-center"
      )}>
        <h1 className={cn(
            "font-display text-[#5A5A40] transition-all",
            isMap ? "text-2xl bg-white/80 backdrop-blur-sm p-4 rough-border paper-shadow pointer-events-auto" : "text-3xl"
        )}>
            {t('title')}
        </h1>
        <div className={cn("flex gap-2 pointer-events-auto", isMap && "bg-white/80 backdrop-blur-sm p-2 rough-border paper-shadow mr-4")}>
            {(['EN', 'ES', 'FR'] as Language[]).map((lang) => (
                <button 
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={cn(
                    "px-3 py-1 rough-border paper-shadow font-hand transition-all text-sm",
                    language === lang 
                      ? "bg-[#FFB7B2] text-white -translate-y-0.5" 
                      : "bg-white hover:bg-gray-50 text-[#5A5A40]"
                  )}
                >
                    {lang}
                </button>
            ))}
        </div>
      </div>

      {/* Main Content Area */}
      <main className={cn(
          "w-full flex-1 flex flex-col md:flex-row transition-all duration-500",
          isMap ? "max-w-none gap-0 relative" : "max-w-6xl gap-8"
      )}>
        {/* Navigation Sidebar (Desktop) */}
        <aside className={cn(
            "hidden md:flex flex-col gap-4 transition-all duration-500 z-40",
            isMap ? "fixed left-6 top-32 w-16" : "w-48"
        )}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex items-center gap-3 font-display rough-border transition-all group relative",
                isMap ? "p-3 rounded-xl justify-center" : "p-4 text-lg",
                activeTab === tab.id 
                  ? "bg-[#FFB7B2] paper-shadow -translate-y-1" 
                  : "bg-white/90 backdrop-blur-sm hover:bg-white"
              )}
              title={tab.label}
            >
              <tab.icon size={isMap ? 24 : 20} />
              {!isMap && tab.label}
              {isMap && (
                  <span className="absolute left-full ml-4 px-2 py-1 bg-[#5A5A40] text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">
                      {tab.label}
                  </span>
              )}
            </button>
          ))}
        </aside>

        {/* Content View */}
        <div className={cn(
            "flex-1 transition-all duration-500 w-full",
            isMap ? "h-full w-full" : "min-h-[600px]"
        )}>
            {isMap ? (
                children
            ) : (
                <PaperCutout color="bg-white" className="h-full" shadow={false}>
                    {children}
                </PaperCutout>
            )}
        </div>
      </main>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-6 left-6 right-6 flex justify-around bg-white p-4 paper-shadow rough-border z-40">
        {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "p-2 rounded-full transition-all",
                activeTab === tab.id ? "bg-[#FFB7B2] text-white" : "text-[#4A4A4A]"
              )}
            >
              <tab.icon size={24} />
            </button>
          ))}
      </nav>
    </div>
  );
};
