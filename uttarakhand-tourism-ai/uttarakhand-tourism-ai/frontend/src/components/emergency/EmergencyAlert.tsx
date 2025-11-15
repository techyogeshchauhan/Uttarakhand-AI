import React, { useState, useEffect } from 'react';
import { Phone, AlertTriangle, Loader2, MessageSquare } from 'lucide-react';
import {
  getEmergencyContacts,
  getEmergencyAdvice,
  getAlerts,
  type EmergencyContact,
  type TravelAlert
} from '../../services/api';

const EmergencyAlert: React.FC = () => {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [alerts, setAlerts] = useState<TravelAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [situation, setSituation] = useState('');
  const [location, setLocation] = useState('');
  const [isGettingAdvice, setIsGettingAdvice] = useState(false);
  const [advice, setAdvice] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [contactsRes, alertsRes] = await Promise.all([
        getEmergencyContacts(),
        getAlerts()
      ]);

      if (contactsRes.success) {
        setContacts(contactsRes.contacts || []);
      }

      if (alertsRes.success) {
        setAlerts(alertsRes.alerts || []);
      }
    } catch (err) {
      setError('Failed to load emergency information');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetAdvice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!situation.trim()) return;

    setIsGettingAdvice(true);
    setAdvice(null);

    try {
      const response = await getEmergencyAdvice(situation, location);
      if (response.success && response.advice) {
        setAdvice(response.advice);
      } else {
        throw new Error(response.message || 'Failed to get advice');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get advice');
    } finally {
      setIsGettingAdvice(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return 'bg-red-100 border-red-300 text-red-800';
      case 'moderate':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'low':
        return 'bg-blue-100 border-blue-300 text-blue-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Travel Alerts */}
      {alerts.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            Active Travel Alerts
          </h3>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border ${getSeverityColor(alert.severity)}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-bold">{alert.title}</h4>
                  <span className="text-xs font-medium uppercase">
                    {alert.severity}
                  </span>
                </div>
                <p className="text-sm mb-2">{alert.message}</p>
                <div className="flex items-center justify-between text-xs">
                  <span>📍 {alert.location}</span>
                  <span>Valid until: {alert.valid_until}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Emergency Contacts */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Phone className="w-6 h-6 text-green-600" />
          Emergency Contacts
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {contacts.map((contact, index) => (
            <div
              key={index}
              className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-gray-800">{contact.name}</h4>
                  <p className="text-sm text-gray-600">{contact.description}</p>
                </div>
                <a
                  href={`tel:${contact.number}`}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm font-medium"
                >
                  <Phone className="w-4 h-4" />
                  {contact.number}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Advice */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-blue-600" />
          Get Emergency Advice
        </h3>
        <form onSubmit={handleGetAdvice} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Describe your situation
            </label>
            <textarea
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
              placeholder="e.g., Lost my way, need help finding nearest police station"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your location (optional)
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Dehradun, Mussoorie"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={isGettingAdvice || !situation.trim()}
            className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
          >
            {isGettingAdvice ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Getting advice...</span>
              </>
            ) : (
              <>
                <MessageSquare className="w-5 h-5" />
                <span>Get Advice</span>
              </>
            )}
          </button>
        </form>

        {advice && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">AI Advice:</h4>
            <p className="text-gray-700 whitespace-pre-wrap">{advice}</p>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
};

export default EmergencyAlert;

