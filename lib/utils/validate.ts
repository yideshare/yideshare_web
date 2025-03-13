const BASE_URL = process.env.NEXTAUTH_URL || "http://localhost:3000";
const CAS_VALIDATE_URL = "https://secure.its.yale.edu/cas/serviceValidate";

export async function validateCASTicket(
  ticket: string | null
): Promise<string | null> {
  // if no ticket found
  if (!ticket) {
    console.error("CAS Error: No ticket provided");
    return null;
  }

  // construct validation url
  const casValidateUrl = `${CAS_VALIDATE_URL}?service=${encodeURIComponent(
    `${BASE_URL}/api/auth/cas-validate`
  )}&ticket=${ticket}`;

  // validate ticket
  const response = await fetch(casValidateUrl);
  if (!response.ok) {
    console.error("CAS Error:", response.status, response.statusText);
    return null;
  }

  // extract id
  const text = await response.text();
  const match = text.match(/<cas:user>(.*?)<\/cas:user>/);
  return match ? match[1] : null;
}

export async function validateRequestPayload(req: Request) {
  try {
    const body = await req.json();
    // check that request includes rideId field
    if (!body.rideId) throw new Error("Missing rideId");
    return { rideId: body.rideId };
  } catch (error) {
    return { error: `Request Error: ${error}`, status: 400 };
  }
}
