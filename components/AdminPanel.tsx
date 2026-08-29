import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  getUser,
  handleAuthCallback,
  login,
  logout,
  signup,
} from "@netlify/identity";
import MascotImage from "./eva/MascotImage";
import {
  NativeCalendar,
  NativeConsole,
  NativeZelle,
  SystemControl,
} from "./admin/NativeWorkspaces";
import {
  AuditEntry,
  AuditPanel,
  DiagnosticsPanel,
  EvaContextAssistant,
  GlobalSearch,
  WorkCenter,
} from "./admin/AdminEnhancements";
import {
  Activity,
  Bot,
  BriefcaseBusiness,
  History,
  Moon,
  Search,
  Sparkles,
  Sun,
} from "lucide-react";

const ALLOWED = new Set([
  "intercoast.texto@gmail.com",
  "alequito09@hotmail.com",
]);
const STATES = ["Nuevo", "Contactado", "Cotizado", "Vendido", "Perdido"];
const SHEET = "https://docs.google.com/spreadsheets/u/0/";
const CALENDAR_EMBED_URL = "https://calendar.google.com/calendar/u/0/r";
type Lead = {
  row: number;
  timestamp: string;
  nombre: string;
  email: string;
  telefono: string;
  totalEstimado: number;
  estado: string;
  asesor: string;
  fuente: string;
  proximoSeguimiento: string;
  ultimoContacto: string;
  notas: string;
  vehicles: Array<{ year: string; make: string; model: string }>;
};
type RetentionSnapshot = {
  updatedAt: string;
  availableSheets: string[];
  cases: Array<Record<string, string>>;
  zelle: Array<Record<string, string>>;
};
const money = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    Number(value || 0),
  );
const date = (value: string) =>
  value
    ? new Intl.DateTimeFormat("es-CO", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(value))
    : "—";
const input =
  "mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100";
const colors: Record<string, string> = {
  Nuevo: "bg-blue-50 text-blue-700",
  Contactado: "bg-violet-50 text-violet-700",
  Cotizado: "bg-amber-50 text-amber-700",
  Vendido: "bg-emerald-50 text-emerald-700",
  Perdido: "bg-rose-50 text-rose-700",
};

function Card({
  label,
  value,
  hint,
  tone = "blue",
}: {
  label: string;
  value: string | number;
  hint: string;
  tone?: string;
}) {
  return (
    <article className="overflow-hidden rounded-2xl bg-white shadow-sm">
      <div
        className={`h-1 ${tone === "green" ? "bg-emerald-500" : tone === "violet" ? "bg-violet-500" : tone === "amber" ? "bg-amber-500" : "bg-blue-600"}`}
      />
      <div className="p-4">
        <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
          {label}
        </p>
        <p className="mt-2 text-3xl font-black">{value}</p>
        <p className="mt-1 text-xs text-slate-500">{hint}</p>
      </div>
    </article>
  );
}

function EvaCoach({
  due,
  leads,
  compact = false,
}: {
  due: number;
  leads: number;
  compact?: boolean;
}) {
  const tip = due
    ? `Tienes ${due} seguimiento${due === 1 ? "" : "s"} pendiente${due === 1 ? "" : "s"}. Revisa los leads nuevos y programa el próximo contacto.`
    : leads
      ? "¡Buen trabajo! Tu bandeja está al día. Actualiza el estado de cada conversación para que las métricas sean precisas."
      : "Cuando llegue la primera cotización, aquí podrás asignarla, contactarla y seguir cada paso.";
  return (
    <section
      className={`relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-cyan-50 ${compact ? "p-4" : "p-5"} shadow-sm`}
    >
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan-200/40 blur-2xl" />
      <div className="relative z-10 max-w-[72%]">
        <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-blue-700 shadow-sm">
          <span className="grid h-5 w-5 place-items-center rounded-full bg-blue-600 text-white">
            E
          </span>{" "}
          Eva te acompaña{" "}
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
        </div>
        <h3
          className={`mt-3 font-black text-slate-900 ${compact ? "text-base" : "text-xl"}`}
        >
          {due ? "Prioridad de hoy" : "¡Vas por muy buen camino!"}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{tip}</p>
        {!compact && (
          <>
            <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-bold text-slate-700 shadow-sm">
              👍 <span>Panel protegido y organizado</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold">
              <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-emerald-700">
                ✓ Datos centralizados
              </span>
              <span className="rounded-full bg-violet-50 px-3 py-1.5 text-violet-700">
                ⚡ Actualiza cada contacto
              </span>
              <span className="rounded-full bg-amber-50 px-3 py-1.5 text-amber-700">
                ★ Haz seguimiento rápido
              </span>
            </div>
          </>
        )}
      </div>
      <div
        className={`absolute bottom-0 right-0 ${compact ? "w-28" : "w-40"} animate-[pulse_4s_ease-in-out_infinite]`}
      >
        <div className="absolute -left-2 top-6 z-10 grid h-9 w-9 rotate-[-10deg] place-items-center rounded-full border-2 border-white bg-emerald-500 text-lg shadow-lg">
          👍
        </div>
        <MascotImage
          srcWebp="/eva/eva-baby-headset.webp"
          srcPng="/eva/eva-baby-headset.png"
          alt="Eva, asistente de Intercoast"
          className="w-full drop-shadow-xl"
        />
      </div>
    </section>
  );
}

