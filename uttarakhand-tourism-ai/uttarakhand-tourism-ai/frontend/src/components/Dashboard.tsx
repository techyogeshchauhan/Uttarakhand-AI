import { useState } from 'react';
import Navbar from './common/Navbar';
import LanguageSelector from './common/LanguageSelector';
import Footer from './common/Footer';
import ChatInterface from './chat/ChatInterface';
import ImageUpload from './vision/ImageUpload';
import ItineraryForm from './itinerary/ItineraryForm';
import EmergencyAlert from './emergency/EmergencyAlert';
import WeatherWidget from './emergency/WeatherWidget';
import type { Language } from '../types';

type TabType = 'chat' | 'vision' | 'itinerary' | 'emergency';

function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('chat');
  const [language, setLanguage] = useState<Language>('english');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex flex-col">
      <Navbar />
      
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Tourism Dashboard</h2>
          <LanguageSelector currentLanguage={language} onLanguageChange={setLanguage} />
        </div>
      </div>
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-md p-2 mb-6">
          <div className="flex gap-2 overflow-x-auto">
            <TabButton
              active={activeTab === 'chat'}
              onClick={() => setActiveTab('chat')}
              icon="💬"
              label="Chat Guide"
            />
            <TabButton
              active={activeTab === 'vision'}
              onClick={() => setActiveTab('vision')}
              icon="📸"
              label="Image Info"
            />
            <TabButton
              active={activeTab === 'itinerary'}
              onClick={() => setActiveTab('itinerary')}
              icon="📅"
              label="Plan Trip"
            />
            <TabButton
              active={activeTab === 'emergency'}
              onClick={() => setActiveTab('emergency')}
              icon="🚨"
              label="Emergency"
            />
          </div>
        </div>

        {/* Tab Content */}
        <div className={`rounded-lg shadow-lg overflow-hidden ${activeTab === 'chat' ? '' : 'bg-white p-6'}`}>
          {activeTab === 'chat' && <ChatInterface language={language} />}
          {activeTab === 'vision' && <ImageUpload language={language} />}
          {activeTab === 'itinerary' && <ItineraryForm />}
          {activeTab === 'emergency' && (
            <div className="space-y-6">
              <WeatherWidget />
              <EmergencyAlert />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: string;
  label: string;
}

function TabButton({ active, onClick, icon, label }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all transform hover:-translate-y-0.5 ${
        active
          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 shadow-sm'
      }`}
    >
      <span className="text-xl">{icon}</span>
      <span className="whitespace-nowrap">{label}</span>
    </button>
  );
}

export default Dashboard;
