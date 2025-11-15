import React, { useState } from 'react';
import { Loader2, Calendar, DollarSign, MapPin, Heart } from 'lucide-react';
import { generateItinerary, getItinerarySuggestions, type ItineraryPreferences } from '../../services/api';
import ItineraryDisplay from './ItineraryDisplay';
import type { Itinerary } from '../../services/api';

const ItineraryForm: React.FC = () => {
  const [duration, setDuration] = useState(3);
  const [budget, setBudget] = useState(50000);
  const [interests, setInterests] = useState<string[]>([]);
  const [startLocation, setStartLocation] = useState('Dehradun');
  const [travelStyle, setTravelStyle] = useState('moderate');
  const [isGenerating, setIsGenerating] = useState(false);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<any>(null);

  React.useEffect(() => {
    loadSuggestions();
  }, []);

  const loadSuggestions = async () => {
    try {
      const response = await getItinerarySuggestions();
      if (response.success) {
        setSuggestions(response.suggestions);
      }
    } catch (err) {
      console.error('Failed to load suggestions:', err);
    }
  };

  const interestOptions = suggestions?.interests || [
    'Temples & Spirituality',
    'Trekking & Adventure',
    'Wildlife & Nature',
    'Hill Stations',
    'Yoga & Wellness',
    'Photography',
    'Local Culture'
  ];

  const travelStyleOptions = suggestions?.travel_styles || [
    'Budget',
    'Moderate',
    'Luxury',
    'Backpacker',
    'Family Friendly'
  ];

  const locationOptions = [
    'Dehradun',
    'Rishikesh',
    'Haridwar',
    'Mussoorie',
    'Nainital',
    'Almora',
    'Ranikhet',
    'Kedarnath',
    'Badrinath'
  ];

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleQuickSelect = (suggestion: any) => {
    setDuration(suggestion.duration);
    setBudget(suggestion.budget);
    setInterests([suggestion.description]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (interests.length === 0) {
      setError('Please select at least one interest');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setItinerary(null);

    try {
      const preferences: ItineraryPreferences = {
        duration,
        budget,
        interests,
        start_location: startLocation,
        travel_style: travelStyle.toLowerCase(),
        language: 'english'
      };

      const response = await generateItinerary(preferences);
      if (response.success && response.itinerary) {
        setItinerary(response.itinerary);
      } else {
        throw new Error(response.message || 'Failed to generate itinerary');
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to generate itinerary. Please try again.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  if (itinerary) {
    return (
      <div>
        <button
          onClick={() => {
            setItinerary(null);
            setError(null);
          }}
          className="mb-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          ← Back to Form
        </button>
        <ItineraryDisplay itinerary={itinerary} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Suggestions */}
      {suggestions?.quick_trips && suggestions.quick_trips.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-3">Quick Trip Suggestions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {suggestions.quick_trips.map((trip: any, index: number) => (
              <button
                key={index}
                onClick={() => handleQuickSelect(trip)}
                className="text-left p-3 bg-white rounded-lg border border-blue-200 hover:border-blue-400 hover:shadow-md transition-all"
              >
                <p className="font-medium text-gray-800">{trip.name}</p>
                <p className="text-sm text-gray-600">{trip.description}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {trip.duration} days • ₹{trip.budget.toLocaleString()}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-1" />
            Duration (days)
          </label>
          <input
            type="number"
            min="1"
            max="30"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value) || 1)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Budget */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <DollarSign className="w-4 h-4 inline mr-1" />
            Budget (₹)
          </label>
          <input
            type="number"
            min="0"
            value={budget}
            onChange={(e) => setBudget(parseInt(e.target.value) || 0)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Start Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="w-4 h-4 inline mr-1" />
            Start Location
          </label>
          <select
            value={startLocation}
            onChange={(e) => setStartLocation(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            {locationOptions.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* Travel Style */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Travel Style
          </label>
          <select
            value={travelStyle}
            onChange={(e) => setTravelStyle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            {travelStyleOptions.map((style: string) => (
              <option key={style} value={style.toLowerCase()}>
                {style}
              </option>
            ))}
          </select>
        </div>

        {/* Interests */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Heart className="w-4 h-4 inline mr-1" />
            Interests (Select at least one)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {interestOptions.map((interest: string) => (
              <button
                key={interest}
                type="button"
                onClick={() => toggleInterest(interest)}
                className={`px-4 py-2 rounded-lg border transition-all ${
                  interests.includes(interest)
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isGenerating || interests.length === 0}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors font-medium"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Generating Itinerary...</span>
            </>
          ) : (
            <>
              <Calendar className="w-5 h-5" />
              <span>Generate Itinerary</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ItineraryForm;

