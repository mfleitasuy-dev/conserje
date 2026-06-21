"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AlertTriangleIcon, CheckCircleIcon, XIcon } from "../icons";

type ToastType = "ok" | "error";

type ToastInput = {
  type: ToastType;
  title: string;
  description?: string;
};

type Toast = ToastInput & { id: number };

type ToastContextValue = {
  notify: (toast: ToastInput) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const DEFAULT_DURATION = 4000;

export function ToastProvider({
  children,
  duration = DEFAULT_DURATION,
}: {
  children: ReactNode;
  duration?: number;
}) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());
  const nextId = useRef(1);

  const dismiss = useCallback((id: number) => {
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const schedule = useCallback(
    (id: number) => {
      const timer = setTimeout(() => dismiss(id), duration);
      timers.current.set(id, timer);
    },
    [dismiss, duration],
  );

  const pause = useCallback((id: number) => {
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const notify = useCallback(
    (toast: ToastInput) => {
      const id = nextId.current++;
      setToasts((prev) => [...prev, { ...toast, id }]);
      schedule(id);
    },
    [schedule],
  );

  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-viewport">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`toast ${t.type}`}
            role="status"
            aria-live={t.type === "error" ? "assertive" : "polite"}
            onMouseEnter={() => pause(t.id)}
            onMouseLeave={() => schedule(t.id)}
            onFocus={() => pause(t.id)}
            onBlur={() => schedule(t.id)}
          >
            <span className="toast-icon" aria-hidden>
              {t.type === "ok" ? (
                <CheckCircleIcon size={20} />
              ) : (
                <AlertTriangleIcon size={20} />
              )}
            </span>
            <div className="toast-body">
              <p className="title">{t.title}</p>
              {t.description && <p className="desc">{t.description}</p>}
            </div>
            <button
              type="button"
              className="toast-close"
              aria-label="Cerrar notificación"
              onClick={() => dismiss(t.id)}
            >
              <XIcon size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast debe usarse dentro de <ToastProvider>");
  }
  return ctx;
}
