import React, { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  AlertTriangle,
  Bot,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  ExternalLink,
  FileSpreadsheet,
  FolderOpen,
  Mail,
  Play,
  RefreshCw,
  Search,
  ShieldCheck,
  UsersRound,
  WalletCards,
} from "lucide-react";

type ConsoleSummary = {
  ok: boolean;
  datos?: {
    polizas: number;
    activas: number;
    canceladas: number;
    renuevan30: number;
    prima30: number;
  };
  mensaje?: string;
};
type ConsoleCase = {
  score: number;
  agente: string;
  nombre: string;
  telefono: string;
  estado: string;
  arrastre: number;
  abierto: number;
  sinSeguimiento: boolean;
  titulo: string;
  resumen: string;
  saldo: number;
  enlace: string;
};
type ConsoleList = {
  ok: boolean;
  publicada?: boolean;
  generada?: string;
  hora?: string;
  total?: number;
  urgentes?: number;
  casos?: ConsoleCase[];
  mensaje?: string;
};
type MoneyData = {
  ok: boolean;
  dias?: number;
  entro?: number;
  salio?: number;
  neto?: number;
  sinReconocer?: number;
  porCategoria?: Array<{ categoria: string; monto: number }>;
  mensaje?: string;
};
type MailData = {
  ok: boolean;
  dias?: number;
  revisados?: number;
  remitentes?: Array<{
    remitente: string;
    n: number;
    ultimo: string;
    asuntos: Array<{ texto: string; n: number }>;
  }>;
  etiquetas?: Array<{
    nombre: string;
    existe: boolean;
    hilos: number;
    ultimo: string;
  }>;
  mensaje?: string;
};
type SearchResult = {
  ok: boolean;
  contrato?: string;
  version?: number;
  generada?: string;
  via?: "nombre" | "telefono" | string;
  fuentes?: Array<{
    id: string;
    nombre: string;
    modo: string;
    actualizada?: string;
  }>;
  nota?: string;
  mensaje?: string;
  resultados?: Array<{
    nombre: string;
    telefono?: string;
    clienteIds?: string[];
    identidad?: {
      estrategia: "sentry-customer-id" | "nombre" | string;
      ambigua: boolean;
      idsSentry: string[];
    };
    polizas: Array<{
      clienteId?: string;
      poliza: string;
      estado: string;
      estadoCreacion?: string;
      carrier: string;
      lob: string;
      agente: string;
      creada?: string;
      desde?: string;
      vence: string;
      cancelada?: string;
      diasVence: number | null;
      prima: number | null;
      brokerFee?: number | null;
      fuente?: string;
      actualizada?: string;
      pagos?: {
        telefono?: string;
        recibos?: number;
        pagado?: number;
        saldo?: number;
        conSaldo?: number;
        ultimo?: string;
        actualizada?: string;
        fuente?: string;
        ultimos?: Array<{
          recibo?: string;
          fecha: string;
          pagado: number;
          debe: number;
          tipo: string;
          estado?: string;
          carrier?: string;
          agente?: string;
          bfRetenido?: number;
          premiumRetenido?: number;
        }>;
      };
      lineasRecibo?: {
        disponible: boolean;
        contrato: string;
        version: number;
        fuente: string;
        total: number;
        mostradas: number;
        truncado: boolean;
        reciboRepetido: boolean;
        lineas: Array<{
          recibo: string;
          fecha: string;
          tipo: string;
          bfRetenido: number;
          premiumRetenido: number;
          pagado: number;
          debe: number;
          estado: string;
          carrier: string;
          agente: string;
          fuenteActualizada: string;
          candidatas: number;
          requiereRevision: boolean;
        }>;
      };
    }>;
  }>;
};
type VinResult = {
  ok: boolean;
  vin: string;
  decoded: boolean;
  source: string;
  cached?: boolean;
  warning?: string;
  errorCode?: string;
  vehicle: {
    year: string;
    make: string;
    model: string;
    trim: string;
    series: string;
    manufacturer: string;
    bodyClass: string;
    vehicleType: string;
    fuelType: string;
    engineCylinders: string;
    displacementL: string;
    driveType: string;
    doors: string;
    gvwr: string;
    plantCountry: string;
  };
};
type ZelleData = {
  autorizada?: boolean;
  publicada?: boolean;
  generada?: string;
  antiguedad?: number;
  ahora?: string;
  pedido?: string | null;
  pagos?: Array<{
    fecha: string;
    hora: string;
    nombre: string;
    monto: number;
    nota: string;
  }>;
};
type CalendarEvent = {
  title: string;
  start: string;
  end: string;
  allDay: boolean;
  calendarId: string;
  calendar: string;
  color: string;
  link: string;
};
type CalendarPayload = {
  ok: boolean;
  updatedAt: string;
  cached?: boolean;
  calendars: Array<{ id: string; name: string; color: string }>;
  events: CalendarEvent[];
};

type ControlComponent = {
  id: string;
  nombre: string;
  grupo: string;
  estado: "OK" | "ERROR" | "AVISO" | "OMITIDA" | "SIN_REGISTRO" | string;
  inicio: string;
  fin: string;
  duracion: string;
  detalle: string;
  capacidad?: {
    estado: string;
    ultimo: number;
    promedio: number;
    p95: number;
    maximo: number;
    muestras: number;
    porcentajeUltimo: number;
  } | null;
};
type ControlSource = {
  id: string;
  nombre: string;
  estado: "OK" | "DESACTUALIZADO" | "SIN_MEDIR" | string;
  dias?: number;
  maxDias: number;
  ultima?: string;
  detalle?: string;
  legado?: boolean;
};
type ControlTrend = {
  fecha: string;
  ejecuciones: number;
  alertas: number;
  promedio: number;
  maximo: number;
};
type ControlOrder = {
  id: string;
  creada: string;
  comando: string;
  estado: string;
  inicio: string;
  fin: string;
  resultado: string;
  error: string;
};
type ControlData = {
  ok: boolean;
  generado: string;
  componentes: ControlComponent[];
  problemas: number;
  ordenes: {
    pendientes: number;
    ejecutando: number;
    errores: number;
    recientes: ControlOrder[];
  };
  fuentes?: ControlSource[];
  tendencias?: ControlTrend[];
  carpetaReportesUrl?: string;
  mensaje?: string;
};

const INPUT_GUIDES: Record<
  string,
  {
    title: string;
    origin: string;
    cadence: string;
    purpose: string;
    steps: string[];
    owner: "Karla" | "Alejandro";
  }
> = {
  PAGOS: {
    title: "Reporte Diario",
    origin: "Sentry",
    cadence: "Cada lunes",
    purpose: "Actualiza pagos, Zelle, cash y el cruce de clientes.",
    steps: ["Últimos 10 días", "Recibo Status: Todos", "Export CSV"],
    owner: "Karla",
  },
  POLIZAS_RENOVACIONES: {
    title: "Detailed Policies",
    origin: "Sentry",
    cadence: "Cada lunes",
    purpose: "Actualiza renovaciones, vencimientos y Broker Fee.",
    steps: ["Fin de vigencia: hoy a +60 días", "Show: All", "Export Excel"],
    owner: "Karla",
  },
  POLIZAS_CARTERA: {
    title: "Summary Policies",
    origin: "Sentry",
    cadence: "Una vez al mes",
    purpose: "Refresca la cartera completa, incluidas pólizas nuevas.",
    steps: ["Fechas: todas vacías", "Show: All", "Export Excel"],
    owner: "Karla",
  },
  CALLBRIGHT: {
    title: "Caller Detail Report",
    origin: "Callbright",
    cadence: "Cada semana",
    purpose: "Trae las llamadas de radio que necesitan seguimiento.",
    steps: [
      "Periodo: la semana",
      "Archivo CallerDetailReport",
      "Sin renombrar",
    ],
    owner: "Karla",
  },
  CHASE: {
    title: "Recibos de Chase",
    origin: "Chase / correo",
    cadence: "Cada semana",
    purpose: "Comprueba que los cobros con tarjeta tengan su recibo.",
    steps: [
      "PDF de la semana",
      "Enviar también a intercoast.texto",
      "No va en Entrada Karla",
    ],
    owner: "Alejandro",
  },
};

type AttendancePeriod = "hoy" | "semana" | "mes";
type AttendanceRow = {
  fecha: string;
  agente: string;
  entrada: string;
  salida: string;
  horas: number | "";
  estado:
    | "sin-iniciar"
    | "en-jornada"
    | "cerrada"
    | "ausente"
    | "sin-cerrar"
    | string;
};
type AttendanceData = {
  ok: boolean;
  periodo: AttendancePeriod;
  desde: string;
  hasta: string;
  generado: string;
  diasConDatos: number;
  agentes: string[];
  resumen: {
    conEntrada: number;
    trabajando: number;
    cerradas: number;
    ausencias: number;
    sinCerrar: number;
    horas: number;
  };
  filas: AttendanceRow[];
  mensaje?: string;
};

const money = (value: number | null | undefined) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

/** La ficha conserva centavos; en pagos redondear cambia el dato contable. */
const moneyExact = (value: number | null | undefined) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value || 0));

