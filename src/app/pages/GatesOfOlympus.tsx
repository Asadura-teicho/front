// import { useState, useEffect, useRef } from 'react'
// import { authAPI } from '../../lib/api/auth.api'
// import sweetBonanzaAPI from '../../lib/api/sweetBonanza.api'
// import { updateUserData } from '../../lib/utils/auth'
// import SlotGameEngine, { SlotGameTheme } from '../components/SlotGameEngine'

// interface GatesOfOlympusPageProps {
//   onClose?: () => void
//   onSwitchGame?: () => void
// }

// function GatesOfOlympusPage({ onClose, onSwitchGame }: GatesOfOlympusPageProps = {}) {
//   console.log('🎮 GatesOfOlympusPage component is mounting/rendering')
  
//   const [user, setUser] = useState<any>(null)
//   const [balance, setBalance] = useState(0)
//   const [loading, setLoading] = useState(true)
//   const [gameLoading, setGameLoading] = useState(true)
//   const [loadingProgress, setLoadingProgress] = useState(0)
//   const [logoLoaded, setLogoLoaded] = useState(false)
//   const [bgImageLoaded, setBgImageLoaded] = useState(false)
//   const [error, setError] = useState('')
//   const [success, setSuccess] = useState('')
//   const [betAmount, setBetAmount] = useState('10')
//   const [spinning, setSpinning] = useState(false)
//   const [selectedOutcome, setSelectedOutcome] = useState(null) // 'win' or 'loss'
//   const [gameState, setGameState] = useState('betting') // 'betting', 'spinning', 'result'
//   const [timer, setTimer] = useState(10)
//   const [spinTrigger, setSpinTrigger] = useState(0) // Trigger for external spin (Buy Free Spins, etc.)

//   // Theme configuration for Gates of Olympus
//   const gatesOfOlympusTheme: SlotGameTheme = {
//     themeName: 'Gates of Olympus',
//     backgroundImage: '/gates-of-olympus-bg.jpg',
//     symbolImages: {
//       '⚡': '/icons/olympus-lightning.png',     // Lightning bolt (weight: 30 - most common)
//       '🔥': '/icons/olympus-fire.png',         // Fire (weight: 25)
//       '🌊': '/icons/olympus-water.png',        // Water (weight: 20)
//       '🌪️': '/icons/olympus-wind.png',        // Wind (weight: 15)
//       '⚔️': '/icons/olympus-sword.png',       // Sword (weight: 12)
//       '🛡️': '/icons/olympus-shield.png',      // Shield (weight: 8)
//       '👑': '/icons/olympus-crown.png',       // Crown (weight: 5)
//       '⭐': '/icons/olympus-star.png',        // Star/Scatter (weight: 3)
//       '💎': '/icons/olympus-gem.png',        // Gem/Bonus (weight: 2 - least common)
//     },
//     symbolWeights: {
//       '⚡': 30, '🔥': 25, '🌊': 20, '🌪️': 15, '⚔️': 12,
//       '🛡️': 8, '👑': 5, '⭐': 3, '💎': 2
//     },
//     defaultSymbol: '⚡',
//     gridColumns: 6,
//     gridRows: 5,
//     gridWidth: 560,
//     gridHeight: 466.67
//   }

//   // Original emoji symbols for reference
//   const symbolKeys = ['⚡', '🔥', '🌊', '🌪️', '⚔️', '🛡️', '👑', '⭐', '💎']

//   // Game state - winAmount and gameHistory kept for display purposes
//   const [winAmount, setWinAmount] = useState(0)
//   const [gameHistory, setGameHistory] = useState<any[]>([])
//   const [autoSpin, setAutoSpin] = useState(false)
//   const [autoSpinCount, setAutoSpinCount] = useState(0)
//   const [isWinning, setIsWinning] = useState(false)
//   const bgMusicRef = useRef<HTMLAudioElement | null>(null)
//   const winSoundRef = useRef<HTMLAudioElement | null>(null)
//   const lossSoundRef = useRef<HTMLAudioElement | null>(null)
//   const spinSoundRef = useRef<HTMLAudioElement | null>(null)
//   const [musicEnabled, setMusicEnabled] = useState(true)
//   const [soundEnabled, setSoundEnabled] = useState(true)
//   const [showGameRules, setShowGameRules] = useState(false)
//   const [doNotShowAgain, setDoNotShowAgain] = useState(false)
//   const [showGamesSidebar, setShowGamesSidebar] = useState(false)
//   const [gamesSearchQuery, setGamesSearchQuery] = useState('')
//   const [gamesProvider, setGamesProvider] = useState('all')
//   const [showBetPopup, setShowBetPopup] = useState(false)
//   const [thunderCount, setThunderCount] = useState(5)

//   const quickBetAmounts = ['10', '50', '100', '500', '1000']
  
//   // Real slot games from the platform
//   const [otherGames] = useState([
//     { id: 'dice-roll', name: 'Dice Roll', provider: 'Garbet Games', image: 'https://media.istockphoto.com/id/525032572/photo/gambling-craps-game.jpg?s=1024x1024&w=is&k=20&c=EIaZAJCR2qvuh2ilrT4b4j4DTreeMbOWvWi7URBcQUA=' },
//     { id: 2, name: 'Sweet Bonanza', provider: 'Pragmatic Play', image: 'https://media.pinkcasino.co.uk/images/games/sweet-bonanza-super-scatter/sweet-bonanza-super-scatter-tile-auth.jpg' },
//     { id: 3, name: 'Gates of Olympus', provider: 'Pragmatic Play', image: 'https://media.pragmaticplay.net/marketing-tools/pragmaticplay/gates-of-olympus-1000/gates-of-olympus-1000.jpg' },
//     { id: 4, name: 'Sugar Rush', provider: 'Pragmatic Play', image: 'https://media.pragmaticplay.net/marketing-tools/pragmaticplay/sugar-rush/sugar-rush.jpg' },
//     { id: 5, name: 'Big Bass Bonanza', provider: 'Pragmatic Play', image: 'https://media.pragmaticplay.net/marketing-tools/pragmaticplay/big-bass-bonanza/big-bass-bonanza.jpg' },
//     { id: 6, name: 'Starlight Princess', provider: 'Pragmatic Play', image: 'https://media.pragmaticplay.net/marketing-tools/pragmaticplay/starlight-princess/starlight-princess.jpg' },
//     { id: 7, name: 'The Dog House', provider: 'Pragmatic Play', image: 'https://media.pragmaticplay.net/marketing-tools/pragmaticplay/the-dog-house/the-dog-house.jpg' },
//     { id: 8, name: 'Wild West Gold', provider: 'Pragmatic Play', image: 'https://media.pragmaticplay.net/marketing-tools/pragmaticplay/wild-west-gold/wild-west-gold.jpg' },
//   ])

//   // Helper function to create beep sound using Web Audio API
//   const createBeepSound = (frequency, duration, type = 'sine') => {
//     if (!soundEnabled || typeof window === 'undefined' || !window.AudioContext && !(window as any).webkitAudioContext) {
//       return
//     }
    
