import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import styles from '../styles/profile.discovered.module.css'
import { supabase } from '../lib/supabase'
import { storageUrl } from '../lib/storage'

import simpleOrangeArrow from '../assets/simple_orange_arrow.svg'
import topPattern from '../assets/profile_details_top_pattern.svg'
import xIcon from '../assets/x_icon.svg'

export function meta() {
  return [{ title: "Discovered Gems" }]
}

const TARGETS = { ona: 25, tom: 15 }

function selectGems(allGems, profileId) {
  const target = TARGETS[profileId] ?? 15
  // ona picks even-indexed gems per type, tom picks odd-indexed
  const offset = profileId === 'tom' ? 1 : 0

  const byType = {}
  allGems.forEach(g => {
    if (!g.type) return
    if (!byType[g.type]) byType[g.type] = []
    byType[g.type].push(g)
  })

  const selected = []
  const usedIds = new Set()

  // First: guarantee one gem per type
  Object.values(byType).forEach(typeGems => {
    const pick = typeGems[offset] ?? typeGems[0]
    if (!usedIds.has(pick.id)) {
      selected.push(pick)
      usedIds.add(pick.id)
    }
  })

  // Then: fill remaining slots from the right pool
  const rest = allGems.filter((g, i) => !usedIds.has(g.id) && i % 2 === offset)
  for (const gem of rest) {
    if (selected.length >= target) break
    selected.push(gem)
    usedIds.add(gem.id)
  }

  // If still short, fill from whatever's left
  if (selected.length < target) {
    for (const gem of allGems) {
      if (selected.length >= target) break
      if (!usedIds.has(gem.id)) {
        selected.push(gem)
        usedIds.add(gem.id)
      }
    }
  }

  return selected
}

export default function ProfileDiscovered() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [gems, setGems] = useState([])
  const [types, setTypes] = useState([])
  const [activeType, setActiveType] = useState(null)

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from('Gems')
        .select('id, gem_name, type, creator, image_url')

      if (error) return console.error(error.message)

      const selected = selectGems(data, id)
      setGems(selected)

      const uniqueTypes = [...new Set(selected.map(g => g.type).filter(Boolean))]
      setTypes(uniqueTypes)
    }
    load()
  }, [id])

  const filtered = activeType ? gems.filter(g => g.type === activeType) : gems

  return (
    <div className={styles.page}>
      <div className={styles.header_area}>
        <img src={topPattern} alt="" className={styles.top_pattern} />
        <div className="top">
          <button className={styles.back_btn} onClick={() => navigate(`/profile/${id}`)}>
            <img src={simpleOrangeArrow} alt="back" className={styles.back_arrow} />
          </button>
          <h1>Discovered gems</h1>
        </div>
      </div>

      <div className={styles.filters}>
        <button
          className={`${styles.pill} ${!activeType ? styles.pill_active : ''}`}
          onClick={() => setActiveType(null)}
        >
          All
        </button>
        {types.map(type => (
          <button
            key={type}
            className={`${styles.pill} ${activeType === type ? styles.pill_active : ''}`}
            onClick={() => setActiveType(prev => prev === type ? null : type)}
          >
            {type}
            {activeType === type && <img src={xIcon} alt="" className={styles.pill_x} />}
          </button>
        ))}
      </div>

      <div className={styles.list}>
        {filtered.map(gem => (
          <div key={gem.id} className={styles.gem_card} onClick={() => navigate(`/gem/detail/${gem.id}`)}>
            <img
              src={storageUrl(`gems/stickers/gem${gem.id}-sticker.avif`)}
              alt={gem.gem_name}
              className={styles.gem_sticker}
            />
            <div className={styles.gem_info}>
              <p className={styles.gem_name}>{gem.gem_name}</p>
              <div className={styles.gem_creator}>
                {gem.image_url && (
                  <img src={gem.image_url} alt={gem.creator} className={styles.creator_avatar} />
                )}
                <p className={styles.creator_name}>made by {gem.creator}</p>
              </div>
            </div>
            {gem.type && <span className={styles.gem_tag}>{gem.type}</span>}
          </div>
        ))}
      </div>
    </div>
  )
}
