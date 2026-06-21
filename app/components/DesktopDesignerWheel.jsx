import styles from './DesktopDesignerWheel.module.css'

const DESIGNERS = [
  { key: 'ann',     label: 'Ann D' },
  { key: 'dries',   label: 'Dries V' },
  { key: 'walter',  label: 'Walter V' },
  { key: 'marina',  label: 'Marina Y' },
  { key: 'dirk_b',  label: 'Dirk B' },
  { key: 'dirk_vs', label: 'Dirk VS' },
]

export default function DesktopDesignerWheel({ activeKey, onSelect }) {
  return (
    <div className={styles.wrap}>
      {DESIGNERS.map(d => (
        <button
          key={d.key}
          type="button"
          className={`${styles.pill} ${activeKey === d.key ? styles.active : ''}`}
          onClick={() => onSelect(d.key)}
        >
          {d.label}
        </button>
      ))}
    </div>
  )
}
