import { useState, useEffect, useRef } from 'react'
import { authAPI } from '../../lib/api/auth.api'
import sweetBonanzaAPI from '../../lib/api/sweetBonanza.api'
import { updateUserData } from '../../lib/utils/auth'
import SlotGameEngine, { SlotGameTheme } from '../components/SlotGameEngine'

interface SweetBonanzaPageProps {
  onClose?: () => void
  onSwitchGame?: () => void
}

function SweetBonanzaPage({ onClose, onSwitchGame }: SweetBonanzaPageProps = {}) {
  console.log('🎮 SweetBonanzaPage component is mounting/rendering')
  
  const [user, setUser] = useState<any>(null)
  const [balance, setBalance] = useState(0)
  const [loading, setLoading] = useState(true)
  const [gameLoading, setGameLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [logoLoaded, setLogoLoaded] = useState(false)
  const [bgImageLoaded, setBgImageLoaded] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [betAmount, setBetAmount] = useState('10')
  const [spinning, setSpinning] = useState(false)
  const [selectedOutcome, setSelectedOutcome] = useState(null) // 'win' or 'loss'
  const [gameState, setGameState] = useState('betting') // 'betting', 'spinning', 'result'
  const [timer, setTimer] = useState(10)
  const [spinTrigger, setSpinTrigger] = useState(0) // Trigger for external spin (Buy Free Spins, etc.)

  // Theme configuration for Sweet Bonanza
  const sweetBonanzaTheme: SlotGameTheme = {
    themeName: 'Sweet Bonanza',
    backgroundImage: '/sweet-bonanza-bg.jpg',
    symbolImages: {
      '🍇': '/icons/icon.png',      // Grapes (weight: 30 - most common)
      '🍊': '/icons/icon1.png',     // Orange (weight: 25)
      '🍋': '/icons/icon7.png',     // Lemon (weight: 20)
      '🍉': '/icons/icon3.png',     // Watermelon (weight: 15)
      '🍌': '/icons/icon4.png',     // Banana (weight: 12)
      '🍎': '/icons/icon5.png',     // Apple (weight: 8)
      '🍓': '/icons/icon6.png',     // Strawberry (weight: 5)
      '⭐': '/icons/icon2.png',     // Star (weight: 3)
      '💎': '/icons/bomb.png',      // Diamond/Lollipop (weight: 2 - least common)
    },
    symbolWeights: {
      '🍇': 30, '🍊': 25, '🍋': 20, '🍉': 15, '🍌': 12,
      '🍎': 8, '🍓': 5, '⭐': 3, '💎': 2
    },
    defaultSymbol: '🍇',
    gridColumns: 6,
    gridRows: 5,
    gridWidth: 560,
    gridHeight: 466.67
  }

  // Original emoji symbols for reference (keeping for weight mapping)
  const symbolKeys = ['🍇', '🍊', '🍋', '🍉', '🍌', '🍎', '🍓', '⭐', '💎']

  // Game state - winAmount and gameHistory kept for display purposes
  const [winAmount, setWinAmount] = useState(0)
  const [gameHistory, setGameHistory] = useState<any[]>([])
  const [autoSpin, setAutoSpin] = useState(false)
  const [autoSpinCount, setAutoSpinCount] = useState(0)
  const [isWinning, setIsWinning] = useState(false)
  const bgMusicRef = useRef<HTMLAudioElement | null>(null)
  const winSoundRef = useRef<HTMLAudioElement | null>(null)
  const lossSoundRef = useRef<HTMLAudioElement | null>(null)
  const spinSoundRef = useRef<HTMLAudioElement | null>(null)
  const [musicEnabled, setMusicEnabled] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [showGameRules, setShowGameRules] = useState(false)
  const [doNotShowAgain, setDoNotShowAgain] = useState(false)
  const [showGamesSidebar, setShowGamesSidebar] = useState(false)
  const [gamesSearchQuery, setGamesSearchQuery] = useState('')
  const [gamesProvider, setGamesProvider] = useState('all')
  const [showBetPopup, setShowBetPopup] = useState(false)
  const [thunderCount, setThunderCount] = useState(5) // Track remaining spins (starts at 5, game ends after 5 spins)
  const [doubleChance, setDoubleChance] = useState(false)

  const quickBetAmounts = ['10', '50', '100', '500', '1000']
  
  // Real slot games from the platform
  const [otherGames] = useState([
    { id: 'dice-roll', name: 'Dice Roll', provider: 'Garbet Games', image: 'https://media.istockphoto.com/id/525032572/photo/gambling-craps-game.jpg?s=1024x1024&w=is&k=20&c=EIaZAJCR2qvuh2ilrT4b4j4DTreeMbOWvWi7URBcQUA=' },
    { id: 2, name: 'Sweet Bonanza', provider: 'Pragmatic Play', image: 'https://media.pinkcasino.co.uk/images/games/sweet-bonanza-super-scatter/sweet-bonanza-super-scatter-tile-auth.jpg' },
    { id: 3, name: 'Gates of Olympus', provider: 'Pragmatic Play', image: 'https://media.pragmaticplay.net/marketing-tools/pragmaticplay/gates-of-olympus-1000/gates-of-olympus-1000.jpg' },
    { id: 4, name: 'Sugar Rush', provider: 'Pragmatic Play', image: 'https://media.pragmaticplay.net/marketing-tools/pragmaticplay/sugar-rush/sugar-rush.jpg' },
    { id: 5, name: 'Big Bass Bonanza', provider: 'Pragmatic Play', image: 'https://media.pragmaticplay.net/marketing-tools/pragmaticplay/big-bass-bonanza/big-bass-bonanza.jpg' },
    { id: 6, name: 'Starlight Princess', provider: 'Pragmatic Play', image: 'https://media.pragmaticplay.net/marketing-tools/pragmaticplay/starlight-princess/starlight-princess.jpg' },
    { id: 7, name: 'The Dog House', provider: 'Pragmatic Play', image: 'https://media.pragmaticplay.net/marketing-tools/pragmaticplay/the-dog-house/the-dog-house.jpg' },
    { id: 8, name: 'Wild West Gold', provider: 'Pragmatic Play', image: 'https://media.pragmaticplay.net/marketing-tools/pragmaticplay/wild-west-gold/wild-west-gold.jpg' },
  ])

  // Helper function to create beep sound using Web Audio API
  const createBeepSound = (frequency, duration, type = 'sine') => {
    if (!soundEnabled || typeof window === 'undefined' || !window.AudioContext && !window.webkitAudioContext) {
      return
    }
    
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext
      const audioContext = new AudioContext()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.value = frequency
      oscillator.type = type
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + duration)
    } catch (error) {
      console.error('Error creating beep sound:', error)
    }
  }

  // Helper function to play sound
  const playSound = (soundRef, volume = 0.7, useBeep = false, beepFreq = 800) => {
    if (!soundEnabled) return
    
    if (useBeep) {
      // Use Web Audio API beep as fallback
      createBeepSound(beepFreq, 0.3)
      return
    }
    
    if (!soundRef?.current) return
    
    try {
      // Reset and play audio
      soundRef.current.currentTime = 0
      soundRef.current.volume = volume
      
      const playPromise = soundRef.current.play()
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Fallback to beep sound
          createBeepSound(beepFreq, 0.3)
        })
      }
    } catch (error) {
      console.error('Error playing sound:', error)
      // Fallback to beep sound
      createBeepSound(beepFreq, 0.3)
    }
  }

  // Initialize audio
  useEffect(() => {
    // Create audio elements for sounds
    try {
      // Background music
      bgMusicRef.current = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3')
      bgMusicRef.current.loop = true
      bgMusicRef.current.volume = 0.3
      bgMusicRef.current.preload = 'auto'
      
      // Try to load audio files from public folder, fallback to beep sounds
      try {
        // Win sound - try loading from public folder first
        winSoundRef.current = new Audio('/sweet-bonanza-win.mp3')
        winSoundRef.current.volume = 0.7
        winSoundRef.current.preload = 'none' // Changed to prevent 416 errors with empty files
        winSoundRef.current.onerror = () => {
          winSoundRef.current = null
        }
        // Don't call load() - let it load on demand to prevent 416 errors
      } catch (e) {
        winSoundRef.current = null
      }
      
      try {
        // Loss sound
        lossSoundRef.current = new Audio('/sweet-bonanza-loss.mp3')
        lossSoundRef.current.volume = 0.7
        lossSoundRef.current.preload = 'none' // Changed from 'auto' to prevent 416 errors
        lossSoundRef.current.onerror = () => {
          lossSoundRef.current = null
        }
        // Don't call load() immediately - let it load on demand
      } catch (e) {
        lossSoundRef.current = null
      }
      
      try {
        // Spin sound
        spinSoundRef.current = new Audio('/sweet-bonanza-spin.mp3')
        spinSoundRef.current.volume = 0.5
        spinSoundRef.current.preload = 'none' // Changed from 'auto' to prevent 416 errors
        spinSoundRef.current.onerror = () => {
          spinSoundRef.current = null
        }
        // Don't call load() immediately - let it load on demand
      } catch (e) {
        spinSoundRef.current = null
      }

      // Start background music if enabled
      if (musicEnabled && bgMusicRef.current) {
        bgMusicRef.current.play().catch(() => {
          // Autoplay blocked, ignore silently
        })
      }
    } catch (error) {
      console.error('Error initializing audio:', error)
    }

    return () => {
      // Cleanup audio on unmount
      if (bgMusicRef.current) {
        bgMusicRef.current.pause()
        bgMusicRef.current = null
      }
      if (winSoundRef.current) {
        winSoundRef.current.pause()
        winSoundRef.current = null
      }
      if (lossSoundRef.current) {
        lossSoundRef.current.pause()
        lossSoundRef.current = null
      }
      if (spinSoundRef.current) {
        spinSoundRef.current.pause()
        spinSoundRef.current = null
      }
    }
  }, [])

  // Handle music toggle
  useEffect(() => {
    if (bgMusicRef.current) {
      if (musicEnabled) {
        bgMusicRef.current.play().catch(() => {})
      } else {
        bgMusicRef.current.pause()
      }
    }
  }, [musicEnabled])

  // Preload background images
  useEffect(() => {
    const bgImage = new Image()
    bgImage.onload = () => setBgImageLoaded(true)
    bgImage.onerror = () => {
      console.warn('Background image failed to load, continuing anyway')
      setBgImageLoaded(true) // Continue even if image fails
    }
    bgImage.src = sweetBonanzaTheme.backgroundImage || '/sweet-bonanza-bg.jpg'
    
    // Set timeout to ensure loading doesn't get stuck
    const timeout = setTimeout(() => {
      setBgImageLoaded(true)
    }, 3000)
    
    return () => clearTimeout(timeout)
  }, [])

  // Loading screen progress animation - only start after logo and bg image are loaded, and user data is loaded
  useEffect(() => {
    // Immediately set loading to false to allow game to open quickly
    setLoading(false)
    
    // Auto-set images as loaded after a short delay if they haven't loaded (ensures game always opens)
    const imageTimeout = setTimeout(() => {
      setLogoLoaded(true)
      setBgImageLoaded(true)
    }, 1000) // Reduced to 1 second for faster loading

    // Safety timeout - if loading takes too long, force completion (ensures game always opens)
    const safetyTimeout = setTimeout(() => {
      setGameLoading(false)
      setLoading(false)
      setLogoLoaded(true)
      setBgImageLoaded(true)
      setLoadingProgress(100)
    }, 2000) // 2 second timeout - game should open quickly
    
    return () => {
      clearTimeout(imageTimeout)
      clearTimeout(safetyTimeout)
    }
  }, []) // Empty dependency array - only run once on mount

  // Progress bar animation - separate effect (runs independently)
  useEffect(() => {
    if (gameLoading && logoLoaded && bgImageLoaded && !loading && loadingProgress < 100) {
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval)
            setTimeout(() => {
              setGameLoading(false)
            }, 200)
            return 100
          }
          return prev + 3 // Faster progress
        })
      }, 50)
      return () => clearInterval(interval)
    }
  }, [gameLoading, logoLoaded, bgImageLoaded, loading, loadingProgress])

  useEffect(() => {
    // Try to get balance from localStorage first (faster initial load)
    try {
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}')
      if (storedUser?.balance !== undefined && storedUser.balance !== null) {
        const initialBalance = parseFloat(storedUser.balance) || 0
        setBalance(initialBalance)
        setUser(storedUser)
        setLoading(false) // Set loading to false immediately if we have localStorage data
        if (import.meta.env.DEV) {
          console.log('Sweet Bonanza - Initial balance from localStorage:', initialBalance)
        }
      } else {
        // No stored user, but still set loading to false after a short delay
        setLoading(false)
      }
    } catch (e) {
      // Ignore localStorage errors, but still set loading to false
      setLoading(false)
    }
    
    // Then fetch fresh data from server (don't block on this)
    fetchUserData()
    
    // Listen for balance updates from other components
    const handleUserDataUpdate = (event) => {
      if (event.detail?.balance !== undefined && event.detail.balance !== null) {
        const newBalance = parseFloat(event.detail.balance) || 0
        setBalance(newBalance)
        setUser(event.detail)
        if (import.meta.env.DEV) {
          console.log('Sweet Bonanza - Balance updated from event:', newBalance)
        }
      }
    }
    
    window.addEventListener('userDataUpdated', handleUserDataUpdate)
    
    // Also poll for balance updates periodically (every 10 seconds - reduced frequency)
    const balanceInterval = setInterval(() => {
      // Only fetch if not loading and component is still mounted
      if (!loading) {
        fetchUserData()
      }
    }, 10000) // Increased to 10 seconds to reduce load
    
    return () => {
      window.removeEventListener('userDataUpdated', handleUserDataUpdate)
      clearInterval(balanceInterval)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchUserData = async () => {
    try {
      // Always ensure loading is false (don't block game)
      setLoading(false)
      
      // Check if user is authenticated
      const token = localStorage.getItem('token')
      if (!token) {
        // Don't block game from opening, just use localStorage data
        try {
          const storedUser = JSON.parse(localStorage.getItem('user') || '{}')
          if (storedUser?.balance !== undefined) {
            setBalance(storedUser.balance)
            setUser(storedUser)
            return
          }
        } catch (e) {
          // Continue to try API call
        }
        return
      }

      const response = await authAPI.me()
      
      // Debug: Log the full response structure
      if (import.meta.env.DEV) {
        console.log('Sweet Bonanza - Full API response:', response)
        console.log('Sweet Bonanza - Response data:', response?.data)
      }
      
      // Handle different response structures
      // Backend returns user directly, axios wraps it in response.data
      const userData = response?.data || response || null
      
      if (userData) {
        setUser(userData)
        // Get balance - check multiple possible locations
        const userBalance = userData.balance !== undefined ? userData.balance : 
                          (userData.user?.balance !== undefined ? userData.user.balance : 0)
        
        setBalance(userBalance)
        
        // Update localStorage to sync with navbar
        updateUserData(userData)
        
        if (import.meta.env.DEV) {
          console.log('Sweet Bonanza - User data:', userData)
          console.log('Sweet Bonanza - User balance set to:', userBalance)
        }
      } else {
        if (import.meta.env.DEV) {
          console.warn('Sweet Bonanza - No user data received from API')
        }
        // Try to get balance from localStorage as fallback
        try {
          const storedUser = JSON.parse(localStorage.getItem('user') || '{}')
          if (storedUser?.balance !== undefined) {
            setBalance(storedUser.balance)
            setUser(storedUser)
            if (import.meta.env.DEV) {
              console.log('Sweet Bonanza - Using balance from localStorage:', storedUser.balance)
            }
          } else {
            setError('Unable to load user data. Please try again.')
          }
        } catch (e) {
          // Ignore localStorage errors
          setError('Unable to load user data. Please try again.')
        }
      }
    } catch (err: any) {
      console.error('Sweet Bonanza - API Error:', err)
      if (import.meta.env.DEV) {
        console.error('Sweet Bonanza - Error fetching user data:', err)
        console.error('Sweet Bonanza - Error response:', err.response)
      }
      
      // Handle authentication errors
      if (err.response?.status === 401) {
        setError('Session expired. Please log in again.')
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setTimeout(() => {
          if (onClose) {
            onClose()
          } else {
            window.location.href = '/'
          }
        }, 2000)
      }
      
      // Try to get balance from localStorage as fallback
      try {
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}')
        if (storedUser?.balance !== undefined) {
          setBalance(storedUser.balance)
          setUser(storedUser)
        } else {
          setError('Unable to load user data. Please try again.')
        }
      } catch (e) {
        // Ignore localStorage errors - game should still open
      }
      // Always set loading to false even on error
      setLoading(false)
    } finally {
      // Always ensure loading is false in finally block
      setLoading(false)
      setLoading(false)
    }
  }

  // NOTE: All game logic (spinReels, processCascadeAnimation, etc.) has been moved to SlotGameEngine component
  // This component now only handles page-level UI (balance display, title, banners, sidebar, etc.)

  // Quick bet handler
  const handleQuickBet = (amount) => {
    setBetAmount(amount)
  }

  // Side feature: buy feature for a fixed cost (e.g. ₺200)
  const handleBuyFeature = (e?) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    const featureCost = 200
    if (balance < featureCost) {
      setError(`Yetersiz bakiye. Özellik için ₺${featureCost.toFixed(2)} gerekiyor.`)
      setSuccess('')
      return
    }
    if (spinning) {
      setError('Lütfen mevcut çevirmenin bitmesini bekleyin.')
      setSuccess('')
      return
    }
    setError('')
    setSuccess(`SATIN ALMA ÖZELLİĞİ AKTİF! ₺${featureCost.toFixed(2)} ile çeviriliyor...`)
    setBetAmount(featureCost.toString())
    setTimeout(() => {
      setSpinTrigger((prev) => prev + 1)
    }, 400)
  }

  // Side feature: toggle double-chance mode (visual/UX only for now)
  const handleToggleDoubleChance = (e?) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    setDoubleChance((prev) => !prev)
  }

  // Reset thunder count when autoplay finishes
  useEffect(() => {
    if (autoSpinCount === 0 && autoSpin) {
      setThunderCount(5) // Reset to 5 for next game
    }
  }, [autoSpinCount, autoSpin])

  // All game logic (spin, cascade animations, win calculations) has been moved to SlotGameEngine component
  // This component now only handles page-level UI (balance display, title, banners, sidebar, etc.)

     // Loading Screen with Pragmatic Play Logo - Show this for all loading states
  if (loading || gameLoading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="flex flex-col items-center justify-center">
          {/* PRAGMATIC PLAY Logo Image - Display first */}
          <div className="mb-8 text-center">
            <img
              src="/pragmaticplay.jpeg"
              alt="Pragmatic Play"
              className="w-48 md:w-64 h-auto mx-auto"
              style={{ maxWidth: '300px' }}
              onLoad={() => setLogoLoaded(true)}
              onError={() => setLogoLoaded(true)}
            />
          </div>

          {/* Loading Bar */}
          {logoLoaded && bgImageLoaded && !loading && (
            <div className="w-64 md:w-80 h-1 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-500 transition-all duration-300 ease-out"
                style={{
                  width: `${loadingProgress}%`,
                  boxShadow: '0 0 10px rgba(255, 165, 0, 0.8)',
                }}
              />
            </div>
          )}

          {loading && (
            <div className="w-64 md:w-80 h-1 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-500 transition-all duration-300 ease-out animate-pulse"
                style={{
                  width: '30%',
                  boxShadow: '0 0 10px rgba(255, 165, 0, 0.8)',
                }}
              />
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black relative flex w-full flex-col"
      style={{
        width: '100%',
        minHeight: '100vh',
        overflowX: 'hidden',
        overflowY: 'hidden',
      }}
    >
      {/* Background Image */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${sweetBonanzaTheme.backgroundImage || '/sweet-bonanza-bg.jpg'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
      </div>

      <main
        className="relative flex flex-col items-start justify-center z-10 w-full main-content"
        style={{
          padding: '0.5rem',
          overflowY: 'auto',
          overflowX: 'hidden',
          minHeight: '100vh',
          position: 'relative',
          width: '100%',
        }}
      >
        <div
          className="w-full relative z-20 flex flex-col items-center gap-2 hide-scrollbar"
          style={{
            borderRadius: '12px',
            padding: '0.5rem 0.75rem 0.75rem 0.75rem',
            margin: '0 auto',
            maxWidth: '100%',
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          {/* Balance Display */}
          <div className="w-full text-center relative z-20 mb-1 flex-shrink-0">
            <div className="bg-green-600/90 text-white px-4 py-1.5 rounded-lg shadow-lg inline-block">
              <p className="text-base md:text-lg font-bold">Balance: ₺{balance.toFixed(2)}</p>
            </div>
          </div>

          {/* Game Title */}
          <div className="w-full text-center relative z-20 mb-1 flex-shrink-0 flex items-center justify-center">
            <img
              src="/icons/sweet bonanza.PNG"
              alt="Sweet Bonanza"
              className="mx-auto object-contain"
              style={{
                height: '70px',
                width: 'auto',
                maxWidth: '95%',
                minHeight: '140px',
                filter:
                  'drop-shadow(0 4px 12px rgba(0,0,0,0.4)) drop-shadow(0 0 20px rgba(255,215,0,0.3))',
                animation: 'titleBlink 2s ease-in-out infinite',
              }}
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
                const fallback = document.createElement('h1')
                fallback.textContent = 'SWEET BONANZA'
                fallback.className =
                  'text-xl md:text-3xl lg:text-4xl xl:text-5xl font-black mb-0 leading-tight relative z-10 titleBlink'
                fallback.style.cssText = `
                  font-family: Arial Black, sans-serif;
                  font-weight: 900;
                  background: linear-gradient(135deg, #FF1493 0%, #FFD700 25%, #FF69B4 50%, #FFD700 75%, #FF1493 100%);
                  background-size: 200% 200%;
                  -webkit-background-clip: text;
                  -webkit-text-fill-color: transparent;
                  background-clip: text;
                  animation: gradientShift 3s ease infinite, titleBlink 2s ease-in-out infinite;
                  letter-spacing: 2px;
                  line-height: 1.1;
                  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
                `
                target.parentNode?.appendChild(fallback)
              }}
            />
          </div>

          {/* Mobile: side feature boxes stacked above the grid */}
          <div className="w-full md:hidden flex flex-col items-center gap-2 mb-1">
            {/* Golden 10,000x box */}
            <div
              className="rounded-xl px-3 py-2 text-center"
              style={{
                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)',
                boxShadow:
                  '0 0 16px rgba(255,215,0,0.8), 0 0 32px rgba(255,215,0,0.6), inset 0 2px 6px rgba(255,255,255,0.5)',
                border: '2px solid rgba(255,255,255,0.85)',
              }}
            >
              <div className="text-xl font-black text-white tracking-wide mb-0.5">10,000X</div>
              <div className="text-[11px] font-bold text-white">EN YÜKSEK ÖDEME</div>
            </div>

            {/* Pink buy-feature box */}
            <button
              onClick={handleBuyFeature}
              disabled={spinning}
              className="w-full max-w-[210px] rounded-xl px-3 py-2 text-center bg-pink-600 hover:bg-pink-700 text-white shadow-lg disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              <div className="text-[11px] font-bold mb-0.5">SATIN ALMA ÖZELLİĞİ</div>
              <div className="text-lg font-black">₺200</div>
            </button>

            {/* Green double-chance box */}
            <button
              onClick={handleToggleDoubleChance}
              className="w-full max-w-[210px] rounded-xl px-3 py-2 text-center bg-green-600 hover:bg-green-700 text-white shadow-lg transition-colors"
            >
              <div className="text-xs font-bold mb-0.5">KAZANMA ŞANSINI İKİYE KATLAMA</div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold">ÖZELLİĞİ</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                    doubleChance ? 'bg-lime-400 text-green-900' : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {doubleChance ? 'AÇIK' : 'KAPALI'}
                </span>
              </div>
            </button>
          </div>

          {/* Main Game Area with desktop side boxes */}
          <div
            className="w-full flex items-start justify-center gap-3"
            style={{ minHeight: 0 }}
          >
            {/* Left side feature column - desktop */}
            <div
              className="hidden md:flex flex-col gap-2 flex-shrink-0"
              style={{ minWidth: '150px', maxWidth: '170px' }}
            >
              {/* Golden 10,000x box */}
              <div
                className="rounded-xl px-3 py-2 text-center"
                style={{
                  background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)',
                  boxShadow:
                    '0 0 18px rgba(255,215,0,0.9), 0 0 36px rgba(255,215,0,0.7), inset 0 2px 8px rgba(255,255,255,0.6)',
                  border: '3px solid rgba(255,255,255,0.9)',
                }}
              >
                <div className="text-2xl font-black text-white tracking-[0.15em] mb-1">
                  10,000X
                </div>
                <div className="text-[11px] font-bold text-white leading-tight">
                  EN YÜKSEK ÖDEME
                </div>
              </div>

              {/* Pink buy-feature box */}
              <button
                onClick={handleBuyFeature}
                disabled={spinning}
                className="w-full rounded-xl px-3 py-2 text-center bg-pink-600 hover:bg-pink-700 text-white shadow-lg disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                <div className="text-xs font-bold mb-0.5">SATIN ALMA ÖZELLİĞİ</div>
                <div className="text-lg font-black">₺200</div>
              </button>

              {/* Green double-chance box */}
              <button
                onClick={handleToggleDoubleChance}
                className="w-full rounded-xl px-3 py-2 text-center bg-green-600 hover:bg-green-700 text-white shadow-lg transition-colors"
              >
                <div className="text-xs font-bold mb-0.5">KAZANMA ŞANSINI İKİYE KATLAMA</div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold">ÖZELLİĞİ</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                      doubleChance ? 'bg-lime-400 text-green-900' : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    {doubleChance ? 'AÇIK' : 'KAPALI'}
                  </span>
                </div>
              </button>
            </div>
            

            {/* Center: game grid */}
            <div
              className="flex-1 flex items-center justify-center relative"
              style={{ minHeight: 0 }}
            >
            <SlotGameEngine
              theme={sweetBonanzaTheme}
              balance={balance}
              betAmount={betAmount}
              onBetAmountChange={setBetAmount}
              spinning={spinning}
              onSpinningChange={setSpinning}
              onSpin={async (bet) => {
                const response = await sweetBonanzaAPI.playGame(bet)
                const gameData = response.data?.data || response.data || {}

                const newBalance =
                  gameData.userBalance ||
                  gameData.newBalance ||
                  gameData.balanceAfter ||
                  balance
                setBalance(newBalance)

                if (user) {
                  const updatedUser = { ...user, balance: newBalance }
                  updateUserData(updatedUser)
                  setUser(updatedUser)
                }

                const win = gameData.winAmount || gameData.actualWin || 0
                setWinAmount(win)

                return {
                  reels: gameData.reels || [],
                  winAmount: win,
                  winningPositions: gameData.winningPositions || [],
                  netChange: gameData.netChange || 0,
                  percentageChange: gameData.percentageChange || 0,
                  userBalance: newBalance,
                }
              }}
              onWin={(amount) => {
                const percentageChange = (amount / balance) * 100
                setSuccess(
                  `🎉 You won ₺${amount.toFixed(2)}! (+${percentageChange.toFixed(2)}%)`,
                )
                setIsWinning(true)
                setError('')

                playSound(winSoundRef, 0.7, !winSoundRef.current, 1000)

                setGameHistory((prev) =>
                  [
                    {
                      id: Date.now(),
                      bet: parseFloat(betAmount),
                      win: amount,
                      result: [],
                      timestamp: new Date(),
                      percentageChange,
                    },
                    ...prev,
                  ].slice(0, 10),
                )

                setTimeout(() => {
                  setIsWinning(false)
                  setSuccess('')
                }, 3000)

                setTimeout(async () => {
                  try {
                    await fetchUserData()
                  } catch {}
                }, 500)
              }}
              onLoss={() => {
                setError('')
                setSuccess('')
                playSound(lossSoundRef, 0.7, !lossSoundRef.current, 300)
              }}
              onError={(msg) => {
                setError(msg)
                setSuccess('')
                setTimeout(() => setError(''), 5000)
              }}
              autoSpin={autoSpin}
              autoSpinCount={autoSpinCount}
              onAutoSpinChange={(value, count) => {
                setAutoSpin(value)
                setAutoSpinCount(count)
              }}
              spinTrigger={spinTrigger}
              renderControls={({
                betAmount: engineBetAmount,
                onBetAmountChange,
                onSpin,
                onAutoSpin,
                spinning: engineSpinning,
                balance: engineBalance,
                autoSpin: engineAutoSpin,
              }) => (
                <>
                  {/* Spin & Autoplay Controls (bottom-right) */}
                  <div
                    className="absolute right-2 bottom-2 flex flex-col items-center gap-2 z-50"
                    style={{ pointerEvents: 'auto' }}
                  >
                    <div className="flex items-center gap-3">
                      {/* Minus */}
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          const current = parseFloat(engineBetAmount) || 10
                          const newBet = Math.max(10, current - 10)
                          onBetAmountChange(newBet.toString())
                          setShowBetPopup(true)
                          setTimeout(() => setShowBetPopup(false), 1500)
                        }}
                        disabled={engineSpinning || parseFloat(engineBetAmount) <= 10}
                        className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gray-900 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-white font-bold text-2xl transition-all duration-150 active:scale-90 hover:ring-2 hover:ring-purple-500"
                        title="Decrease Bet"
                      >
                        −
                      </button>

                      {/* Spin */}
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          const bet = parseFloat(engineBetAmount) || 0
                          if (!engineSpinning && bet > 0 && bet <= engineBalance) {
                            onSpin()
                          } else if (bet <= 0) {
                            setError('Please enter a bet amount')
                          } else if (bet > engineBalance) {
                            setError('Insufficient balance')
                          }
                        }}
                        disabled={
                          engineSpinning ||
                          parseFloat(engineBetAmount) <= 0 ||
                          parseFloat(engineBetAmount) > engineBalance
                        }
                        className="relative w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-purple-700 to-pink-700 hover:from-purple-800 hover:to-pink-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-200 active:scale-90 hover:ring-4 hover:ring-pink-500 spinButtonPop"
                        title="Spin"
                        style={{
                          animation:
                            !engineSpinning &&
                            parseFloat(engineBetAmount) > 0 &&
                            parseFloat(engineBetAmount) <= engineBalance
                              ? 'spinButtonPop 2s ease-in-out infinite'
                              : 'none',
                        }}
                      >
                        <div className="absolute -top-1 -left-1 text-white text-sm">✨</div>
                        <svg
                          className="w-7 h-7 md:w-9 md:h-9 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                      </button>

                      {/* Plus */}
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          const current = parseFloat(engineBetAmount) || 10
                          const maxBet = Math.min(engineBalance, 1000)
                          const newBet = Math.min(maxBet, current + 10)
                          onBetAmountChange(newBet.toString())
                          setShowBetPopup(true)
                          setTimeout(() => setShowBetPopup(false), 1500)
                        }}
                        disabled={
                          engineSpinning ||
                          parseFloat(engineBetAmount) >= engineBalance ||
                          parseFloat(engineBetAmount) >= 1000
                        }
                        className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gray-900 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-white font-bold text-2xl transition-all duration-150 active:scale-90 hover:ring-2 hover:ring-purple-500"
                        title="Increase Bet"
                      >
                        +
                      </button>
                    </div>

                    {/* Autoplay */}
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        onAutoSpin(5)
                      }}
                      disabled={
                        engineSpinning ||
                        parseFloat(engineBetAmount) <= 0 ||
                        parseFloat(engineBetAmount) > engineBalance ||
                        engineAutoSpin
                      }
                      className="px-5 py-2.5 bg-purple-900 hover:bg-purple-800 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-all duration-150 active:scale-95 hover:ring-2 hover:ring-purple-500 flex items-center gap-2"
                      title="Autoplay 5 Spins"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      AUTOPLAY (5)
                    </button>
                  </div>

                  {/* Mute + Info (bottom-left) */}
                  <div
                    className="absolute left-2 -bottom-16 flex flex-row gap-1.5 z-50"
                    style={{ pointerEvents: 'auto' }}
                  >
                    {/* Mute */}
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        const newSoundState = !soundEnabled
                        setSoundEnabled(newSoundState)
                        setMusicEnabled(newSoundState)
                        if (bgMusicRef.current) {
                          if (newSoundState) {
                            bgMusicRef.current.play().catch(() => {})
                          } else {
                            bgMusicRef.current.pause()
                          }
                        }
                      }}
                      className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-all cursor-pointer active:scale-95"
                      title={soundEnabled && musicEnabled ? 'Mute' : 'Unmute'}
                      style={{ minWidth: '44px', minHeight: '44px' }}
                    >
                      {soundEnabled && musicEnabled ? (
                        <svg
                          className="w-4 h-4 md:w-5 md:h-5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-4 h-4 md:w-5 md:h-5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                          />
                        </svg>
                      )}
                    </button>

                    {/* Info */}
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setShowGameRules(true)
                      }}
                      className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-all cursor-pointer active:scale-95"
                      title="Game Rules"
                      style={{ minWidth: '44px', minHeight: '44px' }}
                    >
                      <svg
                        className="w-4 h-4 md:w-5 md:h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </button>
                  </div>
                </>
              )}
              
            />
          </div>

          {/* Win / Error Messages */}
          {(error || success) && (
            <div
              className="flex items-center justify-center w-full mt-2"
              style={{ margin: 0, padding: 0 }}
            >
              {error && (
                <div
                  className="bg-red-600/90 text-white px-4 py-2 rounded-lg shadow-lg"
                  style={{ margin: 0 }}
                >
                  <p className="text-sm font-bold">{error}</p>
                </div>
              )}
              {success && (
                <div
                  className="bg-green-600/90 text-white px-4 py-2 rounded-lg shadow-lg ml-2"
                  style={{ margin: 0 }}
                >
                  <p className="text-sm font-bold">{success}</p>
                </div>
              )}
            </div>
          )}
        </div>
        </div>
      </main>
     

      {/* Bet Amount Popup */}
      {showBetPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-2xl font-bold text-xl animate-bounce">
            BET: ₺{betAmount}
          </div>
        </div>
      )}

      {/* Game Rules Modal */}
      {showGameRules && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-2 sm:p-4"
          onClick={() => setShowGameRules(false)}
        >
          {/* ... keep your existing rules modal content here (already valid JSX) ... */}
        </div>
      )}

      {/* Close Button */}
      {onClose && (
        <button
          onClick={onClose}
          className="fixed top-4 right-4 z-50 w-12 h-12 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center shadow-lg transition-all"
          title="Close Game"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}

export default SweetBonanzaPage
