"use client";

import { useEffect, useState } from "react";
import { Download, Share, Plus, X, MoreVertical } from "lucide-react";


export default function InstallAppButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIOS, setIsIOS] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [help, setHelp] = useState(null); 

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true ||
      window.__pwaInstalled === true;
    if (standalone) {
      setInstalled(true);
      return;
    }

    const ua = window.navigator.userAgent;
    const ios =
      /iphone|ipad|ipod/i.test(ua) ||
      (/Macintosh/.test(ua) && window.navigator.maxTouchPoints > 1);
    if (ios) setIsIOS(true);

    // Chrome fires `beforeinstallprompt` once, and it often fires before this
    // component mounts. An early capture script in the document head stashes the
    // event on `window` and notifies us, so we never miss the native prompt.
    if (window.__deferredInstallPrompt) setDeferredPrompt(window.__deferredInstallPrompt);

    const onAvailable = () => setDeferredPrompt(window.__deferredInstallPrompt || null);
    const onInstalled = () => {
      setInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("pwa-install-available", onAvailable);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("pwa-install-available", onAvailable);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  // Close the help dialog on Escape.
  useEffect(() => {
    if (!help) return;
    const onKey = (e) => {
      if (e.key === "Escape") setHelp(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [help]);

  const handleClick = async () => {
    // Best path: native install dialog (Android / Desktop Chrome, Edge).
    const promptEvent = deferredPrompt || window.__deferredInstallPrompt;
    if (promptEvent) {
      promptEvent.prompt();
      const { outcome } = await promptEvent.userChoice;
      if (outcome === "accepted") setInstalled(true);
      // A prompt can only be used once.
      setDeferredPrompt(null);
      window.__deferredInstallPrompt = null;
      return;
    }
    // Fallback: show manual steps for the current platform.
    setHelp(isIOS ? "ios" : "generic");
  };

  if (installed) return null;

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        aria-label="Install the IEEE GUB app"
        className="install-beat group relative w-full sm:w-auto overflow-hidden inline-flex items-center justify-center sm:justify-start gap-2.5 rounded-xl border px-4 py-2 transform hover:scale-[1.03] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 bg-neutral-900 text-white border-white/10 shadow-md hover:bg-neutral-800 dark:bg-slate-800/60 dark:text-gray-100 dark:border-white/10 dark:backdrop-blur-sm dark:shadow-none dark:hover:bg-slate-700/70"
      >
        {/* shine sweep on hover */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-[220%] transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
        />
        {/* download glyph tile */}
        <span className="relative flex-shrink-0 grid place-items-center w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600">
          <Download className="install-bounce w-4 h-4 text-white" />
        </span>
        {/* two-line app-store style label */}
        <span className="relative flex flex-col items-start leading-none text-left">
          <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-gray-300 dark:text-gray-400">
            Install the
          </span>
          <span className="text-sm font-semibold mt-0.5">IEEE GUB App</span>
        </span>
      </button>

      {help && (
        <div
          className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
          aria-label="How to install the app"
          onClick={() => setHelp(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {help === "ios" ? "Install on iPhone / iPad" : "Install this app"}
              </h3>
              <button
                type="button"
                onClick={() => setHelp(null)}
                aria-label="Close"
                className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {help === "ios" ? (
              <ol className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
                <li className="flex items-center gap-3">
                  <Step n={1} />
                  <span>
                    Open this site in <strong>Safari</strong>.
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Step n={2} />
                  <span className="inline-flex flex-wrap items-center gap-1">
                    Tap the
                    <Share className="inline w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <strong>Share</strong> button.
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Step n={3} />
                  <span className="inline-flex flex-wrap items-center gap-1">
                    Choose
                    <Plus className="inline w-4 h-4" />
                    <strong>Add to Home Screen</strong>.
                  </span>
                </li>
              </ol>
            ) : (
              <ol className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
                <li className="flex items-center gap-3">
                  <Step n={1} />
                  <span className="inline-flex flex-wrap items-center gap-1">
                    Open your browser menu
                    <MoreVertical className="inline w-4 h-4" />
                    (top-right).
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Step n={2} />
                  <span>
                    Choose <strong>Install app</strong> (or{" "}
                    <strong>Install IEEE GUB…</strong>).
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Step n={3} />
                  <span>
                    On a computer, you can also click the install icon in the
                    address bar.
                  </span>
                </li>
              </ol>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes installBeat {
          0% {
            filter: drop-shadow(0 0 3px rgba(16, 185, 129, 0.45));
          }
          14% {
            filter: drop-shadow(0 0 14px rgba(16, 185, 129, 0.9));
          }
          28% {
            filter: drop-shadow(0 0 4px rgba(16, 185, 129, 0.45));
          }
          42% {
            filter: drop-shadow(0 0 13px rgba(16, 185, 129, 0.8));
          }
          58%,
          100% {
            filter: drop-shadow(0 0 3px rgba(16, 185, 129, 0.3));
          }
        }
        .install-beat {
          animation: installBeat 1.8s ease-in-out infinite;
        }
        @keyframes installBounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(3px);
          }
        }
        .install-bounce {
          animation: installBounce 1.5s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .install-beat,
          .install-bounce {
            animation: none;
          }
        }
      `}</style>
    </>
  );
}

function Step({ n }) {
  return (
    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-400 font-semibold flex items-center justify-center">
      {n}
    </span>
  );
}
