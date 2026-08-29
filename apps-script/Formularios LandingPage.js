/*** CONFIG ***/
const TZ = "America/Los_Angeles";
const SHEET_ID = "1ftQvjcres1GRaMgph4kCkxyPO_xTvvwDZ-1kSjt2aMM";
const SHEET_NAME = "Hoja 1";
const FOLLOW_UP_EMAIL = "coastinter23@gmail.com";
const FOLLOW_UP_REMINDER_HOURS = 24;

/*** HELPERS ***/
function sheet_() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sh = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];
  return sh;
}

function nowStamp_() {
  return Utilities.formatDate(new Date(), TZ, "yyyy-MM-dd HH:mm:ss");
}

function value_(data, camelName, legacyName) {
  return String(data[camelName] || data[legacyName] || "").trim();
}

function followUpDate_(value) {
  if (!value) return "";
  const parsed = new Date(value);
  return isNaN(parsed.getTime()) ? "" : parsed;
}

function avisarLeadsPendientes() {
  const sh = sheet_();
  const lastRow = sh.getLastRow();
  if (lastRow < 2) return;

  // AU = Estado, AV = Asesor y AZ = Próximo seguimiento.
  const values = sh.getRange(2, 1, lastRow - 1, 54).getValues();
  const now = new Date();
  const nextReminder = new Date(now.getTime() + FOLLOW_UP_REMINDER_HOURS * 60 * 60 * 1000);

  values.forEach((row, index) => {
    const estado = String(row[46] || "").trim();
    const proximoSeguimiento = row[51];
    const nombre = String(row[1] || "Cliente").trim();
    const telefono = String(row[6] || "Sin teléfono").trim();
    const asesor = String(row[47] || "Sin asignar").trim();

    if (estado !== "Nuevo" || !(proximoSeguimiento instanceof Date) || proximoSeguimiento > now) return;

    try {
      MailApp.sendEmail({
        to: FOLLOW_UP_EMAIL,
        subject: "Seguimiento pendiente: " + nombre,
        htmlBody:
          "<p>Hay un lead pendiente de contacto.</p>" +
          "<p><strong>Cliente:</strong> " + nombre + "<br>" +
          "<strong>Teléfono:</strong> " + telefono + "<br>" +
          "<strong>Asesor:</strong> " + asesor + "</p>" +
          "<p>Actualiza el estado o programa el próximo seguimiento en la hoja.</p>"
      });
      // Evita enviar el mismo recordatorio cada hora mientras el lead siga nuevo.
      sh.getRange(index + 2, 52).setValue(nextReminder);
    } catch (err) {
      Logger.log("ERROR recordatorio de lead: " + err);
    }
  });
}

function configurarRecordatoriosLeads() {
  ScriptApp.getProjectTriggers()
    .filter(trigger => trigger.getHandlerFunction() === "avisarLeadsPendientes")
    .forEach(trigger => ScriptApp.deleteTrigger(trigger));

  ensureFollowUpTrigger_();
}

function ensureFollowUpTrigger_() {
  const alreadyConfigured = ScriptApp.getProjectTriggers()
    .some(trigger => trigger.getHandlerFunction() === "avisarLeadsPendientes");
  if (alreadyConfigured) return;

  ScriptApp.newTrigger("avisarLeadsPendientes")
    .timeBased()
    .everyHours(1)
    .create();
}

function json_(body) {
  return ContentService.createTextOutput(JSON.stringify(body))
    .setMimeType(ContentService.MimeType.JSON);
}

function relayAuthorized_(data) {
  const properties = PropertiesService.getScriptProperties();
  const storedToken = properties.getProperty("LEADS_RELAY_TOKEN");
  const receivedToken = String(data.relayToken || "");
  return Boolean(storedToken && receivedToken && storedToken === receivedToken);
}

function leadPayload_(row, rowNumber) {
  const vehicles = [];
  for (let index = 0; index < 5; index++) {
    const offset = 8 + index * 6;
    if (!row[offset]) continue;
    vehicles.push({
      vin: row[offset] || "",
      year: row[offset + 1] || "",
      make: row[offset + 2] || "",
      model: row[offset + 3] || "",
      bodyClass: row[offset + 4] || "",
      estimated: row[offset + 5] || 0
    });
  }

  return {
    row: rowNumber,
    timestamp: row[0] || "",
    nombre: row[1] || "",
    email: row[5] || "",
    telefono: row[6] || "",
    totalEstimado: row[38] || 0,
    estado: row[46] || "",
    asesor: row[47] || "",
    fuente: row[48] || "",
    proximoSeguimiento: row[51] || "",
    ultimoContacto: row[52] || "",
    notas: row[53] || "",
    vehicles: vehicles
  };
}

