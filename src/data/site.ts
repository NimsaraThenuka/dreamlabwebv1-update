export interface NavItem {
  label: string;
  href: string;
  key: string;
  restFirst?: boolean;
}

export const SITE = {
  name: '株式会社dreamLab',
  brand: 'dreamLab',
  defaultTitle: '福島の中小企業のAI導入・業務効率化支援｜dreamLab（いわき）',
  defaultDescription:
    '福島県いわき市の株式会社dreamLab。社員10〜50名ほどの中小企業の社長と一緒に戦略を考え、AIで業務を仕組みにし、浮いた時間を売上につなげるまで伴走します。まずは30分の無料相談（オンライン）から。',
  defaultImage: '/img/top-hero-ceo-consult.webp',
  locale: 'ja_JP',
  phone: '050-6869-4334',
  email: 'info@dreamlabltd.jp',
  postalCode: '970-8026',
  addressRegion: '福島県',
  addressLocality: 'いわき市',
  streetAddress: '平字田町1-2 猪狩ビル7階 furatto',
  founder: '小川 智美',
  foundingDate: '2014-11'
} as const;

export const NAV_PRIMARY: NavItem[] = [
  { label: 'AI経営支援', href: '/ai-support', key: 'ai-support' },
  { label: '販路開拓支援', href: '/market', key: 'market' },
  { label: '教育・地域共創', href: '/education', key: 'education' }
];

export const NAV_SECONDARY: NavItem[] = [
  { label: '会社情報', href: '/company', key: 'company', restFirst: true },
  { label: 'ブログ', href: '/blog', key: 'blog' }
];
