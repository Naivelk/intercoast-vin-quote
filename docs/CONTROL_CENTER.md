# Centro de control administrativo

La sección **Control** de `https://insuranceintercoast.com/admin` integra las
automatizaciones del bot dentro del panel privado de Intercoast.

## Arquitectura

El navegador llama a `/api/admin/tool`. La función Netlify valida la sesión y
la lista de correos permitidos, luego reenvía la solicitud al puente protegido
de Google Apps Script. La URL y la clave del puente permanecen en variables de
Netlify y no se publican en JavaScript.

La página puede:

- ver la asistencia de hoy y los historiales de 7 y 30 días;
- consultar la salud de 12 procesos y sus 15 activadores;
- distinguir procesos en curso, congelados y atrasados;
- ver gráficas de rendimiento de 7 o 30 días;
- comprobar si Daily Report, pólizas, Callbright o Chase llevan más de 9 días
  sin una fuente nueva;
- ver la cola y el historial de ejecuciones manuales;
- pedir `estado`, `saldo`, `llenar`, `llenarhoy`, `cuadre`, `comisiones`,
  `nomina` o `recibos`;
- indicar el lunes de una semana para nómina y recibos;
- confirmar las acciones que pueden modificar libros.

## Asistencia

La primera tarjeta de **Control** presenta las marcaciones hechas desde Zelle:

- **Hoy:** trabajando, terminaron, sin iniciar y horas cerradas.
- **Semana:** últimos 7 días, ausencias y jornadas sin cierre.
- **Mes:** últimos 30 días con el mismo detalle.

La tabla muestra fecha, agente, entrada, salida, horas y estado. Para días
anteriores solo se muestran registros reales; una fecha anterior a la
activación del reloj no se convierte en ausencia. El panel todavía no etiqueta
“llegó tarde” ni “salió antes” porque falta definir el horario esperado de cada
agente. Si una persona inicia dos jornadas el mismo día, cada sesión aparece en
su propia fila y conserva el cierre anterior.

El navegador pide `resumenAsistencia` al proxy autenticado. Este llama al
puente privado de la consola, que vuelve a validar `PANEL_CLAVE`. El panel nunca
recibe los PIN ni puede modificar la asistencia.

La solicitud no ejecuta una segunda implementación del proceso. Entra a
`ORDENES BOT`, el activador existente la recoge en menos de un minuto y la
procesa por el mismo manejador de Telegram. El resultado queda en el historial
y también llega al grupo.

## Rendimiento y frescura

El puente devuelve dos conjuntos agregados adicionales, sin datos de clientes:

- `tendencias`: 30 días calendario con duración máxima y cantidad de
  ejecuciones `AVISO`/`ERROR`; la interfaz permite mostrar 7 o 30;
- `fuentes`: última llegada registrada de los cuatro reportes de entrada, su
  límite y el estado `OK`, `DESACTUALIZADO` o `SIN_MEDIR`.

La tarjeta de cada proceso también enseña promedio, p95 y máximo. `INICIADO`
no cuenta como una ejecución de cero segundos: si permanece más de 8 minutos
se vuelve `CONGELADO`. `ATRASADO` significa que la última ejecución superó el
SLA propio de esa rutina.

## Seguridad y operación

- Solo entran `intercoast.texto@gmail.com` y `alequito09@hotmail.com` mediante
  Netlify Identity.
- El proxy solo admite acciones expresamente enumeradas.
- El puente vuelve a validar `PANEL_CLAVE` y solo admite ocho comandos.
- Las respuestas del proxy usan `Cache-Control: no-store, private`.
- Sin sesión, `/api/admin/tool` responde 403.

Despliegue inicial de esta sección: 23 de agosto de 2026.
