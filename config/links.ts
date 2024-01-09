import { Navigation } from "@/types"

export const navLinks: Navigation = {
  data: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Dashboard",
      href: "/dashboard/streams",
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
      title: "Unlock",
      href: "/dashboard/unlock",
      icon: "unlock",
    }
  ],
}