function EmbeddedWorkspace({
  tool,
  title,
  description,
  accent,
}: {
  tool: "consola" | "zelle";
  title: string;
  description: string;
  accent: "blue" | "violet";
}) {
  const [url, setUrl] = useState("");
  const [html, setHtml] = useState("");
  const [error, setError] = useState("");
  const [frameKey, setFrameKey] = useState(0);
  const [zelleAction, setZelleAction] = useState("datos");
  const frameRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    let active = true;
    setError("");
    setHtml("");
    Promise.all([
      fetch(`/api/admin/tool?tool=${tool}`, { credentials: "include" }),
      fetch(`/admin-apps/${tool}.html`),
      tool === "zelle"
        ? fetch(`/api/admin/tool?tool=zelle`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: zelleAction, args: [] }),
          })
        : Promise.resolve(null),
    ])
      .then(async ([urlResponse, sourceResponse, dataResponse]) => {
        const urlData = await urlResponse.json();
        if (!urlResponse.ok)
          throw new Error(urlData.error || "No se pudo abrir la herramienta.");
        if (!sourceResponse.ok)
          throw new Error("No se encontró la interfaz original.");
        let source = await sourceResponse.text();
        if (tool === "consola") {
          const consoleShim = `<script>
(function () {
  var callbacks = {}, sequence = 0;
  function runner(success, failure) {
    return new Proxy({}, { get: function (_, property) {
      if (property === "withSuccessHandler") return function (fn) { return runner(fn, failure); };
      if (property === "withFailureHandler") return function (fn) { return runner(success, fn); };
      return function () {
        var id = "call-" + (++sequence), args = Array.prototype.slice.call(arguments);
        callbacks[id] = { success: success, failure: failure };
        parent.postMessage({ type: "intercoast-tool-call", id: id, action: String(property), args: args }, "*");
      };
    }});
  }
  window.google = { script: {} };
  Object.defineProperty(window.google.script, "run", { get: function () { return runner(); } });
  window.addEventListener("message", function (event) {
    var message = event.data || {};
    if (message.type !== "intercoast-tool-response" || !callbacks[message.id]) return;
    var callback = callbacks[message.id]; delete callbacks[message.id];
    if (message.ok) { if (callback.success) callback.success(message.result); }
    else if (callback.failure) callback.failure({ message: message.error || "La operación no respondió." });
  });
})();
<\/script>`;
          source = source
            .replace(
              "<?= momento ?>",
              new Intl.DateTimeFormat("es-ES", {
                dateStyle: "full",
                timeStyle: "short",
              }).format(new Date()),
            )
            .replace(
              "<?= carpetaUrl ?>",
              "https://drive.google.com/drive/u/0/my-drive",
            )
            .replace("</head>", `${consoleShim}</head>`);
        } else {
          if (!dataResponse)
            throw new Error("No se recibieron los datos de Zelle.");
          const data = await dataResponse.json();
          if (!dataResponse.ok || !data.ok)
            throw new Error(data.error || "No se pudieron cargar los pagos.");
          const safeData = JSON.stringify(data.result || {}).replace(
            /</g,
            "\\u003c",
          );
          source = source.replace("<?!= datos ?>", safeData);
        }
        if (active) {
          setUrl(urlData.url || "");
          setHtml(source);
          setZelleAction("datos");
        }
      })
      .catch((reason) => {
        if (active)
          setError(
            reason instanceof Error
              ? reason.message
              : "No se pudo abrir la herramienta.",
          );
      });
    return () => {
      active = false;
    };
  }, [tool, frameKey, zelleAction]);

  useEffect(() => {
    const receive = async (event: MessageEvent) => {
      if (event.source !== frameRef.current?.contentWindow) return;
      const message = event.data || {};
      if (message.type === "intercoast-zelle-refresh" && tool === "zelle") {
        setZelleAction("actualizar");
        setFrameKey((value) => value + 1);
        return;
      }
      if (message.type !== "intercoast-tool-call" || tool !== "consola") return;
      try {
        const response = await fetch("/api/admin/tool?tool=consola", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: message.action,
            args: message.args || [],
          }),
        });
        const data = await response.json();
        frameRef.current?.contentWindow?.postMessage(
          {
            type: "intercoast-tool-response",
            id: message.id,
            ok: response.ok && data.ok,
            result: data.result,
            error: data.error,
          },
          "*",
        );
      } catch (reason) {
        frameRef.current?.contentWindow?.postMessage(
          {
            type: "intercoast-tool-response",
            id: message.id,
            ok: false,
            error:
              reason instanceof Error
                ? reason.message
                : "La operación no respondió.",
          },
          "*",
        );
      }
    };
    window.addEventListener("message", receive);
    return () => window.removeEventListener("message", receive);
  }, [tool]);

  const gradient =
    accent === "violet"
      ? "from-violet-700 via-purple-700 to-fuchsia-700"
      : "from-blue-700 via-indigo-700 to-cyan-700";

  return (
    <section className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
      <div
        className={`flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r ${gradient} px-5 py-5 text-white md:px-7`}
      >
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/70">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            Aplicación conectada en vivo
          </div>
          <h3 className="mt-2 text-2xl font-black">{title}</h3>
          <p className="mt-1 max-w-3xl text-sm text-white/80">{description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFrameKey((value) => value + 1)}
            className="rounded-xl bg-white/15 px-4 py-2.5 text-sm font-bold backdrop-blur transition hover:bg-white/25"
          >
            ↻ Recargar módulo
          </button>
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl bg-white px-4 py-2.5 text-sm font-black text-slate-900 transition hover:bg-slate-100"
            >
              Abrir en pantalla completa ↗
            </a>
          )}
        </div>
      </div>
      {error ? (
        <div className="grid min-h-[560px] place-items-center p-8 text-center">
          <div>
            <p className="text-lg font-black text-rose-700">
              No se pudo cargar el módulo
            </p>
            <p className="mt-2 text-sm text-slate-500">{error}</p>
          </div>
        </div>
      ) : !html ? (
        <div className="grid min-h-[560px] place-items-center text-sm font-bold text-slate-500">
          <span className="animate-pulse">
            Conectando con la aplicación original…
          </span>
        </div>
      ) : (
        <iframe
          ref={frameRef}
          key={frameKey}
          srcDoc={html}
          title={title}
          className="h-[800px] w-full border-0 bg-slate-50"
          allow="clipboard-read; clipboard-write"
        />
      )}
    </section>
  );
}

