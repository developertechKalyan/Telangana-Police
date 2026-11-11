import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPhone } from "react-icons/fa6";
import { LuSignal, LuWifi, LuBatteryFull } from "react-icons/lu";
import { DotGridPattern, RadarSweepPattern } from "@/components/SvgBackground";
import { useT } from "@/contexts/LanguageContext";
import { ui } from "@/i18n/ui";
import patrolCar from "@/assets/patrol_call.gif";
import dial112Logo from "@/assets/dial100.png";

const DIAL_SEQUENCE = ["1", "1", "2"];
const KEYPAD = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"];

const DIGIT_START = 350;
const DIGIT_INTERVAL = 380;
const RING_START = DIGIT_START + DIGIT_INTERVAL * (DIAL_SEQUENCE.length - 1) + 400;
const RING_DURATION = 1700;
const DISPATCH_START = RING_START + RING_DURATION;
const DISPATCH_DURATION = 2000;
const EXIT_START = DISPATCH_START + DISPATCH_DURATION;
const EXIT_DURATION = 650;
const COMPLETE_AT = EXIT_START + EXIT_DURATION;

type Phase = "dial" | "ringing" | "dispatch" | "exit";

/**
 * One-time splash played on app mount: dials 100 on a keypad, rings through to the control
 * room, then shows the patrol car pulling away from the phone toward the right before handing
 * off to the home page. Timing constants above are the single source of truth for the sequence.
 */
