import { useState } from 'react'
import Home from './components/Home'
import TimesTablesGame from './components/TimesTablesGame'
import FractionsGame from './components/FractionsGame'
import LearningBoard from './components/LearningBoard'
import RewardsScreen from './components/RewardsScreen'
import { useGameData } from './hooks/useGameData'

export default function App() {
  const [screen, setScreen] = useState('home')
  const gameData = useGameData()

  const navigate = (s) => setScreen(s)

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-blue-100 flex flex-col items-center">
      <div className="w-full max-w-md mx-auto min-h-screen flex flex-col">
        {screen === 'home' && <Home gameData={gameData} navigate={navigate} />}
        {screen === 'times' && <TimesTablesGame gameData={gameData} navigate={navigate} />}
        {screen === 'fractions' && <FractionsGame gameData={gameData} navigate={navigate} />}
        {screen === 'board' && <LearningBoard navigate={navigate} />}
        {screen === 'rewards' && <RewardsScreen gameData={gameData} navigate={navigate} />}
      </div>
    </div>
  )
}
