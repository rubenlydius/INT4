import { useState } from 'react'
import styles from './dropdown.module.css'
import dropdownTop from '../assets/hintDropdownTop.svg'
import dropdownBottom from '../assets/hintDropdownBottom.svg'
import dropdownArrow from '../assets/dropdownArrow.svg'
import dropdownSeperator from '../assets/dropdownSeperator.svg'
import lockIcon from '../assets/lock_icon.svg'

// Helper function to calculate precise distance in meters
function getHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth's radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; 
}

export default function Dropdown({ 
  title, 
  content, 
  icon, 
  images, 
  hotCold, 
  infoNodeText,
  gemTarget,      // { lat, lng, radius }
  userLocation,   // { lat, lng }
  hcChecksUsed,   // number
  setHcChecksUsed // setter
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [unlockedHints, setUnlockedHints] = useState([])
  const [indicatorPercentage, setIndicatorPercentage] = useState(null)

  const openCount = 1 + unlockedHints.length;
  const finalInfoText = images && images.length > 0 
      ? `${openCount}/3 open` 
      : infoNodeText;

  // Evaluate positional rules
  let isInsideRadius = false;
  let computedDistance = Infinity;

  if (hotCold && userLocation && gemTarget) {
    computedDistance = getHaversineDistance(
      userLocation.lat,
      userLocation.lng,
      gemTarget.lat,
      gemTarget.lng
    );
    isInsideRadius = computedDistance <= gemTarget.radius;
  }

  // Add a brand new state right under your other state definitions
  const [isCooldown, setIsCooldown] = useState(false);

  const handleProximityCheck = () => {
    // Block action if they're outside the radius, out of attempts, or in active cooldown
    if (!isInsideRadius || hcChecksUsed >= 3 || isCooldown) return;

    setHcChecksUsed(prev => prev + 1);
    setIsCooldown(true); // Lock the button immediately

    const gpsErrorMargin = 15; 
    const maxRadiusRange = gemTarget.radius - gpsErrorMargin; 
    const currentRelativeDist = Math.max(0, computedDistance - gpsErrorMargin);

    let percentage = ((maxRadiusRange - currentRelativeDist) / maxRadiusRange) * 100;
    
    // Clamp between 4% and 96% so the circle stays strictly inside the rounded edges
    percentage = Math.min(96, Math.max(4, percentage)); 

    setIndicatorPercentage(percentage);

    // After 10 seconds, clear the bubble and release the button lockdown lock
    setTimeout(() => {
      setIndicatorPercentage(null);
      setIsCooldown(false);
    }, 10000);
  };

  return (
    <div className={styles.dropdownWrapper}>
      <div className={styles.dropdown}>
        <img src={dropdownTop} alt="" className={styles.dropdownEdge} />
        <div className={styles.dropdownInner}>
          <div className={styles.dropdownHeader} onClick={() => setIsOpen(!isOpen)}>
            <div className={styles.headerLeftGroup}>
              <div className={styles.dropdownTitle}>
                {icon && <img src={icon} alt="" className={styles.dropdownIcon} />}
                <h3>{title}</h3>
              </div>
            </div>
            <div className={styles.headerRightGroup}>
              {finalInfoText && (
                <span className={`info_node ${styles.dropdownInfoNode}`}>
                  {finalInfoText}
                </span>
              )}
              <img
                src={dropdownArrow}
                alt=""
                className={`${styles.dropdownArrow} ${isOpen ? styles.dropdownArrowOpen : ''}`}
              />
            </div>
          </div>

          {isOpen && (
            <>
              <img src={dropdownSeperator} alt="" className={styles.dropdownSep} />
              {images && images.length > 0 ? (
                <div className={styles.dropdownImages}>
                  {images.map((src, i) => (
                    <div key={i} className={`${styles.dropdownImageWrapper} ${i > 0 ? styles.dropdownImageLocked : ''}`}>
                      <img src={src} alt={`hint ${i + 1}`} className={styles.dropdownImage} />
                      {i > 0 && !unlockedHints.includes(i) && (
                        <div
                          className={styles.dropdownImageOverlay}
                          onClick={() => setUnlockedHints(prev => [...prev, i])}
                        >
                          <img src={lockIcon} alt="locked" className={styles.lockIcon} />
                          <p className={styles.lockText}>
                            You may unlock this hint in {i === 1 ? 5 : 10} minutes.
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : hotCold ? (
                <div className={styles.hotColdContent}>
                  <p className={styles.HCdropdownText}>
                    You may use this hint three times to check how close you are to the final location (cold-far, hot-close).
                  </p>
                  
                  <div className={styles.hotColdBar}>
                    {indicatorPercentage !== null && (
                      <div 
                        className={styles.proximityIndicator} 
                        style={{ 
                          left: `${indicatorPercentage}%`,
                          '--target-left': `${indicatorPercentage}%` 
                        }}
                      />
                    )}
                  </div>

                  <div className={styles.hotColdLabel}>
                    <span className={styles.coldLabel}>cold</span>
                    <span className={styles.hotLabel}>hot</span>
                  </div>

                  <div className={styles.actionRow}>
                    <button 
                      className={`${styles.pill} ${!isInsideRadius || hcChecksUsed >= 3 || isCooldown ? styles.disabledPill : ''}`}
                      onClick={handleProximityCheck}
                      disabled={!isInsideRadius || hcChecksUsed >= 3 || isCooldown}
                    >
                      {isCooldown ? 'Checking...' : 'Check proximity'}
                    </button>
                    {!isInsideRadius && (
                      <span className={styles.warningMessage}>
                        Move into the radius zone to check proximity
                      </span>
                    )}
                    {isInsideRadius && hcChecksUsed >= 3 && !isCooldown && (
                      <span className={styles.warningMessage}>
                        No remaining check attempts
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <p className={styles.dropdownText}>{content}</p>
              )}
            </>
          )}
        </div>
        <img src={dropdownBottom} alt="" className={styles.dropdownEdge} />
      </div>
    </div>
  )
}