export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const t = useT();
  const [phase, setPhase] = useState<Phase>("dial");
  const [typedCount, setTypedCount] = useState(0);
  const [pressedDigit, setPressedDigit] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const ids: ReturnType<typeof setTimeout>[] = [];
    const after = (ms: number, fn: () => void) => {
      ids.push(setTimeout(() => !cancelled && fn(), ms));
    };

    DIAL_SEQUENCE.forEach((digit, i) => {
      after(DIGIT_START + DIGIT_INTERVAL * i, () => {
        setTypedCount(i + 1);
        setPressedDigit(digit);
        after(220, () => setPressedDigit(null));
      });
    });
    after(RING_START, () => setPhase("ringing"));
    after(DISPATCH_START, () => setPhase("dispatch"));
    after(EXIT_START, () => setPhase("exit"));
    after(COMPLETE_AT, onComplete);

    return () => {
      cancelled = true;
      ids.forEach(clearTimeout);
    };
  }, [onComplete]);

  const showPhone = phase === "dial" || phase === "ringing";
  const showCar = phase === "dispatch" || phase === "exit";

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-linear-to-b from-navy-950 via-navy-900 to-navy-950"
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === "exit" ? 0 : 1, scale: phase === "exit" ? 1.04 : 1 }}
      transition={{ duration: EXIT_DURATION / 1000, ease: "easeInOut" }}
    >
      <DotGridPattern />
      <RadarSweepPattern />

      <div className="relative z-10 mb-6 flex flex-col items-center gap-3">
        <motion.div
          initial={{ opacity: 0, y: -12, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex h-24 w-24 items-center justify-center rounded-full bg-white p-3 shadow-[0_4px_16px_rgba(0,0,0,0.5)] sm:h-28 sm:w-28"
        >
          <img
            src={dial112Logo}
            alt="Dial 100 Emergency Response Support System"
            className="max-h-full max-w-full object-contain"
          />
        </motion.div>
        <div className="h-6">
          <AnimatePresence mode="wait">
            <motion.p
              key={phase}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="font-display text-sm font-semibold tracking-[0.25em] text-brand-300 uppercase"
            >
              {phase === "dial" && t(ui.loading.dialing)}
              {phase === "ringing" && t(ui.loading.ringing)}
              {(phase === "dispatch" || phase === "exit") && t(ui.loading.dispatching)}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      <div className="relative z-10 h-96 w-full">
        <AnimatePresence>
          {showPhone && (
            <div key="phone" className="absolute inset-0 flex items-center justify-center px-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={
                  phase === "ringing"
                    ? { opacity: 1, scale: 1, rotate: [0, -1.5, 1.5, -1.5, 1.5, 0] }
                    : { opacity: 1, scale: 1, rotate: 0 }
                }
                exit={{ opacity: 0, scale: 0.7 }}
                transition={
                  phase === "ringing"
                    ? { rotate: { duration: 0.6, repeat: Infinity, repeatDelay: 0.5 }, opacity: { duration: 0.35 }, scale: { duration: 0.35 } }
                    : { duration: 0.35 }
                }
                className="relative w-64 sm:w-72"
              >
                {phase === "ringing" &&
                  [0, 1].map((ring) => (
                    <motion.span
                      key={ring}
                      className="pointer-events-none absolute inset-0 rounded-[2.75rem] border border-accent-400/50"
                      animate={{ scale: [1, 1.14], opacity: [0.7, 0] }}
                      transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut", delay: ring * 0.6 }}
                    />
                  ))}

                {/* Phone body: bezel + side buttons */}
                <div className="relative rounded-[2.75rem] border-[3px] border-navy-700 bg-navy-950 p-2.5 shadow-2xl shadow-black/60 ring-1 ring-white/10">
                  <span className="absolute -left-0.75 top-20 h-7 w-0.75 rounded-l bg-navy-700" />
                  <span className="absolute -left-0.75 top-30 h-11 w-0.75 rounded-l bg-navy-700" />
                  <span className="absolute -right-0.75 top-24 h-14 w-0.75 rounded-r bg-navy-700" />

                  {/* Screen */}
                  <div className="relative overflow-hidden rounded-[2.2rem] bg-linear-to-b from-navy-900 to-navy-950">
                    <div className="absolute inset-x-0 top-0 z-10 flex justify-center">
                      <div className="h-5 w-24 rounded-b-2xl bg-navy-950" />
                    </div>

                    <div className="flex flex-col items-center gap-5 px-5 pt-8 pb-6">
                      <div className="flex w-full items-center justify-between text-navy-400">
                        <span className="font-mono text-[9px] font-semibold tracking-wide text-accent-300 uppercase">Emergency Line</span>
                        <span className="flex items-center gap-1.5">
                          <LuSignal size={12} />
                          <LuWifi size={12} />
                          <LuBatteryFull size={14} />
                        </span>
                      </div>

                      <AnimatePresence mode="wait">
                        {phase === "dial" ? (
                          <motion.div
                            key="keypad"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="flex flex-col items-center gap-5"
                          >
                            <div className="flex items-center gap-3 font-mono text-4xl font-bold">
                              {DIAL_SEQUENCE.map((digit, i) => (
                                <span key={i} className={i < typedCount ? "text-accent-400" : "text-navy-600"}>
                                  {digit}
                                </span>
                              ))}
                            </div>

                            <div className="grid grid-cols-3 gap-2.5">
                              {KEYPAD.map((key, i) => {
                                const isActive = key === pressedDigit;
                                return (
                                  <div
                                    key={`${key}-${i}`}
                                    className={`flex h-10 w-10 items-center justify-center rounded-full font-mono text-sm font-semibold transition-all duration-200 ${
                                      isActive
                                        ? "scale-110 bg-accent-500 text-white shadow-md shadow-accent-500/50"
                                        : "bg-navy-800 text-navy-400"
                                    }`}
                                  >
                                    {key}
                                  </div>
                                );
                              })}
                            </div>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="ringing"
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="flex flex-col items-center gap-3 py-2"
                          >
                            <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-white p-2 shadow-lg shadow-brand-600/40">
                              <img src={dial112Logo} alt="Dial 112 Emergency Response Support System" className="max-h-full max-w-full object-contain" />
                            </div>
                            <div className="text-center">
                              <p className="font-display text-base font-bold text-white">Telangana Police Control Room</p>
                              <p className="font-mono text-sm text-navy-400">Dial 112</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <motion.div
                        animate={phase === "ringing" ? { scale: [1, 1.18, 1] } : { scale: 1 }}
                        transition={{ duration: 0.7, repeat: phase === "ringing" ? Infinity : 0 }}
                        className="flex h-11 w-11 items-center justify-center rounded-full bg-success-500 text-white shadow-lg shadow-success-500/40"
                      >
                        <FaPhone size={16} />
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showCar && (
            <div key="car" className="absolute inset-0 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.5, x: "0vw" }}
                animate={{ opacity: [0, 1, 1], scale: [0.5, 1.05, 1], x: ["0vw", "0vw", "34vw"] }}
                transition={{ duration: 1.7, times: [0, 0.22, 1], ease: ["easeOut", "easeInOut"] }}
              >
                <img
                  src={patrolCar}
                  alt="Police patrol vehicle dispatched"
                  className="w-60 drop-shadow-[0_14px_22px_rgba(0,0,0,0.5)] sm:w-72"
                />
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