function readCache<T>(key: string): T | null {
  try {
    const raw = sessionStorage.getItem(`intercoast:${key}`);
    if (!raw) return null;
    return JSON.parse(raw).data as T;
  } catch {
    return null;
  }
}

function writeCache<T>(key: string, data: T) {
  try {
    sessionStorage.setItem(
      `intercoast:${key}`,
      JSON.stringify({ savedAt: Date.now(), data }),
    );
  } catch {}
}

async function callTool<T>(
  tool: "consola" | "zelle",
  action: string,
  args: unknown[] = [],
  force = false,
): Promise<T> {
  const response = await fetch(`/api/admin/tool?tool=${tool}`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, args, force }),
  });
  const data = await response.json();
  if (!response.ok || !data.ok)
    throw new Error(data.error || "La herramienta no respondió.");
  return data.result as T;
}

function LoadingBar({ active }: { active: boolean }) {
  return active ? (
    <div className="h-1 overflow-hidden bg-blue-100">
      <div className="h-full w-1/3 animate-[pulse_1s_ease-in-out_infinite] rounded-full bg-blue-600" />
    </div>
  ) : null;
}

function Metric({
  label,
  value,
  hint,
  tone = "blue",
}: {
  label: string;
  value: React.ReactNode;
  hint: string;
  tone?: "blue" | "green" | "violet" | "amber";
}) {
  const tones = {
    blue: "bg-blue-600",
    green: "bg-emerald-500",
    violet: "bg-violet-600",
    amber: "bg-amber-500",
  };
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div className={`h-1 ${tones[tone]}`} />
      <div className="p-4">
        <p className="text-[11px] font-black uppercase tracking-wider text-slate-500">
          {label}
        </p>
        <p className="mt-2 text-3xl font-black text-slate-950">{value}</p>
        <p className="mt-1 text-xs text-slate-500">{hint}</p>
      </div>
    </article>
  );
}

const CONTROL_ACTIONS = [
  {
    command: "estado",
    title: "Estado general",
    description: "Envía a Telegram el diagnóstico de activadores y procesos.",
    date: false,
    safe: true,
  },
  {
    command: "saldo",
    title: "Saldo por oficina",
    description: "Calcula cuánto falta consignar sin modificar los libros.",
    date: false,
    safe: true,
  },
  {
    command: "cuadre",
    title: "Cuentas de oficinas",
    description:
      "Rellena referencias verificadas y compara el archivo con Sentry.",
    date: false,
    safe: false,
  },
  {
    command: "comisiones",
    title: "Comisiones de Karla",
    description: "Coteja el periodo actual y manda el resultado al grupo.",
    date: false,
    safe: false,
  },
  {
    command: "nomina",
    title: "Liquidar nómina",
    description: "Liquida la última semana cerrada o el lunes seleccionado.",
    date: true,
    safe: false,
  },
  {
    command: "recibos",
    title: "Generar recibos",
    description: "Crea y envía a Telegram los PDF de todos los agentes.",
    date: true,
    safe: false,
  },
  {
    command: "llenar",
    title: "Libros hasta ayer",
    description: "Actualiza los libros de depósitos usando días ya cerrados.",
    date: false,
    safe: false,
  },
  {
    command: "llenarhoy",
    title: "Libros incluyendo hoy",
    description: "Solo para cuando las dos oficinas ya terminaron el día.",
    date: false,
    safe: false,
  },
] as const;

const ATTENDANCE_PERIODS: Array<{ id: AttendancePeriod; label: string }> = [
  { id: "hoy", label: "Hoy" },
  { id: "semana", label: "Semana" },
  { id: "mes", label: "Mes" },
];

