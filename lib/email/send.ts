const RESEND_API_KEY = process.env.RESEND_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM ?? "Inverza <onboarding@resend.dev>";

interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
}

/**
 * Envía un correo vía la API de Resend (sin SDK — un solo fetch).
 * Si no hay RESEND_API_KEY configurada (ej. en desarrollo local sin cuenta
 * de Resend todavía), lo imprime en consola en vez de fallar — así el flujo
 * completo (pedir reset, tomar el link, resetear) se puede probar sin
 * depender de un proveedor de correo real.
 */
export async function sendEmail({ to, subject, html }: SendEmailInput) {
  if (!RESEND_API_KEY) {
    console.log(
      `\n[email:dev] No hay RESEND_API_KEY configurada — mostrando el correo en consola.\nPara: ${to}\nAsunto: ${subject}\n${html}\n`
    );
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: EMAIL_FROM, to, subject, html }),
  });

  if (!res.ok) {
    console.error("Error enviando correo con Resend:", await res.text());
  }
}