//     try {
//       const AudioContext = window.AudioContext || (window as any).webkitAudioContext
//       const audioContext = new AudioContext()
//       const oscillator = audioContext.createOscillator()
//       const gainNode = audioContext.createGain()
      
//       oscillator.connect(gainNode)
//       gainNode.connect(audioContext.destination)
      
//       oscillator.frequency.value = frequency
//       oscillator.type = type
      
//       gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
//       gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration)
      
//       oscillator.start(audioContext.currentTime)
//       oscillator.stop(audioContext.currentTime + duration)
//     } catch (error) {
//       console.error('Error creating beep sound:', error)
//     }
//   }

//   // Helper function to play sound
//   const playSound = (soundRef, volume = 0.7, useBeep = false, beepFreq = 800) => {
//     if (!soundEnabled) return
    
//     if (useBeep) {
//       createBeepSound(beepFreq, 0.3)
//       return
//     }
    
//     if (!soundRef?.current) return
    
//     try {
//       soundRef.current.currentTime = 0
//       soundRef.current.volume = volume
      
//       const playPromise = soundRef.current.play()
//       if (playPromise !== undefined) {
//         playPromise.catch(() => {
//           createBeepSound(beepFreq, 0.3)
//         })
//       }
//     } catch (error) {
//       console.error('Error playing sound:', error)
//       createBeepSound(beepFreq, 0.3)
//     }
//   }

//   // Initialize audio
//   useEffect(() => {
//     try {
//       bgMusicRef.current = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3')
//       bgMusicRef.current.loop = true
//       bgMusicRef.current.volume = 0.3
//       bgMusicRef.current.preload = 'auto'
      
//       try {
//         winSoundRef.current = new Audio('/gates-of-olympus-win.mp3')
//         winSoundRef.current.volume = 0.7
//         winSoundRef.current.preload = 'none'
//         winSoundRef.current.onerror = () => {
//           winSoundRef.current = null
//         }
//       } catch (e) {
//         winSoundRef.current = null
//       }
      
//       try {
//         lossSoundRef.current = new Audio('/gates-of-olympus-loss.mp3')
//         lossSoundRef.current.volume = 0.7
//         lossSoundRef.current.preload = 'none'
//         lossSoundRef.current.onerror = () => {
//           lossSoundRef.current = null
//         }
//       } catch (e) {
//         lossSoundRef.current = null
//       }
      
//       try {
//         spinSoundRef.current = new Audio('/gates-of-olympus-spin.mp3')
//         spinSoundRef.current.volume = 0.5
//         spinSoundRef.current.preload = 'none'
//         spinSoundRef.current.onerror = () => {
//           spinSoundRef.current = null
//         }
//       } catch (e) {
//         spinSoundRef.current = null
//       }

//       if (musicEnabled && bgMusicRef.current) {
//         bgMusicRef.current.play().catch(() => {})
//       }
//     } catch (error) {
//       console.error('Error initializing audio:', error)
//     }

//     return () => {
//       if (bgMusicRef.current) {
//         bgMusicRef.current.pause()
//         bgMusicRef.current = null
//       }
//       if (winSoundRef.current) {
//         winSoundRef.current.pause()
//         winSoundRef.current = null
//       }
//       if (lossSoundRef.current) {
//         lossSoundRef.current.pause()
//         lossSoundRef.current = null
//       }
//       if (spinSoundRef.current) {
//         spinSoundRef.current.pause()
//         spinSoundRef.current = null
//       }
//     }
//   }, [])

//   // Handle music toggle
//   useEffect(() => {
//     if (bgMusicRef.current) {
//       if (musicEnabled) {
//         bgMusicRef.current.play().catch(() => {})
//       } else {
//         bgMusicRef.current.pause()
//       }
//     }
//   }, [musicEnabled])

//   // Preload background images
//   useEffect(() => {
//     const bgImage = new Image()
//     bgImage.onload = () => setBgImageLoaded(true)
//     bgImage.onerror = () => {
//       console.warn('Background image failed to load, continuing anyway')
//       setBgImageLoaded(true)
//     }
//     bgImage.src = gatesOfOlympusTheme.backgroundImage || '/gates-of-olympus-bg.jpg'
    
//     const timeout = setTimeout(() => {
//       setBgImageLoaded(true)
//     }, 3000)
    
//     return () => clearTimeout(timeout)
//   }, [])

//   // Loading screen progress animation
//   useEffect(() => {
//     setLoading(false)
    
//     const imageTimeout = setTimeout(() => {
//       setLogoLoaded(true)
//       setBgImageLoaded(true)
//     }, 1000)

//     const safetyTimeout = setTimeout(() => {
//       setGameLoading(false)
//       setLoading(false)
//       setLogoLoaded(true)
//       setBgImageLoaded(true)
//       setLoadingProgress(100)
//     }, 2000)
    
//     return () => {
//       clearTimeout(imageTimeout)
//       clearTimeout(safetyTimeout)
//     }
//   }, [])

//   // Progress bar animation
//   useEffect(() => {
//     if (gameLoading && logoLoaded && bgImageLoaded && !loading && loadingProgress < 100) {
//       const interval = setInterval(() => {
//         setLoadingProgress(prev => {
//           if (prev >= 100) {
//             clearInterval(interval)
//             setTimeout(() => {
//               setGameLoading(false)
//             }, 200)
//             return 100
//           }
//           return prev + 3
//         })
//       }, 50)
//       return () => clearInterval(interval)
//     }
//   }, [gameLoading, logoLoaded, bgImageLoaded, loading, loadingProgress])

//   useEffect(() => {
//     try {
//       const storedUser = JSON.parse(localStorage.getItem('user') || '{}')
//       if (storedUser?.balance !== undefined && storedUser.balance !== null) {
//         const initialBalance = parseFloat(storedUser.balance) || 0
//         setBalance(initialBalance)
//         setUser(storedUser)
//         setLoading(false)
//         if (import.meta.env.DEV) {
//           console.log('Gates of Olympus - Initial balance from localStorage:', initialBalance)
//         }
//       } else {
//         setLoading(false)
//       }
//     } catch (e) {
//       setLoading(false)
//     }
    
//     fetchUserData()
    
//     const handleUserDataUpdate = (event) => {
//       if (event.detail?.balance !== undefined && event.detail.balance !== null) {
//         const newBalance = parseFloat(event.detail.balance) || 0
//         setBalance(newBalance)
//         setUser(event.detail)
//         if (import.meta.env.DEV) {
//           console.log('Gates of Olympus - Balance updated from event:', newBalance)
//         }
//       }
//     }
    
//     window.addEventListener('userDataUpdated', handleUserDataUpdate)
    
//     const balanceInterval = setInterval(() => {
//       if (!loading) {
//         fetchUserData()
//       }
//     }, 10000)
    
//     return () => {
//       window.removeEventListener('userDataUpdated', handleUserDataUpdate)
//       clearInterval(balanceInterval)
//     }
//   }, [])

//   const fetchUserData = async () => {
//     try {
//       setLoading(false)
      
