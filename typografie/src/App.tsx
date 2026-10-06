import { useEffect, useState } from 'react'
import { AsteroidsGame } from './minihry/AsteroidsGame'
import { RaceGame } from './minihry/RaceGame'
import { BadgeGallery } from './minihry/vsemiDeseti/BadgeGallery'
import { VsemiDesetiGame } from './minihry/vsemiDeseti/VsemiDesetiGame'
import { LevelPlay } from './components/LevelPlay'
import { LevelSelect } from './components/LevelSelect'
import { categories, getLevelById } from './levels'

type View =
  | { kind: 'select' }
  | { kind: 'level'; id: string }
  | { kind: 'zavod' }
  | { kind: 'asteroidy' }
  | { kind: 'vsemi-deseti' }
  | { kind: 'vsemi-deseti-galerie' }

function viewFromHash(): View | null {
  const h = location.hash.replace(/^#/, '')
  if (
    h === '/minihry/vsemi-deseti/galerie' ||
    h === 'minihry/vsemi-deseti/galerie'
  ) {
    return import.meta.env.DEV ? { kind: 'vsemi-deseti-galerie' } : null
  }
  return null
}

function App() {
  const [view, setView] = useState<View>(
    () => viewFromHash() ?? { kind: 'select' },
  )

  useEffect(() => {
    const onHash = () => {
      const v = viewFromHash()
      if (v) setView(v)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const goHome = () => setView({ kind: 'select' })

  const openLevel = (levelId: string) => {
    if (!getLevelById(levelId)) return
    setView({ kind: 'level', id: levelId })
  }

  if (view.kind === 'level') {
    const selectedLevel = getLevelById(view.id)
    if (selectedLevel) {
      return (
        <LevelPlay
          key={selectedLevel.id}
          level={selectedLevel}
          onBack={goHome}
          onGoToLevel={openLevel}
        />
      )
    }
  }

  if (view.kind === 'zavod') {
    return (
      <RaceGame onBack={goHome} onOpenLevel={openLevel} />
    )
  }

  if (view.kind === 'asteroidy') {
    return (
      <AsteroidsGame onBack={goHome} onOpenLevel={openLevel} />
    )
  }

  if (view.kind === 'vsemi-deseti') {
    return (
      <VsemiDesetiGame
        onBack={goHome}
        onOpenGallery={
          import.meta.env.DEV
            ? () => {
                location.hash = '#/minihry/vsemi-deseti/galerie'
                setView({ kind: 'vsemi-deseti-galerie' })
              }
            : undefined
        }
      />
    )
  }

  if (view.kind === 'vsemi-deseti-galerie' && import.meta.env.DEV) {
    return (
      <BadgeGallery
        onBack={() => {
          location.hash = ''
          setView({ kind: 'vsemi-deseti' })
        }}
      />
    )
  }

  return (
    <LevelSelect
      categories={categories}
      onSelect={openLevel}
      onOpenRace={() => setView({ kind: 'zavod' })}
      onOpenAsteroids={() => setView({ kind: 'asteroidy' })}
      onOpenVsemiDeseti={() => setView({ kind: 'vsemi-deseti' })}
    />
  )
}

export default App
