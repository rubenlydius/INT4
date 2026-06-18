import styles from '../styles/profile.module.css'
import { storageUrl } from '../lib/storage'
import { useState } from 'react';

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

    const [expanded, setExpanded] = useState(false);

    const shortText = "I write short fiction and the occasional essay when something won't leave me alone. I grew up between two languages and I'm still not sure which one I think in. Most of my work...";
    const fullText = "I write short fiction and the occasional essay when something won't leave me alone. I grew up between two languages and I'm still not sure which one I think in. Most of my work is about ordinary situations that turn slightly wrong. I'm based in Antwerp and I read everywhere — trams, waiting rooms, other people's bookshelves.";


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
                        <h2 className={styles.profile_h2}>About you</h2>
                        <div className={styles.edit_flex}>
                        <p className={styles.orange_to_detail}>Edit</p>
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
                <img src={storageUrl(`gems/locations/gem6-hint2.avif`)} alt="gem picture" />
            </div>
            <div className={styles.gems_added_header}>
                <h2 className={styles.profile_h2}>Discovered gems</h2>
                <div className={styles.edit_flex}>
                    <p className={styles.orange_to_detail}>View all</p>
                    <img src={simpleOrangeArrow} alt="arrow" />
                </div>
            </div>
            <div className={styles.discovered_gems_container}>
                <div className={styles.discovered_gems_left}>
                    <img src={storageUrl(`gems/stickers/gem32-sticker.avif`)} alt="" className={styles.discovered_gem_sticker}/>
                    <div className={styles.discovered_gems_text}>
                        <h3>Bar Paniek</h3>
                        <div className={styles.made_by}>
                            <img src={storageUrl(`gems/creators/jens.avif`)} alt="profile picture"/>
                            <p>Made by Jens</p>
                        </div>
                    </div>
                </div>
                <p className='info_node'>Bars</p>
            </div>
            <div className={styles.discovered_gems_container}>
                <div className={styles.discovered_gems_left}>
                    <img src={storageUrl(`gems/stickers/gem7-sticker.avif`)} alt="" className={styles.discovered_gem_sticker}/>
                    <div className={styles.discovered_gems_text}>
                        <h3>Kasette Koffie</h3>
                        <div className={styles.made_by}>
                            <img src={storageUrl(`gems/creators/lisa.avif`)} alt="profile picture"/>
                            <p>Made by Lisa</p>
                        </div>
                    </div>
                </div>
                <p className='info_node'>Cafes</p>
            </div>
            <div className={styles.gems_added_header}>
                <h2 className={styles.profile_h2}>Your Viewmasters</h2>
                <div className={styles.edit_flex}>
                    <p className={styles.orange_to_detail}>View all</p>
                    <img src={simpleOrangeArrow} alt="arrow" />
                </div>
            </div>
            <div className={styles.your_viewmasters}>
                <div className={styles.plus_viewmaster}>
                    <img src={plusButton} alt="plus button" className={styles.plus_viewmaster_button}/>
                </div>
                <img src={storageUrl(`gems/profile/viewmaster_1.webp`)} alt="viewmaster disc" />
                <img src={storageUrl(`gems/profile/viewmaster_2.webp`)} alt="viewmaster disc" />
                <img src={storageUrl(`gems/profile/viewmaster_3.webp`)} alt="viewmaster disc" />
            </div>
            <div className={styles.gems_added_header}>
                <h2 className={styles.profile_h2}>Photos taken</h2>
                <div className={styles.edit_flex}>
                    <p className={styles.orange_to_detail}>View all</p>
                    <img src={simpleOrangeArrow} alt="arrow" />
                </div>
            </div>
            <div className={styles.gallery_recents}>
                <img src={storageUrl(`gems/gallery/all/gallery_img01.webp`)} alt="" />
                <img src={storageUrl(`gems/gallery/all/gallery_img02.webp`)} alt="" />
                <img src={storageUrl(`gems/gallery/all/gallery_img03.webp`)} alt="" />
                <div className={styles.gallery_recent_last}>
                    <img src={storageUrl(`gems/gallery/all/gallery_img04.webp`)} alt="" />
                    <div className={styles.gallery_recent_overlay}>
                        <span className={styles.gallery_recent_count}>+21</span>
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
            <img src={stickerSeparator} alt="" className={styles.sticker_blocks}/>
            <div className={styles.stickers_collected}>
                <img src={storageUrl(`gems/stickers/gem39-sticker.avif`)} alt="sticker" />
                <img src={storageUrl(`gems/stickers/gem19-sticker.avif`)} alt="sticker" />
                <img src={storageUrl(`gems/stickers/gem60-sticker.avif`)} alt="sticker" />
                <img src={storageUrl(`gems/stickers/gem6-sticker.avif`)} alt="sticker" />
            </div>
            <img src={stickerBottom} alt="" className={styles.sticker_blocks}/>



            <div className={styles.spacing}></div>
        </div>


    );
}; 