//       const token = localStorage.getItem('token')
//       if (!token) {
//         try {
//           const storedUser = JSON.parse(localStorage.getItem('user') || '{}')
//           if (storedUser?.balance !== undefined) {
//             setBalance(storedUser.balance)
//             setUser(storedUser)
//             return
//           }
//         } catch (e) {
//           // Continue to try API call
//         }
//         return
//       }

//       const response = await authAPI.me()
      
//       if (import.meta.env.DEV) {
//         console.log('Gates of Olympus - Full API response:', response)
//         console.log('Gates of Olympus - Response data:', response?.data)
//       }
      
//       const userData = response?.data || response || null
      
//       if (userData) {
//         setUser(userData)
//         const userBalance = userData.balance !== undefined ? userData.balance : 
//                           (userData.user?.balance !== undefined ? userData.user.balance : 0)
        
//         setBalance(userBalance)
//         updateUserData(userData)
        
//         if (import.meta.env.DEV) {
//           console.log('Gates of Olympus - User data:', userData)
//           console.log('Gates of Olympus - User balance set to:', userBalance)
//         }
//       } else {
//         if (import.meta.env.DEV) {
//           console.warn('Gates of Olympus - No user data received from API')
//         }
//         try {
//           const storedUser = JSON.parse(localStorage.getItem('user') || '{}')
//           if (storedUser?.balance !== undefined) {
//             setBalance(storedUser.balance)
//             setUser(storedUser)
//           } else {
//             setError('Unable to load user data. Please try again.')
//           }
//         } catch (e) {
//           setError('Unable to load user data. Please try again.')
//         }
//       }
//     } catch (err: any) {
//       console.error('Gates of Olympus - API Error:', err)
//       if (import.meta.env.DEV) {
//         console.error('Gates of Olympus - Error fetching user data:', err)
//       }
      
//       if (err.response?.status === 401) {
//         setError('Session expired. Please log in again.')
//         localStorage.removeItem('token')
//         localStorage.removeItem('user')
//         setTimeout(() => {
//           if (onClose) {
//             onClose()
//           } else {
//             window.location.href = '/'
//           }
//         }, 2000)
//       }
      
//       try {
//         const storedUser = JSON.parse(localStorage.getItem('user') || '{}')
//         if (storedUser?.balance !== undefined) {
//           setBalance(storedUser.balance)
//           setUser(storedUser)
//         } else {
//           setError('Unable to load user data. Please try again.')
//         }
//       } catch (e) {
//         // Ignore localStorage errors
//       }
//       setLoading(false)
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Quick bet handler
//   const handleQuickBet = (amount) => {
//     setBetAmount(amount)
//   }

//   // Reset thunder count when autoplay finishes
//   useEffect(() => {
//     if (autoSpinCount === 0 && autoSpin) {
//       setThunderCount(5)
//     }
//   }, [autoSpinCount, autoSpin])

//   // Loading Screen with Pragmatic Play Logo
//   if (loading || gameLoading) {
//     return (
//       <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
//           <div className="flex flex-col items-center justify-center">
//             <div className="mb-8 text-center">
//               <img 
//                 src="/pragmaticplay.jpeg" 
//                 alt="Pragmatic Play" 
//                 className="w-48 md:w-64 h-auto mx-auto"
//                 style={{ maxWidth: '300px' }}
//                 onLoad={() => setLogoLoaded(true)}
//                 onError={() => setLogoLoaded(true)}
//               />
//             </div>
            
//             {logoLoaded && bgImageLoaded && !loading && (
//               <div className="w-64 md:w-80 h-1 bg-gray-700 rounded-full overflow-hidden">
//                 <div 
//                   className="h-full bg-orange-500 transition-all duration-300 ease-out"
//                   style={{ 
//                     width: `${loadingProgress}%`,
//                     boxShadow: '0 0 10px rgba(255, 165, 0, 0.8)'
//                   }}
//                 ></div>
//               </div>
//             )}
//             {loading && (
//               <div className="w-64 md:w-80 h-1 bg-gray-700 rounded-full overflow-hidden">
//                 <div 
//                   className="h-full bg-orange-500 transition-all duration-300 ease-out animate-pulse"
//                   style={{ 
//                     width: '30%',
//                     boxShadow: '0 0 10px rgba(255, 165, 0, 0.8)'
//                   }}
//                 ></div>
//               </div>
//             )}
//           </div>
//         </div>
//     )
//   }

//   return (
//     <div className="fixed inset-0 z-[9999] bg-black relative flex w-full flex-col" style={{ 
//         width: '100%',
//         minHeight: '100vh',
//         overflow: 'visible'
//       }}>
//         {/* Background Image - Gates of Olympus BG */}
//         <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
//           <div 
//             className="absolute inset-0 bg-cover bg-center bg-no-repeat"
//             style={{ 
//               backgroundImage: `url(${gatesOfOlympusTheme.backgroundImage || '/gates-of-olympus-bg.jpg'})`,
//               backgroundSize: 'cover',
//               backgroundPosition: 'center',
//               backgroundRepeat: 'no-repeat'
//             }}
//           ></div>
//         </div>
        
//         <main className="relative flex flex-row items-start justify-center z-10 w-full main-content" style={{ padding: '0.2rem', overflowY: 'auto', height: '100vh', maxHeight: '100vh', position: 'relative', width: '100%' }}>
//           {/* Wrapped Container - Title, Golden Banner, Grid, Sidebar, Controls with Game BG */}
//           <div className="w-full relative z-20 flex flex-row gap-3 hide-scrollbar" style={{
//             backgroundImage: `url(${gatesOfOlympusTheme.backgroundImage || '/gates-of-olympus-bg.jpg'})`,
//             backgroundSize: 'cover',
//             backgroundPosition: 'center',
//             backgroundRepeat: 'no-repeat',
//             borderRadius: '12px',
//             padding: '0.75rem',
//             margin: '0 auto',
//             maxWidth: '100%',
//             width: '100%',
//             height: '100%',
//             maxHeight: '100%',
//             position: 'relative',
//             overflow: 'auto',
//             boxSizing: 'border-box'
//           }}>
//             {/* Main Game Content Area */}
//             <div className="flex-1 flex flex-col items-center relative h-full min-h-0 hide-scrollbar" style={{ minWidth: 0, overflowY: 'auto', maxWidth: '100%', boxSizing: 'border-box' }}>
//               {/* Balance Display */}
//               <div className="w-full text-center relative z-20 mb-1 flex-shrink-0">
//                 <div className="bg-green-600/90 text-white px-4 py-2 rounded-lg shadow-lg inline-block">
//                   <p className="text-lg md:text-xl font-bold">
//                     Balance: ₺{balance.toFixed(2)}
//                   </p>
//                 </div>
//               </div>

