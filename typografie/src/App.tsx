import { useState } from 'react'
import { LevelPlay } from './components/LevelPlay'
import { LevelSelect } from './components/LevelSelect'
import { getLevelById, isLevelUnlocked, levels } from './levels'

function App() {
  const [selectedLevelId, setSelectedLevelId] = useState<string | null>(null)
  const selectedLevel = selectedLevelId
    ? getLevelById(selectedLevelId)
    : undefined

  const openLevel = (levelId: string) => {
    const level = getLevelById(levelId)
    if (!level || !isLevelUnlocked(level)) return
    setSelectedLevelId(levelId)
  }

  if (selectedLevel && isLevelUnlocked(selectedLevel)) {
    return (
      <LevelPlay
        key={selectedLevel.id}
        level={selectedLevel}
        onBack={() => setSelectedLevelId(null)}
        onGoToLevel={openLevel}
      />
    )
  }

  return <LevelSelect levels={levels} onSelect={openLevel} />
}

export default App
