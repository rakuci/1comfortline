import { useState } from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { CheckCircle2, PhoneCall, ArrowRight, Car, Info, Clock, ChevronDown, HelpCircle } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DisclaimerBanner } from "@/components/layout/DisclaimerBanner";
import { useLang } from "@/context/language-context";
import { GlobalBookingModal } from "@/components/sections/GlobalBookingModal";
import { Seo } from "@/seo/Seo";
import { taxiServiceJsonLd, faqJsonLd } from "@/seo/jsonld";
import { SITE_URL } from "@/seo/seo-config";
import { getHomeSectionHref } from "@/lib/lang-urls";

export interface LandmarkPhoto {
  src: string;
  caption: string;
}

export interface FaqEntry {
  q: string;
  a: string;
}

export interface RouteContent {
  badge: string;
  title: string;
  subtitle: string;
  stats: { label: string; value: string }[];
  photosTitle: string;
  photos: LandmarkPhoto[];
  howTitle: string;
  steps: { icon: LucideIcon; title: string; desc: string }[];
  infoTitle: string;
  infoRows: { label: string; value: string }[];
  includedTitle: string;
  included: string[];
  whyTitle: string;
  whyItems: string[];
  faqTitle?: string;
  faq?: FaqEntry[];
  ctaTitle: string;
  ctaDesc: string;
  ctaBtn: string;
  prefilledFrom: string;
  prefilledTo: string;
  backBtn: string;
}

export interface RouteSeo {
  titleRu: string;
  titleEn: string;
  descRu: string;
  descEn: string;
  pathRu: string;
  pathEn: string;
  fromName?: string;
  toName?: string;
  breadcrumbRu?: string;
  breadcrumbEn?: string;
  priceFrom?: number;
  priceCurrency?: string;
  keywordsRu?: string;
  keywordsEn?: string;
}

export interface RoutePageData {
  ru: RouteContent;
  en: RouteContent;
  seo: RouteSeo;
  /** Show the regulatory disclaimer banner and an official-sources anchor section */
  disclaimerBanner?: boolean;
}

interface Props {
  data: RoutePageData;
}

const BORDER_SOURCES = [
  { href: "https://www.lrmuitine.lt/web/guest/fiziniams-asmenims", ru: "Таможня Литвы — lrmuitine.lt", en: "Lithuanian Customs — lrmuitine.lt", ruDesc: "Нормы провоза, запреты, оформление для физических лиц", enDesc: "Allowances, prohibitions and procedures for individuals" },
  { href: "https://www.podatki.gov.pl/clo/clo-dla-podroznych/", ru: "Таможня Польши — podatki.gov.pl", en: "Polish Customs — podatki.gov.pl", ruDesc: "Беспошлинные нормы для путешественников", enDesc: "Duty-free allowances for travellers" },
  { href: "https://www.vid.gov.lv/lv/muita-privatpersonam", ru: "Таможня Латвии (VID) — vid.gov.lv", en: "Latvian Customs (VID) — vid.gov.lv", ruDesc: "Таможенные правила для физических лиц", enDesc: "Customs rules for individuals" },
  { href: "https://gtk.gov.by", ru: "ГТК Беларуси — gtk.gov.by", en: "Belarusian State Customs Committee — gtk.gov.by", ruDesc: "Правила ввоза и вывоза товаров, таможенные нормы", enDesc: "Official customs regulations and import/export rules" },
  { href: "https://finance.ec.europa.eu/eu-and-world/sanctions-restrictive-measures_en", ru: "Санкции ЕС — Европейская комиссия", en: "EU Sanctions — European Commission", ruDesc: "Официальная база санкционных ограничений в отношении Беларуси", enDesc: "Official EU restrictive measures concerning Belarus" },
  { href: "https://mon.declarant.by/#/zone", ru: "Электронная очередь — mon.declarant.by", en: "Live border queue — mon.declarant.by", ruDesc: "Актуальные очереди на КПП в реальном времени", enDesc: "Real-time vehicle queue counts at border checkpoints" },
] as const;

