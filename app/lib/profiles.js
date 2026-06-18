import { storageUrl } from './storage'

export const profiles = {
  ona: {
    name: "Ona",
    type: "owner", // "owner" shows all sections; "visitor" hides about + gems added
    keywords: ["Local", "Photographer"],
    bio: {
      short: "I write short fiction and the occasional essay when something won't leave me alone. I grew up between two languages and I'm still not sure which one I think in. Most of my work...",
      full: "I write short fiction and the occasional essay when something won't leave me alone. I grew up between two languages and I'm still not sure which one I think in. Most of my work is about ordinary situations that turn slightly wrong. I'm based in Antwerp and I read everywhere — trams, waiting rooms, other people's bookshelves.",
    },
    stats: {
      gemsFound: 7,
      photosTaken: 43,
      viewmastersCreated: 3,
    },
    avatar: storageUrl('gems/profile/profile_local.webp'),
    gemsAdded: [
      { image: storageUrl('gems/locations/gem6-hint2.avif'), alt: "gem picture" },
    ],
    discoveredGems: [
      {
        sticker: storageUrl('gems/stickers/gem32-sticker.avif'),
        name: "Bar Paniek",
        category: "Bars",
        creator: { name: "Jens", avatar: storageUrl('gems/creators/jens.avif') },
      },
      {
        sticker: storageUrl('gems/stickers/gem7-sticker.avif'),
        name: "Kasette Koffie",
        category: "Cafes",
        creator: { name: "Lisa", avatar: storageUrl('gems/creators/lisa.avif') },
      },
    ],
    viewmasters: [
      storageUrl('gems/profile/viewmaster_1.webp'),
      storageUrl('gems/profile/viewmaster_2.webp'),
      storageUrl('gems/profile/viewmaster_3.webp'),
    ],
    gallery: [
      storageUrl('gems/gallery/all/gallery_img01.webp'),
      storageUrl('gems/gallery/all/gallery_img02.webp'),
      storageUrl('gems/gallery/all/gallery_img03.webp'),
      storageUrl('gems/gallery/all/gallery_img04.webp'),
    ],
    galleryExtra: 21,
    stickers: [
      storageUrl('gems/stickers/gem39-sticker.avif'),
      storageUrl('gems/stickers/gem19-sticker.avif'),
      storageUrl('gems/stickers/gem60-sticker.avif'),
      storageUrl('gems/stickers/gem6-sticker.avif'),
    ],
  },

  tom: {
    name: "Tom",
    type: "visitor",
    keywords: ["Local"],
    bio: {
      short: "",
      full: "",
    },
    stats: {
      gemsFound: 12,
      photosTaken: 23,
      viewmastersCreated: 1,
    },
    avatar: storageUrl('gems/profile/profile_visitor.webp'),
    gemsAdded: [],
    discoveredGems: [
        {
            sticker: storageUrl('gems/stickers/gem32-sticker.avif'),
            name: "Bar Paniek",
            category: "Bars",
            creator: { name: "Jens", avatar: storageUrl('gems/creators/jens.avif') },
          },
        {
            sticker: storageUrl('gems/stickers/gem51-sticker.avif'),
            name: "Goyo",
            category: "Restaurants",
            creator: { name: "Ona", avatar: storageUrl('gems/creators/ona.avif') },
        },
      
    ],
    viewmasters: [
      storageUrl('gems/profile/viewmaster_1.webp'),
    ],
    gallery: [
      storageUrl('gems/gallery/all/gallery_img01.webp'),
      storageUrl('gems/gallery/all/gallery_img02.webp'),
      storageUrl('gems/gallery/all/gallery_img03.webp'),
      storageUrl('gems/gallery/all/gallery_img04.webp'),
    ],
    galleryExtra: 4,
    stickers: [
      storageUrl('gems/stickers/gem31-sticker.avif'),
      storageUrl('gems/stickers/gem58-sticker.avif'),
      storageUrl('gems/stickers/gem57-sticker.avif'),
      storageUrl('gems/stickers/gem42-sticker.avif'),
    ],
  },
}