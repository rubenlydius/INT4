import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import { profiles } from '../lib/profiles'
import { storageUrl } from '../lib/storage'
import { MiniDisc } from '../components/MiniDisc'
import styles from '../styles/profile.viewmasters.module.css'

import simpleOrangeArrow from '../assets/simple_orange_arrow.svg'
import topPattern from '../assets/profile_details_top_pattern.svg'
import plusIconStroke from '../assets/plus_icon_stroke.svg'

const viewmasterSection = storageUrl('gems/profile/your_viewmsater_section.webp')

export function meta() {
    return [{ title: "Your ViewMasters" }]
}

export default function ProfileViewmasters() {
    const { id } = useParams()
    const navigate = useNavigate()
    const profile = profiles[id] || profiles.ona
    const profileViewmasters = profile.viewmasters

    const [createdViewmasters, setCreatedViewmasters] = useState([])

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem(`created_viewmasters_${id}`) || '[]')
        setCreatedViewmasters(saved)
    }, [id])

    const totalCount = profileViewmasters.length + createdViewmasters.length

    return (
        <div className={styles.page}>
            <div className={styles.header_area}>
                <img src={topPattern} alt="" className={styles.top_pattern} />
                <div className="top">
                    <button type="button" className={styles.back_btn} onClick={() => navigate(`/profile/${id}`)}>
                        <img src={simpleOrangeArrow} alt="back" className={styles.back_arrow} />
                    </button>
                    <h1>Your ViewMasters</h1>
                </div>
            </div>

            <div className={styles.content}>
                <div className={styles.summary_card}>
                    <div className={styles.summary_text}>
                        <p className={styles.summary_count}>{totalCount} ViewMasters<br />created</p>
                        <p className={styles.summary_sub}>Keep exploring to create more!</p>
                    </div>
                    <div className={styles.summary_img_wrap}>
                        <img src={viewmasterSection} alt="" className={styles.summary_img} />
                    </div>
                </div>

                <div className={styles.grid}>
                    <button type="button" className={styles.add_btn} onClick={() => navigate('/camera/viewmaster', { state: { profileId: id } })}>
                        <img src={plusIconStroke} alt="add viewmaster" className={styles.plus_icon} />
                    </button>
                    {createdViewmasters.map(vm => (
                        <MiniDisc key={vm.id} color={vm.color} photoIds={vm.photoIds} stickers={vm.stickers} />
                    ))}
                    {profileViewmasters.map(vm => (
                        <img key={vm} src={vm} alt="ViewMaster disc" className={styles.disc} />
                    ))}
                </div>
            </div>
        </div>
    )
}
