// 主题独有配置
import { getThemeConfig } from '@sugarat/theme/node';

// 开启RSS支持（RSS配置）
// import type { Theme } from '@sugarat/theme'

// const baseUrl = 'https://sugarat.top'
// const RSS: Theme.RSSOptions = {
//   title: '粥里有勺糖',
//   baseUrl,
//   copyright: 'Copyright (c) 2018-present, 粥里有勺糖',
//   description: '你的指尖,拥有改变世界的力量（大前端相关技术分享）',
//   language: 'zh-cn',
//   image: 'https://img.cdn.sugarat.top/mdImg/MTY3NDk5NTE2NzAzMA==674995167030',
//   favicon: 'https://sugarat.top/favicon.ico',
// }

// 所有配置项，详见文档: https://theme.sugarat.top/
const blogTheme = getThemeConfig({
  // 开启RSS支持
  // RSS,

  // 搜索
  // 默认开启pagefind离线的全文搜索支持（如使用其它的可以设置为false）
  // 如果npx pagefind 时间过长，可以手动将其安装为项目依赖 pnpm add pagefind
  search: false,
  mermaid: false,
  // giscus comment system
  comment: {
    repo: 'qyuzh/my-blog',
    repoId: 'R_kgDOK_D3NQ',
    category: 'Announcements',
    categoryId: 'DIC_kwDOK_D3Nc4Ccjmf',
    loading: 'eager',
    mapping: 'url',
    lang: 'en'
  },
  // 页脚
  footer: {
    version: false,
    copyright: '2022-present | qyuzh',
    icpRecord: {
      name: '渝ICP备2023000878号',
      link: 'https://beian.miit.gov.cn/#/Integrated/index',
    },
    securityRecord: {
      name: '粤公网安备 44030702005297号',
      link: 'http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=44030702005297',
    },
  },
  // 主题色修改
  themeColor: 'el-blue',
  // 文章默认作者
  author: 'qyuzh',
  friend: [
    {
      nickname: '粥里有勺糖',
      des: '你的指尖用于改变世界的力量',
      avatar:
        'https://img.cdn.sugarat.top/mdImg/MTY3NDk5NTE2NzAzMA==674995167030',
      url: 'https://sugarat.top',
    },
    {
      nickname: '阮一峰',
      des: '阮一峰的网络日志',
      avatar: {
        alt: '的网络日志',
        src: 'https://www.ruanyifeng.com/blog/images/person2_s.jpg',
      },
      url: 'https://www.ruanyifeng.com/blog/archives.html',
    },
  ],
});

export { blogTheme };
