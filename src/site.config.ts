import type { CardListData, Config, IntegrationUserConfig, ThemeUserConfig } from './types'

export const theme: ThemeUserConfig = {
  // === Basic configuration ===
  /** Title for your website. Will be used in metadata and as browser tab title. */
  title: "Liang Jo-shui",
  /** Will be used in index page & copyright declaration */
  author: '梁若水',
  author_en: 'Liang Jo-shui',
  /** Description metadata for your website. Can be used in page metadata. */
  description: '梁若水的个人主页与博客。华南理工大学软件工程本科在读，关注大模型。',
  description_en: 'Liang Jo-shui — Software Engineering undergraduate at South China University of Technology, interested in large language models.',
  /** The default favicon for your site which should be a path to an image in the `public/` directory. */
  favicon: '/favicon.svg',
  /** Specify the default language for this site. */
  locale: {
    lang: 'zh-CN',
    attrs: 'zh_CN',
    // Date locale
    dateLocale: 'en-US',
    dateOptions: {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }
  },
  /** Set a logo image to show in the homepage. */
  logo: {
    src: 'src/assets/avatar.png',
    alt: 'Avatar'
  },

  // === Global configuration ===
  titleDelimiter: '•',
  prerender: true,
  npmCDN: 'https://cdn.jsdelivr.net/npm',

  // in test
  head: [],
  customCss: [],

  /** Configure the header of your site. */
  header: {
    title: 'Liang Jo-shui',
    menu: [
      { title: '博客', link: '/blog/all' },
      { title: '研究', link: '/academic' },
      { title: '友链', link: '/links' },
      { title: '关于', link: '/about' }
    ]
  },

  /** Configure the footer of your site. */
  footer: {
    // Registration information for ICP (optional)
    registration: {
      // url: '',
      // text: '',
      // website: '' // only show ICP if url === website
    },
    /** Enable displaying a "Astro & Axi theme powered" link in your site's footer. */
    credits: true,
    /** Optional details about the social media accounts for this site. */
    social: { github: 'https://github.com/LeonWater1/LeonWater1.github.io' }
  },

  content: {
    externalLinksContent: ' ↗',
    /** Blog page size for pagination (optional) */
    blogPageSize: 15,
    externalLinkArrow: true, // show external link arrow
    // Currently support weibo, x, bluesky
    share: ['weibo', 'x', 'bluesky']
  },

  /** Personal information configuration */
  personal: {
    /** Your location */
    location: 'China',
    /** Your GitHub username */
    githubUsername: 'LeonWater1',
    /** Your email address */
    email: 'l3onwat3r@gmail.com',
    /** Your Google Scholar profile URL */
    googleScholar: '',
    /** Blog start date for statistics */
    blogStartDate: '2026-09-19',
    /** Domain configuration */
    domains: {
      main: 'leonwater1.github.io',
      // githubPages: '',
      // cloudflare: '',
      // friendCircle: '',
    },
  }
}

export const integ: IntegrationUserConfig = {
  links: {
    logbook: [
    ],
    // Yourself link info
    applyTip: [
      { name: 'Name', val: theme.title },
      { name: 'Desc', val: theme.description || 'Null' },
      { name: 'Link', val: `https://${theme.personal?.domains?.main || 'example.com'}` },
      { name: 'Avatar', val: `https://${theme.personal?.domains?.main || 'example.com'}/avatar/avatar.png` }
    ]
  },
  // Enable page search function
  pagefind: true,
  // Add a random quote to the footer (default on homepage footer)
  quote: {
    // https://developer.hitokoto.cn/sentence/#%E8%AF%B7%E6%B1%82%E5%9C%B0%E5%9D%80
    // server: 'https://v1.hitokoto.cn/?c=i',
    // target: (data) => (data as { hitokoto: string }).hitokoto || 'Error'
    // https://github.com/lukePeavey/quotable
    server: '',
    target: `(data) => data[0].content || 'Error'`
  },
  // Tailwindcss typography
  typography: {
    // https://github.com/tailwindlabs/tailwindcss-typography
    class:
      'break-words prose prose-axi dark:prose-invert dark:prose-axi prose-headings:font-medium'
  },
  // A lightbox library that can add zoom effect
  mediumZoom: {
    enable: true, // disable it will not load the whole library
    selector: '.prose .zoomable',
    options: {
      className: 'zoomable'
    }
  },
}

export const terms: CardListData = {
  title: '使用与内容说明',
  list: [
    {
      title: '隐私说明',
      link: '/terms/privacy-policy'
    },
    {
      title: '网站使用说明',
      link: '/terms/terms-and-conditions'
    },
    {
      title: '版权说明',
      link: '/terms/copyright'
    },
    {
      title: '内容说明',
      link: '/terms/disclaimer'
    }
  ]
}

const config = { ...theme, integ } as Config
export const englishTerms: CardListData = {
  title: 'Using the site and its content',
  list: [
    { title: 'Privacy', link: '/en/terms/privacy-policy' },
    { title: 'Using This Website', link: '/en/terms/terms-and-conditions' },
    { title: 'Copyright', link: '/en/terms/copyright' },
    { title: 'About the Content', link: '/en/terms/disclaimer' }
  ]
}
export default config
