'use client'

import Image from "next/image"

import { cn } from "@/lib/utils"
import { buttonVariants } from "../ui/button"
import Link from "next/link"
import { siteConfig } from "@/config/site"
import { Icons } from "../icons"
import { ImageFrame } from "@/components/image-frame"

const videoId = "FKUdU4xyP0w"

export default function HeroHeader() {
  return (
    <>
      <section className="space-y-8 pb-12 pt-4 md:space-y-16 md:pt-10 lg:py-32">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <h1
            className="rounded-2xl bg-muted px-4 py-1.5 text-sm font-medium"
          >
            Experimental. Use at your own risk!
          </h1>
          <h1 className="text-4xl font-semibold sm:text-5xl md:text-6xl lg:text-7xl">
            Lock your bitcoin.
          </h1>
          <div className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            <p>Setup a stream of bitcoins to unlock in the future.</p>
            <p>Lock in on generational wealth.</p>
          </div>

          <div className="flex gap-4">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/Panda-Wallet/panda-wallet/releases/tag/v2.11.3"
              className={cn(buttonVariants({ variant: "secondary" }))}
            >
              Panda Wallet
            </a>
            <Link
              href={siteConfig.links.github}
              target="_blank"
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              <Icons.github className="mr-2 h-4 w-4" />
              <span>GitHub</span>
            </Link>
          </div>
        </div>
        <div className="flex justify-center mx-auto max-w-6xl px-6 lg:px-8">
        <ImageFrame>
            <Image
              className="rounded-lg"
              src="/images/lockstream-image.jpg"
              width={500}
              height={500}
              quality={100}
              alt="Header image"
            />
          </ImageFrame>
        </div>
      </section>
    </>
  )
}
