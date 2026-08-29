import React, { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  Clock3,
  ExternalLink,
  FileClock,
  History,
  MessageCircle,
  Phone,
  Play,
  Search,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import MascotImage from "../eva/MascotImage";

export type AdminLead = {
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

export type RetentionSnapshot = {
  updatedAt: string;
  availableSheets: string[];
  cases: Array<Record<string, string>>;
  zelle: Array<Record<string, string>>;
};

export type AuditEntry = {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  entity: string;
  detail: string;
};

const normalize = (value: unknown) =>
  String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const caseField = (item: Record<string, string>, ...names: string[]) => {
  for (const name of names) if (item[name]) return item[name];
  return "";
};

const isClosed = (lead: AdminLead) =>
  ["Vendido", "Perdido"].includes(lead.estado || "Nuevo");

const isDue = (lead: AdminLead) =>
  Boolean(
    lead.proximoSeguimiento &&
      new Date(lead.proximoSeguimiento).getTime() <= Date.now() &&
      !isClosed(lead),
  );

function PriorityBadge({ score }: { score: number }) {
  const style =
    score >= 90
      ? "bg-rose-50 text-rose-700"
      : score >= 60
        ? "bg-amber-50 text-amber-700"
        : "bg-slate-100 text-slate-600";
  return (
    <span className={`rounded-full px-2.5 py-1 text-[11px] font-black ${style}`}>
      P{score || "—"}
    </span>
  );
}

export function WorkCenter({
  leads,
  retention,
  loading,
  onOpenLead,
  onRefresh,
}: {
  leads: AdminLead[];
  retention: RetentionSnapshot | null;
  loading: boolean;
  onOpenLead: (lead: AdminLead) => void;
  onRefresh: () => void;
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"Todos" | "Vencidos" | "Sin asignar" | "Urgentes">("Todos");

  const leadTasks = useMemo(
    () =>
      leads
        .filter((lead) => !isClosed(lead))
        .map((lead) => ({
          kind: "lead" as const,
          id: `lead-${lead.row}`,
          title: lead.nombre || "Lead sin nombre",
          phone: lead.telefono,
          owner: lead.asesor || "Sin asignar",
          status: lead.estado || "Nuevo",
          due: lead.proximoSeguimiento,
          overdue: isDue(lead),
          urgent: isDue(lead) || !lead.asesor,
          score: isDue(lead) ? 95 : !lead.asesor ? 75 : 40,
          description: `${lead.fuente || "Sitio web"} · $${Number(lead.totalEstimado || 0).toFixed(0)} estimados`,
          lead,
          link: "",
        })),
    [leads],
  );

  const operationTasks = useMemo(
    () =>
      (retention?.cases || []).map((item, index) => {
        const score = Number(caseField(item, "Prioridad", "Score", "score") || 0);
        return {
          kind: "operation" as const,
          id: `operation-${index}`,
          title: caseField(item, "Nombre", "Cliente", "Título original", "Titulo") || "Caso operativo",
          phone: caseField(item, "Teléfono", "Telefono", "telefono"),
          owner: caseField(item, "Agente", "agente") || "Sin asignar",
          status: caseField(item, "Estado", "Estado principal", "estado") || "Pendiente",
          due: caseField(item, "Fecha", "Próximo seguimiento", "Proximo seguimiento"),
          overdue: false,
          urgent: score >= 90,
          score,
          description:
            caseField(item, "Resumen", "resumen", "Título original", "Titulo") ||
            "Caso publicado por la operación de retención",
          lead: null,
          link: caseField(item, "Enlace", "enlace"),
        };
      }),
    [retention],
  );

  const tasks = [...leadTasks, ...operationTasks]
    .filter((task) => {
      const matches = normalize(`${task.title} ${task.phone} ${task.owner} ${task.status}`).includes(normalize(query));
      if (!matches) return false;
      if (filter === "Vencidos") return task.overdue;
      if (filter === "Sin asignar") return task.owner === "Sin asignar";
      if (filter === "Urgentes") return task.urgent;
      return true;
    })
    .sort((a, b) => Number(b.urgent) - Number(a.urgent) || b.score - a.score);

  const dueCount = leadTasks.filter((task) => task.overdue).length;
  const unassigned = leadTasks.filter((task) => task.owner === "Sin asignar").length;
  const urgent = operationTasks.filter((task) => task.urgent).length;

  return (
    <section className="mt-6 space-y-5">
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          ["Seguimientos vencidos", dueCount, "Requieren contacto hoy", "rose"],
          ["Sin responsable", unassigned, "Leads que necesitan dueño", "amber"],
          ["Casos urgentes", urgent, "Prioridad operativa 90+", "violet"],
        ].map(([label, value, hint, tone]) => (
          <button
            key={String(label)}
            onClick={() => setFilter(tone === "rose" ? "Vencidos" : tone === "amber" ? "Sin asignar" : "Urgentes")}
            className="admin-surface rounded-2xl border border-slate-100 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <p className="text-[11px] font-black uppercase tracking-wider text-slate-500">{label}</p>
            <p className="mt-2 text-3xl font-black text-slate-950">{value}</p>
            <p className="mt-1 text-xs text-slate-500">{hint}</p>
          </button>
        ))}
      </div>

      <div className="admin-surface overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-4 md:p-5">
          <div>
            <div className="flex items-center gap-2">
              <CalendarClock className="text-blue-700" size={20} />
              <h3 className="text-xl font-black">Bandeja de trabajo</h3>
            </div>
            <p className="mt-1 text-sm text-slate-500">Leads y casos reales ordenados por prioridad.</p>
          </div>
          <button onClick={onRefresh} className="rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-black text-white">
            {loading ? "Actualizando…" : "Actualizar bandeja"}
          </button>
        </div>
        <div className="flex flex-wrap gap-2 border-b border-slate-100 p-3">
          <div className="relative min-w-[230px] flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar cliente, teléfono, agente o estado…"
              className="admin-input w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-600"
            />
          </div>
          <div className="flex max-w-full gap-1 overflow-x-auto rounded-xl bg-slate-100 p-1">
            {["Todos", "Vencidos", "Sin asignar", "Urgentes"].map((item) => (
              <button
                key={item}
                onClick={() => setFilter(item as typeof filter)}
                className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-black ${filter === item ? "bg-white text-blue-700 shadow-sm" : "text-slate-500"}`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="max-h-[680px] divide-y divide-slate-100 overflow-auto">
          {tasks.map((task) => (
            <article key={task.id} className="grid gap-3 p-4 transition hover:bg-blue-50/60 md:grid-cols-[52px_1fr_auto] md:items-center">
              <div className={`grid h-11 w-11 place-items-center rounded-xl ${task.overdue ? "bg-rose-50 text-rose-700" : task.kind === "lead" ? "bg-blue-50 text-blue-700" : "bg-violet-50 text-violet-700"}`}>
                {task.overdue ? <AlertTriangle size={19} /> : task.kind === "lead" ? <UserRound size={19} /> : <FileClock size={19} />}
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="truncate font-black text-slate-950">{task.title}</h4>
                  <PriorityBadge score={task.score} />
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-bold text-slate-600">{task.status}</span>
                </div>
                <p className="mt-1 text-xs text-slate-500">{task.owner} · {task.phone || "Sin teléfono"}{task.due ? ` · ${task.due}` : ""}</p>
                <p className="mt-1 line-clamp-1 text-sm text-slate-600">{task.description}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {task.phone && <a href={`tel:${task.phone}`} className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-700" title="Llamar"><Phone size={17} /></a>}
                {task.phone && <a href={`https://wa.me/${String(task.phone).replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-600 text-white" title="WhatsApp"><MessageCircle size={17} /></a>}
                {task.lead ? (
                  <button onClick={() => onOpenLead(task.lead!)} className="inline-flex items-center gap-1 rounded-xl bg-blue-700 px-3 py-2 text-xs font-black text-white">Gestionar <ArrowRight size={14} /></button>
                ) : task.link ? (
                  <a href={task.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-xl bg-violet-700 px-3 py-2 text-xs font-black text-white">Abrir caso <ExternalLink size={13} /></a>
                ) : null}
              </div>
            </article>
          ))}
          {!tasks.length && <div className="p-10 text-center text-sm text-slate-500"><CheckCircle2 className="mx-auto mb-3 text-emerald-500" />No hay pendientes con este filtro.</div>}
        </div>
      </div>
    </section>
  );
}

type SearchItem = {
  id: string;
  title: string;
  subtitle: string;
  type: "Lead" | "Operación" | "Zelle";
  lead?: AdminLead;
};

export function GlobalSearch({
  open,
  onClose,
  leads,
  retention,
  onOpenLead,
}: {
  open: boolean;
  onClose: () => void;
  leads: AdminLead[];
  retention: RetentionSnapshot | null;
  onOpenLead: (lead: AdminLead) => void;
}) {
  const [query, setQuery] = useState("");
  useEffect(() => { if (open) setQuery(""); }, [open]);
  if (!open) return null;
  const items: SearchItem[] = [
    ...leads.map((lead) => ({ id: `lead-${lead.row}`, title: lead.nombre || "Lead sin nombre", subtitle: `${lead.telefono || lead.email} · ${lead.estado || "Nuevo"}`, type: "Lead" as const, lead })),
    ...(retention?.cases || []).map((item, index) => ({ id: `case-${index}`, title: caseField(item, "Nombre", "Cliente", "Título original") || "Caso operativo", subtitle: `${caseField(item, "Teléfono", "Telefono")} · ${caseField(item, "Estado", "Estado principal") || "Pendiente"}`, type: "Operación" as const })),
    ...(retention?.zelle || []).map((item, index) => ({ id: `zelle-${index}`, title: item.De || item.nombre || "Pago Zelle", subtitle: `${item.Monto || ""} · ${item.Fecha || ""}`, type: "Zelle" as const })),
  ].filter((item) => !query || normalize(`${item.title} ${item.subtitle} ${item.type}`).includes(normalize(query))).slice(0, 40);

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/60 p-4 backdrop-blur-sm" onMouseDown={onClose}>
      <section className="admin-surface mx-auto mt-[7vh] max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl" onMouseDown={(event) => event.stopPropagation()}>
        <div className="flex items-center gap-3 border-b border-slate-100 p-4">
          <Search className="text-blue-700" />
          <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Busca en leads, operación y Zelle…" className="admin-input min-w-0 flex-1 bg-transparent py-2 text-base outline-none" />
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-xl bg-slate-100"><X size={18} /></button>
        </div>
        <div className="max-h-[65vh] divide-y divide-slate-100 overflow-auto">
          {items.map((item) => (
            <button key={item.id} onClick={() => { if (item.lead) onOpenLead(item.lead); onClose(); }} className="flex w-full items-center gap-3 p-4 text-left transition hover:bg-blue-50">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-700"><Search size={17} /></span>
              <span className="min-w-0 flex-1"><strong className="block truncate">{item.title}</strong><span className="block truncate text-xs text-slate-500">{item.subtitle}</span></span>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black text-slate-600">{item.type}</span>
            </button>
          ))}
          {!items.length && <p className="p-10 text-center text-sm text-slate-500">No encontramos coincidencias.</p>}
        </div>
        <div className="border-t border-slate-100 bg-slate-50 px-4 py-3 text-xs text-slate-500">Consejo: presiona Ctrl + K desde cualquier módulo para volver a buscar.</div>
      </section>
    </div>
  );
}

export function AuditPanel({ entries, loading }: { entries: AuditEntry[]; loading: boolean }) {
  return (
    <section className="mt-6 admin-surface overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 p-5">
        <div className="flex items-center gap-2"><History className="text-blue-700" /><h3 className="text-xl font-black">Historial de actividad</h3></div>
        <p className="mt-1 text-sm text-slate-500">Registro privado de cambios importantes realizados desde el panel.</p>
      </div>
      <div className="max-h-[680px] divide-y divide-slate-100 overflow-auto">
        {entries.map((entry) => (
          <article key={entry.id} className="grid gap-2 p-4 sm:grid-cols-[170px_1fr]">
            <div><p className="text-xs font-bold text-slate-500">{new Intl.DateTimeFormat("es", { dateStyle: "medium", timeStyle: "short" }).format(new Date(entry.timestamp))}</p><p className="mt-1 truncate text-[11px] text-slate-400">{entry.user}</p></div>
            <div><div className="flex flex-wrap items-center gap-2"><strong>{entry.action}</strong><span className="rounded-full bg-blue-50 px-2 py-1 text-[10px] font-black text-blue-700">{entry.entity}</span></div><p className="mt-1 text-sm text-slate-600">{entry.detail}</p></div>
          </article>
        ))}
        {loading && <p className="p-8 text-center text-sm text-slate-500">Cargando actividad…</p>}
        {!loading && !entries.length && <p className="p-8 text-center text-sm text-slate-500">El historial comenzará con el próximo cambio guardado.</p>}
      </div>
    </section>
  );
}

const DIAGNOSTICS = [
  { id: "estadoHojaDatos", name: "Salud de Sentry", description: "Comprueba la hoja operativa, sus pestañas y la actualidad de los datos." },
  { id: "medirRenovaciones", name: "Renovaciones", description: "Mide la cobertura de renovaciones y detecta huecos en el proceso." },
  { id: "medirRiesgo", name: "Riesgo de cancelación", description: "Analiza señales agregadas de riesgo sin modificar pólizas ni eventos." },
  { id: "medirRenovacionEnRiesgo", name: "Renovaciones en riesgo", description: "Cruza vencimientos próximos con señales de pago y seguimiento." },
  { id: "medirCallbright", name: "Callbright", description: "Revisa la importación de llamadas y la cobertura de seguimiento." },
  { id: "detectarAnomalias", name: "Anomalías", description: "Busca inconsistencias operativas que necesitan revisión humana." },
  { id: "listaRecuperables", name: "Casos recuperables", description: "Localiza oportunidades recientes que todavía pueden recuperarse." },
  { id: "medirCruce", name: "Cruce Calendar ↔ Sentry", description: "Comprueba qué tan bien coinciden clientes, teléfonos y pólizas." },
];

export function DiagnosticsPanel() {
  const [results, setResults] = useState<Record<string, { text: string; ranAt: string }>>({});
  const [running, setRunning] = useState("");
  const [selected, setSelected] = useState("");
  const run = async (id: string) => {
    setRunning(id);
    setSelected(id);
    try {
      const response = await fetch(`/api/admin/diagnostic?fn=${encodeURIComponent(id)}`, { credentials: "include" });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || "El diagnóstico no respondió.");
      setResults((current) => ({ ...current, [id]: { text: data.output || "Diagnóstico completado sin observaciones.", ranAt: data.ranAt || new Date().toISOString() } }));
    } catch (error) {
      setResults((current) => ({ ...current, [id]: { text: error instanceof Error ? error.message : "No se pudo ejecutar.", ranAt: new Date().toISOString() } }));
    } finally {
      setRunning("");
    }
  };
  const active = DIAGNOSTICS.find((item) => item.id === selected);
  return (
    <section className="mt-6 space-y-5">
      <div className="rounded-3xl bg-gradient-to-r from-slate-950 via-cyan-950 to-blue-900 p-6 text-white shadow-xl md:p-8">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[.2em] text-cyan-300"><Activity size={17} /> Diagnóstico protegido</div>
        <h3 className="mt-3 text-3xl font-black">Salud de automatizaciones</h3>
        <p className="mt-2 max-w-3xl text-sm text-cyan-100">Ejecuta comprobaciones reales de solo lectura. Ninguna de estas acciones envía Telegram, mueve eventos o modifica archivos.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {DIAGNOSTICS.map((item) => {
          const result = results[item.id];
          return (
            <article key={item.id} className="admin-surface flex flex-col rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-50 text-cyan-700"><Activity size={19} /></span>{result && <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-black text-emerald-700">Revisado</span>}</div>
              <h4 className="mt-4 font-black">{item.name}</h4>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-500">{item.description}</p>
              {result && <p className="mt-3 text-[11px] text-slate-400">Última revisión: {new Intl.DateTimeFormat("es", { hour: "numeric", minute: "2-digit" }).format(new Date(result.ranAt))}</p>}
              <button onClick={() => void run(item.id)} disabled={Boolean(running)} className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-3 py-2.5 text-xs font-black text-white disabled:opacity-50"><Play size={14} /> {running === item.id ? "Comprobando…" : "Ejecutar revisión"}</button>
            </article>
          );
        })}
      </div>
      {active && results[selected] && (
        <article className="admin-surface overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 p-5"><div><h4 className="text-lg font-black">Resultado · {active.name}</h4><p className="text-xs text-slate-500">Salida técnica para revisión, sin ejecutar cambios.</p></div><button onClick={() => setSelected("")} className="grid h-9 w-9 place-items-center rounded-xl bg-slate-100"><X size={17} /></button></div>
          <pre className="max-h-[520px] overflow-auto whitespace-pre-wrap bg-slate-950 p-5 font-mono text-xs leading-relaxed text-slate-200">{results[selected].text}</pre>
        </article>
      )}
    </section>
  );
}

export function EvaContextAssistant({
  open,
  onClose,
  view,
  due,
  unassigned,
  urgent,
  onNavigate,
}: {
  open: boolean;
  onClose: () => void;
  view: string;
  due: number;
  unassigned: number;
  urgent: number;
  onNavigate: (view: string) => void;
}) {
  const context: Record<string, { title: string; text: string; action: string; target: string }> = {
    trabajo: { title: "Empecemos por lo urgente", text: due ? `Hay ${due} seguimientos vencidos. Contactarlos primero evita que una oportunidad se enfríe.` : "La bandeja no tiene seguimientos vencidos. Revisa ahora los casos operativos de mayor prioridad.", action: "Abrir trabajo", target: "trabajo" },
    leads: { title: "Convierte cada contacto en avance", text: unassigned ? `${unassigned} leads todavía no tienen responsable. Asígnalos y programa una fecha concreta.` : "Los leads tienen responsable. Mantén actualizado su estado después de cada llamada.", action: "Ver bandeja", target: "trabajo" },
    consola: { title: "Tu operación está conectada", text: urgent ? `La consola reporta ${urgent} casos urgentes. Usa prioridad y antigüedad para decidir el orden.` : "Revisa la lista del día, el dinero y el correo sin recargar todo el panel.", action: "Ir al trabajo", target: "trabajo" },
    zelle: { title: "Verifica antes de conciliar", text: "Busca por nombre o monto. Los pagos mostrados son ingresos publicados; cualquier cuadre financiero debe revisarse antes de confirmarlo.", action: "Ver automatizaciones", target: "automatizaciones" },
    calendario: { title: "Protege el próximo paso", text: "Un caso sin evento o seguimiento es fácil de olvidar. Abre cada cita original cuando necesites editarla.", action: "Ver leads", target: "leads" },
    control: { title: "Toda la operación en una sola pantalla", text: "Comprueba primero la salud de los procesos. Las órdenes manuales usan exactamente las mismas validaciones del bot y también dejan confirmación en Telegram.", action: "Abrir control", target: "control" },
    automatizaciones: { title: "Lee el impacto antes de ejecutar", text: "Las herramientas con efectos reales mantienen su advertencia. Abre el editor solo cuando sepas qué datos o mensajes modificará.", action: "Ver auditoría", target: "auditoria" },
    diagnosticos: { title: "Revisa antes de intervenir", text: "Estas comprobaciones consultan datos reales sin enviar mensajes ni mover eventos. Abre el resultado técnico para localizar la causa de cualquier alerta.", action: "Ver automatizaciones", target: "automatizaciones" },
    auditoria: { title: "Todo cambio importante deja huella", text: "Aquí puedes comprobar quién actualizó un lead y qué cambió. El historial se guarda en la hoja privada.", action: "Volver al trabajo", target: "trabajo" },
    resumen: { title: "El resumen explica; la bandeja resuelve", text: "Usa las métricas para detectar un problema y pasa al Centro de trabajo para resolverlo.", action: "Abrir trabajo", target: "trabajo" },
  };
  const tip = context[view] || context.trabajo;
  return (
    <>
      {open && <button aria-label="Cerrar Eva" onClick={onClose} className="fixed inset-0 z-[80] bg-slate-950/30 backdrop-blur-[2px]" />}
      <aside className={`admin-surface fixed bottom-0 right-0 top-0 z-[90] w-full max-w-sm transform border-l border-slate-200 bg-white shadow-2xl transition duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}>
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-700 to-violet-800 p-6 text-white">
          <button onClick={onClose} className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-xl bg-white/15"><X size={18} /></button>
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-blue-200"><Sparkles size={15} /> Eva · ayuda contextual</div>
          <h3 className="mt-3 pr-12 text-2xl font-black">{tip.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-blue-100">{tip.text}</p>
          <div className="absolute -bottom-12 -right-7 w-36 opacity-90"><MascotImage srcWebp="/eva/eva-baby-headset.webp" srcPng="/eva/eva-baby-headset.png" alt="Eva, asistente administrativa" className="w-full" /></div>
          <button onClick={() => { onNavigate(tip.target); onClose(); }} className="relative z-10 mt-5 rounded-xl bg-white px-4 py-2.5 text-sm font-black text-blue-800">{tip.action} →</button>
        </div>
        <div className="space-y-3 p-5">
          <p className="text-xs font-black uppercase tracking-wider text-slate-500">Pulso de la oficina</p>
          {[
            ["Seguimientos vencidos", due, due ? "rose" : "green"],
            ["Leads sin responsable", unassigned, unassigned ? "amber" : "green"],
            ["Casos urgentes", urgent, urgent ? "violet" : "green"],
          ].map(([label, value, tone]) => (
            <div key={String(label)} className="flex items-center justify-between rounded-2xl bg-slate-50 p-4"><span className="text-sm font-bold text-slate-700">{label}</span><strong className={`${tone === "rose" ? "text-rose-600" : tone === "amber" ? "text-amber-600" : tone === "violet" ? "text-violet-600" : "text-emerald-600"}`}>{value}</strong></div>
          ))}
          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm leading-relaxed text-blue-900"><strong>Cómo te ayudo:</strong> te explico la pantalla y señalo prioridades usando reglas claras. No envío mensajes ni modifica datos sin que tú lo confirmes.</div>
        </div>
      </aside>
    </>
  );
}
