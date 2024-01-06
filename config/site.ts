import { SiteConfig } from "@/types"

import { env } from "@/env.mjs"

export const siteConfig: SiteConfig = {
  name: "SimplyStream",
  author: "zer0dt",
  description:
    "Setup a stream of bitcoin to unlock in the future.",
  keywords: [
    
  ],
  url: {
    base: env.NEXT_PUBLIC_APP_URL,
    author: "https://twitter.com/zer0_dt_",
  },
  links: {
    github: "https://github.com/zer0dt/simply-stream",
  },
  ogImage: `${env.NEXT_PUBLIC_APP_URL}/og.jpg`,
}
