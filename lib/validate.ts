import logger from "./logger";

const BASE_URL = process.env.NEXTAUTH_URL || "http://localhost:3000";
const CAS_VALIDATE_URL = "https://secure.its.yale.edu/cas/serviceValidate";

export async function extractNetIdFromCASTicket(ticket: string | null) {
  // if no ticket found
  if (!ticket) {
    logger.error("CAS Error: No ticket provided");
    return null;
  }

  // construct validation url
  const serviceUrl = `${BASE_URL}/api/auth/cas-validate`;
  const casValidateUrl = `${CAS_VALIDATE_URL}?service=${encodeURIComponent(serviceUrl)}&ticket=${ticket}`;

  logger.info("CAS Validation - Service URL:", serviceUrl);
  logger.info("CAS Validation - Full URL:", casValidateUrl);

  // validate ticket
  const response = await fetch(casValidateUrl);
  logger.info("CAS Validation - Response status:", response.status);
  logger.info("CAS Validation - Response status text:", response.statusText);

  if (!response.ok) {
    logger.error("CAS Error:", response.status, response.statusText);
    const responseText = await response.text();
    logger.error("CAS Error - Response body:", responseText);
    return null;
  }

  // extract id
  const text = await response.text();
  logger.info("CAS Validation - Response body length:", text.length);
  
  const match = text.match(/<cas:user>(.*?)<\/cas:user>/);
  if (match) {
    logger.info("CAS Validation - Successfully extracted netId:", match[1]);
    return match[1];
  } else {
    logger.error("CAS Validation - No netId found in response");
    logger.error("CAS Validation - Response body:", text);
    return null;
  }
}

export async function extractRideIdFromPayload(req: Request) {
  const body = await req.json();
  return body.rideId ? body.rideId : null;
}
