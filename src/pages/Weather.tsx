import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { IconType } from "react-icons";
import {
  WiDaySunny,
  WiDayCloudyHigh,
  WiCloudy,
  WiDayRain,
  WiHumidity,
  WiRaindrop,
  WiRaindrops,
  WiBarometer,
  WiDust,
  WiSmog,
  WiSmoke,
} from "react-icons/wi";
import {
  LuWind,
  LuCompass,
  LuSun,
  LuActivity,
  LuFactory,
  LuLeaf,
  LuClock,
  LuCalendarDays,
  LuChevronLeft,
  LuChevronRight,
  LuCircleCheck,
  LuTriangleAlert,
  LuHistory,
  LuGauge,
  LuArrowUp,
  LuArrowDown,
  LuRadioTower,
  LuMapPin,
  LuThermometerSun,
  LuLoaderCircle,
  LuTrendingUp,
  LuLayoutGrid,
} from "react-icons/lu";
import { MotionSection, StaggerGroup, staggerItem } from "@/components/MotionSection";
import { RadarSweepPattern } from "@/components/SvgBackground";
import { useWeather } from "@/hooks/useWeather";
import type { LiveHourlyReading, WeatherStation } from "@/lib/weatherApi";
import type { WeatherCondition } from "@/types/content";
import { useT } from "@/contexts/LanguageContext";
import type { LocalizedText } from "@/i18n/locales";
import { ui } from "@/i18n/ui";

type Tint = "brand" | "navy" | "accent" | "success" | "emergency";

const TINT_CHIP: Record<Tint, string> = {
  brand: "bg-brand-500/10 text-brand-600 dark:text-brand-400",
  navy: "bg-navy-500/10 text-navy-600 dark:text-navy-300",
  accent: "bg-accent-500/10 text-accent-600 dark:text-accent-400",
  success: "bg-success-500/10 text-success-600 dark:text-success-400",
  emergency: "bg-emergency-500/10 text-emergency-600 dark:text-emergency-400",
};

const TINT_GLOW: Record<Tint, string> = {
  brand: "bg-brand-400/20",
  navy: "bg-navy-400/20",
  accent: "bg-accent-400/25",
  success: "bg-success-400/25",
  emergency: "bg-emergency-400/25",
};

const CONDITION_ICONS: Record<WeatherCondition, IconType> = {
  Sunny: WiDaySunny,
  "Partly Cloudy": WiDayCloudyHigh,
  Cloudy: WiCloudy,
  Rain: WiDayRain,
};

const COMPASS_POINTS = [
  "N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
  "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW",
];

// Displayed in the hero before the first live fetch resolves; overwritten by the API's own station block once loaded.
const STATION_FALLBACK: WeatherStation = {
  deviceId: "WMS10042226",
  location: "TGiCCC — Telangana Integrated Command and Control Centre, Hyderabad",
  latitude: 17.4147275,
  longitude: 78.427625,
  timezone: "Asia/Kolkata",
  refreshIntervalMinutes: 5,
};

function compassLabel(deg: number) {
  return COMPASS_POINTS[Math.round((((deg % 360) + 360) % 360) / 22.5) % 16];
}

function aqiInfo(aqi: number): { label: LocalizedText; description: LocalizedText; tint: Tint } {
  if (aqi <= 50) return { label: ui.weather.aqiGood, description: ui.weather.aqiGoodDesc, tint: "success" };
  if (aqi <= 100) return { label: ui.weather.aqiModerate, description: ui.weather.aqiModerateDesc, tint: "accent" };
  if (aqi <= 150) return { label: ui.weather.aqiSensitive, description: ui.weather.aqiSensitiveDesc, tint: "accent" };
  if (aqi <= 200) return { label: ui.weather.aqiUnhealthy, description: ui.weather.aqiUnhealthyDesc, tint: "accent" };
  if (aqi <= 300) return { label: ui.weather.aqiVeryPoor, description: ui.weather.aqiVeryPoorDesc, tint: "emergency" };
  return { label: ui.weather.aqiHazardous, description: ui.weather.aqiHazardousDesc, tint: "emergency" };
}

function ConditionIcon({ condition, size, className }: { condition: WeatherCondition; size?: number; className?: string }) {
  const Icon = CONDITION_ICONS[condition] ?? WiCloudy;
  return <Icon size={size} className={className} />;
}

