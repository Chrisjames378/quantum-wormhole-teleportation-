import type { IncomingMessage, ServerResponse } from 'node:http';

type ApiRequest = IncomingMessage & { method?: string };

export default async function handler(req: ApiRequest, res: ServerResponse) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'GET') {
    res.statusCode = 405;
    res.setHeader('Allow', 'GET');
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  const cloudVaultRaw = process.env.CLOUD_VAULT_URL?.trim();
  const cloudVaultUrl = cloudVaultRaw?.endsWith('/') ? cloudVaultRaw.slice(0, -1) : cloudVaultRaw;
  const cloudVaultToken = process.env.CLOUD_VAULT_APP_TOKEN;
  const everpureUrl = process.env.EVERPURE_API_BASE_URL?.trim();
  const everpureToken = process.env.EVERPURE_API_TOKEN;

  const cloudVault: {
    configured: boolean;
    reachable: boolean | null;
    message: string;
    checkedAt: string | null;
  } = {
    configured: Boolean(cloudVaultUrl),
    reachable: null,
    message: cloudVaultUrl
      ? 'Endpoint configured; checking /api/health.'
      : 'Set CLOUD_VAULT_URL to enable the optional Cloud Vault health probe.',
    checkedAt: null
  };

  if (cloudVaultUrl) {
    cloudVault.checkedAt = new Date().toISOString();
    try {
      const response = await fetch(`${cloudVaultUrl}/api/health`, {
        method: 'GET',
        headers: cloudVaultToken ? { Authorization: `Bearer ${cloudVaultToken}` } : {},
        signal: AbortSignal.timeout(5000)
      });
      cloudVault.reachable = response.ok;
      cloudVault.message = response.ok
        ? 'Cloud Vault health endpoint responded successfully.'
        : `Cloud Vault health endpoint returned HTTP ${response.status}.`;
    } catch {
      cloudVault.reachable = false;
      cloudVault.message = 'Cloud Vault health probe failed. Check the endpoint, network access and server logs.';
    }
  }

  const everpureConfigured = Boolean(everpureUrl && everpureToken);
  res.statusCode = 200;
  res.end(JSON.stringify({
    cloudVault,
    everpure: {
      configured: everpureConfigured,
      reachable: null,
      message: everpureConfigured
        ? 'Endpoint and token are present. Live API compatibility is not verified; confirm the supported Everpure product API and permissions before enabling operations.'
        : 'Optional adapter not configured. Confirm the exact Everpure product/API and access method before adding credentials.'
    },
    policyEngine: {
      mode: 'metadata-only-preview',
      message: 'Policy catalogue is a design layer; no storage movement, retention change or deletion is performed.'
    },
    checkedAt: new Date().toISOString()
  }));
}