// Fuente operativa del proyecto de retención. Solo se expone mediante el
// relay autenticado de Netlify: jamás desde el navegador ni con URL pública.
const RETENTION_SHEET_ID = "14agDYdYFnVifRXb7Hj3dClqHrLOAjdQSULIs4Bdzvlo";

function retentionRows_(sheetName, limit) {
  const spreadsheet = SpreadsheetApp.openById(RETENTION_SHEET_ID);
  const sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet || sheet.getLastRow() < 2) return [];
  const width = sheet.getLastColumn();
  const headers = sheet.getRange(1, 1, 1, width).getDisplayValues()[0];
  const firstRow = Math.max(2, sheet.getLastRow() - limit + 1);
  const rows = sheet.getRange(firstRow, 1, sheet.getLastRow() - firstRow + 1, width).getDisplayValues();
  return rows.reverse().map(row => headers.reduce((item, header, index) => {
    item[header || `columna_${index + 1}`] = row[index] || "";
    return item;
  }, {}));
}

function retentionSnapshot_() {
  const spreadsheet = SpreadsheetApp.openById(RETENTION_SHEET_ID);
  const availableSheets = spreadsheet.getSheets().map(sheet => sheet.getName());
  const cases = availableSheets.includes("LISTA DEL DIA") ? retentionRows_("LISTA DEL DIA", 40) : [];
  const zelle = availableSheets.includes("ZELLE") ? retentionRows_("ZELLE", 80) : [];
  return {
    ok: true,
    updatedAt: new Date().toISOString(),
    availableSheets: availableSheets.filter(name => ["LISTA DEL DIA", "ZELLE", "POLIZAS", "PAGOS"].includes(name)),
    cases,
    zelle
  };
}

const AUDIT_SHEET_NAME = "ADMIN AUDIT";

