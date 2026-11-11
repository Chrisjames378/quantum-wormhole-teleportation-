import React, { useCallback, useEffect, useState } from 'react';
import {
  Activity, Archive, ArrowDownToLine, Cloud, Database, Fingerprint,
  GitBranch, HardDrive, LockKeyhole, RefreshCw, ShieldCheck, Workflow
} from 'lucide-react';

type ConnectorStatus = {
  configured: boolean;
  reachable?: boolean | null;
  message: string;
  checkedAt?: string | null;
};

type StatusPayload = {
  cloudVault: ConnectorStatus;
  everpure: ConnectorStatus;
  policyEngine: { mode: string; message: string };
  checkedAt: string;
};

const statusClass = (ok: boolean | null | undefined) =>
  ok === true
    ? 'text-emerald-300 border-emerald-500/30 bg-emerald-950/30'
    : ok === false
      ? 'text-amber-300 border-amber-500/30 bg-amber-950/30'
      : 'text-slate-300 border-slate-700 bg-slate-900/60';

const StatusPill: React.FC<{ ok?: boolean | null; children: React.ReactNode }> = ({ ok, children }) => (
  <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-mono ${statusClass(ok)}`}>
    {children}
  </span>
);

export const DataCloudTab: React.FC = () => {
  const [status, setStatus] = useState<StatusPayload | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/data-cloud/status', { headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error(`Status request failed (${response.status})`);
      setStatus(await response.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load integration status');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  const exportArchitecture = () => {
    const manifest = {
      schemaVersion: 1,
      exportedAt: new Date().toISOString(),
      architecture: 'Quantum Wormhole Playground + Cloud Vault + optional Everpure Enterprise Data Cloud',
      principles: [
        'Keep existing Cloud Vault as the default storage integration',
        'Treat Everpure as an optional provider adapter; do not assume a generic API',
        'Classify research data and attach provenance metadata',
        'Require verified backups and tested recovery before marking protected',
        'Never export credentials or tokens'
      ],
      dataClasses: ['simulation-results', 'wormhole-snapshots', 'circuit-definitions', 'research-reports', 'audit-events'],
      policies: [
        { name: 'Research results', classification: 'Internal research', retention: 'User-defined', encryption: 'At rest and in transit' },
        { name: '3D snapshots', classification: 'Research artifact', retention: 'User-defined', encryption: 'At rest and in transit' },
        { name: 'Credentials', classification: 'Secret', retention: 'Never in exports', encryption: 'Secret manager only' }
      ],
      integrations: {
        cloudVault: status?.cloudVault ?? { configured: false, message: 'Not checked' },
        everpure: status?.everpure ?? { configured: false, message: 'Not checked' }
      }
    };
    const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'quantum-data-cloud-architecture.json';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/40 via-slate-950 to-cyan-950/20 p-5 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <div className="mb-2 flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-cyan-300">
              <Cloud className="h-4 w-4" /> Unified data control plane
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">Enterprise Data Cloud</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              A provider-neutral data layer for simulation artifacts, experiment history, research datasets and recovery.
              Cloud Vault remains the default. Everpure is an optional enterprise adapter that activates only when its
              supported API and access details are supplied.
            </p>
          </div>
          <button onClick={() => void refresh()} disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800 disabled:opacity-50">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Check connections
          </button>
        </div>
        {error && <p role="alert" className="mt-4 rounded-lg border border-amber-500/30 bg-amber-950/30 p-3 text-xs text-amber-200">{error}</p>}
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-white"><HardDrive className="h-4 w-4 text-indigo-300" /> Cloud Vault</div>
            <StatusPill ok={status?.cloudVault.reachable}>{status?.cloudVault.reachable ? 'Reachable' : status?.cloudVault.configured ? 'Configured / unverified' : 'Not configured'}</StatusPill>
          </div>
          <p className="mt-3 text-xs leading-5 text-slate-400">{status?.cloudVault.message ?? 'Checking server-side configuration…'}</p>
          <div className="mt-4 flex items-center gap-2 text-[11px] text-slate-500"><Database className="h-3.5 w-3.5" /> Experiment files · snapshots · reports</div>
        </article>
        <article className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-white"><Cloud className="h-4 w-4 text-cyan-300" /> Everpure EDC</div>
            <StatusPill ok={status?.everpure.configured}>{status?.everpure.configured ? 'Credentials present' : 'Optional / not configured'}</StatusPill>
          </div>
          <p className="mt-3 text-xs leading-5 text-slate-400">{status?.everpure.message ?? 'Checking server-side configuration…'}</p>
          <div className="mt-4 flex items-center gap-2 text-[11px] text-slate-500"><Workflow className="h-3.5 w-3.5" /> Hybrid data services · policy · discovery</div>
        </article>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[
          { icon: Fingerprint, title: 'Data intelligence', body: 'Attach stable IDs, experiment parameters, source version, timestamps and provenance to each artifact.' },
          { icon: ShieldCheck, title: 'Policy and governance', body: 'Define classification, retention, encryption and placement requirements independently of the storage vendor.' },
          { icon: Archive, title: 'Resilience and recovery', body: 'Track backup evidence, recovery points and restore-test outcomes. Never label a backup immutable unless the provider confirms it.' },
          { icon: GitBranch, title: 'Lineage and versions', body: 'Connect each report to its simulation run, circuit definition, source revision and dataset inputs.' },
          { icon: Activity, title: 'Health and observability', body: 'Show connection checks, last successful sync, storage availability and actionable warnings.' },
          { icon: LockKeyhole, title: 'Secret isolation', body: 'Keep provider tokens server-side. The browser receives configuration status only, never credentials.' }
        ].map(({ icon: Icon, title, body }) => (
          <article key={title} className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
            <Icon className="h-5 w-5 text-indigo-300" />
            <h3 className="mt-3 text-sm font-semibold text-slate-100">{title}</h3>
            <p className="mt-1.5 text-xs leading-5 text-slate-400">{body}</p>
          </article>
        ))}
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-white">Research data catalogue</h3>
            <p className="mt-1 text-xs text-slate-400">Suggested classes for consistent metadata and lifecycle policies.</p>
          </div>
          <button onClick={exportArchitecture} className="inline-flex items-center gap-2 rounded-lg border border-indigo-500/30 bg-indigo-950/40 px-3 py-2 text-xs text-indigo-200 hover:bg-indigo-900/50">
            <ArrowDownToLine className="h-4 w-4" /> Export architecture
          </button>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ['Simulation results', 'Parameters · fidelity · noise · trial ID'],
            ['3D wormhole snapshots', 'PNG · render settings · capture time'],
            ['Circuit definitions', 'OpenQASM · qubit count · circuit version'],
            ['Research reports', 'PDF · citations · source dataset IDs'],
            ['Benchmark datasets', 'Runtime · depth · scrambler · sample size'],
            ['Audit events', 'Actor · action · timestamp · outcome']
          ].map(([name, detail]) => (
            <div key={name} className="rounded-lg border border-slate-800 bg-[#090d16] p-3">
              <div className="text-xs font-medium text-slate-200">{name}</div>
              <div className="mt-1 text-[11px] text-slate-500">{detail}</div>
            </div>
          ))}
        </div>
        <p className="mt-4 flex items-start gap-2 text-[11px] leading-5 text-slate-500">
          <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
          Export contains architecture metadata only. It does not contain research files, user data, API keys or provider secrets.
        </p>
      </section>

      <p className="text-[11px] leading-5 text-slate-500">
        Integration status is diagnostic only. A live Everpure connection requires the applicable Everpure product/API,
        endpoint, authorization and permissions; this page does not imply that an Everpure account or service is provisioned.
      </p>
    </div>
  );
};
