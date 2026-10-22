import { motion } from "framer-motion";
import { Plane, Clock, MapPin, Car, ArrowRight, Info, CheckCircle2, PhoneCall, ShieldCheck } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { DisclaimerBanner, BorderOfficialSources } from "@/components/layout/DisclaimerBanner";
import { Footer } from "@/components/layout/Footer";
import { useLang } from "@/context/language-context";
import { GlobalBookingModal } from "@/components/sections/GlobalBookingModal";
import { Seo } from "@/seo/Seo";
import { taxiServiceJsonLd } from "@/seo/jsonld";
import { SITE_URL } from "@/seo/seo-config";
import { getHomeSectionHref } from "@/lib/lang-urls";

const content = {
  ru: {
    badge: "Трансфер",
    title: "Трансфер Минск — Аэропорт Риги (RIX)",
    subtitle: "Индивидуальный трансфер из Минска в международный аэропорт Риги (RIX). Подача от двери, фиксированная цена, опытный водитель и помощь на границе Беларусь–Латвия.",
    seoIntro: "Заказать трансфер Минск — Рига аэропорт можно онлайн или по телефону. Цена фиксированная, без счётчика. Маршрут ~470 км через погранпереход Григоровщина / Патерниеки возможен при действующем допуске. Время поездки зависит от границы; статус КПП и электронной очереди проверяем перед подтверждением. Рижский международный аэропорт — крупнейший хаб Прибалтики с прямыми рейсами в Западную Европу, Скандинавию и СНГ.",
    stats: [
      { label: "Расстояние", value: "~470 км" },
      { label: "Время в пути", value: "5–8 ч" },
      { label: "Класс авто", value: "Комфорт / Бизнес" },
      { label: "Подача машины", value: "До двери" },
    ],
    howTitle: "Как проходит трансфер",
    steps: [
      { icon: MapPin, title: "Подача от двери", desc: "Водитель приедет к вашему адресу в Минске точно в назначенное время." },
      { icon: ShieldCheck, title: "Пересечение границы", desc: "Беларусь–Латвия через КПП Григоровщина / Патерниеки — при доступности для пассажирского транспорта. Перед поездкой проверяем режим КПП и электронную очередь." },
      { icon: Plane, title: "Прибытие в аэропорт", desc: "Доставим прямо к терминалу аэропорта Риги с запасом времени до вылета." },
    ],
    airportTitle: "Аэропорт Риги (RIX)",
    airportInfo: [
      { label: "Полное название", value: "Рижский международный аэропорт" },
      { label: "IATA код", value: "RIX" },
      { label: "Адрес", value: "Mārupes nov., Rīgas rajons, LV-1053, Латвия" },
      { label: "Терминалы", value: "1 терминал (все рейсы)" },
      { label: "Основные авиакомпании", value: "airBaltic, Ryanair, Wizz Air, LOT, Finnair, SAS" },
      { label: "Трансфер в центр", value: "Автобус №22 (30 мин), такси (20–25 мин)" },
    ],
    photosTitle: "Аэропорт в фото",
    photos: [
      { src: "/riga-airport-exterior.jpg", caption: "Терминал аэропорта Риги (RIX)" },
      { src: "/riga-airport-gate.jpg", caption: "Зона ворот аэропорта Риги" },
    ],
    tipsTitle: "Полезная информация",
    tips: [
      "Аэропорт работает круглосуточно, пик — раннее утро и вечер.",
      "Пограничный контроль Беларусь–Латвия: 1–4 часа, в пиковые дни — до 6 часов.",
      "Рекомендуем выезжать с запасом 5–6 часов до вылета.",
      "Бесплатный Wi-Fi и зоны ожидания во всём терминале.",
      "В аэропорту работают магазины Duty Free, кафе и залы бизнес-класса.",
      "airBaltic — базовая авиакомпания, летает в 70+ направлений из Риги.",
    ],
    whyTitle: "Почему ComfortLine",
    whyItems: [
      "Фиксированная цена без счётчика и скрытых доплат",
      "Опытный водитель с навыком пограничного перехода",
      "Детские кресла по запросу",
      "Встреча с табличкой при обратном трансфере из Риги",
      "Помощь с багажом",
      "Работаем 24/7, включая праздники",
    ],
    ctaTitle: "Забронировать трансфер",
    ctaDesc: "Оставьте заявку — менеджер свяжется с вами в ближайшее время и назовёт точную стоимость.",
    ctaBtn: "Оставить заявку",
    backBtn: "← Все услуги",
  },
  en: {
    badge: "Transfer",
    title: "Minsk to Riga Airport (RIX) Transfer",
    subtitle: "Private door-to-door transfer from Minsk to Riga International Airport (RIX). Fixed price, professional driver, full assistance at the Belarus–Latvia border.",
    seoIntro: "Book a Minsk to Riga airport transfer online or by phone. Fixed price, no meter, no surge. The ~470 km route via the Grigorovshchina / Pāternieki crossing depends on current access and queue rules. The border status is checked before confirming each journey. Riga International Airport is the Baltic region's largest hub with direct flights to Western Europe, Scandinavia and beyond.",
    stats: [
      { label: "Distance", value: "~470 km" },
      { label: "Travel time", value: "5–8 hrs" },
      { label: "Vehicle class", value: "Comfort / Business" },
      { label: "Pickup", value: "Door-to-door" },
    ],
    howTitle: "How the transfer works",
    steps: [
      { icon: MapPin, title: "Door pickup", desc: "Your driver arrives at your Minsk address exactly on time." },
      { icon: ShieldCheck, title: "Border crossing", desc: "Belarus–Latvia at the Grigorovshchina / Pāternieki checkpoint, subject to vehicle admission. We verify official border and electronic queue rules before departure." },
      { icon: Plane, title: "Airport arrival", desc: "Delivered directly to the Riga Airport terminal well ahead of your flight." },
    ],
    airportTitle: "Riga Airport (RIX)",
    airportInfo: [
      { label: "Full name", value: "Riga International Airport" },
      { label: "IATA code", value: "RIX" },
      { label: "Address", value: "Mārupes nov., Rīgas rajons, LV-1053, Latvia" },
      { label: "Terminals", value: "1 terminal (all flights)" },
      { label: "Main airlines", value: "airBaltic, Ryanair, Wizz Air, LOT, Finnair, SAS" },
      { label: "City transfer", value: "Bus #22 (30 min), taxi (20–25 min)" },
    ],
    photosTitle: "Airport Gallery",
    photos: [
      { src: "/riga-airport-exterior.jpg", caption: "Riga Airport terminal (RIX)" },
      { src: "/riga-airport-gate.jpg", caption: "Riga Airport departure gate" },
    ],
    tipsTitle: "Useful Information",
    tips: [
      "The airport operates 24/7. Peak hours are early morning and evening.",
      "Belarus–Latvia border crossing: 1–4 hours, up to 6 hours on busy days.",
      "We recommend departing 5–6 hours before your flight.",
      "Free Wi-Fi and waiting areas throughout the terminal.",
      "Duty Free shops, cafes and business lounges are all available.",
      "airBaltic is the home carrier — 70+ destinations from Riga.",
    ],
    whyTitle: "Why ComfortLine",
    whyItems: [
      "Fixed price — no meter, no hidden extras",
      "Driver experienced in border crossings",
      "Child seats available on request",
      "Name-board meet & greet for return transfers from Riga",
      "Luggage assistance included",
      "Available 24/7 including holidays",
    ],
    ctaTitle: "Book your transfer",
    ctaDesc: "Submit a request and our manager will contact you shortly with an exact price.",
    ctaBtn: "Request a booking",
    backBtn: "← All services",
  },
};