function OperationsHub({
  data,
  loading,
}: {
  data: RetentionSnapshot | null;
  loading: boolean;
}) {
  const zelleTotal =
    data?.zelle.reduce(
      (total, item) =>
        total + Number(String(item.Monto || "0").replace(/[^0-9.-]/g, "")),
      0,
    ) || 0;
  return (
    <section className="mt-6 space-y-6">
      <div className="grid gap-3 sm:grid-cols-3">
        <Card
          label="Casos operativos"
          value={data?.cases.length || 0}
          hint="Lista priorizada de retención"
          tone="violet"
        />
        <Card
          label="Zelle recientes"
          value={data?.zelle.length || 0}
          hint="Pagos publicados por la Consola"
          tone="green"
        />
        <Card
          label="Zelle visible"
          value={money(zelleTotal)}
          hint="Suma de la ventana publicada"
          tone="amber"
        />
      </div>
      {loading ? (
        <div className="rounded-2xl bg-white p-8 text-slate-500 shadow-sm">
          Conectando con operación de retención…
        </div>
      ) : !data ? (
        <div className="rounded-2xl bg-amber-50 p-6 text-amber-900 shadow-sm">
          La operación aún no respondió. Usa “Actualizar” para reintentar.
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <article className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="flex items-center justify-between border-b p-5">
              <div>
                <h3 className="text-lg font-black">Casos del día</h3>
                <p className="text-sm text-slate-500">
                  Priorizados por el sistema de retención
                </p>
              </div>
              <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-bold text-violet-700">
                Operación
              </span>
            </div>
            <div className="max-h-[420px] overflow-auto">
              {data.cases.length ? (
                data.cases.map((item, index) => (
                  <div key={index} className="border-b border-slate-100 p-4">
                    <p className="font-bold text-slate-900">
                      {item.Cliente ||
                        item.Nombre ||
                        item.Título ||
                        "Caso operativo"}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {Object.values(item)
                        .filter(Boolean)
                        .slice(1, 3)
                        .join(" · ") || "Información disponible en el caso"}
                    </p>
                  </div>
                ))
              ) : (
                <p className="p-6 text-sm text-slate-500">
                  No hay casos publicados hoy.
                </p>
              )}
            </div>
          </article>
          <article className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="flex items-center justify-between border-b p-5">
              <div>
                <h3 className="text-lg font-black">Zelle publicados</h3>
                <p className="text-sm text-slate-500">
                  Solo ingresos que ya procesó la Consola
                </p>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                Pagos
              </span>
            </div>
            <div className="max-h-[420px] overflow-auto">
              {data.zelle.length ? (
                data.zelle.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-3 border-b border-slate-100 p-4"
                  >
                    <div>
                      <p className="font-bold text-slate-900">
                        {item.De || item.nombre || "Pago recibido"}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {item.Fecha || ""} {item["Hora del aviso"] || ""} ·{" "}
                        {item.Nota || "Sin nota"}
                      </p>
                    </div>
                    <strong className="text-emerald-700">
                      {item.Monto || "—"}
                    </strong>
                  </div>
                ))
              ) : (
                <p className="p-6 text-sm text-slate-500">
                  No hay Zelle publicados en la ventana actual.
                </p>
              )}
            </div>
          </article>
        </div>
      )}
    </section>
  );
}