//               {/* Game Title - GATES OF OLYMPUS Logo Image */}
//               <div className="w-full text-center relative z-20 mb-1 mt-1 flex-shrink-0 flex items-center justify-center">
//                 <img
//                   src="/icons/gates-of-olympus.PNG"
//                   alt="Gates of Olympus"
//                   className="mx-auto object-contain"
//                   style={{
//                     height: '70px',
//                     width: 'auto',
//                     maxWidth: '95%',
//                     minHeight: '140px',
//                     filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.4)) drop-shadow(0 0 20px rgba(255,215,0,0.3))',
//                     animation: 'titleBlink 2s ease-in-out infinite'
//                   }}
//                   onError={(e) => {
//                     const target = e.target as HTMLImageElement;
//                     target.style.display = 'none';
//                     const fallback = document.createElement('h1');
//                     fallback.textContent = 'GATES OF OLYMPUS';
//                     fallback.className = 'text-xl md:text-3xl lg:text-4xl xl:text-5xl font-black mb-0 leading-tight relative z-10 titleBlink';
//                     fallback.style.cssText = `
//                       font-family: Arial Black, sans-serif;
//                       font-weight: 900;
//                       background: linear-gradient(135deg, #4169E1 0%, #FFD700 25%, #FFA500 50%, #FFD700 75%, #4169E1 100%);
//                       background-size: 200% 200%;
//                       -webkit-background-clip: text;
//                       -webkit-text-fill-color: transparent;
//                       background-clip: text;
//                       animation: gradientShift 3s ease infinite, titleBlink 2s ease-in-out infinite;
//                       letter-spacing: 2px;
//                       line-height: 1.1;
//                       text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
//                     `;
//                     target.parentNode?.appendChild(fallback);
//                   }}
//                 />
//               </div>
              

//               {/* Mobile Golden Banner - Show above grid on small/medium screens */}
//               <div className="lg:hidden w-full mb-2 flex justify-center flex-shrink-0">
//                 <div className="relative rounded-xl p-2 text-center glowBox " style={{
//                   background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)',
//                   border: '3px solid rgba(255,255,255,0.8)',
//                   boxShadow: '0 0 20px rgba(255,215,0,0.8), 0 0 40px rgba(255,215,0,0.6), inset 0 2px 8px rgba(255,255,255,0.5)',
//                   animation: 'glowPulse 2s ease-in-out infinite',
//                   maxWidth: '250px'
//                 }}>
//                   <div className="text-2xl font-black text-white mb-1" style={{
//                     textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
//                     letterSpacing: '2px'
//                   }}>
//                     10,000X
//                   </div>
//                   <div className="text-xs font-bold text-white" style={{
//                     textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
//                   }}>
//                     BAHİS KADAR KAZANIN
//                   </div>
//                 </div>
//               </div>

//               {/* Game Area - Side-by-side Layout with Golden Banner */}
//               <div className=" w-full  z-20 flex flex-row items-start justify-center  flex-1 min-h-0" style={{ minHeight: 0, maxWidth: '100%', boxSizing: 'border-box' }}>
//                 {/* Left Side - Golden Banner and Green Boxes - Desktop only */}
//                 <div className="relative hidden lg:flex flex-col items-center gap-2 flex-shrink-0" style={{ minWidth: '160px', maxWidth: '180px', marginTop: '1rem', marginLeft: '1rem', marginRight: '-5rem' }}>
//                   {/* 10000x Banner - Golden Box, Glowing */}
//                   <div className="relative rounded-xl p-2 md:p-2.5 text-center glowBox flex-shrink-0" style={{
//                     background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)',
//                     border: '3px solid rgba(255,255,255,0.8)',
//                     boxShadow: '0 0 20px rgba(255,215,0,0.8), 0 0 40px rgba(255,215,0,0.6), inset 0 2px 8px rgba(255,255,255,0.5)',
//                     animation: 'glowPulse 2s ease-in-out infinite'
//                   }}>
//                     <div className="text-xl md:text-2xl lg:text-3xl font-black text-white mb-1" style={{
//                       textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
//                       letterSpacing: '2px'
//                     }}>
//                       10,000X
//                     </div>
//                     <div className="text-xs font-bold text-white" style={{
//                       textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
//                     }}>
//                       BAHİS KADAR
//                     </div>
//                     <div className="text-xs font-bold text-white mt-0.5" style={{
//                       textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
//                     }}>
//                       KAZANIN
//                     </div>
//                   </div>

//                   {/* Green Divs - Wrapped with Neon Glow */}
//                   <div className="w-full p-1.5 rounded-xl flex-shrink-0" style={{
//                     background: 'rgba(255, 215, 0, 0.1)',
//                     border: '2px solid rgba(255, 215, 0, 0.5)',
//                     boxShadow: '0 0 15px rgba(255, 215, 0, 0.4), inset 0 0 10px rgba(255, 215, 0, 0.1)',
//                     animation: 'neonGlow 2s ease-in-out infinite'
//                   }}>
//                     <div className="flex flex-col gap-1.5 items-center justify-start w-full">
//                       <button
//                         onClick={async (e) => {
//                           e.preventDefault()
//                           e.stopPropagation()
//                           const freeSpinsCost = 2000
//                           if (balance < freeSpinsCost) {
//                             setError(`Insufficient balance. Need ₺${freeSpinsCost.toFixed(2)} for Free Spins`)
//                             return
//                           }
//                           if (spinning) {
//                             setError('Please wait for current spin to finish')
//                             return
//                           }
//                           setSuccess(`Free Spins purchased! Starting game...`)
//                           setTimeout(() => {
//                             setSpinTrigger(prev => prev + 1)
//                           }, 500)
//                         }}
//                         disabled={spinning || balance < 2000}
//                         className="w-full bg-green-600 rounded-lg p-1.5 text-white text-center cursor-pointer hover:bg-green-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed active:scale-95" style={{
//                           boxShadow: '0 0 10px rgba(34, 197, 94, 0.5)'
//                         }}
//                       >
//                         <div className="text-xs font-bold mb-0.5">BUY FREE SPINS</div>
//                         <div className="text-xs">₺2,000.00</div>
//                       </button>
//                       <button
//                         onClick={async (e) => {
//                           e.preventDefault()
//                           e.stopPropagation()
//                           const superFreeSpinsCost = 10000
//                           if (balance < superFreeSpinsCost) {
//                             setError(`Insufficient balance. Need ₺${superFreeSpinsCost.toFixed(2)} for Super Free Spins`)
//                             return
//                           }
//                           if (spinning) {
//                             setError('Please wait for current spin to finish')
//                             return
//                           }
//                           setSuccess(`Super Free Spins purchased! Starting game...`)
//                           setTimeout(() => {
//                             setSpinTrigger(prev => prev + 1)
//                           }, 500)
//                         }}
//                         disabled={spinning || balance < 10000}
//                         className="w-full bg-orange-600 rounded-lg p-1.5 text-white text-center cursor-pointer hover:bg-orange-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed active:scale-95" style={{
//                           boxShadow: '0 0 10px rgba(234, 88, 12, 0.5)'
//                         }}
//                       >
//                         <div className="text-xs font-bold mb-0.5">BUY SUPER FREE SPINS</div>
//                         <div className="text-xs">₺10,000.00</div>
//                       </button>
//                       <div className="w-full bg-green-500 rounded-lg p-1.5 text-white text-center font-bold text-sm shadow-lg" style={{
//                         boxShadow: '0 0 10px rgba(34, 197, 94, 0.5)'
//                       }}>
//                         BET ₺{betAmount}
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Center - Game Grid and Sidebar Toggle */}
//                 <div className="flex-1 flex flex-col items-center justify-center min-h-0 relative" style={{ minWidth: 0, position: 'relative', overflow: 'visible', zIndex: 30, pointerEvents: 'auto', width: '100%' }}>
//                   {/* Sidebar Toggle Button */}
//                   <button
//                     onClick={(e) => {
//                       e.preventDefault()
//                       e.stopPropagation()
//                       console.log('Sidebar toggle clicked')
//                       setShowGamesSidebar(!showGamesSidebar)
//                     }}
//                     className="absolute right-2 top-1/2 transform -translate-y-1/2 z-50 w-10 h-10 md:w-11 md:h-11 bg-purple-600 text-white rounded-full flex items-center justify-center hover:bg-purple-700 transition-all shadow-xl border-2 border-white/30 hover:scale-110 cursor-pointer"
//                     style={{ 
//                       right: showGamesSidebar ? 'calc(100% + 10px)' : '4px',
//                       transition: 'right 0.3s ease-in-out',
//                       pointerEvents: 'auto'
//                     }}
//                     title={showGamesSidebar ? 'Hide Games' : 'Show Games'}
//                   >
//                     <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showGamesSidebar ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} />
//                     </svg>
//                   </button>

