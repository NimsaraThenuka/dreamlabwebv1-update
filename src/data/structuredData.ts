import { SITE } from './site';

export function buildProfessionalServiceSchema(siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: SITE.name,
    url: `${siteUrl}/`,
    telephone: SITE.phone,
    email: SITE.email,
    image: `${siteUrl}${SITE.defaultImage}`,
    address: {
      '@type': 'PostalAddress',
      postalCode: SITE.postalCode,
      addressRegion: SITE.addressRegion,
      addressLocality: SITE.addressLocality,
      streetAddress: SITE.streetAddress,
      addressCountry: 'JP'
    },
    areaServed: ['福島県', 'いわき市', '郡山市'],
    foundingDate: SITE.foundingDate,
    founder: {
      '@type': 'Person',
      name: SITE.founder
    },
    description:
      '福島県いわき市の株式会社dreamLab。中小企業のAI経営支援・業務効率化、販路開拓支援、教育・地域共創。'
  };
}

export function buildWebSiteSchema(siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    alternateName: SITE.brand,
    url: `${siteUrl}/`,
    inLanguage: 'ja'
  };
}

export function buildBreadcrumbSchema(
  siteUrl: string,
  items: Array<{ name: string; path: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: `${siteUrl}${item.path}`
    }))
  };
}

export function buildServiceSchema(
  siteUrl: string,
  name: string,
  description: string,
  path: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url: `${siteUrl}${path}`,
    provider: {
      '@type': 'ProfessionalService',
      name: SITE.name,
      url: `${siteUrl}/`
    },
    areaServed: ['福島県', 'いわき市', '郡山市', '全国（オンライン）']
  };
}

export function buildBlogPostingSchema(
  siteUrl: string,
  post: {
    title: string;
    description: string;
    path: string;
    image: string;
    datePublished: string;
    category: string;
  }
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: `${siteUrl}${post.image}`,
    datePublished: post.datePublished,
    dateModified: post.datePublished,
    articleSection: post.category,
    inLanguage: 'ja',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}${post.path}`
    },
    author: {
      '@type': 'Person',
      name: SITE.founder
    },
    publisher: {
      '@type': 'Organization',
      name: SITE.name,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/img/logo-mark.png`
      }
    }
  };
}

export const AI_SUPPORT_FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'AIの導入は必須ですか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '必須ではありません。仕組みの見直しだけで解決することもあります。'
      }
    },
    {
      '@type': 'Question',
      name: 'AIに詳しくなくても大丈夫ですか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '大丈夫です。専門用語を使わずにお話しします。'
      }
    },
    {
      '@type': 'Question',
      name: '経営診断と業務効率化・仕組み化診断は、どちらを選べばいいですか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '数字から会社の課題と優先順位を知りたい場合は経営診断、現場の業務やシステムを見直したい場合は仕組み化診断が向いています。迷う場合は、90分セッションや30分の無料相談で一緒に決めます。'
      }
    },
    {
      '@type': 'Question',
      name: '経営診断では税金の相談もできますか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '税務申告や税務相談は行いません。必要な場合は、顧問税理士の方と連携して進めます。'
      }
    },
    {
      '@type': 'Question',
      name: '仕組み化診断では、何をしますか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'エンジニアが現地に伺い、今お使いのシステムと業務を棚卸しし、実際に働く方に仕事の流れを伺います。そのうえで、何を仕組みにすれば効果が大きいかを決め、費用と効果を見積もります。'
      }
    },
    {
      '@type': 'Question',
      name: '補助金は使えますか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '取り組みの内容によっては、dreamLabの支援に使える補助金があります。どの補助金が対象になるか、公募の時期も含めて、30分の無料相談で一緒に確認します。なお、「デジタル化・AI導入補助金」（旧IT導入補助金）は、登録されたITツールの導入が対象のため、dreamLabの支援には使えません。'
      }
    },
    {
      '@type': 'Question',
      name: '社内にITに詳しい人がいません。',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '問題ありません。仕組みを回す担当の方を、伴走の中で一緒に育てます。'
      }
    },
    {
      '@type': 'Question',
      name: '伴走の費用はどのくらいですか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '内容と期間によって変わるため、業務効率化・仕組み化診断の最後に、費用と効果の見込みをお出しします。AIの設計・構築・実装の費用は、別途お見積もりします。'
      }
    }
  ]
};

export const SESSION_FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'AIに詳しくなくても大丈夫ですか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '大丈夫です。専門用語を使わずにお話しします。AIを使うかどうかも、課題を整理したあとに一緒に決めます。'
      }
    },
    {
      '@type': 'Question',
      name: '90分だけの利用でもいいですか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'はい。その後のご提案を無理にすすめることはありません。'
      }
    },
    {
      '@type': 'Question',
      name: 'セッションのあと、診断に進む場合の料金は？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'セッションから30日以内に経営診断、または業務効率化・仕組み化診断をお申し込みいただくと、セッション料金の50,000円（税抜）を診断料金から差し引きます。'
      }
    },
    {
      '@type': 'Question',
      name: '決まった日時を変更したいときは？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '日程確定メールへの返信、またはお電話（050-6869-4334）でご連絡ください。前日まで1回、無料で変更できます。'
      }
    },
    {
      '@type': 'Question',
      name: 'どんな準備が必要ですか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '事前シート（5問・10分ほど）へのご記入だけです。決算書などの資料は必須ではありません。'
      }
    },
    {
      '@type': 'Question',
      name: '社長以外（後継者・役員）でも申し込めますか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'はい。優先順位を決める場なので、できれば社長にも同席いただくことをおすすめします。'
      }
    },
    {
      '@type': 'Question',
      name: '秘密は守られますか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '伺った内容を、ご了承なく外部に出すことはありません。ご希望に応じて秘密保持契約を結びます。詳しくは秘密保持に関する方針をご覧ください。'
      }
    },
    {
      '@type': 'Question',
      name: '県外からでも申し込めますか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'オンラインで対応します。'
      }
    },
    {
      '@type': 'Question',
      name: '領収書は出ますか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'カード決済の場合は決済後に自動でお送りします。銀行振込の場合は、ご希望に応じて発行します。'
      }
    }
  ]
};
