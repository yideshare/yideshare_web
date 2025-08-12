import logger from "./logger";

// Always use the main domain, not the deployment-specific URL
const BASE_URL = process.env.NEXTAUTH_URL || "https://yideshare-1mw1.vercel.app";
const CAS_VALIDATE_URL = "https://secure.its.yale.edu/cas/serviceValidate";

/**
 * Validate CAS ticket using the same approach as YCrush (passport-cas2)
 * This mimics the behavior of passport-cas2 without requiring Express middleware
 */
export async function validateCASTicket(ticket: string | null): Promise<string | null> {
  if (!ticket) {
    logger.error("CAS Error: No ticket provided");
    return null;
  }

  // Construct the service URL exactly like YCrush does
  const serviceURL = `${BASE_URL}/api/auth/cas-validate`;
  
  // Construct validation URL
  const casValidateUrl = `${CAS_VALIDATE_URL}?service=${encodeURIComponent(serviceURL)}&ticket=${ticket}`;

  logger.info("CAS Validation - Service URL:", serviceURL);
  logger.info("CAS Validation - Full URL:", casValidateUrl);

  try {
    // Make the validation request
    const response = await fetch(casValidateUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/xml, text/xml, */*',
        'User-Agent': 'Yideshare-CAS-Client/1.0'
      }
    });

    logger.info("CAS Validation - Response status:", response.status);
    logger.info("CAS Validation - Response status text:", response.statusText);

    if (!response.ok) {
      logger.error("CAS Error:", response.status, response.statusText);
      const responseText = await response.text();
      logger.error("CAS Error - Response body:", responseText);
      return null;
    }

    // Parse the XML response
    const responseText = await response.text();
    logger.info("CAS Validation - Response body length:", responseText.length);

    // Check for authentication success
    if (responseText.includes('<cas:authenticationSuccess>')) {
      // Extract netId from successful response
      const match = responseText.match(/<cas:user>(.*?)<\/cas:user>/);
      if (match) {
        logger.info("CAS Validation - Successfully extracted netId:", match[1]);
        return match[1];
      } else {
        logger.error("CAS Validation - No netId found in successful response");
        logger.error("CAS Validation - Response body:", responseText);
        return null;
      }
    } else if (responseText.includes('<cas:authenticationFailure>')) {
      // Extract error message from failure response
      const errorMatch = responseText.match(/<cas:authenticationFailure[^>]*>(.*?)<\/cas:authenticationFailure>/);
      const errorMessage = errorMatch ? errorMatch[1] : 'Unknown authentication failure';
      logger.error("CAS Authentication Failed:", errorMessage);
      logger.error("CAS Validation - Response body:", responseText);
      return null;
    } else {
      logger.error("CAS Validation - Unexpected response format");
      logger.error("CAS Validation - Response body:", responseText);
      return null;
    }
  } catch (error) {
    logger.error("CAS Validation - Network error:", error);
    return null;
  }
}