function StatCard({
  icon: Icon,
  label,
  value,
  progress,
  rotate,
}: {
  icon: IconType;
  label: string;
  value: string;
  progress?: number;
  rotate?: number;
}) {
  return (
    <motion.div
      variants={staggerItem}
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group rounded-2xl border border-navy-100  bg-white p-4 transition-shadow duration-300 hover:shadow-lg hover:shadow-navy-900/5 dark:border-navy-700 dark:bg-navy-800"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition-transform duration-300 group-hover:scale-110 dark:bg-brand-900/40 dark:text-brand-400">
          <Icon size={19} style={rotate !== undefined ? { transform: `rotate(${rotate}deg)` } : undefined} />
        </span>
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-wide text-navy-400">{label}</p>
          <p className="truncate font-mono text-lg font-bold text-navy-900 dark:text-navy-50">{value}</p>
        </div>
      </div>
      {progress !== undefined && (
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-navy-100 dark:bg-navy-700">
          <motion.div
            className="h-full rounded-full bg-brand-500"
            initial={{ width: 0 }}
            whileInView={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      )}
    </motion.div>
  );
}

function MetricCard({ icon: Icon, label, value, unit, tint }: { icon: IconType; label: string; value: number; unit: string; tint: Tint }) {
  return (
    <motion.div
      variants={staggerItem}
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group rounded-xl border border-navy-100 bg-white p-4 transition-shadow duration-300 hover:shadow-lg hover:shadow-navy-900/5 dark:border-navy-700 dark:bg-navy-800"
    >
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110 ${TINT_CHIP[tint]}`}
      >
        <Icon size={18} />
      </span>
      <p className="mt-3 font-mono text-lg font-semibold text-navy-900 dark:text-navy-50">
        {value}
        <span className="ml-1 text-xs font-medium text-navy-400">{unit}</span>
      </p>
      <p className="text-xs text-navy-500 dark:text-navy-400">{label}</p>
    </motion.div>
  );
}

const STATUS_LABELS: Record<"Normal" | "Elevated", LocalizedText> = {
  Normal: { en: "Normal", hi: "सामान्य", te: "సాధారణ", gu: "સામાન્ય", ur: "نارمل", sd: "نارمل" },
  Elevated: { en: "Elevated", hi: "उच्च", te: "అధికం", gu: "ઉચ્ચ", ur: "بلند", sd: "بلند" },
};

function StatusPill({ status }: { status: "Normal" | "Elevated" }) {
  const t = useT();
  const cls =
    status === "Normal"
      ? "bg-success-500/10 text-success-700 dark:text-success-400"
      : "bg-accent-500/10 text-accent-700 dark:text-accent-400";
  return <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${cls}`}>{t(STATUS_LABELS[status])}</span>;
}

function EnvCard({
  icon: Icon,
  label,
  value,
  unit,
  tint,
  status,
}: {
  icon: IconType;
  label: string;
  value: number;
  unit: string;
  tint: Tint;
  status?: "Normal" | "Elevated";
}) {
  return (
    <motion.div
      variants={staggerItem}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative overflow-hidden rounded-2xl border border-navy-100  bg-white p-5 transition-shadow duration-300 hover:shadow-lg hover:shadow-navy-900/5 dark:border-navy-700 dark:bg-navy-800"
    >
      <div
        className={`pointer-events-none absolute -top-6 -right-6 h-20 w-20 rounded-full blur-2xl transition-opacity duration-300 group-hover:opacity-80 ${TINT_GLOW[tint]}`}
      />
      <div className="relative flex items-start justify-between">
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${TINT_CHIP[tint]}`}>
          <Icon size={20} />
        </span>
        {status && <StatusPill status={status} />}
      </div>
      <p className="relative mt-4 font-mono text-2xl font-bold text-navy-900 dark:text-navy-50">
        {value}
        <span className="ml-1 text-xs font-medium text-navy-400">{unit}</span>
      </p>
      <p className="relative text-xs uppercase tracking-wide text-navy-400">{label}</p>
    </motion.div>
  );
}

/** Catmull-Rom → cubic-bezier conversion, so the line reads as a smooth curve instead of straight joins. */
function smoothPath(points: { x: number; y: number }[]) {
  if (points.length < 3) return points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

function TempTrendChart({ data }: { data: LiveHourlyReading[] }) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const width = 760;
  const height = 260;
  const padLeft = 32;
  const padRight = 8;
  const padTop = 16;
  const padBottom = 26;

  const temps = data.map((d) => d.temp);
  const min = Math.floor(Math.min(...temps) - 1);
  const max = Math.ceil(Math.max(...temps) + 1);
  const tickCount = 5;
  const ticks = Array.from({ length: tickCount }, (_, i) => min + ((max - min) / (tickCount - 1)) * i);

  const xFor = (i: number) => padLeft + (i / (data.length - 1)) * (width - padLeft - padRight);
  const yFor = (t: number) => height - padBottom - ((t - min) / (max - min)) * (height - padTop - padBottom);

  const points = data.map((d, i) => ({ x: xFor(i), y: yFor(d.temp), ...d }));
  const path = smoothPath(points);
  const areaPath = `${path} L ${points[points.length - 1].x} ${height - padBottom} L ${points[0].x} ${height - padBottom} Z`;

  const isHovering = hoverIdx !== null;
  const active = points[hoverIdx ?? points.length - 1];
  const tooltipWidth = 86;
  const tooltipX = Math.min(Math.max(active.x - tooltipWidth / 2, padLeft), width - padRight - tooltipWidth);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full overflow-visible">
      <defs>
        <linearGradient id="tempFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-brand-500)" stopOpacity="0.32" />
          <stop offset="100%" stopColor="var(--color-brand-500)" stopOpacity="0" />
        </linearGradient>
      </defs>

      {ticks.map((t) => (
        <g key={t}>
          <line x1={padLeft} x2={width - padRight} y1={yFor(t)} y2={yFor(t)} stroke="currentColor" strokeOpacity={0.1} strokeWidth={1} />
          <text x={padLeft - 8} y={yFor(t) + 3} fontSize={10} textAnchor="end" fill="currentColor" opacity={0.5}>
            {Math.round(t)}°
          </text>
        </g>
      ))}

      <motion.path
        d={areaPath}
        fill="url(#tempFill)"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      />
      <motion.path
        d={path}
        fill="none"
        stroke="var(--color-brand-600)"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: "easeInOut" }}
      />

      {isHovering && (
        <line
          x1={active.x}
          x2={active.x}
          y1={padTop}
          y2={height - padBottom}
          stroke="currentColor"
          strokeOpacity={0.2}
          strokeDasharray="3 3"
        />
      )}

      {points.map((p, i) => {
        const isNow = i === points.length - 1;
        const isActive = isHovering ? i === hoverIdx : isNow;
        return (
          <g key={p.hour}>
            {isActive && (
              <motion.circle
                cx={p.x}
                cy={p.y}
                r={9}
                fill="var(--color-accent-500)"
                opacity={0.18}
                animate={{ r: [9, 13, 9] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              />
            )}
            <circle
              cx={p.x}
              cy={p.y}
              r={isActive ? 5 : 3}
              fill={isActive ? "var(--color-accent-500)" : "var(--color-brand-600)"}
              stroke="white"
              strokeWidth={isActive ? 2 : 0}
              className="transition-all duration-150"
            />
          </g>
        );
      })}

      {points
        .filter((_, i) => i % 2 === 0)
        .map((p) => (
          <text key={p.hour} x={p.x} y={height - 8} fontSize={10} textAnchor="middle" fill="currentColor" opacity={0.5}>
            {p.hour}
          </text>
        ))}

      {isHovering && (
        <g transform={`translate(${tooltipX}, ${Math.max(active.y - 46, padTop)})`}>
          <rect width={tooltipWidth} height={34} rx={8} fill="var(--color-navy-900)" opacity={0.92} />
          <text x={tooltipWidth / 2} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill="white">
            {active.temp.toFixed(1)}°C
          </text>
          <text x={tooltipWidth / 2} y={27} textAnchor="middle" fontSize={9} fill="white" opacity={0.7}>
            {active.hour}
          </text>
        </g>
      )}

      <rect
        x={padLeft}
        y={0}
        width={width - padLeft - padRight}
        height={height}
        fill="transparent"
        className="cursor-crosshair"
        onMouseMove={(e) => {
          const rect = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
          if (!rect) return;
          const localX = ((e.clientX - rect.left) / rect.width) * width;
          let nearest = 0;
          let minDist = Infinity;
          points.forEach((p, i) => {
            const dist = Math.abs(p.x - localX);
            if (dist < minDist) {
              minDist = dist;
              nearest = i;
            }
          });
          setHoverIdx(nearest);
        }}
        onMouseLeave={() => setHoverIdx(null)}
      />
    </svg>
  );
}

function LoadingPanel() {
  const t = useT();
  return (
    <MotionSection className="mt-8 flex flex-col items-center justify-center gap-3 rounded-2xl border border-navy-100 p-20 text-center dark:border-navy-700">
      <LuLoaderCircle size={28} className="animate-spin text-brand-500" />
      <p className="text-sm text-navy-400">{t(ui.weather.loadingReadings)}</p>
    </MotionSection>
  );
}

function ErrorPanel({ message }: { message: string | null }) {
  const t = useT();
  return (
    <MotionSection className="mt-8 flex flex-col items-center gap-2 rounded-2xl border border-emergency-500/30 bg-emergency-500/5 p-20 text-center">
      <LuTriangleAlert size={28} className="text-emergency-600" />
      <p className="text-sm font-medium text-emergency-700 dark:text-emergency-400">{t(ui.weather.errorTitle)}</p>
      {message && <p className="text-xs text-navy-400">{message}</p>}
      <p className="text-xs text-navy-400">{t(ui.weather.errorBackend)}</p>
    </MotionSection>
  );
}

export function Weather() {
  const { data, loading, error } = useWeather();
  const t = useT();
  const [now, setNow] = useState(() => new Date());
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const hours24 = now.getHours();
  const hours12 = ((hours24 + 11) % 12) + 1;
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const meridiem = hours24 >= 12 ? "PM" : "AM";
  const dateLabel = now.toLocaleDateString("en-GB", { weekday: "long", day: "2-digit", month: "long", year: "numeric" });

  const station = data?.station ?? STATION_FALLBACK;
  const scrollByCards = (dir: 1 | -1) => scrollerRef.current?.scrollBy({ left: dir * 216, behavior: "smooth" });

  let content = null;
  if (data) {
    const { current, hourly, daily } = data;
    const meta = aqiInfo(current.aqi);
    const markerPct = Math.min((current.aqi / 500) * 100, 100);

    const elevated = [
      current.pollutantStatus.o3 === "Elevated" && "O₃",
      current.pollutantStatus.co === "Elevated" && "CO",
      current.pollutantStatus.pm10 === "Elevated" && "PM10",
      current.pollutantStatus.pm25 === "Elevated" && "PM2.5",
    ].filter(Boolean) as string[];
    const allNormal = t(meta.label) === t(ui.weather.aqiGood) && elevated.length === 0;

    const allHighs = daily.map((d) => d.high);
    const allLows = daily.map((d) => d.low);
    const weekMax = Math.max(...allHighs);
    const weekMin = Math.min(...allLows);
    const weekSpan = weekMax - weekMin || 1;

    content = (
      <>
        <MotionSection
          className={` flex flex-col gap-3   mt-5 rounded-2xl border p-4 shadow-lg sm:flex-row sm:items-center sm:justify-between  sm:p-5 ${
            allNormal ? "border-success-500/30 bg-success-500/10" : "border-accent-500/30 bg-accent-500/10"
          }`}
        >
          <div className="flex items-center gap-3">
            {allNormal ? (
              <LuCircleCheck size={20} className="flex-none text-success-600 dark:text-success-400" />
            ) : (
              <LuTriangleAlert size={20} className="flex-none text-accent-600 dark:text-accent-400" />
            )}
            <p className={`text-sm font-medium ${allNormal ? "text-success-700 dark:text-success-400" : "text-accent-700 dark:text-accent-400"}`}>
              {allNormal ? t(ui.weather.allNormal) : `${t(ui.weather.elevatedPrefix)} ${elevated.join(", ")}. ${t(ui.weather.elevatedSuffix)}`}
            </p>
          </div>
          <p className="font-mono text-xs text-navy-400">
            {hours12}:{minutes} {meridiem}
          </p>
        </MotionSection>

        <MotionSection className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div className="grid gap-px overflow-hidden rounded-2xl border border-navy-100 bg-navy-100 dark:border-navy-700 dark:bg-navy-700 sm:grid-cols-2">
            <div className="bg-white p-6 dark:bg-navy-800 sm:p-8">
              <p className="text-xs text-navy-400">
                {t(ui.weather.device)} {station.deviceId} · {dateLabel}
              </p>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-mono text-6xl font-bold text-navy-900 dark:text-navy-50 sm:text-7xl">
                  {current.temperature.toFixed(1)}
                </span>
                <span className="font-mono text-2xl font-semibold text-navy-400">°C</span>
              </div>
              <p className="mt-2 flex items-center gap-2 text-navy-500 dark:text-navy-400">
                <ConditionIcon condition={current.condition} size={22} className="text-brand-500 dark:text-brand-400" />
                {t(ui.weather.condition[current.condition])}
              </p>
              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-navy-400">
                <span className="inline-flex items-center gap-1.5">
                  <LuThermometerSun size={14} /> {t(ui.weather.feelsLike)} {current.feelsLike}°C
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <WiRaindrop size={16} /> {t(ui.weather.rain)} {current.rainChance}%
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <LuClock size={14} /> {t(ui.weather.updated)} {current.updatedAt}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-4 bg-navy-50 p-6 dark:bg-navy-900/60 sm:p-8">
              <ConditionIcon condition={current.condition} size={54} className="text-brand-400" />
              <div className="text-center">
                <p className="font-mono text-3xl font-bold text-navy-900 dark:text-navy-50">
                  {hours12}:{minutes} <span className="text-base font-semibold text-navy-400">{meridiem}</span>
                </p>
                <p className="mt-1 text-xs text-navy-400">{dateLabel}</p>
              </div>
              <div className="flex items-center gap-6 border-t border-navy-200 pt-4 dark:border-navy-700">
                <div className="text-center">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-navy-400">{t(ui.weather.todayHigh)}</p>
                  <p className="mt-0.5 flex items-center justify-center gap-1 font-mono text-lg font-bold text-accent-600 dark:text-accent-400">
                    <LuArrowUp size={14} />
                    {current.todayHigh}°
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-navy-400">{t(ui.weather.todayLow)}</p>
                  <p className="mt-0.5 flex items-center justify-center gap-1 font-mono text-lg font-bold text-brand-600 dark:text-brand-400">
                    <LuArrowDown size={14} />
                    {current.todayLow}°
                  </p>
                </div>
              </div>
            </div>
          </div>

          <StaggerGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <StatCard icon={WiHumidity} label={t(ui.weather.humidity)} value={`${current.humidity}%`} progress={current.humidity} />
            <StatCard icon={LuWind} label={t(ui.weather.windSpeed)} value={`${current.windSpeed} km/h`} />
            <StatCard
              icon={LuCompass}
              label={t(ui.weather.windDirection)}
              value={`${current.windDirection}° ${compassLabel(current.windDirection)}`}
              rotate={current.windDirection}
            />
            <StatCard icon={WiRaindrop} label={t(ui.weather.rainChance)} value={`${current.rainChance}%`} progress={current.rainChance} />
          </StaggerGroup>
        </MotionSection>

        <div className="mt-8">
          <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-navy-400">
            <LuLayoutGrid size={13} /> {t(ui.weather.quickMetrics)}
          </p>
          <StaggerGroup className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
            <MetricCard icon={WiRaindrops} label={t(ui.weather.precipitation)} value={current.precipitation} unit="mm" tint="brand" />
            <MetricCard icon={WiBarometer} label={t(ui.weather.pressure)} value={current.pressure} unit="hPa" tint="navy" />
            <MetricCard icon={LuSun} label={t(ui.weather.solarRadiation)} value={current.solarRadiation} unit="W/m²" tint="accent" />
            <MetricCard icon={WiDust} label="PM10" value={current.pm10} unit="µg/m³" tint="navy" />
            <MetricCard icon={WiSmog} label="PM2.5" value={current.pm25} unit="µg/m³" tint="navy" />
            <MetricCard icon={LuActivity} label="NO₂" value={current.no2} unit="µg/m³" tint="success" />
          </StaggerGroup>
          <p className="mt-3 text-xs text-navy-400">
            {t(ui.weather.lastSynced)} {current.updatedAt}
          </p>
        </div>

        <MotionSection className="mt-8 rounded-2xl border border-navy-100 p-6 dark:border-navy-700">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="flex items-center gap-2 font-display text-lg font-bold text-navy-900 dark:text-navy-50">
                <LuTrendingUp className="text-brand-600 dark:text-brand-400" size={18} /> {t(ui.weather.trendTitle)}
              </h2>
              <p className="text-xs text-navy-400">
                {t(ui.weather.trendSubtitlePrefix)} {hourly.length} {t(ui.weather.trendSubtitleSuffix)} {station.deviceId}
              </p>
            </div>
            <span className="hidden items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 dark:bg-brand-900/40 dark:text-brand-300 sm:inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-600" /> {t(ui.weather.temperatureLegend)}
            </span>
          </div>
          <div className="mt-4 text-navy-900 dark:text-navy-100">
            <TempTrendChart data={hourly} />
          </div>
        </MotionSection>

        <MotionSection className="mt-8 rounded-2xl border border-navy-100 p-6 dark:border-navy-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="flex items-center gap-2 font-display text-lg font-bold text-navy-900 dark:text-navy-50">
                <LuHistory className="text-brand-600 dark:text-brand-400" size={18} /> {t(ui.weather.recentReadings)}
              </h2>
              <p className="text-xs text-navy-400">{t(ui.weather.yesterdayToToday)}</p>
            </div>
            <div className="flex gap-1.5">
              <button
                onClick={() => scrollByCards(-1)}
                aria-label="Scroll to earlier readings"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-navy-100 text-navy-500 transition-colors hover:bg-navy-50 dark:border-navy-700 dark:text-navy-400 dark:hover:bg-navy-800"
              >
                <LuChevronLeft size={16} />
              </button>
              <button
                onClick={() => scrollByCards(1)}
                aria-label="Scroll to later readings"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-navy-100 text-navy-500 transition-colors hover:bg-navy-50 dark:border-navy-700 dark:text-navy-400 dark:hover:bg-navy-800"
              >
                <LuChevronRight size={16} />
              </button>
            </div>
          </div>
          <StaggerGroup ref={scrollerRef} className="mt-4 flex snap-x gap-3 overflow-x-auto pb-2" staggerDelay={0.04}>
            {hourly.map((r, i) => {
              const isNow = i === hourly.length - 1;
              return (
                <motion.div
                  key={r.hour + i}
                  variants={staggerItem}
                  whileHover={{ y: -4, scale: 1.04 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`flex w-24 flex-none snap-start flex-col items-center gap-1.5 rounded-xl border p-3 text-center shadow-none transition-shadow duration-300 hover:shadow-lg hover:shadow-navy-900/5 ${
                    isNow
                      ? "border-brand-500 bg-brand-50 ring-1 ring-brand-500 dark:bg-brand-900/30"
                      : "border-navy-100 bg-white dark:border-navy-700 dark:bg-navy-800"
                  }`}
                >
                  <p className={`text-xs font-semibold ${isNow ? "text-brand-700 dark:text-brand-300" : "text-navy-400"}`}>
                    {isNow ? t(ui.weather.now) : r.hour}
                  </p>
                  <ConditionIcon condition={r.condition} size={24} className={isNow ? "text-brand-600 dark:text-brand-400" : "text-navy-400"} />
                  <p className="font-mono text-sm font-bold text-navy-900 dark:text-navy-50">{r.temp}°</p>
                  <p className="flex items-center gap-0.5 text-[10px] text-navy-400">
                    <WiHumidity size={12} />
                    {r.humidity}%
                  </p>
                </motion.div>
              );
            })}
          </StaggerGroup>
        </MotionSection>

        <MotionSection className="mt-8 rounded-2xl border border-navy-100 p-6 dark:border-navy-700">
          <h2 className="flex items-center gap-2 font-display text-lg font-bold text-navy-900 dark:text-navy-50">
            <LuCalendarDays className="text-brand-600 dark:text-brand-400" size={18} /> {t(ui.weather.sevenDayHistorical)}
          </h2>
          <StaggerGroup className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-7" staggerDelay={0.05}>
            {daily.map((d) => {
              const isToday = d.day === "Today";
              const offset = ((d.low - weekMin) / weekSpan) * 100;
              const width = ((d.high - d.low) / weekSpan) * 100;
              return (
                <motion.div
                  key={d.day}
                  variants={staggerItem}
                  whileHover={{ y: -4, scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`rounded-xl border p-3 text-center transition-shadow duration-300 hover:shadow-lg hover:shadow-navy-900/5 ${
                    isToday
                      ? "border-brand-500 bg-brand-50 dark:bg-brand-900/30"
                      : "border-navy-100 bg-navy-50 dark:border-navy-700 dark:bg-navy-800"
                  }`}
                >
                  <p className={`text-xs font-semibold uppercase tracking-wide ${isToday ? "text-brand-700 dark:text-brand-300" : "text-navy-400"}`}>
                    {isToday ? t(ui.weather.today) : d.day.slice(0, 3)}
                  </p>
                  <ConditionIcon
                    condition={d.condition}
                    size={26}
                    className={`mx-auto mt-2 ${isToday ? "text-brand-600 dark:text-brand-400" : "text-navy-400"}`}
                  />
                  <p className="mt-2 font-mono text-sm font-bold text-navy-900 dark:text-navy-50">{d.high}°</p>
                  <p className="font-mono text-xs text-navy-400">{d.low}°</p>
                  <div className="relative mt-2 h-1 overflow-hidden rounded-full bg-navy-200 dark:bg-navy-700">
                    <div
                      className="absolute inset-y-0 rounded-full bg-gradient-to-r from-brand-500 to-accent-500"
                      style={{ left: `${offset}%`, width: `${width}%` }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </StaggerGroup>
        </MotionSection>

        <div className="mt-8">
          <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-navy-400">
            <LuLeaf size={13} /> {t(ui.weather.environmentalAnalytics)}
          </p>
          <StaggerGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <EnvCard icon={WiBarometer} label={t(ui.weather.atmPressure)} value={current.pressure} unit="hPa" tint="brand" />
            <EnvCard icon={LuSun} label={t(ui.weather.solarRadiation)} value={current.solarRadiation} unit="W/m²" tint="accent" />
            <EnvCard icon={LuFactory} label="SOx" value={current.so2} unit="µg/m³" tint="emergency" />
            <EnvCard icon={LuActivity} label="NO₂" value={current.no2} unit="µg/m³" tint="success" />
            <EnvCard icon={LuLeaf} label="O₃ (Ozone)" value={current.o3} unit="µg/m³" tint="accent" status={current.pollutantStatus.o3} />
            <EnvCard icon={WiSmoke} label="CO" value={current.co} unit="µg/m³" tint="navy" status={current.pollutantStatus.co} />
            <EnvCard icon={WiDust} label="PM10" value={current.pm10} unit="µg/m³" tint="brand" status={current.pollutantStatus.pm10} />
            <EnvCard icon={WiSmog} label="PM2.5" value={current.pm25} unit="µg/m³" tint="navy" status={current.pollutantStatus.pm25} />
          </StaggerGroup>
        </div>

        <MotionSection className="mt-8 rounded-2xl border border-navy-100 p-6 dark:border-navy-700 sm:p-8">
          <h2 className="flex items-center gap-2 font-display text-lg font-bold text-navy-900 dark:text-navy-50">
            <LuGauge className="text-brand-600 dark:text-brand-400" size={18} /> {t(ui.weather.aqiTitle)}
          </h2>

          <div className="mt-6 grid gap-8 lg:grid-cols-[auto_1fr] lg:items-center">
            <div className="flex items-center gap-5">
              <div className={`flex h-24 w-24 flex-none items-center justify-center rounded-2xl font-mono text-4xl font-bold ${TINT_CHIP[meta.tint]}`}>
                {current.aqi}
              </div>
              <div className="max-w-xs">
                <p className="font-display text-xl font-bold text-navy-900 dark:text-navy-50">{t(meta.label)}</p>
                <p className="mt-1 text-sm text-navy-500 dark:text-navy-400">{t(meta.description)}</p>
              </div>
            </div>

            <div>
              <div
                className="relative h-3 w-full rounded-full"
                style={{
                  background:
                    "linear-gradient(to right, var(--color-success-500), var(--color-accent-400), var(--color-accent-500), var(--color-accent-600), var(--color-emergency-500), var(--color-emergency-600))",
                }}
              >
                <motion.span
                  className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-white bg-navy-900 shadow dark:border-navy-900 dark:bg-white"
                  initial={{ left: 0 }}
                  whileInView={{ left: `calc(${markerPct}% - 8px)` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
              <div className="mt-2 flex justify-between text-[10px] font-medium uppercase tracking-wide text-navy-400">
                <span>{t(ui.weather.aqiGood)}</span>
                <span>{t(ui.weather.aqiModerate)}</span>
                <span>{t(ui.weather.aqiSensitive)}</span>
                <span>{t(ui.weather.aqiUnhealthy)}</span>
                <span>{t(ui.weather.aqiVeryPoor)}</span>
                <span>{t(ui.weather.aqiHazardous)}</span>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-6">
                {[
                  { label: "PM2.5", value: current.pm25, unit: "µg/m³" },
                  { label: "PM10", value: current.pm10, unit: "µg/m³" },
                  { label: "O₃", value: current.o3, unit: "µg/m³" },
                  { label: "CO", value: current.co, unit: "µg/m³" },
                  { label: "SOx", value: current.so2, unit: "µg/m³" },
                  { label: "NO₂", value: current.no2, unit: "µg/m³" },
                ].map((p) => (
                  <div
                    key={p.label}
                    className="rounded-xl bg-navy-50 p-3 text-center transition-all duration-300 hover:-translate-y-1 hover:bg-navy-100 hover:shadow-md dark:bg-navy-800 dark:hover:bg-navy-700"
                  >
                    <p className="font-mono text-sm font-bold text-navy-900 dark:text-navy-50">{p.value}</p>
                    <p className="text-[10px] text-navy-400">
                      {p.label} {p.unit}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </MotionSection>

        <p className="mt-10 text-center text-xs text-navy-300 dark:text-navy-500">
          {t(ui.weather.footerLine)} {station.deviceId} · {t(ui.weather.footerAutoRefresh)} {station.refreshIntervalMinutes} min
        </p>
      </>
    );
  } else if (loading) {
    content = <LoadingPanel />;
  } else {
    content = <ErrorPanel message={error} />;
  }

  return (
    <div>
      <section className="relative overflow-hidden bg-navy-900 py-24 sm:py-32 lg:py-40">
        <RadarSweepPattern />
        <motion.div
          className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-brand-600/20 blur-3xl"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="pointer-events-none absolute -bottom-32 left-1/4 h-72 w-72 rounded-full bg-accent-500/10 blur-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        {data && (
          <ConditionIcon
            condition={data.current.condition}
            size={340}
            className="pointer-events-none absolute -right-10 -bottom-16 text-white/4"
          />
        )}
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <MotionSection className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <p className="font-display text-sm font-semibold uppercase tracking-wide text-accent-400">{t(ui.weather.kicker)}</p>
              <h1 className="mt-2 font-display text-4xl font-bold text-white sm:text-5xl">{t(ui.weather.title)}</h1>
              <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-navy-300">
                <span className="inline-flex items-center gap-1.5">
                  <LuRadioTower size={14} className="text-brand-400" /> {t(ui.weather.device)} {station.deviceId}
                </span>
                <span className="text-navy-600">·</span>
                <span className="inline-flex items-center gap-1.5">
                  <LuMapPin size={14} className="text-brand-400" /> {station.location}
                </span>
              </p>
            </div>

            <div className="flex flex-col items-start gap-3 lg:items-end">
              <div className="flex items-center gap-3 rounded-full bg-navy-800/80 py-2 pl-3 pr-4 ring-1 ring-white/10">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-success-500" />
                </span>
                <span className="text-sm font-semibold text-white">{t(ui.weather.live)}</span>
                <span className="text-navy-600">·</span>
                <span className="text-xs text-navy-300">
                  {error && data ? t(ui.weather.staleNotice) : `${t(ui.weather.refreshesEvery)} ${station.refreshIntervalMinutes} ${t(ui.weather.minutes)}`}
                </span>
              </div>

              {data && (
                <div className="flex items-center gap-3 rounded-2xl bg-navy-800/60 px-4 py-3 ring-1 ring-white/10 backdrop-blur">
                  <ConditionIcon condition={data.current.condition} size={38} className="flex-none text-accent-400" />
                  <div>
                    <p className="font-mono text-2xl leading-none font-bold text-white">{data.current.temperature.toFixed(1)}°C</p>
                    <p className="mt-1 text-xs text-navy-300">
                      {t(ui.weather.condition[data.current.condition])} · {t(ui.weather.feelsLike)} {data.current.feelsLike}°
                    </p>
                  </div>
                </div>
              )}
            </div>
          </MotionSection>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">{content}</section>
    </div>
  );
}
