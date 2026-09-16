import { readMailConfiguration, sendAcknowledgementEmail, sendInquiryEmail } from "@/lib/inquiries/mail";
import { type InquiryResponse, validateInquiry } from "@/lib/inquiries/schema";

const json = (body: InquiryResponse, status: number) => Response.json(body, { status });

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return json({ ok: false, code: "invalid", message: "The submission could not be read." }, 400);
  }

  const validation = validateInquiry(payload);
  if (!validation.success) {
    if (validation.kind === "blocked") {
      return json({ ok: false, code: "blocked", message: "The submission could not be accepted." }, 400);
    }
    return json({
      ok: false,
      code: "invalid",
      message: "Please check the highlighted fields.",
      fieldErrors: validation.fieldErrors,
    }, 400);
  }

  const configuration = readMailConfiguration();
  if (!configuration) {
    return json({
      ok: false,
      code: "unconfigured",
      message: "Email delivery is not configured yet. Please use the direct email link.",
    }, 503);
  }

  const requestId = crypto.randomUUID();
  try {
    const delivery = await sendInquiryEmail(validation.data, configuration);
    if (!delivery.ok) {
      console.error("Inquiry delivery failed", { requestId, providerStatus: delivery.status });
      return json({ ok: false, code: "delivery_failed", message: "The message could not be delivered. Please use the direct email link." }, 502);
    }

    const acknowledgement = await sendAcknowledgementEmail(validation.data, configuration);
    if (!acknowledgement.ok) {
      console.error("Inquiry acknowledgement failed", { requestId, providerStatus: acknowledgement.status });
    }
  } catch {
    console.error("Inquiry delivery failed", { requestId });
    return json({ ok: false, code: "delivery_failed", message: "The message could not be delivered. Please use the direct email link." }, 502);
  }

  return json({ ok: true, code: "sent", message: "Your note is on its way." }, 200);
}
