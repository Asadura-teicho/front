import { useState } from 'react';
import { SlidersHorizontal, Grid3x3, List, Home } from 'lucide-react';
import { Search } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { TrendingUp } from 'lucide-react';
import { Flame } from 'lucide-react';
import { Sparkles } from 'lucide-react';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { SlotGamesSidebar } from '../components/SlotGamesSidebar';
import { SlotGameCard } from '../components/SlotGameCard';
import { SlotBanner } from '../components/SlotBanner';
import { JackpotCounter } from '../components/JackpotCounter';
import { Button } from '../components/ui/button';

interface SlotGamesProps {
  onNavigate?: (page: string) => void;
  onShowSignIn?: () => void;
  onShowSignUp?: () => void;
  onShowDeposit?: () => void;
  onShowMessages?: () => void;
  onShowSweetBonanza?: () => void;
}

export default function SlotGames({ onNavigate, onShowSignIn, onShowSignUp, onShowDeposit, onShowMessages, onShowSweetBonanza }: SlotGamesProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Generate comprehensive slot games list
  const slotGames = [
    { title: 'Sweet Bonanza', provider: 'Pragmatic Play', image: 'https://images.unsplash.com/photo-1655159428752-c700435e9983?w=400', isHot: true, isJackpot: true, rtp: '96.5' },
    { title: 'Gates of Olympus', provider: 'Pragmatic Play', image: 'https://images.unsplash.com/photo-1566563255308-753861417000?w=400', isNew: true, rtp: '96.5' },
    { title: 'Book of Dead', provider: 'Play\'n GO', image: 'https://images.unsplash.com/photo-1719228159232-48608b807a58?w=400', rtp: '96.2' },
    { title: 'Starburst', provider: 'NetEnt', image: 'https://images.unsplash.com/photo-1732998340351-b44984f30508?w=400', rtp: '96.1' },
    { title: 'Big Bass Bonanza', provider: 'Pragmatic Play', image: 'https://images.unsplash.com/photo-1739133710741-1468de0acf26?w=400', isHot: true, rtp: '96.7' },
    { title: 'Wolf Gold', provider: 'Pragmatic Play', image: 'https://images.unsplash.com/photo-1659382151328-30c3df37a69a?w=400', isJackpot: true, rtp: '96.0' },
    { title: 'Blackjack Live', provider: 'Evolution', image: 'https://images.unsplash.com/photo-1618304925090-b68a8c744cbe?w=400', rtp: '99.5' },
    { title: 'Mega Moolah', provider: 'Microgaming', image: 'https://images.unsplash.com/photo-1599579887642-9821ebe3c79a?w=400', isJackpot: true, rtp: '88.1' },
    { title: 'Crazy Time', provider: 'Evolution', image: 'https://images.unsplash.com/photo-1566563255308-753861417000?w=400', isNew: true, isHot: true, rtp: '96.1' },
    { title: 'Gonzo\'s Quest', provider: 'NetEnt', image: 'https://images.unsplash.com/photo-1732998340351-b44984f30508?w=400', rtp: '96.0' },
    { title: 'Aviator', provider: 'Spribe', image: 'https://images.unsplash.com/photo-1739133710741-1468de0acf26?w=400', isHot: true, rtp: '97.0' },
    { title: 'Roulette Live', provider: 'Evolution', image: 'https://images.unsplash.com/photo-1659382151328-30c3df37a69a?w=400', rtp: '97.3' },
    { title: 'Starlight Princess', provider: 'Pragmatic Play', image: 'https://images.unsplash.com/photo-1655159428752-c700435e9983?w=400', isNew: true, rtp: '96.5' },
    { title: 'Sugar Rush', provider: 'Pragmatic Play', image: 'https://images.unsplash.com/photo-1566563255308-753861417000?w=400', isHot: true, rtp: '96.5' },
    { title: 'Fire Joker', provider: 'Play\'n GO', image: 'https://images.unsplash.com/photo-1719228159232-48608b807a58?w=400', rtp: '96.2' },
    { title: 'Dead or Alive 2', provider: 'NetEnt', image: 'https://images.unsplash.com/photo-1732998340351-b44984f30508?w=400', rtp: '96.8' },
    { title: 'Jammin\' Jars', provider: 'Push Gaming', image: 'https://images.unsplash.com/photo-1655159428752-c700435e9983?w=400', isHot: true, rtp: '96.8' },
    { title: 'Immortal Romance', provider: 'Microgaming', image: 'https://images.unsplash.com/photo-1599579887642-9821ebe3c79a?w=400', rtp: '96.9' },
    { title: 'Reactoonz', provider: 'Play\'n GO', image: 'https://images.unsplash.com/photo-1719228159232-48608b807a58?w=400', rtp: '96.5' },
    { title: 'The Dog House', provider: 'Pragmatic Play', image: 'https://images.unsplash.com/photo-1739133710741-1468de0acf26?w=400', isNew: true, rtp: '96.5' },
    { title: 'Legacy of Dead', provider: 'Play\'n GO', image: 'https://images.unsplash.com/photo-1566563255308-753861417000?w=400', rtp: '96.6' },
    { title: 'Moon Princess', provider: 'Play\'n GO', image: 'https://images.unsplash.com/photo-1732998340351-b44984f30508?w=400', isHot: true, rtp: '96.5' },
    { title: 'Vikings Go Berzerk', provider: 'Yggdrasil', image: 'https://images.unsplash.com/photo-1659382151328-30c3df37a69a?w=400', rtp: '96.1' },
    { title: 'Razor Shark', provider: 'Push Gaming', image: 'https://images.unsplash.com/photo-1655159428752-c700435e9983?w=400', isJackpot: true, rtp: '96.7' },
    { title: 'Buffalo King', provider: 'Pragmatic Play', image: 'https://images.unsplash.com/photo-1719228159232-48608b807a58?w=400', rtp: '96.1' },
    { title: 'Rise of Olympus', provider: 'Play\'n GO', image: 'https://images.unsplash.com/photo-1599579887642-9821ebe3c79a?w=400', rtp: '96.5' },
    { title: 'Bonanza', provider: 'Big Time Gaming', image: 'https://images.unsplash.com/photo-1739133710741-1468de0acf26?w=400', isHot: true, rtp: '96.0' },
    { title: 'Wild West Gold', provider: 'Pragmatic Play', image: 'https://images.unsplash.com/photo-1566563255308-753861417000?w=400', rtp: '96.5' },
    { title: 'Fruit Party', provider: 'Pragmatic Play', image: 'https://images.unsplash.com/photo-1655159428752-c700435e9983?w=400', isNew: true, rtp: '96.5' },
    { title: 'Crystal Caverns', provider: 'Hacksaw Gaming', image: 'https://images.unsplash.com/photo-1732998340351-b44984f30508?w=400', rtp: '96.3' },
    { title: 'Solar Queen', provider: 'Playson', image: 'https://images.unsplash.com/photo-1659382151328-30c3df37a69a?w=400', rtp: '96.5' },
    { title: 'Rich Wilde', provider: 'Play\'n GO', image: 'https://images.unsplash.com/photo-1719228159232-48608b807a58?w=400', isHot: true, rtp: '96.2' },
    { title: 'Great Rhino Megaways', provider: 'Pragmatic Play', image: 'https://images.unsplash.com/photo-1739133710741-1468de0acf26?w=400', rtp: '96.6' },
    { title: 'Dragon Tiger', provider: 'Evolution', image: 'https://images.unsplash.com/photo-1599579887642-9821ebe3c79a?w=400', rtp: '96.3' },
    { title: 'Book of Shadows', provider: 'Nolimit City', image: 'https://images.unsplash.com/photo-1655159428752-c700435e9983?w=400', rtp: '96.1' },
    { title: 'Madame Destiny', provider: 'Pragmatic Play', image: 'https://images.unsplash.com/photo-1566563255308-753861417000?w=400', isNew: true, rtp: '95.2' },
  ];

  const categories = [
    'Tümü',
    'Popüler',
    'Yeni',
    'Jackpot',
    'Megaways',
    'Bonus Buy',
    'Canlı',
    'Masalar',
    'Klasik'
  ];

  const [activeCategory, setActiveCategory] = useState('Tümü');

  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [selectedProvider, setSelectedProvider] = useState('Tümü');
  const [searchQuery, setSearchQuery] = useState('');

  const { t } = useLanguage();

  const handleNavigate = (page: string) => {
    onNavigate?.(page);
  };

  // Filtered games based on search query
  const filteredGames = slotGames.filter(game => 
    game.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Jackpot games
  const jackpots = Array.from({ length: 5 }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        onNavigate={handleNavigate} 
        onShowSignIn={onShowSignIn} 
        onShowSignUp={onShowSignUp}
        onShowDeposit={onShowDeposit}
        onShowMessages={onShowMessages}
      />

      {/* Slot Games Banner */}
      <SlotBanner />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex gap-4 sm:gap-6">
          {/* Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0 animate-fade-in-right">
            <SlotGamesSidebar
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              selectedProvider={selectedProvider}
              onProviderChange={setSelectedProvider}
            />
          </div>

          {/* Main Content Area */}
          <div className="flex-1 animate-fade-in-up">
            {/* Search Bar */}
            <div className="mb-4 sm:mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  type="text"
                  placeholder={t('slotGames.search')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Jackpot Games */}
            <div className="mb-6 sm:mb-8 animate-scale-in">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-1.5 sm:gap-2">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-yellow-500 animate-wiggle" />
                  {t('slotGames.jackpot')}
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                {jackpots.map((jackpot, index) => (
                  <div key={index} className="animate-fade-in stagger-1" style={{ animationDelay: `${index * 0.1}s` }}>
                    <JackpotCounter />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
                {filteredGames.filter(g => g.jackpot).slice(0, 10).map((game, index) => (
                  <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <SlotGameCard 
                      {...game} 
                      onPlay={game.title === 'Sweet Bonanza' ? onShowSweetBonanza : undefined}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Hot Games */}
            <div className="mb-6 sm:mb-8 animate-scale-in" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-1.5 sm:gap-2">
                  <Flame className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-red-500 animate-wiggle" />
                  {t('slotGames.hot')}
                </h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
                {filteredGames.filter(g => g.isHot).map((game, index) => (
                  <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <SlotGameCard 
                      {...game} 
                      onPlay={game.title === 'Sweet Bonanza' ? onShowSweetBonanza : undefined}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* All Games */}
            <div className="animate-scale-in" style={{ animationDelay: '0.6s' }}>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">{t('slotGames.allGames')}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
                {filteredGames.map((game, index) => (
                  <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                    <SlotGameCard 
                      {...game} 
                      onPlay={game.title === 'Sweet Bonanza' ? onShowSweetBonanza : undefined}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between bg-white rounded-lg p-3 sm:p-4 shadow-sm mt-6">
              <div className="text-gray-700 text-xs sm:text-sm md:text-base">
                <span className="font-semibold">{slotGames.length}</span> oyun bulundu
              </div>
              
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={`${viewMode === 'grid' ? 'bg-purple-700' : ''} px-2 sm:px-3`}
                >
                  <Grid3x3 className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={`${viewMode === 'list' ? 'bg-purple-700' : ''} px-2 sm:px-3`}
                >
                  <List className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
              </div>
            </div>

            {/* Games Grid */}
            <div className={`grid gap-2 sm:gap-3 md:gap-4 mt-4 sm:mt-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6' 
                : 'grid-cols-1'
            }`}>
              {slotGames.map((game, index) => (
                <SlotGameCard 
                  key={index} 
                  {...game} 
                  onPlay={game.title === 'Sweet Bonanza' ? onShowSweetBonanza : undefined}
                />
              ))}
            </div>

            {/* Load More */}
            <div className="text-center py-6 sm:py-8">
              <Button className="bg-purple-700 hover:bg-purple-800 px-6 sm:px-8 py-4 sm:py-6 text-sm sm:text-base md:text-lg">
                Daha Fazla Yükle
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}