function AttendanceControl() {
  const [period, setPeriod] = useState<AttendancePeriod>("hoy");
  const [data, setData] = useState<AttendanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async (selected = period, quiet = false) => {
    if (!quiet) setLoading(true);
    try {
      const value = await callTool<AttendanceData>(
        "consola",
        "resumenAsistencia",
        [selected],
        true,
      );
      if (!value.ok)
        throw new Error(value.mensaje || "No se pudo armar la asistencia.");
      setData(value);
      setError("");
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "No se pudo leer la asistencia.",
      );
    } finally {
      if (!quiet) setLoading(false);
    }
  };

  useEffect(() => {
    void load(period);
    const timer = window.setInterval(() => void load(period, true), 30000);
    return () => window.clearInterval(timer);
  }, [period]);

  const choosePeriod = (selected: AttendancePeriod) => {
    setPeriod(selected);
    setData(null);
  };
  const sinIniciar = (data?.filas || []).filter(
    (row) => row.estado === "sin-iniciar",
  ).length;
  const status = (value: string) => {
    const styles: Record<string, { label: string; className: string }> = {
      "en-jornada": {
        label: "Trabajando",
        className: "border-blue-200 bg-blue-50 text-blue-700",
      },
      cerrada: {
        label: "Terminó",
        className: "border-emerald-200 bg-emerald-50 text-emerald-700",
      },
      "sin-iniciar": {
        label: "Sin iniciar",
        className: "border-slate-200 bg-slate-50 text-slate-600",
      },
      ausente: {
        label: "No trabajó",
        className: "border-rose-200 bg-rose-50 text-rose-700",
      },
      "sin-cerrar": {
        label: "No cerró",
        className: "border-amber-200 bg-amber-50 text-amber-700",
      },
    };
    return (
      styles[value] || {
        label: value,
        className: "border-slate-200 bg-slate-50 text-slate-600",
      }
    );
  };

  return (
    <article className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
      <LoadingBar active={loading} />
      <div className="border-b border-slate-100 p-5 md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-violet-50 text-violet-700">
              <UsersRound size={21} />
            </span>
            <div>
              <h3 className="text-2xl font-black text-slate-950">Asistencia</h3>
              <p className="mt-1 text-sm text-slate-500">
                Entrada, salida y horas registradas desde la página de Zelle.
              </p>
            </div>
          </div>
          <button
            onClick={() => void load(period)}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-800 hover:border-violet-300 hover:bg-violet-50 disabled:opacity-60"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />{" "}
            Actualizar
          </button>
        </div>
        <div className="mt-5 inline-flex rounded-xl bg-slate-100 p-1">
          {ATTENDANCE_PERIODS.map((item) => (
            <button
              key={item.id}
              onClick={() => choosePeriod(item.id)}
              className={`rounded-lg px-4 py-2 text-sm font-black transition ${period === item.id ? "bg-white text-violet-700 shadow-sm" : "text-slate-500 hover:text-slate-900"}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="m-5 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-800">
          {error}
        </div>
      )}

      <div className="p-5 md:p-6">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {period === "hoy" ? (
            <>
              <Metric
                label="Trabajando"
                value={data?.resumen.trabajando ?? "—"}
                hint="Jornada abierta ahora"
                tone="blue"
              />
              <Metric
                label="Ya terminaron"
                value={data?.resumen.cerradas ?? "—"}
                hint="Registraron su salida"
                tone="green"
              />
              <Metric
                label="Sin iniciar"
                value={data ? sinIniciar : "—"}
                hint="Todavía no han marcado entrada"
                tone="amber"
              />
              <Metric
                label="Horas cerradas"
                value={data ? data.resumen.horas.toFixed(2) : "—"}
                hint="Total de jornadas ya cerradas"
                tone="violet"
              />
            </>
          ) : (
            <>
              <Metric
                label="Jornadas iniciadas"
                value={data?.resumen.conEntrada ?? "—"}
                hint={`${data?.diasConDatos ?? 0} días con registros`}
                tone="blue"
              />
              <Metric
                label="No trabajaron"
                value={data?.resumen.ausencias ?? "—"}
                hint="Filas pasadas sin entrada"
                tone="amber"
              />
              <Metric
                label="No cerraron"
                value={data?.resumen.sinCerrar ?? "—"}
                hint="Entraron pero faltó la salida"
                tone="amber"
              />
              <Metric
                label="Horas registradas"
                value={data ? data.resumen.horas.toFixed(2) : "—"}
                hint="Suma de jornadas cerradas"
                tone="violet"
              />
            </>
          )}
        </div>

        <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50 text-[11px] font-black uppercase tracking-wider text-slate-500">
              <tr>
                {period !== "hoy" && <th className="px-4 py-3">Fecha</th>}
                <th className="px-4 py-3">Agente</th>
                <th className="px-4 py-3">Entrada</th>
                <th className="px-4 py-3">Salida</th>
                <th className="px-4 py-3">Horas</th>
                <th className="px-4 py-3">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {(data?.filas || []).map((row) => {
                const badge = status(row.estado);
                return (
                  <tr
                    key={`${row.fecha}:${row.agente}`}
                    className="hover:bg-slate-50"
                  >
                    {period !== "hoy" && (
                      <td className="whitespace-nowrap px-4 py-3 font-semibold text-slate-600">
                        {row.fecha}
                      </td>
                    )}
                    <td className="whitespace-nowrap px-4 py-3 font-black text-slate-950">
                      {row.agente}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                      {row.entrada || "—"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                      {row.salida || "—"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-semibold text-slate-700">
                      {row.horas === "" ? "—" : Number(row.horas).toFixed(2)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-black ${badge.className}`}
                      >
                        {badge.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {!loading && !data?.filas.length && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-10 text-center text-sm text-slate-500"
                  >
                    Todavía no hay registros para este periodo.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <p>
            {data
              ? `Periodo: ${data.desde} a ${data.hasta}`
              : "Cargando historial…"}
          </p>
          <p>
            {data?.generado ? `Actualizado ${data.generado} (California)` : ""}
          </p>
        </div>
        <p className="mt-3 rounded-xl bg-amber-50 px-4 py-3 text-xs font-semibold text-amber-800">
          “Llegó tarde” y “salió antes” se activarán cuando se defina el horario
          esperado de cada agente. Mientras tanto se muestran las horas reales
          sin inventar una regla.
        </p>
      </div>
    </article>
  );
}

function ControlTrendChart({
  data,
  field,
  floor,
  color,
  unit = "",
  label,
}: {
  data: ControlTrend[];
  field: "maximo" | "alertas";
  floor: number;
  color: string;
  unit?: string;
  label: string;
}) {
  if (!data.length) {
    return (
      <div className="grid h-40 place-items-center text-sm font-semibold text-slate-400">
        Todavía no hay historial suficiente.
      </div>
    );
  }
  const width = 620;
  const height = 170;
  const left = 42;
  const right = 14;
  const top = 16;
  const bottom = 28;
  const maximum = Math.max(
    floor,
    ...data.map((item) => Number(item[field]) || 0),
  );
  const step = data.length > 1 ? (width - left - right) / (data.length - 1) : 0;
  const points = data
    .map((item, index) => {
      const x = left + index * step;
      const y =
        top +
        (height - top - bottom) * (1 - (Number(item[field]) || 0) / maximum);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  const latest = Number(data[data.length - 1]?.[field]) || 0;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="mt-4 h-40 w-full overflow-visible"
      role="img"
      aria-label={label}
    >
      <line
        x1={left}
        y1={height - bottom}
        x2={width - right}
        y2={height - bottom}
        stroke="#e2e8f0"
      />
      <line
        x1={left}
        y1={top}
        x2={left}
        y2={height - bottom}
        stroke="#e2e8f0"
      />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <text x="0" y={top + 5} fill="#64748b" fontSize="12">
        {maximum}
      </text>
      <text x={left} y={height - 5} fill="#64748b" fontSize="12">
        {data[0].fecha.slice(5)}
      </text>
      <text
        x={width - right}
        y={height - 5}
        textAnchor="end"
        fill="#64748b"
        fontSize="12"
      >
        {data[data.length - 1].fecha.slice(5)}
      </text>
      <text
        x={width - right}
        y={top + 5}
        textAnchor="end"
        fill={color}
        fontSize="13"
        fontWeight="800"
      >
        último: {latest}
        {unit}
      </text>
    </svg>
  );
}

export function SystemControl() {
  const [data, setData] = useState<ControlData | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState("");
  const [week, setWeek] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [trendDays, setTrendDays] = useState<7 | 30>(7);
  const directOrder = new URLSearchParams(window.location.search).get("orden");
  const directAction = CONTROL_ACTIONS.find(
    (action) => action.command === directOrder,
  );

  const load = async (quiet = false) => {
    if (!quiet) setLoading(true);
    try {
      const value = await callTool<ControlData>(
        "consola",
        "centroControl",
        [],
        true,
      );
      if (!value.ok)
        throw new Error(
          value.mensaje || "El bot no pudo armar el diagnóstico.",
        );
      setData(value);
      setError("");
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "No se pudo leer el estado del bot.",
      );
    } finally {
      if (!quiet) setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    const timer = window.setInterval(() => void load(true), 15000);
    return () => window.clearInterval(timer);
  }, []);

  const run = async (action: (typeof CONTROL_ACTIONS)[number]) => {
    const argument = action.date ? week : "";
    if (!action.safe) {
      const label = `/${action.command}${argument ? ` ${argument}` : ""}`;
      if (
        !window.confirm(
          `¿Enviar ${label} al bot? El resultado llegará también por Telegram.`,
        )
      )
        return;
    }
    setRunning(action.command);
    setMessage("");
    setError("");
    try {
      const result = await callTool<{
        ok: boolean;
        mensaje: string;
        id?: string;
      }>("consola", "solicitarControl", [action.command, argument], true);
      if (!result.ok)
        throw new Error(result.mensaje || "El bot no aceptó la orden.");
      setMessage(result.mensaje);
      await load(true);
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "No se pudo enviar la orden.",
      );
    } finally {
      setRunning("");
    }
  };

  const healthy = (data?.componentes || []).filter((item) =>
    ["OK", "OMITIDA"].includes(item.estado),
  ).length;
  const staleSources = (data?.fuentes || []).filter(
    (item) => item.estado === "DESACTUALIZADO",
  ).length;
  const karlaSources = (data?.fuentes || []).filter(
    (item) => INPUT_GUIDES[item.id]?.owner === "Karla",
  );
  const managerSources = (data?.fuentes || []).filter(
    (item) => INPUT_GUIDES[item.id]?.owner === "Alejandro",
  );
  const pendingKarla = karlaSources.filter(
    (item) => item.estado !== "OK",
  ).length;
  const trendData = (data?.tendencias || []).slice(-trendDays);
  const statusStyle = (state: string) =>
    state === "ERROR" || state === "CONGELADO" || state === "DESACTUALIZADO"
      ? "border-rose-200 bg-rose-50 text-rose-700"
      : state === "AVISO" ||
          state === "SIN_REGISTRO" ||
          state === "ATRASADO" ||
          state === "SIN_MEDIR" ||
          state === "EN_CURSO"
        ? "border-amber-200 bg-amber-50 text-amber-700"
        : "border-emerald-200 bg-emerald-50 text-emerald-700";

  return (
    <section className="mt-6 space-y-6">
      {directAction?.command === "cuadre" && (
        <article className="overflow-hidden rounded-3xl border border-emerald-200 bg-gradient-to-r from-emerald-700 to-teal-700 text-white shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-5 p-6 md:p-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[.2em] text-emerald-100">
                <WalletCards size={17} /> Abierto desde CUENTAS OFICINAS
              </div>
              <h3 className="mt-3 text-3xl font-black">
                Rellenar el libro ahora
              </h3>
              <p className="mt-2 max-w-2xl text-sm text-emerald-50">
                Ejecuta el mismo cuadre protegido que corre automáticamente. No
                pisa datos escritos por el manager y el resultado llega también
                por Telegram.
              </p>
            </div>
            <button
              onClick={() => void run(directAction)}
              disabled={Boolean(running)}
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-4 text-base font-black text-emerald-800 shadow-lg transition hover:-translate-y-0.5 disabled:opacity-60"
            >
              <Play
                size={19}
                className={running === "cuadre" ? "animate-pulse" : ""}
              />
              {running === "cuadre" ? "Enviando…" : "Rellenar CUENTAS OFICINAS"}
            </button>
          </div>
        </article>
      )}
      <AttendanceControl />
      <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-blue-950 to-cyan-900 text-white shadow-xl">
        <LoadingBar active={loading} />
        <div className="flex flex-wrap items-center justify-between gap-5 p-6 md:p-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[.2em] text-cyan-300">
              <Bot size={17} /> Automatizaciones conectadas
            </div>
            <h3 className="mt-3 text-3xl font-black">Centro de control</h3>
            <p className="mt-2 max-w-3xl text-sm text-cyan-100">
              Revisa todo el sistema y ejecuta los procesos existentes desde una
              sola pantalla. El bot conserva las mismas validaciones y confirma
              por Telegram.
            </p>
          </div>
          <button
            onClick={() => void load()}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-black text-slate-950 disabled:opacity-60"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />{" "}
            Actualizar estado
          </button>
        </div>
      </div>

      {(error || message) && (
        <div
          className={`rounded-2xl border p-4 text-sm font-semibold ${error ? "border-rose-200 bg-rose-50 text-rose-800" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`}
        >
          {error || `✅ ${message}`}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <Metric
          label="Procesos bien"
          value={`${healthy}/${data?.componentes.length || 12}`}
          hint="Últimas ejecuciones registradas"
          tone="green"
        />
        <Metric
          label="Problemas visibles"
          value={data?.problemas ?? "—"}
          hint="Errores o avisos que requieren revisión"
          tone="amber"
        />
        <Metric
          label="Reportes viejos"
          value={data ? staleSources : "—"}
          hint="4 de Entrada Karla + Chase"
          tone={staleSources ? "amber" : "green"}
        />
        <Metric
          label="En espera"
          value={data?.ordenes.pendientes ?? "—"}
          hint="Órdenes que recogerá el bot"
        />
        <Metric
          label="Ejecutando"
          value={data?.ordenes.ejecutando ?? "—"}
          hint={
            data?.generado ? `Leído ${data.generado}` : "Conectando con el bot"
          }
          tone="violet"
        />
      </div>

      <article className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm md:p-6">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-50 text-blue-700">
            <Activity size={20} />
          </span>
          <div>
            <h4 className="text-xl font-black">Salud por proceso</h4>
            <p className="text-sm text-slate-500">
              Cada tarjeta se actualiza cuando su automatización corre.
            </p>
          </div>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {(data?.componentes || []).map((item) => (
            <div
              key={item.id}
              className={`rounded-2xl border p-4 ${statusStyle(item.estado)}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-black text-slate-950">{item.nombre}</p>
                  <p className="mt-1 text-[11px] font-black uppercase tracking-wider opacity-70">
                    {item.grupo}
                  </p>
                </div>
                {["ERROR", "CONGELADO"].includes(item.estado) ? (
                  <AlertTriangle size={18} />
                ) : ["SIN_REGISTRO", "ATRASADO", "EN_CURSO"].includes(
                    item.estado,
                  ) ? (
                  <Clock3 size={18} />
                ) : (
                  <CheckCircle2 size={18} />
                )}
              </div>
              <p className="mt-3 text-xs font-semibold">
                {item.fin
                  ? `Última: ${item.fin}${item.duracion ? ` · ${item.duracion} s` : ""}`
                  : item.detalle}
              </p>
              {item.capacidad && (
                <p className="mt-2 text-[11px] font-bold opacity-75">
                  Prom. {item.capacidad.promedio} s · p95 {item.capacidad.p95} s
                  · máx. {item.capacidad.maximo} s
                </p>
              )}
            </div>
          ))}
        </div>
      </article>

      <article className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h4 className="text-xl font-black">Rendimiento</h4>
            <p className="mt-1 text-sm text-slate-500">
              Duración máxima diaria y ejecuciones que terminaron con algo por
              revisar.
            </p>
          </div>
          <div className="inline-flex rounded-xl bg-slate-100 p-1">
            {([7, 30] as const).map((days) => (
              <button
                key={days}
                type="button"
                onClick={() => setTrendDays(days)}
                className={`rounded-lg px-3 py-2 text-xs font-black transition ${trendDays === days ? "bg-white text-blue-700 shadow-sm" : "text-slate-500"}`}
              >
                {days} días
              </button>
            ))}
          </div>
        </div>
        <div className="mt-5 grid gap-4 xl:grid-cols-2">
          <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
            <p className="font-black text-slate-950">Duración máxima del día</p>
            <p className="text-xs text-slate-500">
              Segundos; la escala conserva el límite de 360 s.
            </p>
            <ControlTrendChart
              data={trendData}
              field="maximo"
              floor={360}
              color="#2563eb"
              unit=" s"
              label={`Duración máxima de los últimos ${trendDays} días`}
            />
          </div>
          <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
            <p className="font-black text-slate-950">Avisos y errores</p>
            <p className="text-xs text-slate-500">
              Cantidad diaria de ejecuciones que requieren revisión.
            </p>
            <ControlTrendChart
              data={trendData}
              field="alertas"
              floor={1}
              color="#e11d48"
              label={`Avisos y errores de los últimos ${trendDays} días`}
            />
          </div>
        </div>
      </article>

      <article className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-gradient-to-r from-cyan-950 via-blue-950 to-blue-800 p-5 text-white md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/10 text-cyan-200">
                <FolderOpen size={21} />
              </span>
              <div>
                <p className="text-[11px] font-black uppercase tracking-[.18em] text-cyan-300">
                  Entrada Karla
                </p>
                <h4 className="mt-1 text-2xl font-black">
                  Qué archivos hay que subir
                </h4>
                <p className="mt-1 max-w-2xl text-sm text-blue-100">
                  Cuatro reportes alimentan el bot. Cada tarjeta dice de dónde
                  sale, cómo exportarlo y si ya está al día.
                </p>
              </div>
            </div>
            {data?.carpetaReportesUrl && (
              <a
                href={data.carpetaReportesUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-black text-blue-950 shadow-lg transition hover:-translate-y-0.5"
              >
                <FolderOpen size={17} /> Abrir Entrada Karla{" "}
                <ExternalLink size={14} />
              </a>
            )}
          </div>
        </div>

        <div className="p-5 md:p-6">
          <div
            className={`mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border px-4 py-3 ${pendingKarla ? "border-amber-200 bg-amber-50" : "border-emerald-200 bg-emerald-50"}`}
          >
            <div className="flex items-center gap-2">
              {pendingKarla ? (
                <AlertTriangle size={18} className="text-amber-700" />
              ) : (
                <CheckCircle2 size={18} className="text-emerald-700" />
              )}
              <p
                className={`text-sm font-black ${pendingKarla ? "text-amber-900" : "text-emerald-900"}`}
              >
                {pendingKarla
                  ? `${pendingKarla} reporte(s) requieren subir o confirmar`
                  : "Los cuatro reportes de Entrada Karla están al día"}
              </p>
            </div>
            <p className="text-xs font-semibold text-slate-600">
              El bot los recoge solo y los mueve a Procesados.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {karlaSources.map((source) => {
              const guide = INPUT_GUIDES[source.id];
              const good = source.estado === "OK";
              const unmeasured =
                source.estado === "SIN_MEDIR" ||
                source.estado === "SIN_DISTINGUIR";
              return (
                <div
                  key={source.id}
                  className={`rounded-2xl border p-4 ${good ? "border-emerald-200 bg-emerald-50/50" : "border-amber-200 bg-amber-50/70"}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span
                        className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${good ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}
                      >
                        <FileSpreadsheet size={19} />
                      </span>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h5 className="font-black text-slate-950">
                            {guide.title}
                          </h5>
                          <span className="rounded-full bg-white px-2 py-1 text-[10px] font-black uppercase tracking-wider text-slate-600">
                            {guide.origin}
                          </span>
                        </div>
                        <p className="mt-1 text-xs font-black text-blue-700">
                          {guide.cadence}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`rounded-full border px-2.5 py-1 text-[10px] font-black uppercase ${good ? "border-emerald-200 bg-white text-emerald-700" : "border-amber-300 bg-white text-amber-800"}`}
                    >
                      {good
                        ? "Al día"
                        : source.estado === "DESACTUALIZADO"
                          ? "Subir ahora"
                          : "Por confirmar"}
                    </span>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-slate-700">
                    {guide.purpose}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {guide.steps.map((step) => (
                      <span
                        key={step}
                        className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-bold text-slate-600"
                      >
                        {step}
                      </span>
                    ))}
                  </div>
                  <div className="mt-3 border-t border-slate-200/80 pt-3 text-xs font-semibold text-slate-600">
                    {unmeasured
                      ? source.estado === "SIN_DISTINGUIR"
                        ? "El registro anterior juntaba los dos reportes de pólizas. El próximo archivo quedará identificado por separado."
                        : "Todavía no se ha registrado este reporte desde que empezó la medición."
                      : `Último recibido: ${source.ultima || "—"} · hace ${source.dias ?? "—"} día(s).`}
                  </div>
                </div>
              );
            })}
            {!karlaSources.length && (
              <p className="text-sm font-semibold text-slate-500">
                Esperando el primer registro de los reportes.
              </p>
            )}
          </div>

          {managerSources.map((source) => {
            const guide = INPUT_GUIDES[source.id];
            const good = source.estado === "OK";
            return (
              <div
                key={source.id}
                className="mt-5 rounded-2xl border border-violet-200 bg-violet-50 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-wider text-violet-700">
                      Archivo de Alejandro · separado de Entrada Karla
                    </p>
                    <h5 className="mt-1 font-black text-slate-950">
                      {guide.title} · {guide.cadence}
                    </h5>
                    <p className="mt-1 text-sm text-slate-600">
                      {guide.purpose} Se envía por correo también a{" "}
                      <b>intercoast.texto@gmail.com</b>.
                    </p>
                  </div>
                  <span
                    className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase ${good ? "border-emerald-200 bg-white text-emerald-700" : "border-amber-300 bg-white text-amber-800"}`}
                  >
                    {good ? "Al día" : "Revisar"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </article>

      <article className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm md:p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h4 className="text-xl font-black">Ejecutar ahora</h4>
            <p className="mt-1 text-sm text-slate-500">
              Los procesos sensibles piden confirmación antes de entrar a la
              cola.
            </p>
          </div>
          <label className="text-xs font-black uppercase tracking-wider text-slate-500">
            Semana opcional (lunes)
            <input
              type="date"
              value={week}
              onChange={(event) => setWeek(event.target.value)}
              className="mt-1 block rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold normal-case tracking-normal text-slate-900 outline-none focus:border-blue-600"
            />
          </label>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {CONTROL_ACTIONS.map((action) => (
            <button
              key={action.command}
              onClick={() => void run(action)}
              disabled={Boolean(running)}
              className="group rounded-2xl border border-slate-200 p-4 text-left transition hover:border-blue-300 hover:bg-blue-50 disabled:opacity-50"
            >
              <div className="flex items-center justify-between gap-3">
                <code className="font-black text-blue-700">
                  /{action.command}
                </code>
                <Play
                  size={16}
                  className={
                    running === action.command
                      ? "animate-pulse text-blue-700"
                      : "text-slate-400 group-hover:text-blue-700"
                  }
                />
              </div>
              <p className="mt-2 font-black text-slate-950">{action.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {action.description}
              </p>
            </button>
          ))}
        </div>
      </article>

      <article className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-5">
          <h4 className="text-xl font-black">Actividad reciente</h4>
          <p className="text-sm text-slate-500">
            Historial de órdenes enviadas desde este panel.
          </p>
        </div>
        <div className="divide-y divide-slate-100">
          {(data?.ordenes.recientes || []).map((order) => (
            <div
              key={order.id}
              className="flex flex-wrap items-center justify-between gap-3 p-4"
            >
              <div>
                <code className="font-black text-blue-700">
                  {order.comando}
                </code>
                <p className="mt-1 text-xs text-slate-500">
                  {order.error || order.resultado || order.creada}
                </p>
              </div>
              <span
                className={`rounded-full border px-3 py-1 text-[11px] font-black ${statusStyle(order.estado === "ERROR" ? "ERROR" : ["PENDIENTE", "EJECUTANDO"].includes(order.estado) ? "AVISO" : "OK")}`}
              >
                {order.estado}
              </span>
            </div>
          ))}
          {!data?.ordenes.recientes.length && (
            <p className="p-8 text-center text-sm text-slate-500">
              Todavía no hay órdenes hechas desde la página.
            </p>
          )}
        </div>
      </article>
    </section>
  );
}

export function NativeConsole() {
  const [summary, setSummary] = useState<ConsoleSummary | null>(() =>
    readCache("console-summary"),
  );
  const [list, setList] = useState<ConsoleList | null>(() =>
    readCache("console-list"),
  );
  const [moneyData, setMoneyData] = useState<MoneyData | null>(() =>
    readCache("console-money-7"),
  );
  const [mail, setMail] = useState<MailData | null>(() =>
    readCache("console-mail"),
  );
  const [loading, setLoading] = useState({
    summary: !summary,
    list: !list,
    money: !moneyData,
    mail: !mail,
  });
  const [query, setQuery] = useState("");
  const [caseQuery, setCaseQuery] = useState("");
  const [onlyUrgent, setOnlyUrgent] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [vin, setVin] = useState("");
  const [vinLoading, setVinLoading] = useState(false);
  const [vinResult, setVinResult] = useState<VinResult | null>(null);
  const [vinError, setVinError] = useState("");
  const [error, setError] = useState("");
  const started = useRef(false);

  const loadPart = async <T,>(
    key: keyof typeof loading,
    action: string,
    args: unknown[],
    setter: (value: T) => void,
    cacheKey: string,
    force = false,
  ) => {
    setLoading((current) => ({ ...current, [key]: true }));
    try {
      const value = await callTool<T>("consola", action, args, force);
      setter(value);
      writeCache(cacheKey, value);
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "No se pudieron actualizar los datos.",
      );
    } finally {
      setLoading((current) => ({ ...current, [key]: false }));
    }
  };

  const refreshAll = (force = false) => {
    setError("");
    void loadPart<ConsoleSummary>(
      "summary",
      "cargarResumen",
      [],
      setSummary,
      "console-summary",
      force,
    );
    void loadPart<ConsoleList>(
      "list",
      "listaDelDia",
      [],
      setList,
      "console-list",
      force,
    );
    void loadPart<MoneyData>(
      "money",
      "dineroDelDia",
      [7],
      setMoneyData,
      "console-money-7",
      force,
    );
    void loadPart<MailData>(
      "mail",
      "inventarioCorreo",
      [],
      setMail,
      "console-mail",
      force,
    );
  };

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    refreshAll(false);
  }, []);

  const cases = useMemo(
    () =>
      (list?.casos || []).filter((item) => {
        const matches =
          `${item.nombre} ${item.telefono} ${item.estado} ${item.agente}`
            .toLowerCase()
            .includes(caseQuery.toLowerCase());
        return matches && (!onlyUrgent || item.score >= 90);
      }),
    [list, caseQuery, onlyUrgent],
  );

  const searchClient = async (event: FormEvent) => {
    event.preventDefault();
    if (query.trim().length < 3) return;
    setSearching(true);
    setSearchResult(null);
    try {
      setSearchResult(
        await callTool<SearchResult>(
          "consola",
          "buscar",
          [query.trim(), "", true],
          true,
        ),
      );
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "No se pudo buscar.");
    } finally {
      setSearching(false);
    }
  };

  const decodeVin = async (event: FormEvent) => {
    event.preventDefault();
    const normalized = vin.trim().toUpperCase();
    setVinError("");
    setVinResult(null);
    if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(normalized)) {
      setVinError(
        "El VIN debe tener 17 caracteres y no puede contener I, O o Q.",
      );
      return;
    }
    setVinLoading(true);
    try {
      const response = await fetch("/api/admin/vin", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vin: normalized }),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) {
        throw new Error(data.error || "No se pudo decodificar el VIN.");
      }
      setVinResult(data);
      setVin(normalized);
    } catch (reason) {
      setVinError(
        reason instanceof Error
          ? reason.message
          : "No se pudo decodificar el VIN.",
      );
    } finally {
      setVinLoading(false);
    }
  };

  const d = summary?.datos;
  const busy = Object.values(loading).some(Boolean);
  return (
    <section className="mt-6 space-y-6">
      <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-blue-950 to-blue-800 text-white shadow-xl">
        <LoadingBar active={busy} />
        <div className="flex flex-wrap items-center justify-between gap-5 p-6 md:p-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[.2em] text-blue-300">
              <ShieldCheck size={16} /> Centro operativo en vivo
            </div>
            <h3 className="mt-3 text-3xl font-black">Consola Intercoast</h3>
            <p className="mt-2 max-w-2xl text-sm text-blue-100">
              La interfaz aparece de inmediato. Los bloques se actualizan por
              separado y conservan su última información mientras llega la
              nueva.
            </p>
          </div>
          <button
            onClick={() => refreshAll(true)}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-black text-slate-950 disabled:opacity-60"
          >
            <RefreshCw size={16} className={busy ? "animate-spin" : ""} />{" "}
            Actualizar todo
          </button>
        </div>
      </div>
      {error && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          {error}
        </div>
      )}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          label="Urgentes hoy"
          value={list?.urgentes ?? "—"}
          hint={`${list?.total || 0} casos publicados`}
          tone="violet"
        />
        <Metric
          label="Pólizas activas"
          value={d?.activas ?? "—"}
          hint={`${d?.polizas || 0} pólizas en cartera`}
        />
        <Metric
          label="Entró · 7 días"
          value={moneyData ? money(moneyData.entro) : "—"}
          hint={`Neto ${money(moneyData?.neto)}`}
          tone="green"
        />
        <Metric
          label="Renuevan en 30 días"
          value={d?.renuevan30 ?? "—"}
          hint={`${money(d?.prima30)} en prima`}
          tone="amber"
        />
      </div>

      <article
        id="buscar"
        className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm md:p-6"
      >
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-50 text-blue-700">
            <Search size={20} />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-xl font-black">Ficha Unificada</h4>
              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-blue-700">
                v2 · solo lectura
              </span>
            </div>
            <p className="text-sm text-slate-500">
              Cliente, pólizas y actividad de pagos desde la misma fuente
              operativa.
            </p>
          </div>
        </div>
        <form onSubmit={searchClient} className="mt-5 flex gap-2">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Nombre o teléfono"
            className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
          />
          <button
            disabled={searching}
            className="rounded-xl bg-blue-700 px-5 py-3 text-sm font-black text-white disabled:opacity-60"
          >
            {searching ? "Buscando…" : "Buscar"}
          </button>
        </form>
        {searchResult && (
          <div className="mt-5 space-y-4">
            {searchResult.contrato && (
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-blue-100 bg-blue-50/70 px-4 py-3 text-xs text-blue-900">
                <span className="font-bold">
                  Fuente:{" "}
                  {searchResult.fuentes
                    ?.map((source) => source.nombre)
                    .join(", ") || "Sentry"}
                  {searchResult.via
                    ? ` · localizada por ${searchResult.via}`
                    : ""}
                </span>
                <span>
                  Datos actualizados:{" "}
                  {searchResult.fuentes?.[0]?.actualizada ||
                    "sin sello disponible"}
                </span>
              </div>
            )}
            {searchResult.resultados?.length ? (
              searchResult.resultados.map((client, index) => (
                <div
                  key={`${client.nombre}-${index}`}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 bg-white p-4">
                    <div>
                      <h5 className="text-lg font-black text-slate-950">
                        {client.nombre}
                      </h5>
                      <p className="mt-1 text-sm text-slate-500">
                        {client.telefono || "Sin teléfono en los recibos"} ·{" "}
                        {client.polizas.length} póliza
                        {client.polizas.length === 1 ? "" : "s"}
                      </p>
                    </div>
                    <div className="text-right text-xs text-slate-500">
                      <p className="font-bold text-slate-700">
                        {client.identidad?.estrategia === "sentry-customer-id"
                          ? "Identidad confirmada por Customer ID"
                          : "Identidad agrupada por nombre"}
                      </p>
                      {client.clienteIds?.length ? (
                        <p className="mt-1">ID Sentry disponible</p>
                      ) : null}
                    </div>
                  </div>
                  {client.identidad?.ambigua && (
                    <div className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-900">
                      Atención: este nombre corresponde a más de un Customer ID.
                      Revisa la póliza antes de actuar.
                    </div>
                  )}
                  <div className="space-y-4 p-4">
                    {client.polizas.map((policy) => (
                      <article
                        key={policy.poliza}
                        className="rounded-2xl bg-white p-4 text-sm shadow-sm"
                      >
                        <div className="grid gap-3 md:grid-cols-4">
                          <div>
                            <span className="text-xs text-slate-400">
                              Póliza
                            </span>
                            <p className="font-black text-slate-950">
                              {policy.poliza}
                            </p>
                          </div>
                          <div>
                            <span className="text-xs text-slate-400">
                              Compañía
                            </span>
                            <p className="font-bold">{policy.carrier || "—"}</p>
                          </div>
                          <div>
                            <span className="text-xs text-slate-400">
                              Estado
                            </span>
                            <p className="font-bold">{policy.estado || "—"}</p>
                          </div>
                          <div>
                            <span className="text-xs text-slate-400">
                              Agente
                            </span>
                            <p className="font-bold">{policy.agente || "—"}</p>
                          </div>
                        </div>
                        <div className="mt-4 grid gap-3 rounded-xl bg-slate-50 p-3 sm:grid-cols-2 lg:grid-cols-5">
                          <div>
                            <span className="text-xs text-slate-400">Tipo</span>
                            <p className="font-bold">{policy.lob || "—"}</p>
                          </div>
                          <div>
                            <span className="text-xs text-slate-400">
                              Vigencia
                            </span>
                            <p className="font-bold">{policy.desde || "—"}</p>
                          </div>
                          <div>
                            <span className="text-xs text-slate-400">
                              Vence
                            </span>
                            <p className="font-bold">{policy.vence || "—"}</p>
                          </div>
                          <div>
                            <span className="text-xs text-slate-400">
                              Prima
                            </span>
                            <p className="font-bold">
                              {moneyExact(policy.prima)}
                            </p>
                          </div>
                          <div>
                            <span className="text-xs text-slate-400">
                              Broker Fee
                            </span>
                            <p className="font-bold">
                              {moneyExact(policy.brokerFee)}
                            </p>
                          </div>
                        </div>
                        {policy.cancelada && (
                          <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-xs font-bold text-rose-800">
                            Cancelación registrada: {policy.cancelada}
                          </p>
                        )}
                        <div className="mt-4 border-t border-slate-100 pt-4">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <p className="font-black text-slate-900">
                                Actividad de pagos
                              </p>
                              <p className="text-xs text-slate-500">
                                {policy.pagos?.recibos || 0} recibos válidos ·
                                último {policy.pagos?.ultimo || "sin fecha"}
                              </p>
                            </div>
                            <div className="flex gap-2 text-xs font-bold">
                              <span className="rounded-lg bg-emerald-50 px-3 py-2 text-emerald-700">
                                Pagado {moneyExact(policy.pagos?.pagado)}
                              </span>
                              <span className="rounded-lg bg-amber-50 px-3 py-2 text-amber-800">
                                Último due {moneyExact(policy.pagos?.saldo)}
                              </span>
                            </div>
                          </div>
                          {policy.pagos?.ultimos?.length ? (
                            <div className="mt-3 overflow-x-auto rounded-xl border border-slate-100">
                              <table className="w-full min-w-[620px] text-left text-xs">
                                <thead className="bg-slate-50 text-slate-500">
                                  <tr>
                                    <th className="p-2.5">Fecha</th>
                                    <th className="p-2.5">Transacción</th>
                                    <th className="p-2.5">Recibo</th>
                                    <th className="p-2.5 text-right">Pagado</th>
                                    <th className="p-2.5 text-right">
                                      Amount Due
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {policy.pagos.ultimos.map(
                                    (payment, paymentIndex) => (
                                      <tr
                                        key={`${payment.recibo || payment.fecha}-${paymentIndex}`}
                                        className="border-t border-slate-100"
                                      >
                                        <td className="p-2.5">
                                          {payment.fecha || "—"}
                                        </td>
                                        <td className="p-2.5 font-bold">
                                          {payment.tipo || "—"}
                                        </td>
                                        <td className="p-2.5">
                                          {payment.recibo || "—"}
                                        </td>
                                        <td className="p-2.5 text-right font-bold text-emerald-700">
                                          {moneyExact(payment.pagado)}
                                        </td>
                                        <td className="p-2.5 text-right font-bold text-amber-800">
                                          {moneyExact(payment.debe)}
                                        </td>
                                      </tr>
                                    ),
                                  )}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <p className="mt-3 rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
                              No hay recibos válidos para esta póliza.
                            </p>
                          )}
                        </div>
                        <div className="mt-4 border-t border-slate-100 pt-4">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <p className="font-black text-slate-900">
                                Líneas del recibo
                              </p>
                              <p className="text-xs text-slate-500">
                                Detalle histórico sin colapsar transacciones con
                                el mismo Receipt#.
                              </p>
                            </div>
                            {policy.lineasRecibo?.disponible && (
                              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-600">
                                {policy.lineasRecibo.mostradas} de {policy.lineasRecibo.total}
                              </span>
                            )}
                          </div>
                          {!policy.lineasRecibo?.disponible ? (
                            <p className="mt-3 rounded-lg bg-amber-50 p-3 text-xs font-bold text-amber-800">
                              Historial temporalmente no disponible. El resumen
                              operativo de arriba sigue siendo válido.
                            </p>
                          ) : (
                            <>
                              {(policy.lineasRecibo.reciboRepetido ||
                                policy.lineasRecibo.truncado) && (
                                <div className="mt-3 space-y-2">
                                  {policy.lineasRecibo.reciboRepetido && (
                                    <p className="rounded-lg bg-blue-50 p-3 text-xs font-bold text-blue-800">
                                      Hay Receipt# repetidos: cada transacción se
                                      muestra en su propia línea.
                                    </p>
                                  )}
                                  {policy.lineasRecibo.truncado && (
                                    <p className="rounded-lg bg-amber-50 p-3 text-xs font-bold text-amber-800">
                                      Se muestran {policy.lineasRecibo.mostradas} de{" "}
                                      {policy.lineasRecibo.total} líneas.
                                    </p>
                                  )}
                                </div>
                              )}
                              {policy.lineasRecibo.lineas.length ? (
                                <div className="mt-3 overflow-x-auto rounded-xl border border-slate-100">
                                  <table className="w-full min-w-[880px] text-left text-xs">
                                    <thead className="bg-slate-50 text-slate-500">
                                      <tr>
                                        <th className="p-2.5">Fecha</th>
                                        <th className="p-2.5">Receipt#</th>
                                        <th className="p-2.5">Tx Type</th>
                                        <th className="p-2.5 text-right">BF Retained</th>
                                        <th className="p-2.5 text-right">Premium Retained</th>
                                        <th className="p-2.5 text-right">Amount Paid</th>
                                        <th className="p-2.5 text-right">Amount Due</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {policy.lineasRecibo.lineas.map((line, lineIndex) => (
                                        <tr
                                          key={`${line.recibo || line.fecha}-${line.tipo}-${lineIndex}`}
                                          className="border-t border-slate-100"
                                        >
                                          <td className="p-2.5">{line.fecha || "—"}</td>
                                          <td className="p-2.5">{line.recibo || "—"}</td>
                                          <td className="p-2.5 font-bold">{line.tipo || "—"}</td>
                                          <td className="p-2.5 text-right">{moneyExact(line.bfRetenido)}</td>
                                          <td className="p-2.5 text-right">{moneyExact(line.premiumRetenido)}</td>
                                          <td className="p-2.5 text-right font-bold text-emerald-700">{moneyExact(line.pagado)}</td>
                                          <td className="p-2.5 text-right font-bold text-amber-800">{moneyExact(line.debe)}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              ) : (
                                <p className="mt-3 rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
                                  No hay líneas históricas para esta póliza.
                                </p>
                              )}
                            </>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
                {searchResult.nota ||
                  searchResult.mensaje ||
                  "No encontramos resultados."}
              </p>
            )}
          </div>
        )}
      </article>

      <article
        id="vin"
        className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm md:p-6"
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-violet-50 text-violet-700">
              <span className="text-xs font-black">VIN</span>
            </span>
            <div>
              <h4 className="text-xl font-black">Decodificador de vehículo</h4>
              <p className="text-sm text-slate-500">
                Reutiliza NHTSA vPIC. La consulta no se guarda en Intercoast.
              </p>
            </div>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-700">
            Herramienta autenticada
          </span>
        </div>
        <form onSubmit={decodeVin} className="mt-5 flex flex-wrap gap-2">
          <input
            value={vin}
            onChange={(event) =>
              setVin(event.target.value.toUpperCase().replace(/\s/g, ""))
            }
            placeholder="VIN de 17 caracteres"
            maxLength={17}
            autoComplete="off"
            spellCheck={false}
            className="min-w-[260px] flex-1 rounded-xl border border-slate-200 px-4 py-3 font-mono uppercase tracking-wider outline-none focus:border-violet-600 focus:ring-4 focus:ring-violet-100"
          />
          <button
            disabled={vinLoading}
            className="rounded-xl bg-violet-700 px-5 py-3 text-sm font-black text-white disabled:opacity-60"
          >
            {vinLoading ? "Consultando…" : "Decodificar VIN"}
          </button>
        </form>
        {vinError && (
          <p className="mt-3 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
            {vinError}
          </p>
        )}
        {vinResult && (
          <div className="mt-5 overflow-hidden rounded-2xl border border-violet-100">
            <div className="flex flex-wrap items-start justify-between gap-3 bg-gradient-to-r from-violet-700 to-indigo-700 p-5 text-white">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-violet-200">
                  {vinResult.source}
                </p>
                <h5 className="mt-1 text-2xl font-black">
                  {[
                    vinResult.vehicle.year,
                    vinResult.vehicle.make,
                    vinResult.vehicle.model,
                  ]
                    .filter(Boolean)
                    .join(" ") || "VIN con información parcial"}
                </h5>
                <p className="mt-1 font-mono text-xs text-violet-100">
                  {vinResult.vin}
                </p>
              </div>
              {vinResult.cached && (
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold">
                  Caché seguro
                </span>
              )}
            </div>
            {!vinResult.decoded && (
              <p className="border-b border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                NHTSA devolvió información parcial. Confirma el VIN antes de
                usar estos datos.
              </p>
            )}
            <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["Carrocería", vinResult.vehicle.bodyClass],
                ["Tipo de vehículo", vinResult.vehicle.vehicleType],
                ["Fabricante", vinResult.vehicle.manufacturer],
                [
                  "Trim / serie",
                  [vinResult.vehicle.trim, vinResult.vehicle.series]
                    .filter(Boolean)
                    .join(" · "),
                ],
                ["Combustible", vinResult.vehicle.fuelType],
                [
                  "Motor",
                  [
                    vinResult.vehicle.engineCylinders &&
                      `${vinResult.vehicle.engineCylinders} cil.`,
                    vinResult.vehicle.displacementL &&
                      `${vinResult.vehicle.displacementL} L`,
                  ]
                    .filter(Boolean)
                    .join(" · "),
                ],
                ["Tracción", vinResult.vehicle.driveType],
                ["País de planta", vinResult.vehicle.plantCountry],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl bg-slate-50 p-3">
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    {label}
                  </p>
                  <p className="mt-1 font-bold text-slate-800">
                    {value || "—"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </article>

      <article
        id="casos"
        className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-5">
          <div>
            <h4 className="text-xl font-black">Casos de hoy</h4>
            <p className="text-sm text-slate-500">
              Prioridad, cliente y acceso directo a llamada o calendario.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <input
              value={caseQuery}
              onChange={(event) => setCaseQuery(event.target.value)}
              placeholder="Filtrar casos…"
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-600"
            />
            <button
              onClick={() => setOnlyUrgent((value) => !value)}
              className={`rounded-xl px-3 py-2 text-sm font-black ${onlyUrgent ? "bg-rose-600 text-white" : "bg-slate-100 text-slate-600"}`}
            >
              Solo urgentes
            </button>
          </div>
        </div>
        <div className="max-h-[680px] overflow-auto divide-y divide-slate-100">
          {loading.list && !list ? (
            <p className="p-8 text-center text-sm text-slate-500">
              Preparando los casos…
            </p>
          ) : (
            cases.map((item, index) => (
              <div
                key={`${item.nombre}-${item.telefono}-${index}`}
                className="grid gap-3 p-4 transition hover:bg-blue-50/60 md:grid-cols-[64px_1fr_auto]"
              >
                <div
                  className={`grid h-12 w-12 place-items-center rounded-2xl text-sm font-black ${item.score >= 90 ? "bg-rose-50 text-rose-700" : item.score >= 60 ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-600"}`}
                >
                  {item.score}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-black text-slate-950">
                      {item.nombre || "Sin nombre"}
                    </p>
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-bold text-slate-600">
                      {item.estado || "Pendiente"}
                    </span>
                    {item.sinSeguimiento && (
                      <span className="rounded-full bg-rose-50 px-2 py-1 text-[11px] font-bold text-rose-700">
                        Sin seguimiento
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    {item.agente || "Sin agente"} ·{" "}
                    {item.telefono || "Sin teléfono"} · {item.arrastre} días
                    arrastrado
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    {item.resumen ||
                      item.titulo ||
                      "Caso pendiente de revisión"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {item.telefono && (
                    <a
                      href={`tel:${item.telefono}`}
                      className="rounded-xl bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-700"
                    >
                      Llamar
                    </a>
                  )}
                  {item.enlace && (
                    <a
                      href={item.enlace}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 rounded-xl bg-blue-700 px-3 py-2 text-xs font-black text-white"
                    >
                      Calendar <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </article>

      <div className="grid gap-6 xl:grid-cols-2">
        <article
          id="dinero"
          className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
                <WalletCards size={20} />
              </span>
              <div>
                <h4 className="text-xl font-black">Dinero</h4>
                <p className="text-sm text-slate-500">
                  Movimientos reconocidos por Chase.
                </p>
              </div>
            </div>
            <div className="flex gap-1">
              {[1, 7, 30, 90].map((days) => (
                <button
                  key={days}
                  onClick={() =>
                    void loadPart<MoneyData>(
                      "money",
                      "dineroDelDia",
                      [days],
                      setMoneyData,
                      `console-money-${days}`,
                      true,
                    )
                  }
                  className={`rounded-lg px-2.5 py-2 text-xs font-black ${moneyData?.dias === days ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600"}`}
                >
                  {days === 1
                    ? "Hoy"
                    : days === 90
                      ? "3 meses"
                      : `${days} días`}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-3">
            <div className="rounded-2xl bg-emerald-50 p-4">
              <p className="text-xs font-bold text-emerald-700">Entró</p>
              <p className="mt-1 text-2xl font-black text-emerald-800">
                {money(moneyData?.entro)}
              </p>
            </div>
            <div className="rounded-2xl bg-rose-50 p-4">
              <p className="text-xs font-bold text-rose-700">Salió</p>
              <p className="mt-1 text-2xl font-black text-rose-800">
                {money(moneyData?.salio)}
              </p>
            </div>
            <div className="rounded-2xl bg-blue-50 p-4">
              <p className="text-xs font-bold text-blue-700">Neto</p>
              <p className="mt-1 text-2xl font-black text-blue-800">
                {money(moneyData?.neto)}
              </p>
            </div>
          </div>
          {moneyData?.porCategoria?.length ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {moneyData.porCategoria.slice(0, 6).map((item) => (
                <span
                  key={item.categoria}
                  className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600"
                >
                  {item.categoria} · {money(item.monto)}
                </span>
              ))}
            </div>
          ) : null}
        </article>
        <article
          id="correo"
          className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-violet-50 text-violet-700">
              <Mail size={20} />
            </span>
            <div>
              <h4 className="text-xl font-black">Correo operativo</h4>
              <p className="text-sm text-slate-500">
                {mail?.revisados || 0} mensajes revisados, con datos sensibles
                enmascarados.
              </p>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {mail?.remitentes?.slice(0, 5).map((item) => (
              <div key={item.remitente} className="rounded-2xl bg-slate-50 p-3">
                <div className="flex justify-between gap-3">
                  <p className="truncate text-sm font-black">
                    {item.remitente}
                  </p>
                  <span className="text-xs font-bold text-violet-700">
                    {item.n} mensajes
                  </span>
                </div>
                <p className="mt-1 truncate text-xs text-slate-500">
                  {item.asuntos[0]?.texto || "Sin asunto"}
                </p>
              </div>
            ))}
            {loading.mail && !mail && (
              <p className="py-8 text-center text-sm text-slate-500">
                Revisando el correo en segundo plano…
              </p>
            )}
          </div>
        </article>
      </div>
    </section>
  );
}

export function NativeZelle() {
  const [data, setData] = useState<ZelleData | null>(() => readCache("zelle"));
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(!data);
  const [error, setError] = useState("");
  const started = useRef(false);
  const load = async (refresh = false) => {
    setLoading(true);
    setError("");
    try {
      const value = await callTool<ZelleData>(
        "zelle",
        refresh ? "actualizar" : "datos",
        [],
        refresh,
      );
      setData(value);
      writeCache("zelle", value);
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "No se pudieron cargar los pagos.",
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    void load(false);
  }, []);
  const payments = (data?.pagos || []).filter((item) =>
    `${item.nombre} ${item.monto}`.toLowerCase().includes(query.toLowerCase()),
  );
  const groups = payments.reduce<Record<string, typeof payments>>(
    (result, item) => {
      (result[item.fecha] ||= []).push(item);
      return result;
    },
    {},
  );
  const total = payments.reduce(
    (sum, item) => sum + Number(item.monto || 0),
    0,
  );
  return (
    <section className="mt-6 overflow-hidden rounded-3xl bg-gradient-to-br from-violet-950 via-purple-900 to-fuchsia-900 p-1 shadow-2xl">
      <div className="rounded-[22px] bg-[#f7f4ff] p-5 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[.2em] text-violet-600">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-violet-700 text-white">
                Z
              </span>{" "}
              Pagos conectados
            </div>
            <h3 className="mt-3 text-3xl font-black text-slate-950">
              Zelle recibidos
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              La misma herramienta de los agentes, ahora integrada directamente
              al panel.
            </p>
          </div>
          <button
            onClick={() => void load(true)}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-violet-700 px-4 py-3 text-sm font-black text-white disabled:opacity-60"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />{" "}
            Actualizar ahora
          </button>
        </div>
        {error && (
          <p className="mt-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">
            {error}
          </p>
        )}
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Metric
            label="Pagos visibles"
            value={payments.length}
            hint="Ingresos publicados"
            tone="violet"
          />
          <Metric
            label="Total visible"
            value={money(total)}
            hint="Suma de la búsqueda"
            tone="green"
          />
          <Metric
            label="Actualización"
            value={data?.antiguedad != null ? `${data.antiguedad} min` : "—"}
            hint={data?.generada || "Preparando datos"}
            tone="amber"
          />
        </div>
        <div className="relative mt-5">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-violet-400"
          />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por nombre o monto…"
            className="w-full rounded-2xl border border-violet-100 bg-white py-3 pl-11 pr-4 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
          />
        </div>
        <div className="mt-6 space-y-5">
          {Object.entries(groups).map(([day, items]) => (
            <section key={day}>
              <div className="mb-2 flex items-center justify-between">
                <h4 className="text-sm font-black text-violet-950">{day}</h4>
                <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-700">
                  {items.length} pagos
                </span>
              </div>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {items.map((item, index) => (
                  <article
                    key={`${day}-${item.hora}-${index}`}
                    className="rounded-2xl border border-violet-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-violet-100 text-sm font-black text-violet-700">
                          {item.nombre
                            .split(/\s+/)
                            .slice(0, 2)
                            .map((part) => part[0])
                            .join("")}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-black text-slate-900">
                            {item.nombre}
                          </p>
                          <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                            <Clock3 size={12} />
                            {item.hora || "Sin hora"}
                          </p>
                        </div>
                      </div>
                      <strong className="text-lg text-emerald-700">
                        {money(item.monto)}
                      </strong>
                    </div>
                    {item.nota && (
                      <p className="mt-3 rounded-lg bg-slate-50 p-2 text-xs text-slate-500">
                        {item.nota}
                      </p>
                    )}
                  </article>
                ))}
              </div>
            </section>
          ))}
          {loading && !data && (
            <div className="py-20 text-center text-sm font-bold text-violet-600">
              Preparando los pagos…
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

const startOfWeek = (date: Date) => {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  value.setDate(value.getDate() - value.getDay());
  return value;
};
const OFFICE_TIME_ZONE = "America/Los_Angeles";
const addDays = (date: Date, days: number) => {
  const value = new Date(date);
  value.setDate(value.getDate() + days);
  return value;
};
const isoDay = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
const officeDay = (value: string | Date) =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: OFFICE_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));
const officeBoundary = (date: Date) => {
  const day = isoDay(date);
  const noon = new Date(`${day}T12:00:00Z`);
  const zone = new Intl.DateTimeFormat("en-US", {
    timeZone: OFFICE_TIME_ZONE,
    timeZoneName: "shortOffset",
  })
    .formatToParts(noon)
    .find((part) => part.type === "timeZoneName")?.value;
  const match = String(zone || "GMT-8").match(
    /GMT([+-])(\d{1,2})(?::(\d{2}))?/,
  );
  const sign = match?.[1] || "-";
  const hour = String(match?.[2] || "8").padStart(2, "0");
  const minute = String(match?.[3] || "00").padStart(2, "0");
  return `${day}T00:00:00${sign}${hour}:${minute}`;
};

export function NativeCalendar() {
  const [week, setWeek] = useState(() => startOfWeek(new Date()));
  const cacheKey = `calendar-${isoDay(week)}`;
  const [data, setData] = useState<CalendarPayload | null>(() =>
    readCache(cacheKey),
  );
  const [loading, setLoading] = useState(!data);
  const [query, setQuery] = useState("");
  const [calendar, setCalendar] = useState("Todos");
  const [error, setError] = useState("");
  const end = addDays(week, 7);
  const days = Array.from({ length: 7 }, (_, index) => addDays(week, index));

  const load = async (force = false) => {
    const key = `calendar-${isoDay(week)}`;
    const cached = readCache<CalendarPayload>(key);
    if (cached) setData(cached);
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `/api/admin/calendar?start=${encodeURIComponent(officeBoundary(week))}&end=${encodeURIComponent(officeBoundary(end))}${force ? "&force=1" : ""}`,
        { credentials: "include" },
      );
      const value = await response.json();
      if (!response.ok || !value.ok)
        throw new Error(value.error || "No se pudo cargar el calendario.");
      setData(value);
      writeCache(key, value);
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "No se pudo cargar el calendario.",
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    void load(false);
  }, [week.getTime()]);

  const visible = (data?.events || []).filter(
    (event) =>
      (calendar === "Todos" || event.calendar === calendar) &&
      `${event.title} ${event.calendar}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  const byDay = visible.reduce<Record<string, CalendarEvent[]>>(
    (result, event) => {
      const key = officeDay(event.start);
      (result[key] ||= []).push(event);
      return result;
    },
    {},
  );
  const today = isoDay(new Date());
  return (
    <section className="mt-6 space-y-5">
      <div className="rounded-3xl bg-gradient-to-r from-blue-800 via-indigo-800 to-violet-800 p-6 text-white shadow-xl md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[.2em] text-blue-200">
              <CalendarDays size={16} /> Agenda nativa
            </div>
            <h3 className="mt-3 text-3xl font-black">
              Calendarios de la oficina
            </h3>
            <p className="mt-2 text-sm text-blue-100">
              Sin ventana incrustada: eventos rápidos, filtros propios y edición
              directa en Google Calendar.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setWeek(addDays(week, -7))}
              className="grid h-11 w-11 place-items-center rounded-xl bg-white/15 hover:bg-white/25"
            >
              <ChevronLeft />
            </button>
            <button
              onClick={() => setWeek(startOfWeek(new Date()))}
              className="rounded-xl bg-white px-4 py-2 text-sm font-black text-blue-900"
            >
              Hoy
            </button>
            <button
              onClick={() => setWeek(addDays(week, 7))}
              className="grid h-11 w-11 place-items-center rounded-xl bg-white/15 hover:bg-white/25"
            >
              <ChevronRight />
            </button>
            <button
              onClick={() => void load(true)}
              className="grid h-11 w-11 place-items-center rounded-xl bg-white/15 hover:bg-white/25"
            >
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>
      </div>
      {error && (
        <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">
          {error}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-white p-3 shadow-sm">
        <div className="relative min-w-[240px] flex-1">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar cliente o tipo de evento…"
            className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-600"
          />
        </div>
        <select
          value={calendar}
          onChange={(event) => setCalendar(event.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-700"
        >
          <option>Todos</option>
          {data?.calendars?.map((item) => (
            <option key={item.id}>{item.name}</option>
          ))}
        </select>
        <span className="rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-black text-slate-600">
          {visible.length} eventos
        </span>
        <a
          href="https://calendar.google.com/calendar/u/0/r"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-black text-white"
        >
          Google Calendar <ExternalLink size={14} />
        </a>
      </div>
      <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="grid min-w-[1180px] grid-cols-7 divide-x divide-slate-100">
          {days.map((day) => {
            const key = isoDay(day);
            const events = byDay[key] || [];
            const isToday = key === today;
            return (
              <section key={key} className="min-h-[650px]">
                <header
                  className={`sticky top-0 z-10 border-b border-slate-100 p-3 ${isToday ? "bg-blue-700 text-white" : "bg-slate-50 text-slate-700"}`}
                >
                  <p className="text-[11px] font-black uppercase tracking-wider">
                    {new Intl.DateTimeFormat("es", { weekday: "short" }).format(
                      day,
                    )}
                  </p>
                  <div className="mt-1 flex items-end justify-between">
                    <span className="text-2xl font-black">{day.getDate()}</span>
                    <span
                      className={`rounded-full px-2 py-1 text-[10px] font-black ${isToday ? "bg-white/20" : "bg-white"}`}
                    >
                      {events.length}
                    </span>
                  </div>
                </header>
                <div className="max-h-[650px] space-y-2 overflow-auto p-2">
                  {events.map((event, index) => (
                    <a
                      key={`${event.start}-${event.title}-${index}`}
                      href={event.link || "#"}
                      target={event.link ? "_blank" : undefined}
                      rel="noreferrer"
                      className="block rounded-xl border border-slate-100 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
                      style={{
                        borderLeftWidth: 4,
                        borderLeftColor: event.color || "#2563eb",
                      }}
                    >
                      <p className="line-clamp-3 text-xs font-black leading-snug text-slate-900">
                        {event.title}
                      </p>
                      <p className="mt-2 flex items-center gap-1 text-[10px] font-bold text-slate-500">
                        <Clock3 size={11} />
                        {event.allDay
                          ? "Todo el día"
                          : new Intl.DateTimeFormat("es", {
                              hour: "numeric",
                              minute: "2-digit",
                              timeZone: OFFICE_TIME_ZONE,
                            }).format(new Date(event.start))}
                      </p>
                      <p className="mt-1 truncate text-[10px] text-slate-400">
                        {event.calendar}
                      </p>
                    </a>
                  ))}
                  {!events.length && (
                    <p className="py-10 text-center text-xs text-slate-400">
                      Sin eventos
                    </p>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </section>
  );
}