//                   {/* SlotGameEngine - Handles all game logic, animations, and grid rendering */}
//                   <SlotGameEngine
//                     theme={gatesOfOlympusTheme}
//                     balance={balance}
//                     betAmount={betAmount}
//                     onBetAmountChange={setBetAmount}
//                     spinning={spinning}
//                     onSpinningChange={setSpinning}
//                     onSpin={async (bet) => {
//                       const response = await sweetBonanzaAPI.playGame(bet)
//                       const gameData = response.data?.data || response.data || {}

//                       const newBalance =
//                         gameData.userBalance || gameData.newBalance || gameData.balanceAfter || balance
//                       setBalance(newBalance)

//                       if (user) {
//                         const updatedUser = { ...user, balance: newBalance }
//                         updateUserData(updatedUser)
//                         setUser(updatedUser)
//                       }

//                       const win = gameData.winAmount || gameData.actualWin || 0
//                       setWinAmount(win)

//                       return {
//                         reels: gameData.reels || [],
//                         winAmount: win,
//                         winningPositions: gameData.winningPositions || [],
//                         netChange: gameData.netChange || 0,
//                         percentageChange: gameData.percentageChange || 0,
//                         userBalance: newBalance,
//                       }
//                     }}
//                     onWin={(winAmount) => {
//                       const percentageChange = (winAmount / balance) * 100
//                       setSuccess(`🎉 You won ₺${winAmount.toFixed(2)}! (+${percentageChange.toFixed(2)}%)`)
//                       setIsWinning(true)
//                       setError('')

//                       playSound(winSoundRef, 0.7, !winSoundRef.current, 1000)

//                       setGameHistory((prev) => [
//                         {
//                           id: Date.now(),
//                           bet: parseFloat(betAmount),
//                           win: winAmount,
//                           result: [],
//                           timestamp: new Date(),
//                           percentageChange,
//                         },
//                         ...prev,
//                       ].slice(0, 10))

//                       setTimeout(() => {
//                         setIsWinning(false)
//                         setSuccess('')
//                       }, 3000)

//                       setTimeout(async () => {
//                         try {
//                           await fetchUserData()
//                         } catch (fetchErr) {
//                           if (import.meta.env.DEV) {
//                             console.warn('Error refreshing user data:', fetchErr)
//                           }
//                         }
//                       }, 500)
//                     }}
//                     onLoss={() => {
//                       setError('')
//                       setSuccess('')
//                       playSound(lossSoundRef, 0.7, !lossSoundRef.current, 300)
//                     }}
//                     onError={(errorMessage) => {
//                       setError(errorMessage)
//                       setSuccess('')
//                       setTimeout(() => setError(''), 5000)
//                     }}
//                     autoSpin={autoSpin}
//                     autoSpinCount={autoSpinCount}
//                     onAutoSpinChange={(autoSpin, count) => {
//                       setAutoSpin(autoSpin)
//                       setAutoSpinCount(count)
//                     }}
//                     spinTrigger={spinTrigger}
//                     renderControls={({
//                       betAmount: engineBetAmount,
//                       onBetAmountChange,
//                       onSpin,
//                       onAutoSpin,
//                       spinning: engineSpinning,
//                       balance: engineBalance,
//                       autoSpin: engineAutoSpin,
//                       autoSpinCount: engineAutoSpinCount,
//                     }) => (
//                       <>
//                         {/* Spin Controls - Positioned at bottom-right corner with slight overlap */}
//                         <div
//                           className="absolute right-0 bottom-0 flex flex-col items-center gap-2 z-50"
//                           style={{ pointerEvents: 'auto', transform: 'translate(12px, 12px)' }}
//                         >
//                           <div className="flex items-center gap-3">
//                             {/* Minus Button */}
//                             <button
//                               onClick={(e) => {
//                                 e.preventDefault()
//                                 e.stopPropagation()
//                                 const current = parseFloat(engineBetAmount) || 10
//                                 const newBet = Math.max(10, current - 10)
//                                 onBetAmountChange(newBet.toString())
//                                 setShowBetPopup(true)
//                                 setTimeout(() => setShowBetPopup(false), 1500)
//                               }}
//                               disabled={engineSpinning || parseFloat(engineBetAmount) <= 10}
//                               className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gray-900 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-white font-bold text-2xl transition-all duration-150 active:scale-90 hover:ring-2 hover:ring-purple-500"
//                               title="Decrease Bet"
//                             >
//                               −
//                             </button>

//                             {/* SPIN BUTTON (BIGGEST) */}
//                             <button
//                               onClick={(e) => {
//                                 e.preventDefault()
//                                 e.stopPropagation()
//                                 const bet = parseFloat(engineBetAmount)
//                                 if (!engineSpinning && bet > 0 && bet <= engineBalance) {
//                                   onSpin()
//                                 } else if (bet <= 0) {
//                                   setError('Please enter a bet amount')
//                                 } else if (bet > engineBalance) {
//                                   setError('Insufficient balance')
//                                 }
//                               }}
//                               disabled={
//                                 engineSpinning ||
//                                 parseFloat(engineBetAmount) <= 0 ||
//                                 parseFloat(engineBetAmount) > engineBalance
//                               }
//                               className="relative w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-purple-700 to-pink-700 hover:from-purple-800 hover:to-pink-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-200 active:scale-90 hover:ring-4 hover:ring-pink-500 spinButtonPop"
//                               title="Spin"
//                               style={{
//                                 animation:
//                                   !engineSpinning &&
//                                   parseFloat(engineBetAmount) > 0 &&
//                                   parseFloat(engineBetAmount) <= engineBalance
//                                     ? 'spinButtonPop 2s ease-in-out infinite'
//                                     : 'none',
//                               }}
//                             >
//                               <div className="absolute -top-1 -left-1 text-white text-sm">✨</div>
//                               <svg
//                                 className="w-7 h-7 md:w-9 md:h-9 text-white"
//                                 fill="none"
//                                 stroke="currentColor"
//                                 viewBox="0 0 24 24"
//                               >
//                                 <path
//                                   strokeLinecap="round"
//                                   strokeLinejoin="round"
//                                   strokeWidth={2.5}
//                                   d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
//                                 />
//                               </svg>
//                             </button>

