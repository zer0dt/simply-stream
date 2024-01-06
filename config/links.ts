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
  ],
}

export const dashboardLinks: Navigation = {
  data: [
    {
      title: "Streams",
      href: "/dashboard/streams",
      icon: "activity",
    }
  ],
}
