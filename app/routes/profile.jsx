import styles from '../styles/profile.module.css'
import { storageUrl } from '../lib/storage'
import { useState } from 'react';

import settingsIcon from '../assets/settings_icon.svg'
import infoBubble from '../assets/profile_info_bubble.svg'
import profileTransition from '../assets/profile_transition.svg'
import aboutyouContainerTop from '../assets/aboutyou_container_top.svg'
import containerSeperator from '../assets/dropdownSeperator.svg'
import simpleOrangeArrow from '../assets/simple_orange_arrow.svg'

export default function Profile() {

    const [expanded, setExpanded] = useState(false);

    const shortText = "I shoot mostly on film in Antwerp. I'm interested in the kind of light that only exists in Belgian cities in late afternoon: the grey that isn't really grey. My work has...";
    const fullText = "I shoot mostly on film in Antwerp. I'm interested in the kind of light that only exists in Belgian cities in late afternoon: the grey that isn't really grey. My work has been shown in two small galleries in the Eilandje and once, accidentally, in a shop window on Kammenstraat. You can find my portfolio at lisaclaes.be.";


    return(
        <div>
            <div className={styles.settings_icon}>
                <img src={settingsIcon} alt="settings" />
            </div>
            <div className={styles.profile_info}>
                <img src={storageUrl(`gems/profile/profile_local.webp`)} alt="profile picture" className={styles.profile_picture}/>
                <h1>Ona</h1>
                <div className={styles.profile_keywords}>
                    <p>Local</p>
                    <p>•</p>
                    <p>Photographer</p>
                </div>
                <div className={styles.info_bubbles}>
                    <div className={styles.bubble_wrapper}>
                        <img src={infoBubble} alt="" />
                        <p><span className={styles.bubble_number}>7</span><br />Gems found</p>
                    </div>
                    <div className={styles.bubble_wrapper}>
                        <img src={infoBubble} alt="" className={styles.middle_info_bubble}/>
                        <p><span className={styles.bubble_number}>35</span><br />Photos taken</p>
                    </div>
                    <div className={styles.bubble_wrapper}>
                        <img src={infoBubble} alt="" />
                        <p><span className={styles.bubble_number}>3</span><br />Viewmasters created</p>
                    </div>
                </div>
            </div>
            
            <img src={profileTransition} alt="" className={styles.profile_transition}/>
            <div className={styles.aboutyou_container}>
                <img src={aboutyouContainerTop} alt="" className={styles.aboutyou_ContainerTop} />
                <div className={styles.aboutyou_content}>
                    <div className={styles.aboutyou_header}>
                        <h2>About you</h2>
                        <div className={styles.edit_flex}>
                        <p>Edit</p>
                        <img src={simpleOrangeArrow} alt="arrow" />
                        </div>
                    </div>
                    <img src={containerSeperator} alt="" className={styles.containerSeperator} />
                    <p className={styles.aboutyou_text}>{expanded ? fullText : shortText}</p>
                    <button onClick={() => setExpanded(!expanded)} className={styles.readMore}>
                        {expanded ? "Read less" : "Read more"}
                    </button>
                </div>
            </div>

            <div className={styles.spacing}>

            </div>
        </div>


    );
}; 