//                             {/* Plus Button */}
//                             <button
//                               onClick={(e) => {
//                                 e.preventDefault()
//                                 e.stopPropagation()
//                                 const current = parseFloat(engineBetAmount) || 10
//                                 const maxBet = Math.min(engineBalance, 1000)
//                                 const newBet = Math.min(maxBet, current + 10)
//                                 onBetAmountChange(newBet.toString())
//                                 setShowBetPopup(true)
//                                 setTimeout(() => setShowBetPopup(false), 1500)
//                               }}
//                               disabled={
//                                 engineSpinning ||
//                                 parseFloat(engineBetAmount) >= engineBalance ||
//                                 parseFloat(engineBetAmount) >= 1000
//                               }
//                               className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gray-900 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-white font-bold text-2xl transition-all duration-150 active:scale-90 hover:ring-2 hover:ring-purple-500"
//                               title="Increase Bet"
//                             >
//                               +
//                             </button>
//                           </div>

//                           {/* AUTOPLAY BUTTON */}
//                           <button
//                             onClick={(e) => {
//                               e.preventDefault()
//                               e.stopPropagation()
//                               onAutoSpin(5)
//                             }}
//                             disabled={
//                               engineSpinning ||
//                               parseFloat(engineBetAmount) <= 0 ||
//                               parseFloat(engineBetAmount) > engineBalance ||
//                               engineAutoSpin
//                             }
//                             className="px-5 py-2.5 bg-purple-900 hover:bg-purple-800 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-all duration-150 active:scale-95 hover:ring-2 hover:ring-purple-500 flex items-center gap-2"
//                             title="Autoplay 5 Spins"
//                           >
//                             <svg
//                               className="w-4 h-4"
//                               fill="none"
//                               stroke="currentColor"
//                               viewBox="0 0 24 24"
//                             >
//                               <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 strokeWidth={2}
//                                 d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
//                               />
//                               <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 strokeWidth={2}
//                                 d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                               />
//                             </svg>
//                             AUTOPLAY (5)
//                           </button>
//                         </div>

//                         {/* Bottom Controls - Left bottom: Mute and Info Buttons */}
//                         <div
//                           className="absolute left-2 -bottom-16 flex flex-row gap-1.5 z-50"
//                           style={{ pointerEvents: 'auto' }}
//                         >
//                           {/* Mute Button */}
//                           <button
//                             onClick={(e) => {
//                               e.preventDefault()
//                               e.stopPropagation()
//                               const newSoundState = !soundEnabled
//                               setSoundEnabled(newSoundState)
//                               setMusicEnabled(newSoundState)
//                               if (bgMusicRef.current) {
//                                 if (newSoundState) {
//                                   bgMusicRef.current.play().catch(() => {})
//                                 } else {
//                                   bgMusicRef.current.pause()
//                                 }
//                               }
//                             }}
//                             className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-all cursor-pointer active:scale-95"
//                             title={soundEnabled && musicEnabled ? 'Mute' : 'Unmute'}
//                             style={{ minWidth: '44px', minHeight: '44px' }}
//                           >
//                             {soundEnabled && musicEnabled ? (
//                               <svg
//                                 className="w-4 h-4 md:w-5 md:h-5 text-white"
//                                 fill="none"
//                                 stroke="currentColor"
//                                 viewBox="0 0 24 24"
//                               >
//                                 <path
//                                   strokeLinecap="round"
//                                   strokeLinejoin="round"
//                                   strokeWidth={2}
//                                   d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
//                                 />
//                               </svg>
//                             ) : (
//                               <svg
//                                 className="w-4 h-4 md:w-5 md:h-5 text-white"
//                                 fill="none"
//                                 stroke="currentColor"
//                                 viewBox="0 0 24 24"
//                               >
//                                 <path
//                                   strokeLinecap="round"
//                                   strokeLinejoin="round"
//                                   strokeWidth={2}
//                                   d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
//                                 />
//                                 <path
//                                   strokeLinecap="round"
//                                   strokeLinejoin="round"
//                                   strokeWidth={2}
//                                   d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
//                                 />
//                               </svg>
//                             )}
//                           </button>

//                           {/* Info Icon Button */}
//                           <button
//                             onClick={(e) => {
//                               e.preventDefault()
//                               e.stopPropagation()
//                               setShowGameRules(true)
//                             }}
//                             className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-all cursor-pointer active:scale-95"
//                             title="Game Rules"
//                             style={{ minWidth: '44px', minHeight: '44px' }}
//                           >
//                             <svg
//                               className="w-4 h-4 md:w-5 md:h-5 text-white"
//                               fill="none"
//                               stroke="currentColor"
//                               viewBox="0 0 24 24"
//                             >
//                               <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 strokeWidth={2}
//                                 d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                               />
//                             </svg>
//                           </button>
//                         </div>
//                       </>
//                     )}
//                   />

//                   {/* Win/Error Messages - Immediately after grid with no spacing */}
//                   {(error || success) && (
//                     <div
//                       className="flex items-center justify-center w-full"
//                       style={{ margin: 0, padding: 0, marginTop: 0 }}
//                     >
//                       {error && (
//                         <div
//                           className="bg-red-600/90 text-white px-4 py-2 rounded-lg shadow-lg"
//                           style={{ margin: 0 }}
//                         >
//                           <p className="text-sm font-bold">{error}</p>
//                         </div>
//                       )}
//                       {success && (
//                         <div
//                           className="bg-green-600/90 text-white px-4 py-2 rounded-lg shadow-lg"
//                           style={{ margin: 0 }}
//                         >
//                           <p className="text-sm font-bold">{success}</p>
//                         </div>
//                       )}
//                     </div>
//                   )}
//               </div>
//             </div>

//           {/* Right Sidebar - Other Realtime Games */}
//             <div 
//               className={`bg-white/95 backdrop-blur-md z-40 shadow-2xl overflow-y-auto flex-shrink-0 transition-all duration-300 ease-in-out ${
//                 showGamesSidebar ? 'w-[280px] md:w-[320px] opacity-100' : 'w-0 opacity-0 overflow-hidden'
//               }`}
//               style={{ 
//                 height: '100%', 
//                 maxHeight: '100%',
//                 minWidth: showGamesSidebar ? '280px' : '0',
//                 maxWidth: 'min(320px, 30vw)',
//                 boxSizing: 'border-box'
//               }}
//             >
//               {showGamesSidebar && (
//                 <>
//                   {/* Sidebar Header */}
//                   <div className="bg-purple-600 p-4 flex items-center justify-between sticky top-0 z-10">
//                     <div className="flex items-center gap-3">
//                       <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
//                       </svg>
//                       <span className="text-white font-semibold">Games</span>
//                     </div>
//                     <button
//                       onClick={() => setShowGamesSidebar(false)}
//                       className="text-white hover:text-gray-200 transition-colors"
//                     >
//                       <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                       </svg>
//                     </button>
//                   </div>
                  
