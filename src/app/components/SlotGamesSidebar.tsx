import { useState } from 'react';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';

interface SlotGamesSidebarProps {
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
  selectedProvider?: string;
  onProviderChange?: (provider: string) => void;
}

export function SlotGamesSidebar({ 
  selectedCategory, 
  onCategoryChange, 
  selectedProvider, 
  onProviderChange 
}: SlotGamesSidebarProps) {
  const [providersExpanded, setProvidersExpanded] = useState(true);
  const [featuresExpanded, setFeaturesExpanded] = useState(true);

  const providers = [
    { name: 'Pragmatic Play', count: 248 },
    { name: 'NetEnt', count: 156 },
    { name: 'Play\'n GO', count: 132 },
    { name: 'Evolution', count: 98 },
    { name: 'Microgaming', count: 87 },
    { name: 'Red Tiger', count: 76 },
    { name: 'Yggdrasil', count: 64 },
    { name: 'Push Gaming', count: 52 },
    { name: 'Hacksaw Gaming', count: 48 },
    { name: 'Relax Gaming', count: 41 }
  ];

  const features = [
    { name: 'Bonus Buy', count: 156 },
    { name: 'Free Spins', count: 324 },
    { name: 'Jackpot', count: 89 },
    { name: 'Megaways', count: 112 },
    { name: 'Multiplier', count: 198 },
    { name: 'Wild', count: 276 },
    { name: 'Scatter', count: 245 },
    { name: 'Avalanche', count: 87 }
  ];

  return (
    <aside className="w-full lg:w-64 bg-white rounded-lg shadow-sm p-4 space-y-6 sticky top-20 h-fit">
      {/* Search */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Oyun Ara</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            type="text" 
            placeholder="Oyun adı..." 
            className="pl-10"
          />
        </div>
      </div>

      {/* Providers */}
      <div>
        <button 
          onClick={() => setProvidersExpanded(!providersExpanded)}
          className="flex items-center justify-between w-full font-semibold text-gray-900 mb-3 hover:text-purple-700"
        >
          <span>Sağlayıcılar</span>
          {providersExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {providersExpanded && (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {providers.map((provider) => (
              <label key={provider.name} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                <Checkbox />
                <span className="text-sm text-gray-700 flex-1">{provider.name}</span>
                <span className="text-xs text-gray-400">({provider.count})</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Features */}
      <div>
        <button 
          onClick={() => setFeaturesExpanded(!featuresExpanded)}
          className="flex items-center justify-between w-full font-semibold text-gray-900 mb-3 hover:text-purple-700"
        >
          <span>Özellikler</span>
          {featuresExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {featuresExpanded && (
          <div className="space-y-2">
            {features.map((feature) => (
              <label key={feature.name} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                <Checkbox />
                <span className="text-sm text-gray-700 flex-1">{feature.name}</span>
                <span className="text-xs text-gray-400">({feature.count})</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Volatility */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Volatilite</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
            <Checkbox />
            <span className="text-sm text-gray-700">Düşük</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
            <Checkbox />
            <span className="text-sm text-gray-700">Orta</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
            <Checkbox />
            <span className="text-sm text-gray-700">Yüksek</span>
          </label>
        </div>
      </div>
    </aside>
  );
}