import logger from "./logger";

// Always use the main domain, not the deployment-specific URL
const BASE_URL =
  process.env.NEXTAUTH_URL || "https://yideshare-1mw1.vercel.app";
const CAS_VALIDATE_URL = "https://secure.its.yale.edu/cas/serviceValidate";

/**
 * Validate CAS ticket using the same approach as YCrush (passport-cas2)
 * This mimics the behavior of passport-cas2 without requiring Express middleware
 */
export async function validateCASTicket(
  ticket: string,
  serviceUrl: string
): Promise<string | null> {
  const validateUrl = `https://secure.its.yale.edu/cas/serviceValidate?ticket=${encodeURIComponent(
    ticket
  )}&service=${encodeURIComponent(serviceUrl)}`;

  const res = await fetch(validateUrl, { cache: "no-store" });
  if (!res.ok) return null;

  const text = await res.text();
  logger.info("CAS Validation - Response body length:", text.length);

  // Check for authentication success
  if (text.includes("<cas:authenticationSuccess>")) {
    // Extract netId from successful response
    const match = text.match(/<cas:user>(.*?)<\/cas:user>/);
    if (match) {
      logger.info("CAS Validation - Successfully extracted netId:", match[1]);
      return match[1];
    } else {
      logger.error("CAS Validation - No netId found in successful response");
      logger.error("CAS Validation - Response body:", text);
      return null;
    }
  } else if (text.includes("<cas:authenticationFailure>")) {
    // Extract error message from failure response
    const errorMatch = text.match(
      /<cas:authenticationFailure[^>]*>(.*?)<\/cas:authenticationFailure>/
    );
    const errorMessage = errorMatch
      ? errorMatch[1]
      : "Unknown authentication failure";
    logger.error("CAS Authentication Failed:", errorMessage);
    logger.error("CAS Validation - Response body:", text);
    return null;
  } else {
    logger.error("CAS Validation - Unexpected response format");
    logger.error("CAS Validation - Response body:", text);
    return null;
  }
}
