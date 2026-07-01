/** Metadata Midtrans disimpan di catatan_settlement (ringkas, max ~191 char). */



const MAX_MSG = 80;



export function encodeMidtransMeta({

  orderId,

  gatewayStatus = "pending",

  paymentType = null,

  statusMessage = null,

}) {

  const msg =

    statusMessage && typeof statusMessage === "string"

      ? statusMessage.slice(0, MAX_MSG)

      : null;



  return JSON.stringify({

    provider: "midtrans",

    order_id: orderId,

    gateway_status: gatewayStatus,

    ...(paymentType ? { payment_type: paymentType } : {}),

    ...(msg ? { status_message: msg } : {}),

  });

}



export function decodeMidtransMeta(catatan) {

  if (!catatan || typeof catatan !== "string") return null;

  try {

    const parsed = JSON.parse(catatan);

    if (parsed?.provider === "midtrans" && parsed?.order_id) {

      return parsed;

    }

  } catch {

    /* bukan JSON midtrans */

  }

  return null;

}



export function getOrderIdFromMeta(catatan) {

  return decodeMidtransMeta(catatan)?.order_id ?? null;

}

