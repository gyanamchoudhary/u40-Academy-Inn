import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { turnstileSiteKey } from "@/lib/turnstileConfig";

type TurnstileApi = {
  render(
    container: HTMLElement,
    options: {
      sitekey: string;
      action: string;
      theme: "light";
      callback: (token: string) => void;
      "expired-callback": () => void;
      "error-callback": () => void;
    }
  ): string;
  reset(widgetId?: string): void;
  remove(widgetId: string): void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let turnstileScriptPromise: Promise<TurnstileApi> | null = null;

function loadTurnstile() {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (turnstileScriptPromise) return turnstileScriptPromise;

  turnstileScriptPromise = new Promise<TurnstileApi>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    script.addEventListener("load", () => {
      if (window.turnstile) resolve(window.turnstile);
      else reject(new Error("Turnstile did not initialize"));
    });
    script.addEventListener("error", () =>
      reject(new Error("Turnstile could not be loaded"))
    );
    document.head.appendChild(script);
  });

  return turnstileScriptPromise;
}

export type TurnstileWidgetHandle = { reset: () => void };

type Props = {
  onTokenChange: (token: string) => void;
};

export const TurnstileWidget = forwardRef<TurnstileWidgetHandle, Props>(
  function TurnstileWidget({ onTokenChange }, ref) {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<string | undefined>(undefined);
    const [loadFailed, setLoadFailed] = useState(false);

    useImperativeHandle(ref, () => ({
      reset() {
        setLoadFailed(false);
        onTokenChange("");
        window.turnstile?.reset(widgetIdRef.current);
      },
    }));

    useEffect(() => {
      if (!turnstileSiteKey || !containerRef.current) return;
      let disposed = false;

      void loadTurnstile()
        .then(turnstile => {
          if (disposed || !containerRef.current) return;
          widgetIdRef.current = turnstile.render(containerRef.current, {
            sitekey: turnstileSiteKey,
            action: "admission_inquiry",
            theme: "light",
            callback: onTokenChange,
            "expired-callback": () => onTokenChange(""),
            "error-callback": () => {
              onTokenChange("");
              setLoadFailed(true);
            },
          });
        })
        .catch(() => setLoadFailed(true));

      return () => {
        disposed = true;
        if (widgetIdRef.current) window.turnstile?.remove(widgetIdRef.current);
      };
    }, [onTokenChange]);

    if (!turnstileSiteKey) {
      return (
        <p className="text-sm font-semibold text-red-700" role="alert">
          The secure inquiry form is temporarily unavailable.
        </p>
      );
    }

    return (
      <div>
        <div ref={containerRef} />
        {loadFailed ? (
          <p className="mt-2 text-sm font-semibold text-red-700" role="alert">
            The security check could not load. Check your connection and refresh.
          </p>
        ) : null}
      </div>
    );
  }
);
