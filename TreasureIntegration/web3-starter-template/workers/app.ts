import { createRequestHandler, type ServerBuild } from 'react-router';

declare module 'react-router' {
  export interface AppLoadContext {
    cloudflare: {
      env: Env;
      ctx: ExecutionContext;
      cf: IncomingRequestCfProperties | undefined;
    };
  }
}

// Cloudflare Access service token validation
const ALLOWED_CLIENT_IDS = [
  'Ov23liQInz81slG8kxFL', // bridgeworld.lol Access Client ID
];

function verifyCloudflareAccess(request: Request): boolean {
  const clientId = request.headers.get('CF-Access-Client-Id');
  const clientSecret = request.headers.get('CF-Access-Client-Secret');
  
  // Allow if valid service token
  if (clientId && ALLOWED_CLIENT_IDS.includes(clientId) && clientSecret) {
    return true;
  }
  
  // Allow if CF-Access-Authenticated-User-Email is set (logged in via Access)
  const authenticatedEmail = request.headers.get('CF-Access-Authenticated-User-Email');
  if (authenticatedEmail) {
    return true;
  }
  
  // For development, allow all
  if (import.meta.env.MODE === 'development') {
    return true;
  }
  
  return false;
}

const requestHandler = createRequestHandler(
  () => import('virtual:react-router/server-build') as Promise<ServerBuild>,
  import.meta.env.MODE,
);

export default {
  async fetch(request, env, ctx) {
    // Verify Cloudflare Access (can be bypassed in development)
    const isAuthorized = verifyCloudflareAccess(request);
    
    if (!isAuthorized && env.PUBLIC_ENVIRONMENT === 'production') {
      return new Response('Access Denied - Invalid Cloudflare Access credentials', {
        status: 403,
        headers: { 'Content-Type': 'text/plain' },
      });
    }
    
    return requestHandler(request, {
      cloudflare: { env, ctx, cf: request.cf },
    });
  },
} satisfies ExportedHandler<Env>;