export default function MinskRigaAirportPage() {
  const { lang } = useLang();
  const c = content[lang];
  const isRu = lang === "ru";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Seo
        titleRu="Трансфер Минск — Аэропорт Риги (RIX) | ComfortLine"
        titleEn="Minsk to Riga Airport (RIX) Private Transfer | ComfortLine"
        descRu="Индивидуальный трансфер из Минска в международный аэропорт Риги (RIX). Фиксированная цена, подача от двери, опытный водитель, помощь на границе Беларусь–Латвия. ~470 км, 5–8 ч. Заказ онлайн или +375 (44) 762-06-49."
        descEn="Private door-to-door transfer from Minsk to Riga International Airport (RIX). Fixed price, professional driver, comfort or business class. ~470 km, 5–8 hrs incl. Belarus–Latvia border. Book online or call +375 (44) 762-06-49."
        pathRu="/трансфер-минск-рига-аэропорт"
        pathEn="/minsk-riga-airport"
        keywordsRu="трансфер минск рига, трансфер минск аэропорт риги, такси минск рига аэропорт, rix трансфер, минск rix трансфер, заказ авто в аэропорт риги, airbaltic минск, рига трансфер из минска"
        keywordsEn="minsk riga airport transfer, minsk to rix taxi, private transfer minsk riga, riga international airport ride, belarus latvia border transfer, airbaltic minsk riga"
        ogImage={`${SITE_URL}/og/minsk-riga-airport.jpg`}
        breadcrumbsRu={[
          { name: "Главная", path: "/" },
          { name: "Трансфер Минск — Аэропорт Риги (RIX)", path: "/трансфер-минск-рига-аэропорт" },
        ]}
        breadcrumbsEn={[
          { name: "Home", path: "/" },
          { name: "Minsk — Riga Airport (RIX)", path: "/minsk-riga-airport" },
        ]}
        jsonLd={taxiServiceJsonLd({
          lang,
          name: isRu ? "Трансфер Минск — Аэропорт Риги (RIX)" : "Minsk to Riga Airport (RIX) Transfer",
          description: isRu
            ? "Индивидуальный трансфер из Минска в международный аэропорт Риги (RIX). Фиксированная цена, подача от двери, опытный водитель."
            : "Private door-to-door transfer from Minsk to Riga International Airport (RIX). Fixed price, professional driver.",
          url: SITE_URL + (isRu ? "/трансфер-минск-рига-аэропорт" : "/minsk-riga-airport"),
          fromName: isRu ? "Минск" : "Minsk",
          toName: isRu ? "Аэропорт Риги (RIX)" : "Riga International Airport (RIX)",
        })}
      />
      <Navbar />
      <DisclaimerBanner />

      {/* Hero */}
      <div className="pt-28 pb-14 border-b border-border/40 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 md:px-6 max-w-4xl relative">
          <a href={getHomeSectionHref(lang, "services")} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors mb-6">
            {c.backBtn}
          </a>
          <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-primary mb-4">
            {c.badge}
          </p>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
            {c.title}
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mb-6">
            {c.subtitle}
          </p>
          <p className="text-muted-foreground/90 text-sm md:text-[15px] leading-relaxed max-w-3xl mb-10">
            {c.seoIntro}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {c.stats.map((s) => (
              <div key={s.label} className="bg-card border border-border rounded-xl p-4">
                <p className="text-primary font-bold text-lg">{s.value}</p>
                <p className="text-muted-foreground text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("open-booking-modal", {
                detail: {
                  prefilledFrom: isRu ? "Минск" : "Minsk",
                  prefilledTo: isRu ? "Аэропорт Риги (RIX)" : "Riga Airport (RIX)",
                }
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

        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-2xl font-bold text-foreground mb-8">{c.howTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {c.steps.map((step, i) => {
              const StepIcon = step.icon;
              return (
                <div key={i} className="bg-card border border-border rounded-2xl p-6 relative">
                  <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                    {i + 1}
                  </div>
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

        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
            <Info className="h-5 w-5 text-primary" />
            {c.airportTitle}
          </h2>
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            {c.airportInfo.map((row, i) => (
              <div key={i} className={`flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 px-6 py-4 ${i < c.airportInfo.length - 1 ? "border-b border-border/50" : ""}`}>
                <span className="text-muted-foreground text-sm min-w-[180px] shrink-0">{row.label}</span>
                <span className="text-foreground text-sm font-medium">{row.value}</span>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
            <MapPin className="h-5 w-5 text-primary" />
            {c.photosTitle}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {c.photos.map((photo, i) => (
              <div key={i} className="relative rounded-2xl overflow-hidden aspect-video bg-card border border-border">
                <img src={photo.src} alt={photo.caption} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-3">
                  <p className="text-white text-sm font-medium">{photo.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
            <Clock className="h-5 w-5 text-primary" />
            {c.tipsTitle}
          </h2>
          <ul className="space-y-3">
            {c.tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
            <Plane className="h-5 w-5 text-primary" />
            {isRu ? "Похожие направления" : "Related transfers"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href={isRu ? "/трансфер-минск-вильнюс-аэропорт" : "/minsk-vilnius-airport"}
              className="block bg-card border border-border rounded-2xl p-5 hover:border-primary/50 hover:bg-primary/5 transition-colors group"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <p className="font-bold text-foreground group-hover:text-primary transition-colors">
                  {isRu ? "Трансфер Минск — Аэропорт Вильнюса (VNO)" : "Minsk — Vilnius Airport (VNO)"}
                </p>
                <ArrowRight className="h-4 w-4 text-primary shrink-0 mt-1 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-muted-foreground text-xs leading-relaxed">
                {isRu ? "~175 км, 2,5–5 ч. Главный аэропорт Литвы, ближе к Минску." : "~175 km, 2.5–5 hrs. Lithuania's main airport, closer to Minsk."}
              </p>
            </a>
            <a
              href={isRu ? "/трансфер-минск-каунас-аэропорт" : "/minsk-kaunas-airport"}
              className="block bg-card border border-border rounded-2xl p-5 hover:border-primary/50 hover:bg-primary/5 transition-colors group"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <p className="font-bold text-foreground group-hover:text-primary transition-colors">
                  {isRu ? "Трансфер Минск — Аэропорт Каунаса (KUN)" : "Minsk — Kaunas Airport (KUN)"}
                </p>
                <ArrowRight className="h-4 w-4 text-primary shrink-0 mt-1 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-muted-foreground text-xs leading-relaxed">
                {isRu ? "~280 км, 4–7 ч. Крупный хаб Ryanair в Литве." : "~280 km, 4–7 hrs. Major Ryanair hub in Lithuania."}
              </p>
            </a>
          </div>
        </motion.section>

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

        <motion.section id="official-sources" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <BorderOfficialSources isRu={isRu} />
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="rounded-2xl border border-primary/30 bg-primary/5 p-8 md:p-10 text-center">
            <PhoneCall className="h-8 w-8 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-3">{c.ctaTitle}</h2>
            <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">{c.ctaDesc}</p>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("open-booking-modal", {
                detail: {
                  prefilledFrom: isRu ? "Минск" : "Minsk",
                  prefilledTo: isRu ? "Аэропорт Риги (RIX)" : "Riga Airport (RIX)",
                }
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
