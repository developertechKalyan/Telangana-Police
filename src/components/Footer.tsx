import { Link } from "react-router-dom";
import { FaInstagram, FaFacebook, FaXTwitter, FaYoutube } from "react-icons/fa6";
import { LuPhoneCall, LuMapPin, LuClock } from "react-icons/lu";
import { socialLinks, EMERGENCY_NUMBER } from "@/data/nav";
import { contactInfo } from "@/data/contact";
import { EmergencyButton } from "@/components/EmergencyButton";
import { HoverUnderline } from "@/components/ui/HoverUnderline";
import { useT } from "@/contexts/LanguageContext";
import { ui } from "@/i18n/ui";
// import policeLogo from "@/assets/logo.png";
import erssLogo from "@/assets/dial100.png";
import tgiccLogo from "@/assets/tgic.png";

const iconMap = {
  instagram: FaInstagram,
  facebook: FaFacebook,
  twitter: FaXTwitter,
  youtube: FaYoutube,
};

const HEADQUARTERS_MAP_URL = "https://maps.app.goo.gl/53GDDGzRt36ZeGRd9";

const quickLinks = [
  { label: ui.common.home, path: "/" },
  { label: ui.footer.quickLinkAbout, path: "/about" },
  { label: ui.nav.services, path: "/services" },
  { label: ui.nav.reachUs, path: "/reach-us" },
  { label: ui.nav.resources, path: "/resources" },
  { label: ui.nav.contact, path: "/contact" },
];

export function Footer() {
  const t = useT();
  return (
    <footer className="bg-navy-950 text-navy-200">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <Link to="/" className="inline-block">
            {/* <img src={policeLogo} alt="Telangana Police Dial 112" className="h-auto w-28" /> */}
          </Link>
          <div className="mt-4 flex items-center gap-3">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white p-1.5">
              <img src={erssLogo} alt="Emergency Response Support System — Dial 112" className="h-full w-full object-contain" />
            </span>
            <img src={tgiccLogo} alt="Telangana Integrated Command and Control Centre" className="h-14 w-auto" />
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-navy-300">{t(ui.footer.tagline)}</p>
          <EmergencyButton size="sm" className="mt-5" />
          <div className="mt-5 flex gap-3">
            {socialLinks.map((social) => {
              const Icon = iconMap[social.icon];
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-800 text-navy-200 transition-colors hover:bg-brand-600 hover:text-white"
                >
                  <Icon size={16} />
                </a>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-accent-400">{t(ui.footer.quickLinks)}</h3>
          <ul className="mt-4 space-y-2.5 border-t border-navy-800 pt-4 text-sm">
            {quickLinks.map((link) => (
              <li key={link.path}>
                <Link to={link.path} className="group inline-flex items-center gap-1.5 transition-colors hover:text-white">
                  <span className="text-accent-500">›</span>
                  <HoverUnderline>{t(link.label)}</HoverUnderline>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-accent-400">{t(ui.footer.emergency)}</h3>
          <ul className="mt-4 space-y-2.5 border-t border-navy-800 pt-4 text-sm">
            <li className="flex items-center gap-1.5">
              <span className="text-accent-500">›</span>
              {t(ui.footer.universal)}:{" "}
              <a href={`tel:${EMERGENCY_NUMBER}`} className="group font-mono font-semibold text-white">
                <HoverUnderline>{EMERGENCY_NUMBER}</HoverUnderline>
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-accent-400">{t(ui.footer.contact)}</h3>
          <div className="mt-4 space-y-4">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 flex-none items-center justify-center rounded-lg border border-accent-500/30 bg-navy-900 text-accent-400">
                <LuPhoneCall size={15} />
              </span>
              <div>
                <p className="text-[10px] font-medium tracking-wide text-navy-400 uppercase">{t(ui.footer.emergency)}</p>
                <a href={`tel:${EMERGENCY_NUMBER}`} className="font-mono text-lg font-bold text-accent-400">
                  {EMERGENCY_NUMBER}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 flex-none items-center justify-center rounded-lg border border-accent-500/30 bg-navy-900 text-accent-400">
                <LuMapPin size={15} />
              </span>
              <div>
                <p className="text-[10px] font-medium tracking-wide text-navy-400 uppercase">{t(ui.footer.address)}</p>
                <a
                  href={HEADQUARTERS_MAP_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="max-w-64 text-sm leading-snug text-navy-200 hover:text-white hover:underline"
                >
                  {t(contactInfo.headquarters)}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 flex-none items-center justify-center rounded-lg border border-accent-500/30 bg-navy-900 text-accent-400">
                <LuClock size={15} />
              </span>
              <div>
                <p className="text-[10px] font-medium tracking-wide text-navy-400 uppercase">{t(ui.footer.availability)}</p>
                <p className="text-sm font-medium text-navy-200">{t(contactInfo.availability)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-navy-800">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-navy-400 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>{t(ui.footer.copyright)}</p>
          <div className="flex items-center gap-4">
            <p>{t(ui.footer.govOf)}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