function auditSheet_() {
  const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
  let sheet = spreadsheet.getSheetByName(AUDIT_SHEET_NAME);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(AUDIT_SHEET_NAME);
    sheet.appendRow(["ID", "Fecha", "Usuario", "Acción", "Entidad", "Detalle"]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function auditAppend_(data) {
  const sheet = auditSheet_();
  const entry = {
    id: Utilities.getUuid(),
    timestamp: new Date().toISOString(),
    user: String(data.user || "Usuario autorizado").trim().slice(0, 120),
    action: String(data.auditAction || "Actividad").trim().slice(0, 120),
    entity: String(data.entity || "Panel").trim().slice(0, 120),
    detail: String(data.detail || "").trim().slice(0, 1000)
  };
  sheet.appendRow([entry.id, new Date(entry.timestamp), entry.user, entry.action, entry.entity, entry.detail]);
  return entry;
}

function auditList_() {
  const sheet = auditSheet_();
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  const firstRow = Math.max(2, lastRow - 199);
  return sheet.getRange(firstRow, 1, lastRow - firstRow + 1, 6).getValues().reverse().map(row => ({
    id: String(row[0] || ""),
    timestamp: row[1] instanceof Date ? row[1].toISOString() : String(row[1] || ""),
    user: String(row[2] || ""),
    action: String(row[3] || ""),
    entity: String(row[4] || ""),
    detail: String(row[5] || "")
  }));
}

function handleAdminAction_(data) {
  if (!relayAuthorized_(data)) return json_({ ok: false, error: "Unauthorized" });
  if (data.action === "bootstrap") return json_({ ok: true });

  const sh = sheet_();
  if (data.action === "admin_list") {
    const lastRow = sh.getLastRow();
    if (lastRow < 2) return json_({ ok: true, leads: [] });
    const values = sh.getRange(2, 1, lastRow - 1, 54).getValues();
    return json_({
      ok: true,
      leads: values.map((row, index) => leadPayload_(row, index + 2)).reverse()
    });
  }

  if (data.action === "retention_snapshot") {
    try {
      return json_(retentionSnapshot_());
    } catch (error) {
      return json_({ ok: false, error: "No se pudo leer la operación de retención." });
    }
  }

  if (data.action === "audit_list") {
    try {
      return json_({ ok: true, entries: auditList_() });
    } catch (error) {
      return json_({ ok: false, error: "No se pudo leer el historial." });
    }
  }

  if (data.action === "audit_append") {
    try {
      return json_({ ok: true, entry: auditAppend_(data) });
    } catch (error) {
      return json_({ ok: false, error: "No se pudo registrar la actividad." });
    }
  }

  if (data.action === "admin_update") {
    const rowNumber = Number(data.row);
    if (!Number.isInteger(rowNumber) || rowNumber < 2 || rowNumber > sh.getLastRow()) {
      return json_({ ok: false, error: "Lead inválido" });
    }

    const estados = ["Nuevo", "Contactado", "Cotizado", "Vendido", "Perdido"];
    const estado = String(data.estado || "").trim();
    const asesor = String(data.asesor || "").trim().slice(0, 80);
    const notas = String(data.notas || "").trim().slice(0, 1000);
    const proximoSeguimiento = followUpDate_(String(data.proximoSeguimiento || ""));
    if (estado && !estados.includes(estado)) return json_({ ok: false, error: "Estado inválido" });

    if (estado) sh.getRange(rowNumber, 47).setValue(estado);
    sh.getRange(rowNumber, 48).setValue(asesor);
    sh.getRange(rowNumber, 52).setValue(proximoSeguimiento || "");
    sh.getRange(rowNumber, 54).setValue(notas);
    if (estado === "Contactado") sh.getRange(rowNumber, 53).setValue(new Date());

    const updated = sh.getRange(rowNumber, 1, 1, 54).getValues()[0];
    return json_({ ok: true, lead: leadPayload_(updated, rowNumber) });
  }

  return json_({ ok: false, error: "Acción no válida" });
}

/*** GET de salud: nunca escribe ni revela datos. ***/
function doGet() {
  return ContentService.createTextOutput("OK").setMimeType(ContentService.MimeType.TEXT);
}

/*** PRODUCCIÓN: recibe el POST del formulario con varios vehículos ***/
function doPost(e) {
  let data = {};

  try {
    if (e && e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else {
      data = e && e.parameter ? e.parameter : {};
    }
  } catch (err) {
    data = e && e.parameter ? e.parameter : {};
  }

  if (!relayAuthorized_(data)) return json_({ ok: false, error: "Unauthorized" });
  if (data.action) return handleAdminAction_(data);

  const sh = sheet_();
  const ts = nowStamp_();

  try {
    const cantidadVehiculos = Math.min(5, parseInt(data.cantidadVehiculos || 0));
const vehiculos = [];

for (let i = 0; i < cantidadVehiculos; i++) {
  try {
    const raw = data[`vehiculo${i}`];
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    vehiculos.push(parsed);
  } catch (err) {
    vehiculos.push({});
  }
}
    let totalEstimado = parseFloat(data.totalEstimado || 0);

    const row = [
      ts,
      data.nombre || "",
      data.nacimiento || "",
      data.documento || "",
      data.direccion || "",
      data.email || "",
      data.telefono || "",
      cantidadVehiculos
    ];

    for (let i = 0; i < 5; i++) {
      if (i < cantidadVehiculos) {
        const v = vehiculos[i] || {};
        row.push(
          v.vin || "",
          v.year || "",
          v.make || "",
          v.model || "",
          v.bodyClass || "",
          parseFloat(v.estimated || 0)
        );
        
      } else {
        row.push("", "", "", "", "", "");
      }
    }

    row.push(
      totalEstimado,
      value_(data, "utmSource", "utm_source"),
      value_(data, "utmMedium", "utm_medium"),
      value_(data, "utmCampaign", "utm_campaign"),
      value_(data, "utmTerm", "utm_term"),
      value_(data, "utmContent", "utm_content"),
      data.gclid || "",
      data.referrer || "",
      value_(data, "estado", "estado") || "Nuevo",
      "", // Asesor: se asigna desde el panel operativo.
      value_(data, "fuente", "fuente") || "Sitio web",
      value_(data, "utmSource", "utm_source"),
      value_(data, "utmCampaign", "utm_campaign"),
      followUpDate_(value_(data, "proximoSeguimiento", "proximo_seguimiento")),
      "", // Último contacto: se actualiza cuando el asesor atiende el lead.
      ""  // Notas internas.
    );

    sh.appendRow(row);

    // El primer lead recibido deja instalado el recordatorio horario.
    try {
      ensureFollowUpTrigger_();
    } catch (err) {
      Logger.log("ERROR al configurar recordatorios: " + err);
    }

    // --- ENVÍO DE CORREO INTERNO ---
    try {
      const to = "coastinter23@gmail.com";
      let vehiculoInfo = vehiculos.map((v, i) => `\n\n🚗 Vehiculo ${i + 1}:
- VIN: ${v.vin || ""}
- Año: ${v.year || ""}
- Marca: ${v.make || ""}
- Modelo: ${v.model || ""}
- Carrocería: ${v.bodyClass || ""}
- Estimado: $${v.estimated || 0}`).join("");

      const body = `
🕓 Fecha: ${ts}
👤 Nombre: ${data.nombre || ""}
🎂 Fecha nacimiento: ${data.nacimiento || ""}
🔑 Documento: ${data.documento || ""}
🏠 Dirección: ${data.direccion || ""}
📧 Email: ${data.email || ""}
📱 Teléfono: ${data.telefono || ""}${vehiculoInfo}

💰 Total estimado con descuento: $${totalEstimado.toFixed(2)}
🎉 Descuento aplicado por cotizar online con Intercoast Insurance

🔗 Origen: utm_source=${data.utm_source || ""}, utm_medium=${data.utm_medium || ""}, utm_campaign=${data.utm_campaign || ""}
📈 gclid: ${data.gclid || ""}`;

      MailApp.sendEmail(to, `📥 Nueva cotización - ${data.nombre || ""}`, body);
    } catch (err) {
      Logger.log("ERROR correo interno: " + err);
    }

    // --- ENVÍO DE CORREO AL CLIENTE ---
    try {
      if (data.email && data.email.includes("@")) {

const vehiculoHtml = vehiculos.map((v, i) => `
  <div style="margin-bottom:12px;">
    <strong>🚗 Vehículo ${i + 1}</strong><br>
    <ul style="margin:4px 0 0 16px; padding-left:0;">
      <li><strong>VIN:</strong> ${v.vin || ""}</li>
      <li><strong>Año:</strong> ${v.year || ""}</li>
      <li><strong>Marca:</strong> ${v.make || ""}</li>
      <li><strong>Modelo:</strong> ${v.model || ""}</li>
      <li><strong>Carrocería:</strong> ${v.bodyClass || ""}</li>
    </ul>
  </div>
`).join("");

const htmlBody = `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:16px;border:1px solid #ddd;border-radius:8px;">
  <h2>🚗 ¡Gracias por tu solicitud de estimado!</h2>
  <p>Hola <strong>${data.nombre || "cliente"}</strong>,</p>
  <p>Hemos recibido tu información y nuestro equipo se pondrá en contacto contigo para brindarte una cotización personalizada.</p>

  <h3>💰 Estimado total mensual:</h3>
  <p style="font-size: 18px; color: #2E8B57;"><strong>$${totalEstimado.toFixed(2)} / mes</strong></p>
  <p style="background:#e8f5e9; padding:10px; border-left:5px solid #4caf50; border-radius:4px;">
  🎉 <strong>¡Descuento aplicado por hacer su cotización online con Intercoast Insurance!</strong>
  </p>


  <h3>📋 Detalles de tus vehículos:</h3>
  ${vehiculoHtml}
  <p style="background:#fff8e1;padding:10px;border-left:5px solid #ffc107;border-radius:4px;margin-top:16px;">
  💳 <strong>Puedes realizar tus pagos con tarjeta, efectivo o vía ZELLE.</strong>
  </p>

  <p style="margin-top:16px;"><em>📌 Este estimado es referencial. El precio final depende de otros factores como el conductor, cobertura, zona ZIP, etc.</em></p>
  <hr style="margin:24px 0;">

  <p>📞 ¿Tienes dudas? Contáctanos:</p>
  <ul>
    <li>Tel: <strong>+1 (562) 381-2012</strong></li>
    <li>Tel: <strong>+1 (424) 417-1700</strong></li>
    <li>WhatsApp: <strong>+1 (775) 675-4559</strong></li>
  </ul>

  <p>🏢 Oficinas:</p>
  <ul>
    <li>5863 Imperial Hwy, South Gate CA 90280</li>
    <li>920 N Long Beach Blvd I, Compton CA 90221</li>
  </ul>

  <p style="font-size:13px;color:#777;">Gracias por confiar en nosotros 🛡️</p>
</div>
`;
        MailApp.sendEmail({
          to: data.email,
          subject: "📄 Estimado de tu seguro de auto",
          htmlBody: htmlBody,
          name: "Equipo de Cotizaciones"
        });
      }
    } catch (err) {
      Logger.log("ERROR correo cliente: " + err);
    }

    return ContentService.createTextOutput("OK").setMimeType(ContentService.MimeType.TEXT);
  } catch (err) {
    Logger.log("ERROR appendRow: " + err);
    return ContentService.createTextOutput("ERROR: " + err).setMimeType(ContentService.MimeType.TEXT);
  }
}
