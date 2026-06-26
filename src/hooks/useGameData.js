import { useState, useCallback } from 'react'
import {
  getAllData, recordFactResult, recordFractionResult,
  addPoints, incrementStreak, resetStreak,
  unlockBadge, isTableMastered, getFactAccuracy,
  unlockCosmetic, getUnlockedCosmetics, getActiveCosmetic, setActiveCosmetic,
  getPoints, getStreak, getBestStreak, getUnlockedBadges,
} from '../utils/storage'

export function useGameData() {
  const [data, setData] = useState(() => getAllData())

  const refresh = useCallback(() => {
    setData(getAllData())
  }, [])

  const handleFactResult = useCallback((a, b, correct) => {
    recordFactResult(a, b, correct)
    let pts = data.points
    let streak = data.streak
    if (correct) {
      pts = addPoints(10 + Math.floor(data.streak * 1.5))
      streak = incrementStreak()
      // Check badge unlock
      const table = Math.min(a, b)
      if (isTableMastered(table)) {
        const badgeId = `table_${table}`
        unlockBadge(badgeId)
      }
    } else {
      streak = resetStreak()
    }
    setData(prev => ({
      ...prev,
      points: pts,
      streak,
      bestStreak: Math.max(prev.bestStreak, streak),
      unlockedBadges: getUnlockedBadges(),
    }))
    return { points: pts, streak }
  }, [data])

  const handleFractionResult = useCallback((tier, correct) => {
    recordFractionResult(tier, correct)
    let pts = data.points
    let streak = data.streak
    if (correct) {
      pts = addPoints(15 + Math.floor(data.streak * 2))
      streak = incrementStreak()
    } else {
      streak = resetStreak()
    }
    setData(prev => ({ ...prev, points: pts, streak, bestStreak: Math.max(prev.bestStreak, streak) }))
    return { points: pts, streak }
  }, [data])

  const purchaseCosmetic = useCallback((cosmeticId, cost) => {
    if (data.points < cost) return false
    addPoints(-cost)
    unlockCosmetic(cosmeticId)
    setData(prev => ({
      ...prev,
      points: getPoints(),
      unlockedCosmetics: getUnlockedCosmetics(),
    }))
    return true
  }, [data.points])

  const changeCosmetic = useCallback((id) => {
    setActiveCosmetic(id)
    setData(prev => ({ ...prev, activeCosmetic: id }))
  }, [])

  return { data, refresh, handleFactResult, handleFractionResult, purchaseCosmetic, changeCosmetic }
}
