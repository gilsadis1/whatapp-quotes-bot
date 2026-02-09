export type QuoteItem = {
  id: string;
  author: string; // English name
  gender: "female" | "male" | "other";
  quote_en: string;
  wikipedia: string;
  tags: string[];
};

export const QUOTES: QuoteItem[] = [
  {
    id: "michael-jordan-01",
    author: "Michael Jordan",
    gender: "male",
    quote_en: "I've failed over and over and over again in my life. And that is why I succeed.",
    wikipedia: "https://en.wikipedia.org/wiki/Michael_Jordan",
    tags: ["sports", "grit"]
  },
  {
    id: "serena-williams-01",
    author: "Serena Williams",
    gender: "female",
    quote_en: "I really think a champion is defined not by their wins but by how they can recover when they fall.",
    wikipedia: "https://en.wikipedia.org/wiki/Serena_Williams",
    tags: ["sports", "resilience"]
  },
  {
    id: "lionel-messi-01",
    author: "Lionel Messi",
    gender: "male",
    quote_en: "You have to fight to reach your dream. You have to sacrifice and work hard for it.",
    wikipedia: "https://en.wikipedia.org/wiki/Lionel_Messi",
    tags: ["sports", "discipline"]
  },
  {
    id: "cristiano-ronaldo-01",
    author: "Cristiano Ronaldo",
    gender: "male",
    quote_en: "Talent without working hard is nothing.",
    wikipedia: "https://en.wikipedia.org/wiki/Cristiano_Ronaldo",
    tags: ["sports", "work-ethic"]
  },
  {
    id: "mia-hamm-01",
    author: "Mia Hamm",
    gender: "female",
    quote_en: "I am building a fire, and every day I train, I add more fuel.",
    wikipedia: "https://en.wikipedia.org/wiki/Mia_Hamm",
    tags: ["sports", "discipline"]
  },
  {
    id: "jackie-robinson-01",
    author: "Jackie Robinson",
    gender: "male",
    quote_en: "A life is not important except in the impact it has on other lives.",
    wikipedia: "https://en.wikipedia.org/wiki/Jackie_Robinson",
    tags: ["sports", "character"]
  },
  {
    id: "simone-biles-01",
    author: "Simone Biles",
    gender: "female",
    quote_en: "If you think you’re done, you’re always 40% shy of where your body thinks it’s at.",
    wikipedia: "https://en.wikipedia.org/wiki/Simone_Biles",
    tags: ["sports", "mindset"]
  },
  {
    id: "muhammad-ali-01",
    author: "Muhammad Ali",
    gender: "male",
    quote_en: "He who is not courageous enough to take risks will accomplish nothing in life.",
    wikipedia: "https://en.wikipedia.org/wiki/Muhammad_Ali",
    tags: ["sports", "courage"]
  },
  {
    id: "billie-jean-king-01",
    author: "Billie Jean King",
    gender: "female",
    quote_en: "Champions keep playing until they get it right.",
    wikipedia: "https://en.wikipedia.org/wiki/Billie_Jean_King",
    tags: ["sports", "perseverance"]
  },
  {
    id: "pele-01",
    author: "Pelé",
    gender: "male",
    quote_en: "Success is no accident. It is hard work, perseverance, learning, studying, sacrifice and most of all, love of what you are doing.",
    wikipedia: "https://en.wikipedia.org/wiki/Pel%C3%A9",
    tags: ["sports", "work-ethic"]
  },
  {
    id: "sachin-tendulkar-01",
    author: "Sachin Tendulkar",
    gender: "male",
    quote_en: "People throw stones at you and you convert them into milestones.",
    wikipedia: "https://en.wikipedia.org/wiki/Sachin_Tendulkar",
    tags: ["sports", "resilience"]
  },
  {
    id: "abe-lincoln-01",
    author: "Abraham Lincoln",
    gender: "male",
    quote_en: "I walk slowly, but I never walk backward.",
    wikipedia: "https://en.wikipedia.org/wiki/Abraham_Lincoln",
    tags: ["history", "perseverance"]
  },
  {
    id: "marie-curie-01",
    author: "Marie Curie",
    gender: "female",
    quote_en: "Nothing in life is to be feared, it is only to be understood.",
    wikipedia: "https://en.wikipedia.org/wiki/Marie_Curie",
    tags: ["science", "curiosity"]
  },
  {
    id: "albert-einstein-01",
    author: "Albert Einstein",
    gender: "male",
    quote_en: "Life is like riding a bicycle. To keep your balance, you must keep moving.",
    wikipedia: "https://en.wikipedia.org/wiki/Albert_Einstein",
    tags: ["science", "mindset"]
  },
  {
    id: "maya-angelou-01",
    author: "Maya Angelou",
    gender: "female",
    quote_en: "You will face many defeats in life, but never let yourself be defeated.",
    wikipedia: "https://en.wikipedia.org/wiki/Maya_Angelou",
    tags: ["literature", "resilience"]
  },
  {
    id: "nelson-mandela-01",
    author: "Nelson Mandela",
    gender: "male",
    quote_en: "It always seems impossible until it's done.",
    wikipedia: "https://en.wikipedia.org/wiki/Nelson_Mandela",
    tags: ["leadership", "grit"]
  },
  {
    id: "helen-keller-01",
    author: "Helen Keller",
    gender: "female",
    quote_en: "Alone we can do so little; together we can do so much.",
    wikipedia: "https://en.wikipedia.org/wiki/Helen_Keller",
    tags: ["leadership", "community"]
  },
  {
    id: "usain-bolt-01",
    author: "Usain Bolt",
    gender: "male",
    quote_en: "Dream big, work hard, stay focused, and surround yourself with good people.",
    wikipedia: "https://en.wikipedia.org/wiki/Usain_Bolt",
    tags: ["sports", "discipline"]
  },
  {
    id: "kobe-bryant-01",
    author: "Kobe Bryant",
    gender: "male",
    quote_en: "The moment you give up, is the moment you let someone else win.",
    wikipedia: "https://en.wikipedia.org/wiki/Kobe_Bryant",
    tags: ["sports", "grit"]
  },
  {
    id: "naomi-osaka-01",
    author: "Naomi Osaka",
    gender: "female",
    quote_en: "If you don’t try, you can’t win.",
    wikipedia: "https://en.wikipedia.org/wiki/Naomi_Osaka",
    tags: ["sports", "courage"]
  },
  {
    id: "stephen-hawking-01",
    author: "Stephen Hawking",
    gender: "male",
    quote_en: "However difficult life may seem, there is always something you can do and succeed at.",
    wikipedia: "https://en.wikipedia.org/wiki/Stephen_Hawking",
    tags: ["science", "resilience"]
  },
  {
    id: "malala-01",
    author: "Malala Yousafzai",
    gender: "female",
    quote_en: "Let us pick up our books and our pens, they are the most powerful weapons.",
    wikipedia: "https://en.wikipedia.org/wiki/Malala_Yousafzai",
    tags: ["education", "courage"]
  },
  {
    id: "oprah-01",
    author: "Oprah Winfrey",
    gender: "female",
    quote_en: "The biggest adventure you can take is to live the life of your dreams.",
    wikipedia: "https://en.wikipedia.org/wiki/Oprah_Winfrey",
    tags: ["leadership", "mindset"]
  },
  {
    id: "yitzhak-rabin-01",
    author: "Yitzhak Rabin",
    gender: "male",
    quote_en: "You don't make peace with friends. You make it with very unsavory enemies.",
    wikipedia: "https://en.wikipedia.org/wiki/Yitzhak_Rabin",
    tags: ["leadership", "history"]
  },
  {
    id: "rosa-parks-01",
    author: "Rosa Parks",
    gender: "female",
    quote_en: "I have learned over the years that when one's mind is made up, this diminishes fear.",
    wikipedia: "https://en.wikipedia.org/wiki/Rosa_Parks",
    tags: ["courage", "history"]
  },
  {
    id: "greta-thunberg-01",
    author: "Greta Thunberg",
    gender: "female",
    quote_en: "No one is too small to make a difference.",
    wikipedia: "https://en.wikipedia.org/wiki/Greta_Thunberg",
    tags: ["environment", "leadership"]
  }
];
