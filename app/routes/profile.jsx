import styles from '../styles/profile.module.css'
import { useState } from 'react';
import { useParams } from 'react-router'
import { profiles } from '../lib/profiles'

import settingsIcon from '../assets/settings_icon.svg'
import infoBubble from '../assets/profile_info_bubble.svg'
import profileTransition from '../assets/profile_transition.svg'
import aboutyouContainerTop from '../assets/aboutyou_container_top.svg'
import containerSeperator from '../assets/dropdownSeperator.svg'
import simpleOrangeArrow from '../assets/simple_orange_arrow.svg'
import plusButton from '../assets/plus_button.svg'
import stickerSeparator from '../assets/sticker_separator.svg'
import stickerBottom from '../assets/sticker_bottom.svg'


export function meta() {
    return [{ title: "Profile" }];
}


export default function Profile() {
    const { id } = useParams()
    const profile = profiles[id] || profiles.ona

    const isOwner = profile.type === 'owner'

    const [expanded, setExpanded] = useState(false);

    return (
        <div>
            <div className={styles.settings_icon}>
                <img src={settingsIcon} alt="settings" />
            </div>

            <div className={styles.profile_info}>
                <img src={profile.avatar} alt="profile picture" className={styles.profile_picture} />
                <h1>{profile.name}</h1>
                <div className={styles.profile_keywords}>
                    {profile.keywords.map((kw, i) => (
                        <span key={i} className={styles.profile_keywords}>
                            {i > 0 && <p>•</p>}
                            <p>{kw}</p>
                        </span>
                    ))}
                </div>
                <div className={styles.info_bubbles}>
                    <div className={styles.bubble_wrapper}>
                        <img src={infoBubble} alt="" />
                        <p><span className={styles.bubble_number}>{profile.stats.gemsFound}</span><br />Gems found</p>
                    </div>
                    <div className={styles.bubble_wrapper}>
                        <img src={infoBubble} alt="" className={styles.middle_info_bubble} />
                        <p><span className={styles.bubble_number}>{profile.stats.photosTaken}</span><br />Photos taken</p>
                    </div>
                    <div className={styles.bubble_wrapper}>
                        <img src={infoBubble} alt="" />
                        <p><span className={styles.bubble_number}>{profile.stats.viewmastersCreated}</span><br />Viewmasters created</p>
                    </div>
                </div>
            </div>

            <img src={profileTransition} alt="" className={styles.profile_transition} />

            {isOwner && (
                <div className={styles.aboutyou_container}>
                    <img src={aboutyouContainerTop} alt="" className={styles.aboutyou_ContainerTop} />
                    <div className={styles.aboutyou_content}>
                        <div className={styles.aboutyou_header}>
                            <h2 className={styles.profile_h2}>About you</h2>
                            <div className={styles.edit_flex}>
                                <p className={styles.orange_to_detail}>Edit</p>
                                <img src={simpleOrangeArrow} alt="arrow" />
                            </div>
                        </div>
                        <img src={containerSeperator} alt="" className={styles.containerSeperator} />
                        <p className={styles.aboutyou_text}>
                            {expanded ? profile.bio.full : profile.bio.short}
                        </p>
                        <button onClick={() => setExpanded(!expanded)} className={styles.readMore}>
                            {expanded ? "Read less" : "Read more"}
                        </button>
                    </div>
                </div>
            )}

            {isOwner && (
                <>
                    <div className={styles.gems_added_header}>
                        <h2 className={styles.profile_h2}>Gems added by you</h2>
                        <div className={styles.edit_flex}>
                            <p className={styles.orange_to_detail}>View all</p>
                            <img src={simpleOrangeArrow} alt="arrow" />
                        </div>
                    </div>
                    <div className={styles.profile_gems}>
                        <div className={styles.addGem}>
                            <img src={plusButton} alt="add gem" />
                        </div>
                        {profile.gemsAdded.map((gem, i) => (
                            <img key={i} src={gem.image} alt={gem.alt} />
                        ))}
                    </div>
                </>
            )}

            <div className={styles.gems_added_header}>
                <h2 className={styles.profile_h2}>Discovered gems</h2>
                <div className={styles.edit_flex}>
                    <p className={styles.orange_to_detail}>View all</p>
                    <img src={simpleOrangeArrow} alt="arrow" />
                </div>
            </div>
            {profile.discoveredGems.map((gem, i) => (
                <div key={i} className={styles.discovered_gems_container}>
                    <div className={styles.discovered_gems_left}>
                        <img src={gem.sticker} alt="" className={styles.discovered_gem_sticker} />
                        <div className={styles.discovered_gems_text}>
                            <h3>{gem.name}</h3>
                            <div className={styles.made_by}>
                                <img src={gem.creator.avatar} alt="profile picture" />
                                <p>Made by {gem.creator.name}</p>
                            </div>
                        </div>
                    </div>
                    <p className='info_node'>{gem.category}</p>
                </div>
            ))}

            <div className={styles.gems_added_header}>
                <h2 className={styles.profile_h2}>
                    {isOwner ? 'Your Viewmasters' : `${profile.name}'s Viewmasters`}
                </h2>
                <div className={styles.edit_flex}>
                    <p className={styles.orange_to_detail}>View all</p>
                    <img src={simpleOrangeArrow} alt="arrow" />
                </div>
            </div>
            <div className={styles.your_viewmasters}>
                {isOwner && (
                    <div className={styles.plus_viewmaster}>
                        <img src={plusButton} alt="plus button" className={styles.plus_viewmaster_button} />
                    </div>
                )}
                {profile.viewmasters.map((vm, i) => (
                    <img key={i} src={vm} alt="viewmaster disc" />
                ))}
            </div>

            <div className={styles.gems_added_header}>
                <h2 className={styles.profile_h2}>Photos taken</h2>
                <div className={styles.edit_flex}>
                    <p className={styles.orange_to_detail}>View all</p>
                    <img src={simpleOrangeArrow} alt="arrow" />
                </div>
            </div>
            <div className={styles.gallery_recents}>
                {profile.gallery.slice(0, 3).map((img, i) => (
                    <img key={i} src={img} alt="" />
                ))}
                <div className={styles.gallery_recent_last}>
                    <img src={profile.gallery[3]} alt="" />
                    <div className={styles.gallery_recent_overlay}>
                        <span className={styles.gallery_recent_count}>+{profile.galleryExtra}</span>
                    </div>
                </div>
            </div>

            <div className={styles.gems_added_header}>
                <h2 className={styles.profile_h2}>Sticker collection</h2>
                <div className={styles.edit_flex}>
                    <p className={styles.orange_to_detail}>View all</p>
                    <img src={simpleOrangeArrow} alt="arrow" />
                </div>
            </div>
            <img src={stickerSeparator} alt="" className={styles.sticker_blocks} />
            <div className={styles.stickers_collected}>
                {profile.stickers.map((sticker, i) => (
                    <img key={i} src={sticker} alt="sticker" className={styles.profile_stickers}/>
                ))}
            </div>
            <img src={stickerBottom} alt="" className={styles.sticker_blocks} />

            <div className={styles.spacing}></div>
        </div>
    );
}