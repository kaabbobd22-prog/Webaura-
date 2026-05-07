import { useEffect, useState } from 'react';
import api from '../../lib/api';
import Button from '../../components/Button';

const statuses = ['New', 'Replied', 'Quoted', 'Won', 'Lost'];

export default function AdminCustomRequestsPage() {
  const [requests, setRequests] = useState([]);

  const load = () => api.get('/custom-requests').then((res) => setRequests(res.data.requests || []));
  useEffect(() => { load(); }, []);

  return (
    <div className="card-shell p-6">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">Custom requests</p>
        <h1 className="mt-3 text-4xl font-bold text-white">Lead inbox for bespoke projects</h1>
      </div>
      <div className="space-y-4">
        {requests.map((request) => (
          <div key={request._id} className="rounded-3xl border border-white/10 bg-slate-950/40 p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-white">{request.name}</h2>
                <p className="mt-1 text-slate-400">{request.email} {request.phone ? `• ${request.phone}` : ''}</p>
                <p className="mt-3 text-sm text-slate-300"><strong className="text-white">Type:</strong> {request.type} • <strong className="text-white">Budget:</strong> {request.budget} • <strong className="text-white">Timeline:</strong> {request.timeline}</p>
                <p className="mt-4 text-slate-300">{request.description}</p>
                {request.referenceLinks && <p className="mt-3 text-sm text-cyan-300">References: {request.referenceLinks}</p>}
              </div>
              <div className="flex flex-col gap-3 md:min-w-52">
                <select className="field" value={request.status} onChange={async (e) => { await api.patch(`/custom-requests/${request._id}`, { status: e.target.value }); load(); }}>
                  {statuses.map((status) => <option key={status}>{status}</option>)}
                </select>
                <a href={`mailto:${request.email}?subject=Re:%20Your%20website%20request`}>
                  <Button className="w-full">Reply via Email</Button>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