function CalendarHub({
  data,
  loading,
}: {
  data: RetentionSnapshot | null;
  loading: boolean;
}) {
  const [calendarView, setCalendarView] = useState<"calendar" | "agenda">(
    "calendar",
  );
  const [agentFilter, setAgentFilter] = useState("Todos");
  const [calendarQuery, setCalendarQuery] = useState("");
  const cases = data?.cases || [];
  const agents = Array.from(
    new Set(cases.map((item) => item.Agente || "Sin asignar")),
  );
  const visibleAgents =
    agentFilter === "Todos"
      ? agents
      : agents.filter((agent) => agent === agentFilter);
  return (
    <section className="mt-6 space-y-5">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-700 p-6 text-white shadow-lg md:p-8">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-200">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            Google Calendar conectado
          </div>
          <h3 className="mt-3 text-2xl font-black md:text-3xl">
            Todos los calendarios en un solo lugar
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-blue-100">
            Navega por semanas y meses, consulta todos los agentes y abre cada
            evento original sin salir del centro de operaciones.
          </p>
        </div>
        <div className="absolute -bottom-10 -right-4 hidden w-40 opacity-90 sm:block">
          <MascotImage
            srcWebp="/eva/eva-baby-clipboard.webp"
            srcPng="/eva/eva-baby-clipboard.png"
            alt="Eva organizando el calendario"
            className="w-full"
          />
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-2 shadow-sm">
        <div className="flex rounded-xl bg-slate-100 p-1">
          <button
            onClick={() => setCalendarView("calendar")}
            className={`rounded-lg px-4 py-2 text-sm font-black transition ${calendarView === "calendar" ? "bg-white text-blue-700 shadow-sm" : "text-slate-500"}`}
          >
            ▦ Calendario completo
          </button>
          <button
            onClick={() => setCalendarView("agenda")}
            className={`rounded-lg px-4 py-2 text-sm font-black transition ${calendarView === "agenda" ? "bg-white text-blue-700 shadow-sm" : "text-slate-500"}`}
          >
            ☷ Agenda priorizada
          </button>
        </div>
        <a
          href="https://calendar.google.com/calendar/u/0/r"
          target="_blank"
          rel="noreferrer"
          className="rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-black text-white hover:bg-blue-800"
        >
          Abrir Google Calendar ↗
        </a>
      </div>
      {calendarView === "calendar" ? (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
          <iframe
            src={CALENDAR_EMBED_URL}
            title="Calendarios de Intercoast"
            className="h-[780px] w-full border-0"
          />
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-3 rounded-2xl bg-white p-3 shadow-sm">
            <input
              value={calendarQuery}
              onChange={(event) => setCalendarQuery(event.target.value)}
              placeholder="Buscar cliente, teléfono o tipo de caso…"
              className="min-w-[220px] flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
            />
            <select
              value={agentFilter}
              onChange={(event) => setAgentFilter(event.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700"
            >
              <option>Todos</option>
              {agents.map((agent) => (
                <option key={agent}>{agent}</option>
              ))}
            </select>
            <div className="flex items-center rounded-xl bg-slate-100 px-4 py-2 text-sm font-bold text-slate-600">
              {cases.length} casos hoy
            </div>
          </div>
          {loading ? (
            <div className="rounded-2xl bg-white p-8 text-slate-500 shadow-sm">
              Cargando agenda…
            </div>
          ) : (
            <div className="grid gap-5 lg:grid-cols-2">
              {visibleAgents.map((agent) => {
                const items = cases
                  .filter((item) => (item.Agente || "Sin asignar") === agent)
                  .filter((item) =>
                    Object.values(item)
                      .join(" ")
                      .toLowerCase()
                      .includes(calendarQuery.toLowerCase()),
                  );
                return (
                  <article
                    key={agent}
                    className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 p-4">
                      <div>
                        <h4 className="font-black">{agent}</h4>
                        <p className="text-xs text-slate-500">
                          {items.length} casos visibles
                        </p>
                      </div>
                      <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600 font-black text-white shadow-sm">
                        {items.length}
                      </span>
                    </div>
                    <div className="max-h-[500px] overflow-auto">
                      {items.map((item, index) => {
                        const score = Number(item.Prioridad || item.Score || 0);
                        const link = item.Enlace || "";
                        return (
                          <div
                            key={index}
                            className="group border-b border-slate-100 p-4 transition hover:bg-blue-50/60"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="font-bold text-slate-900">
                                  {item.Nombre ||
                                    item.Cliente ||
                                    item["Título original"] ||
                                    "Caso de calendario"}
                                </p>
                                <p className="mt-1 text-xs text-slate-500">
                                  {item.Estado ||
                                    item["Estado principal"] ||
                                    "Pendiente"}{" "}
                                  ·{" "}
                                  {item.Teléfono ||
                                    item.Telefono ||
                                    "Sin teléfono"}
                                </p>
                              </div>
                              {score > 0 && (
                                <span
                                  className={`rounded-full px-2.5 py-1 text-xs font-black ${score >= 90 ? "bg-rose-50 text-rose-700" : score >= 60 ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-600"}`}
                                >
                                  P{score}
                                </span>
                              )}
                            </div>
                            {link ? (
                              <a
                                href={link}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-3 inline-flex items-center rounded-lg bg-blue-700 px-3 py-2 text-xs font-bold text-white transition group-hover:bg-blue-800"
                              >
                                Abrir evento <span className="ml-1">↗</span>
                              </a>
                            ) : (
                              <span className="mt-3 inline-block text-xs text-slate-400">
                                Evento sin enlace publicado
                              </span>
                            )}
                          </div>
                        );
                      })}
                      {!items.length && (
                        <p className="p-8 text-center text-sm text-slate-500">
                          No hay casos con este filtro.
                        </p>
                      )}
                    </div>
                  </article>
                );
              })}
              {!agents.length && (
                <div className="rounded-2xl bg-white p-8 text-slate-500 shadow-sm">
                  No hay eventos publicados para hoy.
                </div>
              )}
            </div>
          )}
        </>
      )}
    </section>
  );
}

const AUTOMATIONS = [
  {
    name: "Consola operativa",
    script: "",
    level: "Diario",
    color: "bg-blue-50 text-blue-700",
    description:
      "Buscador de clientes, cartera, lista del día, dinero y publicación de Zelle.",
    warning:
      "Lee correo y datos operativos. Úsala para consultar o actualizar la operación diaria.",
  },
  {
    name: "Telegram",
    script: "",
    level: "Envía mensajes",
    color: "bg-sky-50 text-sky-700",
    description:
      "Envía el resumen del día, anomalías, renovaciones y avisos de operación al equipo.",
    warning:
      "Enviar un mensaje informa al equipo de forma real. Revisa el contenido y evita reenvíos duplicados.",
  },
  {
    name: "Rutinas programadas",
    script: "",
    level: "Alto impacto",
    color: "bg-violet-50 text-violet-700",
    description:
      "Orquesta noche, madrugada y mañana: auditorías, listas, renovaciones y avisos.",
    warning:
      "Puede encadenar varias automatizaciones. No la ejecutes manualmente para una prueba aislada.",
  },
  {
    name: "Calendario y seguimiento",
    script: "",
    level: "Modifica calendario",
    color: "bg-amber-50 text-amber-700",
    description:
      "Clasifica, audita y mueve pendientes; agenda renovaciones, Open Suspense y casos de cancelación.",
    warning:
      "Puede crear o mover eventos en calendarios de agentes. Confirma el caso y evita duplicar citas.",
  },
  {
    name: "Sentry e ingresos",
    script: "",
    level: "Datos operativos",
    color: "bg-indigo-50 text-indigo-700",
    description:
      "Ingiere reportes de Sentry, actualiza pagos y pólizas, y cruza datos para priorizar casos.",
    warning:
      "Procesa archivos operativos. No cambies columnas, carpetas ni nombres de pestañas desde el editor.",
  },
  {
    name: "Aspire y cancelaciones",
    script: "",
    level: "Seguimiento",
    color: "bg-rose-50 text-rose-700",
    description:
      "Lee Open Suspense y pendientes de cancelación para convertirlos en casos trabajables.",
    warning:
      "Crea seguimiento desde avisos de aseguradoras. Úsalo sobre mensajes reales, no correos de prueba.",
  },
  {
    name: "Renovaciones y riesgo",
    script: "",
    level: "Proactivo",
    color: "bg-emerald-50 text-emerald-700",
    description:
      "Detecta pólizas por vencer y señales de riesgo de cancelación para contacto preventivo.",
    warning:
      "Puede agendar y avisar renovaciones. Verifica ventanas y filtros antes de modificar reglas.",
  },
  {
    name: "Leads de radio · Callbright",
    script: "",
    level: "Agenda casos",
    color: "bg-orange-50 text-orange-700",
    description:
      "Importa leads de Callbright y los agenda para que la oficina los trabaje a tiempo.",
    warning:
      "Puede crear eventos de seguimiento. No ejecutes importaciones repetidas sobre el mismo período.",
  },
  {
    name: "Zelle de agentes",
    script: "",
    level: "Controlado",
    color: "bg-emerald-50 text-emerald-700",
    description:
      "Página para agentes con Zelle recibidos y buscador limitado de pagos publicados.",
    warning:
      "Publica únicamente ingresos recientes. No agregues movimientos de salida ni datos de nómina.",
  },
  {
    name: "Depósitos y cuadre",
    script: "",
    level: "Financiero",
    color: "bg-red-50 text-red-700",
    description:
      "Verifica Deposit Log, descuadres por agente y totales operativos contra las fuentes disponibles.",
    warning:
      "Área financiera. Revisa resultados antes de guardar o marcar datos como depositados.",
  },
  {
    name: "Nómina y comisiones",
    script: "",
    level: "Financiero",
    color: "bg-red-50 text-red-700",
    description:
      "Prepara y verifica copias de nómina, chargebacks y cálculos por agente en entornos de prueba.",
    warning:
      "No ejecutarlo sobre archivos operativos. La nómina requiere revisión humana y procesos de prueba separados.",
  },
];

function AutomationCenter() {
  const [automationQuery, setAutomationQuery] = useState("");
  const [automationLevel, setAutomationLevel] = useState("Todos");
  const levels = Array.from(new Set(AUTOMATIONS.map((item) => item.level)));
  const visibleAutomations = AUTOMATIONS.filter(
    (item) =>
      (automationLevel === "Todos" || item.level === automationLevel) &&
      `${item.name} ${item.description} ${item.level}`
        .toLowerCase()
        .includes(automationQuery.toLowerCase()),
  );
  const openScript = (item: (typeof AUTOMATIONS)[number]) => {
    if (item.script.length < 12) {
      window.alert(
        "Este módulo está documentado, pero su enlace de editor no está configurado en el catálogo todavía.",
      );
      return;
    }
    if (
      window.confirm(
        `Abrirás el editor de Apps Script para “${item.name}”.\n\n${item.warning}`,
      )
    )
      window.open(
        `https://script.google.com/home/projects/${item.script}/edit`,
        "_blank",
        "noopener,noreferrer",
      );
  };
  return (
    <section className="mt-6">
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-6 text-white shadow-lg md:p-8">
        <div className="relative z-10">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-300">
            Centro de automatizaciones
          </p>
          <h3 className="mt-2 text-2xl font-black md:text-3xl">
            Herramientas de la oficina, explicadas
          </h3>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-300">
            Encuentra el proceso correcto, entiende su impacto y abre el editor
            original con una advertencia clara antes de tocar la operación.
          </p>
        </div>
        <div className="absolute -bottom-12 -right-8 hidden w-44 opacity-80 sm:block">
          <MascotImage
            srcWebp="/eva/eva-baby-headset.webp"
            srcPng="/eva/eva-baby-headset.png"
            alt="Eva ayudando con las automatizaciones"
            className="w-full"
          />
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-3 rounded-2xl bg-white p-3 shadow-sm">
        <input
          value={automationQuery}
          onChange={(event) => setAutomationQuery(event.target.value)}
          placeholder="Buscar Telegram, Zelle, renovaciones…"
          className="min-w-[230px] flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
        />
        <select
          value={automationLevel}
          onChange={(event) => setAutomationLevel(event.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700"
        >
          <option>Todos</option>
          {levels.map((level) => (
            <option key={level}>{level}</option>
          ))}
        </select>
        <div className="flex items-center rounded-xl bg-slate-100 px-4 py-2 text-sm font-bold text-slate-600">
          {visibleAutomations.length} herramientas
        </div>
      </div>
      <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {visibleAutomations.map((item, index) => (
          <article
            key={item.name}
            className="group flex flex-col rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-slate-900 text-xs font-black text-white">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-bold ${item.color}`}
              >
                {item.level}
              </span>
            </div>
            <h4 className="text-lg font-black">{item.name}</h4>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              {item.description}
            </p>
            <div className="mt-4 flex-1 rounded-xl border border-amber-100 bg-amber-50 p-3 text-xs leading-relaxed text-amber-900">
              <strong>Antes de abrir:</strong> {item.warning}
            </div>
            <button
              onClick={() => openScript(item)}
              className="mt-5 w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-black text-white transition group-hover:bg-blue-700"
            >
              Abrir herramienta con advertencia ↗
            </button>
          </article>
        ))}
      </div>
      {!visibleAutomations.length && (
        <div className="mt-5 rounded-2xl bg-white p-8 text-center text-sm text-slate-500 shadow-sm">
          No encontramos una automatización con ese filtro.
        </div>
      )}
    </section>
  );
}

export default function AdminPanel() {
  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selected, setSelected] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [view, setView] = useState<
    | "trabajo"
    | "resumen"
    | "leads"
    | "consola"
    | "zelle"
    | "calendario"
    | "control"
    | "diagnosticos"
    | "auditoria"
    | "automatizaciones"
  >(() => {
    const requested = new URLSearchParams(window.location.search).get("view");
    return requested === "control" ? "control" : "trabajo";
  });
  const [visitedWorkspaces, setVisitedWorkspaces] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("Todos");
  const [retention, setRetention] = useState<RetentionSnapshot | null>(null);
  const [retentionLoading, setRetentionLoading] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem("intercoast-admin-theme");
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });
  const [searchOpen, setSearchOpen] = useState(false);
  const [evaOpen, setEvaOpen] = useState(false);
  const [auditEntries, setAuditEntries] = useState<AuditEntry[]>([]);
  const [auditLoading, setAuditLoading] = useState(false);
  const load = async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/admin/leads", { credentials: "include" });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setLeads(d.leads || []);
    } catch (e) {
      setMessage(
        e instanceof Error ? e.message : "No se pudieron cargar los leads.",
      );
    } finally {
      setLoading(false);
    }
  };
  const loadRetention = async () => {
    setRetentionLoading(true);
    try {
      const response = await fetch("/api/admin/retention", {
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "No se pudo cargar la operación.");
      setRetention(data);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "No se pudo cargar la operación.",
      );
    } finally {
      setRetentionLoading(false);
    }
  };
  const loadAudit = async () => {
    setAuditLoading(true);
    try {
      const response = await fetch("/api/admin/audit", {
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "No se pudo cargar el historial.");
      setAuditEntries(data.entries || []);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "No se pudo cargar el historial.",
      );
    } finally {
      setAuditLoading(false);
    }
  };
  const recordAudit = async (action: string, entity: string, detail: string) => {
    try {
      const response = await fetch("/api/admin/audit", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, entity, detail }),
      });
      const data = await response.json();
      if (response.ok && data.entry)
        setAuditEntries((current) => [data.entry, ...current].slice(0, 200));
    } catch {
      // El cambio principal no debe fallar si el registro está temporalmente caído.
    }
  };
  useEffect(() => {
    (async () => {
      try {
        await handleAuthCallback();
      } catch {}
      const current = await getUser();
      const normalized = String(current?.email || "").toLowerCase();
      if (ALLOWED.has(normalized)) {
        setUser(normalized);
        await Promise.all([load(), loadRetention()]);
      } else setLoading(false);
    })();
  }, []);
  useEffect(() => {
    localStorage.setItem("intercoast-admin-theme", theme);
  }, [theme]);
  useEffect(() => {
    if (view === "auditoria") void loadAudit();
  }, [view]);
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
      if (event.key === "Escape") {
        setSearchOpen(false);
        setEvaOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
  useEffect(() => {
    if (!["consola", "zelle", "calendario"].includes(view)) return;
    setVisitedWorkspaces((current) =>
      current.includes(view) ? current : [...current, view],
    );
  }, [view]);
  const counts = useMemo(
    () =>
      STATES.reduce<Record<string, number>>(
        (a, s) => ({
          ...a,
          [s]: leads.filter((l) => (l.estado || "Nuevo") === s).length,
        }),
        {},
      ),
    [leads],
  );
  const value = useMemo(
    () => leads.reduce((a, l) => a + Number(l.totalEstimado || 0), 0),
    [leads],
  );
  const due = useMemo(
    () =>
      leads.filter(
        (l) =>
          l.proximoSeguimiento &&
          new Date(l.proximoSeguimiento).getTime() <= Date.now() &&
          !["Vendido", "Perdido"].includes(l.estado),
      ).length,
    [leads],
  );
  const shown = useMemo(
    () =>
      leads.filter(
        (l) =>
          `${l.nombre} ${l.email} ${l.telefono} ${l.asesor} ${l.fuente}`
            .toLowerCase()
            .includes(query.toLowerCase()) &&
          (filter === "Todos" || (l.estado || "Nuevo") === filter),
      ),
    [leads, query, filter],
  );
  const sources = useMemo(
    () =>
      Object.entries(
        leads.reduce<Record<string, number>>((a, l) => {
          const k = l.fuente || "Directo";
          a[k] = (a[k] || 0) + 1;
          return a;
        }, {}),
      ).sort((a, b) => b[1] - a[1]),
    [leads],
  );
  const auth = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = email.trim().toLowerCase();
    if (!ALLOWED.has(normalized))
      return setMessage("Este correo no está autorizado.");
    try {
      if (mode === "login") await login(normalized, password);
      else {
        await signup(normalized, password);
        return setMessage("Revisa tu correo y confirma la cuenta.");
      }
      setUser(normalized);
      await Promise.all([load(), loadRetention()]);
    } catch (err) {
      setMessage(
        err instanceof Error ? err.message : "No se pudo iniciar sesión.",
      );
    }
  };
  const save = async () => {
    if (!selected) return;
    const previous = leads.find((lead) => lead.row === selected.row);
    const r = await fetch("/api/admin/leads", {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(selected),
    });
    const d = await r.json();
    if (!r.ok) return setMessage(d.error || "No se pudo guardar.");
    setLeads((items) => items.map((l) => (l.row === d.lead.row ? d.lead : l)));
    setSelected(d.lead);
    setMessage("Lead actualizado correctamente.");
    const changes = [
      previous?.estado !== d.lead.estado
        ? `estado: ${previous?.estado || "Nuevo"} → ${d.lead.estado || "Nuevo"}`
        : "",
      previous?.asesor !== d.lead.asesor
        ? `asesor: ${previous?.asesor || "Sin asignar"} → ${d.lead.asesor || "Sin asignar"}`
        : "",
      previous?.proximoSeguimiento !== d.lead.proximoSeguimiento
        ? "seguimiento actualizado"
        : "",
      previous?.notas !== d.lead.notas ? "notas actualizadas" : "",
    ].filter(Boolean);
    void recordAudit(
      "Lead actualizado",
      d.lead.nombre || `Fila ${d.lead.row}`,
      changes.join(" · ") || "Registro guardado sin cambios visibles",
    );
  };
  const csv = () => {
    const rows = [
      [
        "Nombre",
        "Email",
        "Teléfono",
        "Estado",
        "Asesor",
        "Fuente",
        "Total",
        "Seguimiento",
        "Notas",
      ],
      ...shown.map((l) => [
        l.nombre,
        l.email,
        l.telefono,
        l.estado || "Nuevo",
        l.asesor,
        l.fuente,
        l.totalEstimado,
        l.proximoSeguimiento,
        l.notas,
      ]),
    ];
    const blob = new Blob(
      [
        rows
          .map((row) =>
            row
              .map((v) => `"${String(v ?? "").replaceAll('"', '""')}"`)
              .join(","),
          )
          .join("\n"),
      ],
      { type: "text/csv" },
    );
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `leads-intercoast-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };
  if (!user)
    return (
      <main className="grid min-h-screen place-items-center bg-slate-950 p-4">
        <form
          onSubmit={auth}
          className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl"
        >
          <p className="text-xs font-black tracking-widest text-blue-700">
            INTERCOAST INSURANCE
          </p>
          <h1 className="mt-3 text-3xl font-black">Panel de operaciones</h1>
          <p className="mt-2 text-sm text-slate-600">
            Leads, seguimiento y resultados en un solo lugar.
          </p>
          <label className="mt-6 block text-sm font-bold">
            Correo
            <input
              className={input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label className="mt-4 block text-sm font-bold">
            Contraseña
            <input
              className={input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              required
            />
          </label>
          {message && (
            <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
              {message}
            </p>
          )}
          <button className="mt-6 w-full rounded-xl bg-blue-700 py-3 font-bold text-white">
            {mode === "login" ? "Entrar al panel" : "Crear acceso"}
          </button>
          <button
            type="button"
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className="mt-4 w-full text-sm font-bold text-blue-700"
          >
            {mode === "login" ? "Primera vez: crear acceso" : "Ya tengo cuenta"}
          </button>
        </form>
      </main>
    );
  const unassigned = leads.filter(
    (lead) => !lead.asesor && !["Vendido", "Perdido"].includes(lead.estado),
  ).length;
  const urgentCases = (retention?.cases || []).filter(
    (item) => Number(item.Prioridad || item.Score || item.score || 0) >= 90,
  ).length;
  const navigateToLead = (lead: Lead) => {
    setSelected(lead);
    setView("leads");
  };
  return (
    <main
      className={`admin-shell min-h-screen bg-slate-100 ${theme === "dark" ? "dark" : ""}`}
    >
      <header className="admin-header sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-4 px-4 py-4 md:px-8">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[.16em] text-blue-700">
              Intercoast Insurance
            </p>
            <h1 className="text-xl font-black">Centro de operaciones</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="admin-header-button inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold"
              title="Búsqueda global (Ctrl + K)"
            >
              <Search size={16} /> Buscar <kbd className="hidden rounded bg-slate-100 px-1.5 py-0.5 text-[10px] sm:inline">Ctrl K</kbd>
            </button>
            <button
              onClick={() => setEvaOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-2 text-sm font-black text-blue-700"
            >
              <Sparkles size={16} /> Preguntar a Eva
            </button>
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="admin-header-button grid h-10 w-10 place-items-center rounded-xl border border-slate-200"
              aria-label={theme === "dark" ? "Activar modo claro" : "Activar modo oscuro"}
              title={theme === "dark" ? "Modo claro" : "Modo oscuro"}
            >
              {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <a
              href={SHEET}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold"
            >
              Hoja de cálculo ↗
            </a>
            <button
              onClick={() => {
                void Promise.all([load(), loadRetention()]);
              }}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold"
            >
              Actualizar
            </button>
            <button
              onClick={async () => {
                await logout();
                window.location.href = "/";
              }}
              className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-bold text-white"
            >
              Salir
            </button>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-[1600px] px-4 py-7 md:px-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-widest text-blue-700">
              Espacio privado · {user}
            </p>
            <h2 className="text-3xl font-black">
              {view === "resumen"
                ? "Resumen comercial"
                : view === "trabajo"
                  ? "Centro de trabajo"
                : view === "leads"
                  ? "Gestión de leads"
                  : view === "consola"
                    ? "Consola operativa"
                    : view === "zelle"
                      ? "Zelle de agentes"
                      : view === "calendario"
                        ? "Calendarios de la oficina"
                        : view === "control"
                          ? "Centro de control"
                        : view === "diagnosticos"
                          ? "Salud de automatizaciones"
                        : view === "auditoria"
                          ? "Historial de actividad"
                        : "Automatizaciones"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {view === "resumen"
                ? "Lo más importante de la oficina, en una sola mirada."
                : view === "trabajo"
                  ? "Prioridades reales de leads y retención listas para trabajar."
                : view === "leads"
                  ? "Busca, actualiza y da seguimiento sin perder oportunidades."
                  : view === "consola"
                    ? "La aplicación completa de tu papá, funcionando dentro del panel."
                    : view === "zelle"
                      ? "La interfaz morada original con los pagos y controles de los agentes."
                      : view === "calendario"
                        ? "Todos los calendarios y la agenda priorizada en una sola vista."
                        : view === "control"
                          ? "Comprueba la salud de todos los procesos y ejecútalos manualmente desde un solo lugar."
                        : view === "diagnosticos"
                          ? "Ejecuta revisiones reales y seguras de Sentry, renovaciones, riesgo y Callbright."
                        : view === "auditoria"
                          ? "Consulta quién cambió qué y cuándo desde este panel."
                        : "Conoce cada proceso antes de abrir o modificar sus scripts."}
            </p>
          </div>
          <nav
            aria-label="Secciones del panel"
            className="flex max-w-full gap-1 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm"
          >
            <button
              onClick={() => setView("trabajo")}
              className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-bold transition ${view === "trabajo" ? "bg-blue-700 text-white shadow-md shadow-blue-200" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}
            >
              <BriefcaseBusiness size={15} /> Trabajo
            </button>
            <button
              onClick={() => setView("resumen")}
              className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-bold transition ${view === "resumen" ? "bg-blue-700 text-white shadow-md shadow-blue-200" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}
            >
              ◫ Resumen
            </button>
            <button
              onClick={() => setView("leads")}
              className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-bold transition ${view === "leads" ? "bg-blue-700 text-white shadow-md shadow-blue-200" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}
            >
              ◎ Leads
            </button>
            <button
              onClick={() => setView("control")}
              className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-bold transition ${view === "control" ? "bg-cyan-800 text-white shadow-md shadow-cyan-200" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}
            >
              <Bot size={15} /> Control
            </button>
            <button
              onClick={() => setView("consola")}
              className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-bold transition ${view === "consola" ? "bg-blue-700 text-white shadow-md shadow-blue-200" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}
            >
              ◈ Consola
            </button>
            <button
              onClick={() => setView("zelle")}
              className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-bold transition ${view === "zelle" ? "bg-violet-700 text-white shadow-md shadow-violet-200" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}
            >
              $ Zelle
            </button>
            <button
              onClick={() => setView("calendario")}
              className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-bold transition ${view === "calendario" ? "bg-blue-700 text-white shadow-md shadow-blue-200" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}
            >
              □ Calendario
            </button>
            <button
              onClick={() => setView("automatizaciones")}
              className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-bold transition ${view === "automatizaciones" ? "bg-blue-700 text-white shadow-md shadow-blue-200" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}
            >
              ⚡ Automatizaciones
            </button>
            <button
              onClick={() => setView("diagnosticos")}
              className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-bold transition ${view === "diagnosticos" ? "bg-cyan-700 text-white shadow-md shadow-cyan-200" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}
            >
              <Activity size={15} /> Salud
            </button>
            <button
              onClick={() => setView("auditoria")}
              className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-bold transition ${view === "auditoria" ? "bg-blue-700 text-white shadow-md shadow-blue-200" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}
            >
              <History size={15} /> Auditoría
            </button>
          </nav>
        </div>
        {message && (
          <p className="mb-5 rounded-xl bg-blue-50 p-3 text-sm text-blue-800">
            {message}
          </p>
        )}
        {view === "trabajo" && (
          <WorkCenter
            leads={leads}
            retention={retention}
            loading={loading || retentionLoading}
            onOpenLead={navigateToLead}
            onRefresh={() => void Promise.all([load(), loadRetention()])}
          />
        )}
        {view === "resumen" && (
          <>
            <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <Card
                label="Leads totales"
                value={leads.length}
                hint="Registros disponibles"
              />
              <Card
                label="Valor estimado"
                value={money(value)}
                hint="Suma de cotizaciones"
                tone="green"
              />
              <Card
                label="Conversión"
                value={`${leads.length ? Math.round(((counts.Vendido || 0) * 100) / leads.length) : 0}%`}
                hint={`${counts.Vendido || 0} ventas cerradas`}
                tone="violet"
              />
              <Card
                label="Seguimientos"
                value={due}
                hint={due ? "Requieren atención" : "Todo al día"}
                tone="amber"
              />
            </section>
            <div className="mt-5">
              <EvaCoach due={due} leads={leads.length} />
            </div>
          </>
        )}
        {view === "resumen" ? (
          <section className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_.7fr]">
            <article className="rounded-2xl bg-white p-5 shadow-sm">
              <h3 className="text-lg font-black">Embudo comercial</h3>
              <p className="text-sm text-slate-500">
                Avance de los leads por estado
              </p>
              <div className="mt-7 space-y-5">
                {STATES.map((s) => {
                  const n = counts[s] || 0;
                  const w = leads.length
                    ? Math.max((n * 100) / leads.length, n ? 5 : 0)
                    : 0;
                  return (
                    <div key={s}>
                      <div className="mb-2 flex justify-between text-sm font-bold">
                        <span>{s}</span>
                        <span>
                          {n}{" "}
                          <span className="font-normal text-slate-400">
                            (
                            {leads.length
                              ? Math.round((n * 100) / leads.length)
                              : 0}
                            %)
                          </span>
                        </span>
                      </div>
                      <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full ${s === "Vendido" ? "bg-emerald-500" : s === "Perdido" ? "bg-rose-400" : "bg-blue-600"}`}
                          style={{ width: `${w}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </article>
            <aside className="rounded-2xl bg-slate-900 p-5 text-white">
              <p className="text-xs font-bold uppercase tracking-widest text-blue-300">
                Acciones prioritarias
              </p>
              <h3 className="mt-2 text-xl font-black">
                Mantén el embudo en movimiento
              </h3>
              <div className="mt-6 rounded-xl bg-white/10 p-4">
                <p className="text-3xl font-black">{due}</p>
                <p className="text-sm text-slate-300">
                  seguimientos pendientes
                </p>
              </div>
              <button
                onClick={() => {
                  setView("leads");
                  setFilter("Nuevo");
                }}
                className="mt-4 w-full rounded-xl bg-white px-4 py-3 text-sm font-black text-slate-900"
              >
                Ver leads nuevos →
              </button>
            </aside>
            <article className="rounded-2xl bg-white p-5 shadow-sm lg:col-span-2">
              <h3 className="text-lg font-black">Origen de los leads</h3>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {sources.map(([s, n]) => (
                  <div key={s} className="rounded-xl bg-slate-50 p-4">
                    <p className="truncate text-sm font-bold">{s}</p>
                    <p className="mt-2 text-2xl font-black">{n}</p>
                    <div className="mt-3 h-1.5 rounded-full bg-slate-200">
                      <div
                        className="h-full rounded-full bg-blue-600"
                        style={{ width: `${(n * 100) / leads.length}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </section>
        ) : view === "leads" ? (
          <section className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_.65fr]">
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
              <div className="border-b border-slate-100 p-4">
                <div className="flex flex-wrap gap-3">
                  <input
                    className="min-w-[180px] flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm"
                    placeholder="Buscar cliente, correo o teléfono…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  <select
                    className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    <option>Todos</option>
                    {STATES.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                  <button
                    onClick={csv}
                    className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-bold text-white"
                  >
                    Exportar CSV
                  </button>
                </div>
                <p className="mt-3 text-xs text-slate-500">
                  Mostrando {shown.length} de {leads.length} leads
                </p>
              </div>
              {loading ? (
                <p className="p-8 text-slate-500">Cargando leads…</p>
              ) : (
                <div className="max-h-[620px] overflow-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="sticky top-0 bg-slate-50 text-[11px] uppercase text-slate-500">
                      <tr>
                        <th className="p-4">Cliente</th>
                        <th className="p-4">Estado</th>
                        <th className="p-4">Seguimiento</th>
                        <th className="p-4 text-right">Estimado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {shown.map((l) => (
                        <tr
                          key={l.row}
                          onClick={() => setSelected(l)}
                          className={`cursor-pointer border-t border-slate-100 hover:bg-blue-50 ${selected?.row === l.row ? "bg-blue-50" : ""}`}
                        >
                          <td className="p-4">
                            <strong className="block">
                              {l.nombre || "Sin nombre"}
                            </strong>
                            <span className="text-xs text-slate-500">
                              {l.telefono || l.email}
                            </span>
                          </td>
                          <td className="p-4">
                            <span
                              className={`rounded-full px-2.5 py-1 text-xs font-bold ${colors[l.estado || "Nuevo"]}`}
                            >
                              {l.estado || "Nuevo"}
                            </span>
                          </td>
                          <td className="p-4 text-xs text-slate-500">
                            {date(l.proximoSeguimiento)}
                          </td>
                          <td className="p-4 text-right font-black">
                            {money(l.totalEstimado)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {!shown.length && (
                    <p className="p-8 text-center text-sm text-slate-500">
                      No hay resultados.
                    </p>
                  )}
                </div>
              )}
            </div>
            <aside className="h-fit rounded-2xl bg-white p-5 shadow-sm">
              <h3 className="text-lg font-black">
                {selected ? "Gestionar lead" : "Selecciona un lead"}
              </h3>
              {selected ? (
                <>
                  <div className="mt-4 rounded-xl bg-slate-50 p-4">
                    <p className="font-black">
                      {selected.nombre || "Sin nombre"}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      {selected.email || "Sin correo"} ·{" "}
                      {selected.telefono || "Sin teléfono"}
                    </p>
                    <a
                      className="mt-3 inline-block rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white"
                      href={`https://wa.me/${String(selected.telefono).replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      WhatsApp
                    </a>
                  </div>
                  <label className="mt-4 block text-sm font-bold">
                    Estado
                    <select
                      className={input}
                      value={selected.estado || "Nuevo"}
                      onChange={(e) =>
                        setSelected({ ...selected, estado: e.target.value })
                      }
                    >
                      {STATES.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </label>
                  <label className="mt-3 block text-sm font-bold">
                    Asesor
                    <input
                      className={input}
                      value={selected.asesor || ""}
                      onChange={(e) =>
                        setSelected({ ...selected, asesor: e.target.value })
                      }
                      placeholder="Responsable"
                    />
                  </label>
                  <label className="mt-3 block text-sm font-bold">
                    Próximo seguimiento
                    <input
                      className={input}
                      type="datetime-local"
                      value={
                        selected.proximoSeguimiento
                          ? new Date(selected.proximoSeguimiento)
                              .toISOString()
                              .slice(0, 16)
                          : ""
                      }
                      onChange={(e) =>
                        setSelected({
                          ...selected,
                          proximoSeguimiento: e.target.value,
                        })
                      }
                    />
                  </label>
                  <label className="mt-3 block text-sm font-bold">
                    Notas
                    <textarea
                      className={input}
                      rows={4}
                      value={selected.notas || ""}
                      onChange={(e) =>
                        setSelected({ ...selected, notas: e.target.value })
                      }
                      placeholder="Llamadas y próximos pasos…"
                    />
                  </label>
                  <button
                    onClick={save}
                    className="mt-5 w-full rounded-xl bg-blue-700 py-3 font-black text-white"
                  >
                    Guardar cambios
                  </button>
                </>
              ) : (
                <p className="mt-3 text-sm text-slate-500">
                  Elige un registro de la tabla para actualizar su estado,
                  asignar asesor y programar el siguiente contacto.
                </p>
              )}
            </aside>
          </section>
        ) : null}
        {visitedWorkspaces.includes("consola") && (
          <div className={view === "consola" ? "block" : "hidden"}>
            <NativeConsole />
          </div>
        )}
        {visitedWorkspaces.includes("zelle") && (
          <div className={view === "zelle" ? "block" : "hidden"}>
            <NativeZelle />
          </div>
        )}
        {visitedWorkspaces.includes("calendario") && (
          <div className={view === "calendario" ? "block" : "hidden"}>
            <NativeCalendar />
          </div>
        )}
        {view === "automatizaciones" && <AutomationCenter />}
        {view === "control" && <SystemControl />}
        {view === "diagnosticos" && <DiagnosticsPanel />}
        {view === "auditoria" && (
          <AuditPanel entries={auditEntries} loading={auditLoading} />
        )}
      </div>
      <GlobalSearch
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        leads={leads}
        retention={retention}
        onOpenLead={navigateToLead}
      />
      <EvaContextAssistant
        open={evaOpen}
        onClose={() => setEvaOpen(false)}
        view={view}
        due={due}
        unassigned={unassigned}
        urgent={urgentCases}
        onNavigate={(target) => setView(target as typeof view)}
      />
      <button
        onClick={() => setEvaOpen(true)}
        className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-700 to-violet-700 px-4 py-3 text-sm font-black text-white shadow-xl transition hover:-translate-y-0.5"
      >
        <Sparkles size={17} /> Eva
        {(due + urgentCases) > 0 && (
          <span className="grid h-6 min-w-6 place-items-center rounded-full bg-rose-500 px-1 text-[11px]">
            {due + urgentCases}
          </span>
        )}
      </button>
    </main>
  );
}