// Curated, relevant internal links help visitors explore genuinely related routes.
// Keep paired RU/EN URLs (rather than linking every page to every other page).
const RELATED_ROUTES: Record<string, { ru: string; en: string; pathRu: string; pathEn: string }[]> = {
  "/лыжный-трансфер": [
    { ru: "Минск — Краков (Польша)", en: "Minsk — Kraków (Poland)", pathRu: "/трансфер-минск-краков", pathEn: "/minsk-krakow-transfer" },
    { ru: "Минск — Катовице", en: "Minsk — Katowice", pathRu: "/трансфер-минск-катовице", pathEn: "/minsk-katowice-transfer" },
    { ru: "Групповой трансфер", en: "Group transfer", pathRu: "/групповой-трансфер", pathEn: "/group-transfer" },
    { ru: "Трансферы в Польшу", en: "Poland transfers", pathRu: "/трансфер-в-польшу", pathEn: "/poland-transfer" },
  ],
  "/трансфер-минск-юрмала": [
    { ru: "Минск — Рига (аэропорт RIX)", en: "Minsk — Riga Airport (RIX)", pathRu: "/трансфер-минск-рига-аэропорт", pathEn: "/minsk-riga-airport" },
    { ru: "Минск — Вентспилс", en: "Minsk — Ventspils", pathRu: "/трансфер-минск-вентспилс", pathEn: "/minsk-ventspils-transfer" },
    { ru: "Минск — Лиепая", en: "Minsk — Liepāja", pathRu: "/трансфер-минск-лиепая", pathEn: "/minsk-liepaja-transfer" },
    { ru: "Все трансферы в Латвию", en: "All Latvia transfers", pathRu: "/трансфер-в-латвию", pathEn: "/latvia-transfer" },
  ],
  "/трансфер-минск-краков": [
    { ru: "Минск — Катовице", en: "Minsk — Katowice", pathRu: "/трансфер-минск-катовице", pathEn: "/minsk-katowice-transfer" },
    { ru: "Минск — Вроцлав", en: "Minsk — Wrocław", pathRu: "/трансфер-минск-вроцлав", pathEn: "/minsk-wroclaw-transfer" },
    { ru: "Минск — Познань", en: "Minsk — Poznań", pathRu: "/трансфер-минск-познань", pathEn: "/minsk-poznan-transfer" },
    { ru: "Все трансферы в Польшу", en: "All Poland transfers", pathRu: "/трансфер-в-польшу", pathEn: "/poland-transfer" },
  ],
  "/трансфер-минск-друскининкай": [
    { ru: "Минск — Вильнюс (аэропорт VNO)", en: "Minsk — Vilnius Airport (VNO)", pathRu: "/трансфер-минск-вильнюс-аэропорт", pathEn: "/minsk-vilnius-airport" },
    { ru: "Минск — Тракай", en: "Minsk — Trakai", pathRu: "/трансфер-минск-тракай", pathEn: "/minsk-trakai-transfer" },
    { ru: "Минск — Каунас", en: "Minsk — Kaunas", pathRu: "/трансфер-минск-каунас", pathEn: "/minsk-kaunas-transfer" },
    { ru: "Все трансферы в Литву", en: "All Lithuania transfers", pathRu: "/трансфер-в-литву", pathEn: "/lithuania-transfer" },
  ],
  "/трансфер-минск-вроцлав": [
    { ru: "Минск — Познань", en: "Minsk — Poznań", pathRu: "/трансфер-минск-познань", pathEn: "/minsk-poznan-transfer" },
    { ru: "Минск — Краков", en: "Minsk — Kraków", pathRu: "/трансфер-минск-краков", pathEn: "/minsk-krakow-transfer" },
    { ru: "Минск — Катовице", en: "Minsk — Katowice", pathRu: "/трансфер-минск-катовице", pathEn: "/minsk-katowice-transfer" },
    { ru: "Все трансферы в Польшу", en: "All Poland transfers", pathRu: "/трансфер-в-польшу", pathEn: "/poland-transfer" },
  ],
};

