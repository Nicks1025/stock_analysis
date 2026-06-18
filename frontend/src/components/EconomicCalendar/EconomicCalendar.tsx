import React, { useEffect, useState } from 'react';
import calendarService from '../../services/calendarService';
import { ShieldCheck, Compass, Info, ArrowUpRight, ArrowDownRight, RefreshCw, Layers } from 'lucide-react';
import { useSnackbar } from '../../components/common/SnackbarProvider';

interface CalendarEvent {
  id: string;
  name: string;
  country: string;
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  actual?: number | string;
  forecast?: number | string;
  previous?: number | string;
  releaseDate: string;
}

export function EconomicCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [impactFilter, setImpactFilter] = useState<'ALL' | 'HIGH' | 'MEDIUM'>('ALL');
  const { enqueueSnackbar } = useSnackbar();

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await calendarService.getEvents();
      const rawData = res?.data || res;
      if (Array.isArray(rawData)) {
        setEvents(rawData);
      } else {
        setEvents([]);
      }
    } catch (err) {
      console.error(err);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const filteredEvents = events.filter(e => impactFilter === 'ALL' || e.impact === impactFilter);

  return (
    <div className="space-y-6 max-w-7xl mx-auto select-none">
      {/* Title block */}
      <div>
        <div className="text-[10px] uppercase tracking-[0.25em] font-black text-cyan-400 font-mono">Macroeconomic indices releases</div>
        <h2 className="text-2xl font-black text-white tracking-wide uppercase neon-text-cyan mt-0.5" style={{ color: 'var(--brand-cyan)' }}>
          Economic Calendar
        </h2>
        <p className="text-xs text-white/50 font-mono">Observe upcoming GDP parameters, RBI interest rate decisions, and services PMI benchmarks</p>
      </div>

      {/* Control bar */}
      <div className="flex justify-between items-center bg-black/40 p-4 rounded border border-white/5 text-xs font-mono">
        <span className="text-white/40 uppercase text-[10px]">Filter macro impacts:</span>
        <div className="flex gap-2">
          {(['ALL', 'HIGH', 'MEDIUM'] as const).map(imp => (
            <button
              key={imp}
              onClick={() => setImpactFilter(imp)}
              className={`px-3 py-1 text-[10px] uppercase font-mono rounded cursor-pointer transition-all border ${
                impactFilter === imp 
                  ? 'bg-cyan-500/10 border-cyan-400 text-cyan-400 font-bold' 
                  : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10'
              }`}
            >
              {imp} IMPACT
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Layout */}
      <div className="space-y-4 font-mono text-xs">
        {loading ? (
          <div className="text-center py-12 text-white/30 animate-pulse">Running macro indexes calendar polling...</div>
        ) : filteredEvents.length > 0 ? (
          filteredEvents.map((evt) => (
            <div key={evt.id} className="glass-panel p-4 rounded border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-black/40 hover:border-cyan-500/15 transition-all">
              
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded shrink-0 border uppercase text-[9px] font-black tracking-wider text-center w-16 ${
                  evt.impact === 'HIGH' 
                    ? 'bg-red-500/15 text-red-400 border-red-500/25' 
                    : evt.impact === 'MEDIUM' 
                      ? 'bg-amber-500/15 text-amber-500 border-amber-500/25' 
                      : 'bg-white/5 border-white/5 text-white/40'
                }`}>
                  {evt.impact}
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-sm">{evt.name}</h3>
                  <span className="text-[10px] text-white/40 uppercase">ZONE: {evt.country} // {evt.releaseDate}</span>
                </div>
              </div>

              {/* Stats values */}
              <div className="grid grid-cols-3 gap-6 text-[10px] text-white/55 border-l border-white/5 pl-4 w-full md:w-auto">
                <div>
                  <span className="block text-white/30 uppercase">ACTUAL</span>
                  <span className="block text-white font-extrabold mt-0.5">{evt.actual || 'PENDING'}</span>
                </div>
                <div>
                  <span className="block text-white/30 uppercase">FORECAST</span>
                  <span className="block text-white font-bold mt-0.5">{evt.forecast || '—'}</span>
                </div>
                <div>
                  <span className="block text-white/30 uppercase">PREVIOUS</span>
                  <span className="block text-white/70 mt-0.5">{evt.previous || '—'}</span>
                </div>
              </div>

            </div>
          ))
        ) : (
          <div className="text-center py-12 text-white/30 border border-white/5 rounded p-6 bg-black/25">No upcoming economic indicator coordinates registered.</div>
        )}
      </div>
    </div>
  );
}

export default EconomicCalendar;
