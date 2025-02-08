import { NextRequest, NextResponse } from 'next/server';
import fetch from 'node-fetch';
import { parseStringPromise } from 'xml2js';

const CAS_BASE_URL = 'https://secure.its.yale.edu/cas';
const SERVICE_URL = process.env.SERVICE_URL || 'http://localhost:3000/api/auth';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const ticket = searchParams.get('ticket');

  if (!ticket) {
    // renew=true is used to force CAS to re-authenticate the user
    const loginUrl = `${CAS_BASE_URL}/login?service=${encodeURIComponent(SERVICE_URL)}&renew=true`;
    return NextResponse.redirect(loginUrl);
  }

  try {
    const validateUrl = `${CAS_BASE_URL}/serviceValidate?ticket=${encodeURIComponent(
      ticket
    )}&service=${encodeURIComponent(SERVICE_URL)}`;

    const casResponse = await fetch(validateUrl);
    const xml = await casResponse.text();

    const result = await parseStringPromise(xml, { explicitArray: false });

    const serviceResponse = result['cas:serviceResponse'];
    if (
      serviceResponse &&
      serviceResponse['cas:authenticationSuccess'] &&
      serviceResponse['cas:authenticationSuccess']['cas:user']
    ) {
      const netId = serviceResponse['cas:authenticationSuccess']['cas:user'];
      return NextResponse.json({ netId });
    } else {
      return new NextResponse('CAS authentication failed', { status: 401 });
    }
  } catch (error) {
    console.error('CAS authentication error:', error);
    return new NextResponse('Internal Server Error during CAS authentication', { status: 500 });
  }
}