import type { NavLink, SocialLink } from "@/types/content";
import { ui } from "@/i18n/ui";

export const navLinks: NavLink[] = [
  { label: ui.nav.home, path: "/" },
  { label: ui.nav.about, path: "/about" },
  { label: ui.nav.services, path: "/services" },
  {
    label: ui.nav.getHelp,
    path: "/reach-us",
    children: [
      { label: ui.nav.reachUs, path: "/reach-us" },
      { label: ui.nav.whenToCall, path: "/when-to-call" },
      { label: ui.nav.whatHappens, path: "/what-happens" },
      { label: ui.nav.findYou, path: "/find-you" },
      { label: ui.nav.resources, path: "/resources" },
    ],
  },
  { label: ui.nav.gallery, path: "/gallery" },
  { label: ui.nav.contact, path: "/contact" },
];

export const socialLinks: SocialLink[] = [
  { label: "Facebook", href: "https://www.facebook.com/112Telangana/", icon: "facebook" },
  { label: "Instagram", href: "https://www.instagram.com/112telangana", icon: "instagram" },
  { label: "X / Twitter", href: "https://x.com/112Telangana", icon: "twitter" },
  { label: "YouTube", href: "https://www.youtube.com/@112-Telangana", icon: "youtube" },
];

export const EMERGENCY_NUMBER = "112";
