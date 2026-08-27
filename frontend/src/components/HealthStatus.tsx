import React, { useEffect, useState } from 'react';
import { apiClient } from '../lib/api';

interface HealthResponse {
  status: string;
  supabase: string;
  timestamp?: string;
}

export default function HealthStatus() {
  const [data, setData] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkHealth() {
      try {
        setLoading(true);
        const res = await apiClient.get<HealthResponse>('/health');
        setData(res.data);
        setError(null);
      } catch (err: any) {
        setError(err?.message || 'Failed to connect to backend server');
      } finally {
        setLoading(false);
      }
    }
    checkHealth();
  }, []);

  if (loading) {
    return (
      <div className="p-4 rounded-architectural bg-white border border-neutral-concrete shadow-warm text-center">
        <span className="animate-pulse text-neutral-500 font-medium">Checking System Health...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-architectural bg-red-50 border border-red-200 text-red-700 text-sm space-y-1">
        <p className="font-semibold">Health Check Failed</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-5 rounded-architectural bg-white border border-neutral-concrete shadow-warm space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">Backend Status</span>
        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
          {data?.status}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">Supabase DB</span>
        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
          {data?.supabase}
        </span>
      </div>
    </div>
  );
}