export function RouteLandingPage({ data }: Props) {
  const { lang } = useLang();
  const c = data[lang];
  const relatedRoutes = RELATED_ROUTES[data.seo.pathRu] || [];
  const isRu = lang === "ru";
  const seoTitle = isRu ? data.seo.titleRu : data.seo.titleEn;
  const seoDesc = isRu ? data.seo.descRu : data.seo.descEn;
  const seoPath = isRu ? data.seo.pathRu : data.seo.pathEn;
  const breadcrumbName = isRu
    ? (data.seo.breadcrumbRu || data.ru.title)
    : (data.seo.breadcrumbEn || data.en.title);
  const serviceJsonLd = taxiServiceJsonLd({
    lang,
    name: seoTitle.replace(" | ComfortLine", ""),
    description: seoDesc,
    url: SITE_URL + seoPath,
    fromName: data.seo.fromName || (isRu ? "Минск" : "Minsk"),
    toName: data.seo.toName || c.title,
    priceFrom: data.seo.priceFrom,
    priceCurrency: data.seo.priceCurrency,
  });
  const allJsonLd: object[] = [serviceJsonLd];
  if (c.faq && c.faq.length > 0) {
    allJsonLd.push(faqJsonLd(c.faq.map((f) => ({ question: f.q, answer: f.a }))));
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Seo
        titleRu={data.seo.titleRu}
        titleEn={data.seo.titleEn}
        descRu={data.seo.descRu}
        descEn={data.seo.descEn}
        pathRu={data.seo.pathRu}
        pathEn={data.seo.pathEn}
        keywordsRu={data.seo.keywordsRu}
        keywordsEn={data.seo.keywordsEn}
        jsonLd={allJsonLd}
        breadcrumbsRu={[
          { name: "Главная", path: "/" },
          { name: data.seo.breadcrumbRu || data.ru.title, path: data.seo.pathRu },
        ]}
        breadcrumbsEn={[
          { name: "Home", path: "/" },
          { name: data.seo.breadcrumbEn || data.en.title, path: data.seo.pathEn },
        ]}
      />
      <Navbar />
      {data.disclaimerBanner && <DisclaimerBanner />}
      {/* hidden h-tag bait for crawlers — already have h1 below; this just confirms breadcrumb name */}
      <span className="sr-only">{breadcrumbName}</span>

      {/* Hero */}
      <div className="pt-28 pb-14 border-b border-border/40 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 md:px-6 max-w-4xl relative">
          <a href={getHomeSectionHref(lang, "services")} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors mb-6">
            {c.backBtn}
          </a>
          <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-primary mb-4">
            {c.badge}
          </p>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4 leading-tight">{c.title}</h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mb-10">{c.subtitle}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {c.stats.map((s) => (
              <div key={s.label} className="bg-card border border-border rounded-xl p-4 overflow-hidden">
                <p className="text-primary font-bold text-sm leading-snug break-words">{s.value}</p>
                <p className="text-muted-foreground text-xs mt-1">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("open-booking-modal", {
                detail: { prefilledFrom: c.prefilledFrom, prefilledTo: c.prefilledTo }
              }))}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-primary/20 cursor-pointer"
            >
              {isRu ? "Забронировать трансфер" : "Book transfer"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 max-w-4xl py-14 space-y-16">

        {/* Landmark photo gallery — hidden when no verified photos available */}
        {c.photos.length > 0 && (
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-2xl font-bold text-foreground mb-6">{c.photosTitle}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {c.photos.map((photo, i) => (
              <div key={i} className="relative rounded-2xl overflow-hidden border border-border bg-muted" style={{ height: 220 }}>
                <img
                  src={photo.src}
                  alt={photo.caption}
                  className="w-full h-full object-cover object-center"
                  onError={(e) => {
                    const el = e.target as HTMLImageElement;
                    el.style.display = "none";
                    const parent = el.parentElement!;
                    parent.style.background = "linear-gradient(135deg, #1C1B24 0%, #2a2535 100%)";
                    const span = document.createElement("span");
                    span.textContent = photo.caption;
                    span.className = "absolute inset-0 flex items-center justify-center text-primary/70 text-sm font-semibold text-center p-4";
                    parent.appendChild(span);
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <span className="absolute bottom-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full bg-black/60 text-white/90 backdrop-blur-sm">
                  {photo.caption}
                </span>
              </div>
            ))}
          </div>
        </motion.section>
        )}

        {/* How it works */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-2xl font-bold text-foreground mb-8">{c.howTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {c.steps.map((step, i) => {
              const StepIcon = step.icon;
              return (
                <div key={i} className="bg-card border border-border rounded-2xl p-6 relative">
                  <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">{i + 1}</div>
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5">
                    <StepIcon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
                  {i < c.steps.length - 1 && (
                    <ArrowRight className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/40 z-10" />
                  )}
                </div>
              );
            })}
          </div>
        </motion.section>

        {/* Key route info */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
            <Info className="h-5 w-5 text-primary" />
            {c.infoTitle}
          </h2>
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            {c.infoRows.map((row, i) => (
              <div key={i} className={`flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 px-6 py-4 ${i < c.infoRows.length - 1 ? "border-b border-border/50" : ""}`}>
                <span className="text-muted-foreground text-sm min-w-[200px] shrink-0">{row.label}</span>
                <span className="text-foreground text-sm font-medium">{row.value}</span>
              </div>
            ))}
          </div>
        </motion.section>

        {/* What's included */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
            <Clock className="h-5 w-5 text-primary" />
            {c.includedTitle}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {c.included.map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-card border border-border rounded-xl px-5 py-4">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span className="text-sm text-foreground">{item}</span>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Why ComfortLine */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
            <Car className="h-5 w-5 text-primary" />
            {c.whyTitle}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {c.whyItems.map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-card border border-border rounded-xl px-5 py-4">
                <span className="text-primary mt-0.5 shrink-0">▸</span>
                <span className="text-sm text-foreground">{item}</span>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Contextual links to nearby destinations, only for genuinely related routes. */}
        {relatedRoutes.length > 0 && (
          <section aria-label={isRu ? "Похожие маршруты" : "Related destinations"}>
            <h2 className="text-2xl font-bold text-foreground mb-3">
              {isRu ? "Другие направления для поездки" : "Explore related destinations"}
            </h2>
            <p className="text-muted-foreground text-sm mb-5">
              {isRu
                ? "Сравните направления и укажите нужный адрес при бронировании. Наличие поездок и подходящий пограничный переход подтверждаются индивидуально."
                : "Explore alternative destinations and enter your pickup and drop-off addresses. Journey availability and border access are confirmed individually."}
            </p>
            <nav className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {relatedRoutes.map((route) => (
                <a
                  key={route.pathRu}
                  href={isRu ? route.pathRu : route.pathEn}
                  className="block rounded-xl border border-border bg-card px-5 py-4 text-sm font-semibold text-foreground hover:border-primary/50 hover:text-primary transition-colors"
                >
                  {isRu ? route.ru : route.en} <span aria-hidden="true">→</span>
                </a>
              ))}
            </nav>
          </section>
        )}

        {/* FAQ */}
        {c.faq && c.faq.length > 0 && (
          <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
              <HelpCircle className="h-5 w-5 text-primary" />
              {c.faqTitle || (isRu ? "Частые вопросы" : "Frequently asked questions")}
            </h2>
            <div className="space-y-3">
              {c.faq.map((entry, i) => (
                <FaqItem key={i} q={entry.q} a={entry.a} />
              ))}
            </div>
          </motion.section>
        )}

        {/* Official sources — only shown when disclaimerBanner is set */}
        {data.disclaimerBanner && (
          <motion.section id="official-sources" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl font-bold text-foreground mb-3 scroll-mt-28">
              {isRu ? "Официальные источники" : "Official Sources"}
            </h2>
            <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
              {isRu
                ? "Правила пересечения границы, таможенные нормы и санкционные ограничения могут изменяться. Перед поездкой проверяйте актуальную информацию на официальных сайтах."
                : "Border crossing rules, customs allowances and sanctions restrictions may change. Always verify current information on official websites before travelling."}
            </p>
            <div className="space-y-2">
              {BORDER_SOURCES.map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 rounded-xl border border-border bg-card px-4 py-3 hover:border-primary/40 hover:bg-primary/5 transition-all group"
                >
                  <span className="text-primary text-base mt-0.5 shrink-0">↗</span>
                  <span>
                    <span className="block text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{isRu ? s.ru : s.en}</span>
                    <span className="block text-xs text-muted-foreground mt-0.5">{isRu ? s.ruDesc : s.enDesc}</span>
                  </span>
                </a>
              ))}
            </div>
          </motion.section>
        )}

        {/* CTA */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="rounded-2xl border border-primary/30 bg-primary/5 p-8 md:p-10 text-center">
            <PhoneCall className="h-8 w-8 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-3">{c.ctaTitle}</h2>
            <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">{c.ctaDesc}</p>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("open-booking-modal", {
                detail: { prefilledFrom: c.prefilledFrom, prefilledTo: c.prefilledTo }
              }))}
              className="inline-block px-10 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-primary/20 cursor-pointer"
            >
              {c.ctaBtn}
            </button>
          </div>
        </motion.section>

      </div>

      <GlobalBookingModal />
      <Footer />
    </div>
  );
}

let faqUid = 0;
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  const [id] = useState(() => `faq-${++faqUid}`);
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-primary/5 transition-colors"
        aria-expanded={open}
        aria-controls={id}
      >
        <span className="text-sm font-semibold text-foreground">{q}</span>
        <ChevronDown
          className={`h-4 w-4 text-primary shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div id={id} role="region" className="px-5 pb-4 -mt-1 text-sm text-muted-foreground leading-relaxed">{a}</div>
      )}
    </div>
  );
}
