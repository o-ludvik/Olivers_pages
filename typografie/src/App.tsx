import { useState } from 'react'
import { LevelPlay } from './components/LevelPlay'
import { LevelSelect } from './components/LevelSelect'
import { categories, getLevelById } from './levels'

function App() {
  const [selectedLevelId, setSelectedLevelId] = useState<string | null>(null)
  const selectedLevel = selectedLevelId
    ? getLevelById(selectedLevelId)
    : undefined

  const openLevel = (levelId: string) => {
    if (!getLevelById(levelId)) return
    setSelectedLevelId(levelId)
  }

  if (selectedLevel) {
    return (
      <LevelPlay
        key={selectedLevel.id}
        level={selectedLevel}
        onBack={() => setSelectedLevelId(null)}
        onGoToLevel={openLevel}
      />
    )
  }

  return <LevelSelect categories={categories} onSelect={openLevel} />
}

export default App
