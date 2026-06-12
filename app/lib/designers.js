import { storageUrl } from './storage'

export const designers = {
  ann_d: {
    name: "Ann Demeulemeester",
    first_name: "Ann", 
    last_name: "Demeulemeester",
    header: storageUrl('gems/designers/ann_d/ann_d_header.avif'),
    keywords: ["dark", "poetic", "raw", "intimate", "restrained"],
    bio: ["Ann Demeulemeester grew up in Ghent and studied at the Royal Academy in Antwerp, where she immediately stood apart. While others experimented with colour and volume, Ann went deeper into darkness — not as a mood, but as a philosophy.", 
        "Her work lives in the tension between strength and vulnerability, masculinity and femininity, structure and disintegration. She worked almost exclusively in black and white, with fabrics that looked worn, unfinished and alive. Her clothes felt like armour for people who felt things deeply.",
        "Her Antwerp is intimate and unhurried. Candlelit bars where the music matters. Streets that feel different at midnight than they do at noon. Places that don't announce themselves — you find them because you were paying attention."
    ],
    images: [
        storageUrl('gems/designers/ann_d/ann_d_model1.avif'),
        storageUrl('gems/designers/ann_d/ann_d_model2.avif'),
      ],
    his_her: "her", 

    },
  dries: {
    name: "Dries Van Noten",
    header: storageUrl('gems/designers/dries/dries_header.avif'),
  }
}