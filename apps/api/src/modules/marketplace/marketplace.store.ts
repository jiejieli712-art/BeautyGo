import type { MarketplaceArtist, ServicePackage } from "@beautygo/domain-types";

const packages: ServicePackage[] = [
  {
    id: "pkg_xiaomei_travel",
    artistId: "artist_xiaomei",
    scene: "travel_photo",
    name: "旅拍出片妆",
    durationMinutes: 60,
    priceYuan: 199,
    includesHair: true,
    materialsPolicy: "artist_provided",
    description: "适合景点写真、汉服旅拍，含基础发型，持妆 8 小时+"
  },
  {
    id: "pkg_xiaomei_party",
    artistId: "artist_xiaomei",
    scene: "party",
    name: "精致晚宴妆",
    durationMinutes: 75,
    priceYuan: 299,
    includesHair: true,
    materialsPolicy: "artist_provided",
    description: "适合生日派对、酒会、年会，含发型设计和假睫毛"
  },
  {
    id: "pkg_lili_business",
    artistId: "artist_lili",
    scene: "business",
    name: "面试商务妆",
    durationMinutes: 45,
    priceYuan: 159,
    includesHair: false,
    materialsPolicy: "artist_provided",
    description: "清爽自然，适合面试、见客户、正式场合"
  },
  {
    id: "pkg_lili_travel",
    artistId: "artist_lili",
    scene: "travel_photo",
    name: "日常清新妆",
    durationMinutes: 45,
    priceYuan: 129,
    includesHair: false,
    materialsPolicy: "mixed",
    description: "轻薄底妆、自然眉眼，适合通勤和轻正式场景"
  },
  {
    id: "pkg_tongtong_wedding",
    artistId: "artist_tongtong",
    scene: "wedding_guest",
    name: "婚礼宾客妆",
    durationMinutes: 60,
    priceYuan: 259,
    includesHair: true,
    materialsPolicy: "artist_provided",
    description: "得体大方不抢新娘风头，含简单发型"
  },
  {
    id: "pkg_tongtong_party",
    artistId: "artist_tongtong",
    scene: "party",
    name: "氛围感派对妆",
    durationMinutes: 60,
    priceYuan: 239,
    includesHair: true,
    materialsPolicy: "artist_provided",
    description: "适合闺蜜聚会、毕业典礼、拍照出片"
  }
];

const artists: MarketplaceArtist[] = [
  {
    id: "artist_xiaomei",
    displayName: "小美",
    cityId: "chengdu",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=xiaomei",
    bio: "5 年旅拍化妆经验，擅长汉服妆面和景区出片造型，成都本地可接单。",
    tags: ["旅拍", "汉服", "写真", "出片"],
    scenes: ["travel_photo", "party"],
    rating: 4.9,
    reviewCount: 128,
    experienceYears: 5,
    serviceArea: 15,
    level: "gold",
    portfolioImages: [
      "https://picsum.photos/seed/bgm1/400/500",
      "https://picsum.photos/seed/bgm2/400/500",
      "https://picsum.photos/seed/bgm3/400/500",
      "https://picsum.photos/seed/bgm4/400/500"
    ],
    servicePackages: packages.filter((p) => p.artistId === "artist_xiaomei")
  },
  {
    id: "artist_lili",
    displayName: "丽丽",
    cityId: "chengdu",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=lili",
    bio: "3 年化妆师经验，擅长面试妆和商务场合妆面，风格自然干净。",
    tags: ["面试", "商务", "自然", "通勤"],
    scenes: ["business", "travel_photo"],
    rating: 4.7,
    reviewCount: 64,
    experienceYears: 3,
    serviceArea: 10,
    level: "certified",
    portfolioImages: [
      "https://picsum.photos/seed/bgm5/400/500",
      "https://picsum.photos/seed/bgm6/400/500",
      "https://picsum.photos/seed/bgm7/400/500"
    ],
    servicePackages: packages.filter((p) => p.artistId === "artist_lili")
  },
  {
    id: "artist_tongtong",
    displayName: "彤彤",
    cityId: "hangzhou",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=tongtong",
    bio: "4 年婚礼和宴会化妆经验，擅长氛围感妆面，杭州可上门。",
    tags: ["婚礼", "宴会", "氛围感", "精致"],
    scenes: ["wedding_guest", "party"],
    rating: 4.8,
    reviewCount: 92,
    experienceYears: 4,
    serviceArea: 20,
    level: "gold",
    portfolioImages: [
      "https://picsum.photos/seed/bgm8/400/500",
      "https://picsum.photos/seed/bgm9/400/500",
      "https://picsum.photos/seed/bgm10/400/500",
      "https://picsum.photos/seed/bgm11/400/500"
    ],
    servicePackages: packages.filter((p) => p.artistId === "artist_tongtong")
  }
];

export function listArtists(cityId?: string): MarketplaceArtist[] {
  if (cityId) {
    return artists.filter((a) => a.cityId === cityId);
  }
  return artists;
}

export function getArtistById(id: string): MarketplaceArtist | undefined {
  return artists.find((a) => a.id === id);
}
