import { Navigation } from "@/types"

export const navLinks: Navigation = {
  data: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Streams",
      href: "/dashboard/streams",
    },
    {
      title: "Broadcast",
      href: "/dashboard/broadcast",
    }
  ],
}

export const dashboardLinks: Navigation = {
  data: [
    {
      title: "Streams",
      href: "/dashboard/streams",
      icon: "lock",
    },
    {
      title: "Broadcast",
      href: "/dashboard/broadcast",
      icon: "unlock",
    }
  ],
}
