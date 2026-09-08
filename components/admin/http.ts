export const MENSAJE_SESION =
  "Tu sesión venció. Vuelve a entrar para cargar los datos.";

/** Comprueba solo la sesión de Netlify; no llama a Apps Script. */
export async function sesionPrivadaVigente(): Promise<boolean> {
  try {
    const response = await fetch("/api/admin/tool?tool=consola", {
      credentials: "include",
    });
    return response.status !== 401 && response.status !== 403;
  } catch {
    /* Sin red no significa sin permiso. La carga normal enseñará el error de
     * conectividad sin expulsar al manager de una sesión que puede ser válida. */
    return true;
  }
}

/**
 * Lee respuestas de las funciones privadas sin dejar que un HTML de timeout o
 * de acceso termine convertido en `Unexpected token ... is not valid JSON`.
 *
 * Esta función solo interpreta la respuesta: no reintenta, no cambia datos y
 * no esconde el mensaje que una API válida haya enviado en JSON.
 */
export async function leerJsonSeguro<T extends Record<string, unknown>>(
  response: Response,
  mensajeAlterno: string,
): Promise<T> {
  const texto = await response.text();
  let data: T;
  try {
    data = JSON.parse(texto) as T;
  } catch {
    if (response.status === 401 || response.status === 403) {
      throw new Error(MENSAJE_SESION);
    }
    throw new Error(mensajeAlterno);
  }

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error(MENSAJE_SESION);
    }
    const detalle = data.error;
    throw new Error(
      typeof detalle === "string" && detalle.trim()
        ? detalle
        : mensajeAlterno,
    );
  }
  return data;
}