//                   {/* Switch Game Button */}
//                   {onSwitchGame && (
//                     <div className="p-4 border-b border-gray-200">
//                       <button
//                         onClick={(e) => {
//                           e.preventDefault()
//                           e.stopPropagation()
//                           onSwitchGame()
//                         }}
//                         className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-2"
//                       >
//                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
//                         </svg>
//                         Switch to Sweet Bonanza
//                       </button>
//                     </div>
//                   )}

//               {/* Search and Filter */}
//               <div className="p-4 border-b border-gray-200">
//                 <div className="relative mb-3">
//                   <input
//                     type="text"
//                     placeholder="Search By Game Name"
//                     value={gamesSearchQuery}
//                     onChange={(e) => setGamesSearchQuery(e.target.value)}
//                     className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//                   />
//                   <svg className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                   </svg>
//                 </div>
//                 <select
//                   value={gamesProvider}
//                   onChange={(e) => setGamesProvider(e.target.value)}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//                 >
//                   <option value="all">All Providers</option>
//                   <option value="Pragmatic Play">Pragmatic Play</option>
//                   <option value="NetEnt">NetEnt</option>
//                   <option value="Evolution">Evolution</option>
//                 </select>
//               </div>

//               {/* Games List */}
//               <div className="p-4">
//                 <h3 className="font-semibold text-gray-800 mb-3">All</h3>
//                 <div className="grid grid-cols-2 gap-3">
//                   {otherGames
//                     .filter(game => {
//                       const matchesSearch = !gamesSearchQuery || game.name.toLowerCase().includes(gamesSearchQuery.toLowerCase())
//                       const matchesProvider = gamesProvider === 'all' || game.provider === gamesProvider
//                       return matchesSearch && matchesProvider
//                     })
//                     .map(game => (
//                       <div
//                         key={game.id}
//                         className="relative cursor-pointer group hover:scale-105 transition-transform"
//                         onClick={() => {
//                           if (game.name === 'Gates of Olympus') {
//                             setShowGamesSidebar(false)
//                           } else {
//                             // router.push(`/game/${game.id}`)
//                           }
//                         }}
//                       >
//                         <div className="aspect-video bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg overflow-hidden relative">
//                           {game.image ? (
//                             <img src={game.image} alt={game.name} className="w-full h-full object-cover" />
//                           ) : (
//                             <div className="w-full h-full flex items-center justify-center text-white font-bold text-sm">
//                               {game.name}
//                             </div>
//                           )}
//                           <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
//                         </div>
//                         <p className="text-xs text-gray-700 mt-1 font-medium truncate">{game.name}</p>
//                       </div>
//                     ))}
//                 </div>
//               </div>
//                 </>
//               )}
//             </div>
//           </div>
//         </main>

//         {/* Bet Amount Popup */}
//         {showBetPopup && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
//             <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-2xl font-bold text-xl animate-bounce">
//               BET: ₺{betAmount}
//             </div>
//           </div>
//         )}

//         {/* Game Rules Modal */}
//         {showGameRules && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-2 sm:p-4" onClick={() => setShowGameRules(false)}>
//             <div className="bg-gradient-to-br from-[#1a0f2e] via-[#2d1b4e] to-[#1a0f2e] rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8 max-w-2xl w-full mx-2 sm:mx-4 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto border-2 border-white/20 shadow-2xl custom-scrollbar" onClick={(e) => e.stopPropagation()}>
//               <div className="flex items-center justify-between mb-4 md:mb-6">
//                 <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 pr-2">
//                   GATES OF OLYMPUS - GAME RULES
//                 </h2>
//                 <button
//                   onClick={() => setShowGameRules(false)}
//                   className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all flex-shrink-0"
//                   aria-label="Close"
//                 >
//                   <span className="material-symbols-outlined text-white text-lg md:text-xl">close</span>
//                 </button>
//               </div>

//               <div className="space-y-4 md:space-y-6 text-white">
//                 {/* Game Overview */}
//                 <div>
//                   <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-yellow-400">Game Overview</h3>
//                   <p className="text-white/80 leading-relaxed text-sm md:text-base">
//                     Gates of Olympus is a 6-reel, 5-row slot game with a cluster pays mechanic. Match symbols horizontally or vertically to win!
//                   </p>
//                 </div>

//                 {/* How to Play */}
//                 <div>
//                   <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-yellow-400">How to Play</h3>
//                   <ul className="space-y-2 text-white/80 list-disc list-inside text-sm md:text-base">
//                     <li>Set your bet amount using the +/- buttons or quick bet options</li>
//                     <li>Click the SPIN button to start the game</li>
//                     <li>Match 8 or more identical symbols anywhere on the reels to win</li>
//                     <li>Symbols can connect horizontally or vertically</li>
//                     <li>More symbols = Higher multiplier!</li>
//                   </ul>
//                 </div>

//                 {/* Symbol Multipliers */}
//                 <div>
//                   <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-yellow-400">Symbol Multipliers</h3>
//                   <div className="grid grid-cols-3 gap-2 md:gap-3">
//                     <div className="bg-white/10 rounded-lg p-2 md:p-3 flex items-center justify-between">
//                       <span className="text-2xl md:text-3xl">💎</span>
//                       <span className="font-bold text-yellow-400 text-sm md:text-base">100x</span>
//                     </div>
//                     <div className="bg-white/10 rounded-lg p-2 md:p-3 flex items-center justify-between">
//                       <span className="text-2xl md:text-3xl">⭐</span>
//                       <span className="font-bold text-yellow-400 text-sm md:text-base">50x</span>
//                     </div>
//                     <div className="bg-white/10 rounded-lg p-2 md:p-3 flex items-center justify-between">
//                       <span className="text-2xl md:text-3xl">👑</span>
//                       <span className="font-bold text-pink-400 text-sm md:text-base">20x</span>
//                     </div>
//                     <div className="bg-white/10 rounded-lg p-2 md:p-3 flex items-center justify-between">
//                       <span className="text-2xl md:text-3xl">🛡️</span>
//                       <span className="font-bold text-red-400 text-sm md:text-base">15x</span>
//                     </div>
//                     <div className="bg-white/10 rounded-lg p-2 md:p-3 flex items-center justify-between">
//                       <span className="text-2xl md:text-3xl">⚔️</span>
//                       <span className="font-bold text-yellow-300 text-sm md:text-base">12x</span>
//                     </div>
//                     <div className="bg-white/10 rounded-lg p-2 md:p-3 flex items-center justify-between">
//                       <span className="text-2xl md:text-3xl">🌪️</span>
//                       <span className="font-bold text-green-400 text-sm md:text-base">10x</span>
//                     </div>
//                     <div className="bg-white/10 rounded-lg p-2 md:p-3 flex items-center justify-between">
//                       <span className="text-2xl md:text-3xl">🌊</span>
//                       <span className="font-bold text-orange-400 text-sm md:text-base">8x</span>
//                     </div>
//                     <div className="bg-white/10 rounded-lg p-2 md:p-3 flex items-center justify-between">
//                       <span className="text-2xl md:text-3xl">🔥</span>
//                       <span className="font-bold text-yellow-300 text-sm md:text-base">6x</span>
//                     </div>
//                     <div className="bg-white/10 rounded-lg p-2 md:p-3 flex items-center justify-between">
//                       <span className="text-2xl md:text-3xl">⚡</span>
//                       <span className="font-bold text-purple-400 text-sm md:text-base">5x</span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Special Features */}
//                 <div>
//                   <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-yellow-400">Special Features</h3>
//                   <ul className="space-y-2 text-white/80 text-sm md:text-base">
//                     <li><strong className="text-white">Scatter Symbols (⭐ and 💎):</strong> Can appear anywhere and count towards cluster wins</li>
//                     <li><strong className="text-white">Free Spins:</strong> Triggered by 3+ scatter symbols</li>
//                     <li><strong className="text-white">Random Multiplier:</strong> Up to 100x multiplier in free spins</li>
//                     <li><strong className="text-white">Tumble Feature:</strong> Winning symbols disappear and new ones fall down</li>
//                   </ul>
//                 </div>

//                 {/* Winning Rules */}
//                 <div>
//                   <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-yellow-400">Winning Rules</h3>
//                   <ul className="space-y-2 text-white/80 list-disc list-inside text-sm md:text-base">
//                     <li>Minimum 8 matching symbols required for a win</li>
//                     <li>Symbols must be adjacent (horizontally or vertically)</li>
//                     <li>Wins are calculated based on symbol multiplier × bet amount</li>
//                     <li>Multiple clusters can win simultaneously</li>
//                     <li>Maximum win: 21,100x your bet!</li>
//                   </ul>
//                 </div>

//                 {/* Volatility */}
//                 <div>
//                   <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-yellow-400">Volatility</h3>
//                   <p className="text-white/80 text-sm md:text-base">
//                     This game has <strong className="text-yellow-400">HIGH VOLATILITY</strong> (5/5). 
//                     This means wins may be less frequent but can be significantly larger when they occur.
//                   </p>
//                 </div>
//               </div>

//               <div className="mt-4 md:mt-6 flex justify-end">
//                 <button
//                   onClick={() => setShowGameRules(false)}
//                   className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold rounded-lg transition-all text-sm md:text-base min-h-[44px]"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Custom Animations */}
//         <style>{`
//           @keyframes gradientShift {
//             0%, 100% {
//               background-position: 0% 50%;
//             }
//             50% {
//               background-position: 100% 50%;
//             }
//           }
          
//           @keyframes spinButtonPop {
//             0%, 100% {
//               transform: translateY(0) scale(1);
//             }
//             50% {
//               transform: translateY(-8px) scale(1.05);
//             }
//           }
          
//           @keyframes titleBlink {
//             0%, 100% {
//               opacity: 1;
//             }
//             50% {
//               opacity: 0.7;
//             }
//           }
          
//           @keyframes glowPulse {
//             0%, 100% {
//               box-shadow: 0 0 20px rgba(255,215,0,0.8), 0 0 40px rgba(255,215,0,0.6), inset 0 2px 8px rgba(255,255,255,0.5);
//             }
//             50% {
//               box-shadow: 0 0 30px rgba(255,215,0,1), 0 0 60px rgba(255,215,0,0.8), inset 0 2px 8px rgba(255,255,255,0.7);
//             }
//           }
          
//           @keyframes neonGlow {
//             0%, 100% {
//               box-shadow: 0 0 15px rgba(255, 215, 0, 0.4), inset 0 0 10px rgba(255, 215, 0, 0.1);
//               border-color: rgba(255, 215, 0, 0.5);
//             }
//             50% {
//               box-shadow: 0 0 25px rgba(255, 215, 0, 0.7), 0 0 35px rgba(255, 215, 0, 0.5), inset 0 0 15px rgba(255, 215, 0, 0.2);
//               border-color: rgba(255, 215, 0, 0.8);
//             }
//           }
          
//           main.main-content,
//           .hide-scrollbar,
//           .hide-scrollbar * {
//             scrollbar-width: none !important;
//             -ms-overflow-style: none !important;
//           }
          
//           main.main-content::-webkit-scrollbar,
//           .hide-scrollbar::-webkit-scrollbar,
//           .hide-scrollbar *::-webkit-scrollbar {
//             display: none !important;
//             width: 0 !important;
//             height: 0 !important;
//             background: transparent !important;
//           }
          
//           main.main-content::-webkit-scrollbar-track,
//           .hide-scrollbar::-webkit-scrollbar-track,
//           .hide-scrollbar *::-webkit-scrollbar-track {
//             display: none !important;
//             background: transparent !important;
//           }
          
//           main.main-content::-webkit-scrollbar-thumb,
//           .hide-scrollbar::-webkit-scrollbar-thumb,
//           .hide-scrollbar *::-webkit-scrollbar-thumb {
//             display: none !important;
//             background: transparent !important;
//           }
          
//           .custom-scrollbar::-webkit-scrollbar {
//             width: 6px;
//           }
          
//           .custom-scrollbar::-webkit-scrollbar-track {
//             background: rgba(255, 255, 255, 0.05);
//             border-radius: 10px;
//           }
          
//           .custom-scrollbar::-webkit-scrollbar-thumb {
//             background: linear-gradient(to bottom, #ff6b9d, #9333ea);
//             border-radius: 10px;
//           }
          
//           .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//             background: linear-gradient(to bottom, #ff8fb3, #a855f7);
//           }
          
//           @media (max-width: 640px) {
//             button {
//               min-height: 44px;
//               min-width: 44px;
//             }
            
//             body {
//               -webkit-text-size-adjust: 100%;
//               -moz-text-size-adjust: 100%;
//               text-size-adjust: 100%;
//             }
            
//             * {
//               max-width: 100%;
//             }
            
//             .game-container,
//             .reels-grid,
//             .bet-controls {
//               max-width: 100vw;
//               box-sizing: border-box;
//             }
            
//             .sidebar-container {
//               max-width: min(320px, 90vw) !important;
//             }
            
//             .animate-spin,
//             .animate-pulse,
//             .animate-bounce {
//               will-change: transform;
//             }
//           }
          
//           @media (min-width: 641px) and (max-width: 1024px) {
//             .game-container {
//               padding: 1rem;
//             }
//           }
          
//           @media (min-width: 1025px) and (max-width: 1440px) {
//             .game-area-laptop {
//               transform: scale(0.85) !important;
//               transform-origin: center top;
//             }
//           }
          
//           .game-area * {
//             -webkit-user-select: none;
//             -moz-user-select: none;
//             -ms-user-select: none;
//             user-select: none;
//           }
          
//           @media (hover: none) and (pointer: coarse) {
//             button:active {
//               transform: scale(0.95);
//             }
//           }
//         `}</style>
        
//         {/* Close Button */}
//         {onClose && (
//           <button
//             onClick={onClose}
//             className="fixed top-4 right-4 z-50 w-12 h-12 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center shadow-lg transition-all"
//             title="Close Game"
//           >
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </button>
//         )}
//       </div>
//   )
// }

// export default GatesOfOlympusPage
