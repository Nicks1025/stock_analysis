import React, { useState, useRef, useEffect } from 'react';
import { Activity, TrendingUp, TrendingDown, Eye, Calendar, Target } from 'lucide-react';

interface StockChartProps {
  symbol: string;
  price: number;
  changePercent: number;
}

type Timeframe = '1D' | '5D' | '1M' | '6M' | '1Y';

export function StockChart({ symbol, price, changePercent }: StockChartProps) {
  const [timeframe, setTimeframe] = useState<Timeframe>('1M');
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [chartWidth, setChartWidth] = useState(600);
  const chartHeight = 160;

  // Track dynamic resize for SVG scaling
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setChartWidth(Math.max(entry.contentRect.width - 24, 200));
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Generate deterministic mock price & volume histories based on symbol + timeframe
  const generateChartData = () => {
    const pointsCount = timeframe === '1D' ? 24 : timeframe === '5D' ? 40 : timeframe === '1M' ? 30 : timeframe === '6M' ? 50 : 80;
    const isUp = changePercent >= 0;
    const seed = symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const data: Array<{ date: string; value: number; volume: number }> = [];
    
    let currentVal = price * (1 - (changePercent / 100)); // Start price
    const step = (price - currentVal) / pointsCount;
    
    for (let i = 0; i < pointsCount; i++) {
      const ratio = i / pointsCount;
      // Introduce sine noise & random walk
      const noiseScalar = price * (timeframe === '1D' ? 0.005 : timeframe === '5D' ? 0.01 : timeframe === '1M' ? 0.025 : 0.06);
      const sineWave = Math.sin((i / pointsCount) * Math.PI * 4.5 + seed) * noiseScalar * 0.4;
      const randomWalk = (Math.sin(i * 1337) * noiseScalar * 0.3);
      
      const val = currentVal + (step * i) + sineWave + randomWalk;
      const volSeed = Math.abs(Math.sin(i * 2 + seed));
      const vol = Math.floor(volSeed * 120000 + (val * 10));

      const dateLabel = getLabelForIndex(i, pointsCount, timeframe);
      data.push({ date: dateLabel, value: Number(val.toFixed(2)), volume: vol });
    }
    
    // Lock final node precisely to latest price
    if (data.length > 0) {
      data[data.length - 1].value = price;
    }
    return data;
  };

  const getLabelForIndex = (index: number, total: number, tf: Timeframe) => {
    if (tf === '1D') return `${String(Math.floor(9 + (index * 6.5 / total))).padStart(2, '0')}:${String((index * 15) % 60).padStart(2, '0')}`;
    if (tf === '5D') return `Day ${Math.floor(index / 8) + 1} H${index % 8 + 1}`;
    if (tf === '1M') return `Jun ${Math.floor(index * 26 / total) + 1}`;
    if (tf === '6M') return `Month ${Math.floor(index * 6 / total) + 1}`;
    return `Month ${Math.floor(index * 12 / total) + 1}`;
  };

  const chartData = generateChartData();
  const minPrice = Math.min(...chartData.map((d) => d.value)) * 0.995;
  const maxPrice = Math.max(...chartData.map((d) => d.value)) * 1.005;
  const priceRange = maxPrice - minPrice;

  // Map data coordinates to SVG pixel ranges
  const points = chartData.map((d, index) => {
    const x = (index / (chartData.length - 1)) * chartWidth;
    const y = chartHeight - ((d.value - minPrice) / priceRange) * chartHeight;
    return { x, y, data: d };
  });

  const svgLinePath = points.map((p) => `${p.x},${p.y}`).join(' L ');
  const svgAreaPath = `${svgLinePath} L ${chartWidth},${chartHeight} L 0,${chartHeight} Z`;

  // Determine indicator coloring
  const strokeColor = changePercent >= 0 ? '#10b981' : '#f87171';
  const fillColor = changePercent >= 0 ? 'rgba(16, 185, 129, 0.06)' : 'rgba(248, 113, 113, 0.06)';

  return (
    <div className="glass-panel p-4 rounded border border-white/5 space-y-4 bg-black/40 font-mono text-xs" ref={containerRef} id={`stock-chart-${symbol}`}>
      {/* Chart controls toolbar */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <div className="space-y-0.5">
          <span className="text-[10px] text-white/40 uppercase tracking-widest font-black block">INTERACTIVE ANALYTICAL CANVASES</span>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-black text-white">{symbol.toUpperCase()} Ticker History</span>
            <span className={`text-[10px] font-bold ${changePercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              ({changePercent >= 0 ? '▲ +' : '▼'}{changePercent.toFixed(2)}% Over selected zoom)
            </span>
          </div>
        </div>

        {/* Zoom toggles */}
        <div className="flex bg-white/5 p-0.5 rounded border border-white/5 self-start sm:self-auto">
          {(['1D', '5D', '1M', '6M', '1Y'] as Timeframe[]).map((tf) => (
            <button
              key={tf}
              onClick={() => { setTimeframe(tf); setHoverIndex(null); }}
              className={`px-3 py-1 rounded text-[10px] font-bold cursor-pointer uppercase transition-all ${
                timeframe === tf
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-400/25 shadow-[0_0_8px_rgba(0,242,255,0.05)]'
                  : 'text-white/40 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="relative border border-white/5 rounded bg-black/60 p-1 overflow-hidden" style={{ height: `${chartHeight + 20}px` }}>
        
        {/* Horizontal grid markings */}
        {[0.25, 0.5, 0.75].map((ratio, idx) => {
          const gridVal = maxPrice - (ratio * priceRange);
          return (
            <div 
              key={idx} 
              className="absolute left-0 w-full border-t border-dashed border-white/5 pointer-events-none"
              style={{ top: `${ratio * chartHeight}px` }}
            >
              <span className="absolute right-2 -top-2 text-[7px] text-white/15 bg-black/30 px-1 font-mono">
                ₹{gridVal.toLocaleString('en-IN', { maximumFractionDigits: 1 })}
              </span>
            </div>
          );
        })}

        {/* SVG Drawing Canvas with crosshair handlers */}
        <svg 
          width="100%" 
          height={chartHeight}
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          preserveAspectRatio="none"
          className="overflow-visible"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const index = Math.round((mouseX / chartWidth) * (chartData.length - 1));
            if (index >= 0 && index < chartData.length) {
              setHoverIndex(index);
            }
          }}
          onMouseLeave={() => setHoverIndex(null)}
        >
          {/* Faded area under line */}
          <path d={svgAreaPath} fill={fillColor} />

          {/* Smooth path vector lines */}
          <path 
            d={`M ${svgLinePath}`} 
            fill="none" 
            stroke={strokeColor} 
            strokeWidth="1.7" 
            strokeLinecap="round"
            strokeLinejoin="round" 
          />

          {/* Render Volume Bars at lower quadrant */}
          {chartData.map((d, idx) => {
            const barW = Math.max((chartWidth / chartData.length) * 0.7, 1);
            const barH = (d.volume / Math.max(...chartData.map(c => c.volume))) * 35;
            const x = (idx / (chartData.length - 1)) * chartWidth - (barW / 2);
            const y = chartHeight - barH;
            
            // If historical node price rises, volume color is green; else red
            const prevPrice = idx > 0 ? chartData[idx - 1].value : d.value;
            const vColor = d.value >= prevPrice ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)';

            return (
              <rect
                key={idx}
                x={x}
                y={y}
                width={barW}
                height={barH}
                fill={vColor}
                rx="0.5"
              />
            );
          })}

          {/* Interactive tracking crosshair overlays */}
          {hoverIndex !== null && points[hoverIndex] && (
            <>
              {/* Vertical dotted guide bar */}
              <line 
                x1={points[hoverIndex].x} 
                y1="0" 
                x2={points[hoverIndex].x} 
                y2={chartHeight} 
                stroke="#22d3ee" 
                strokeWidth="1" 
                strokeDasharray="3,3" 
                opacity="0.6"
              />
              
              {/* Active cursor anchor dot */}
              <circle 
                cx={points[hoverIndex].x} 
                cy={points[hoverIndex].y} 
                r="4.5" 
                fill="#22d3ee" 
                stroke="black" 
                strokeWidth="2" 
                className="animate-ping"
              />
              <circle 
                cx={points[hoverIndex].x} 
                cy={points[hoverIndex].y} 
                r="3.5" 
                fill="#00f2ff" 
                stroke="black" 
                strokeWidth="1.5" 
              />
            </>
          )}
        </svg>

        {/* X-axis custom dates */}
        <div className="absolute bottom-0.5 inset-x-0 h-4 flex justify-between px-2 text-[8px] text-white/20 select-none border-t border-white/5 bg-black/60 font-mono pointer-events-none">
          <span>{chartData[0]?.date}</span>
          <span>{chartData[Math.floor(chartData.length / 2)]?.date}</span>
          <span>{chartData[chartData.length - 1]?.date}</span>
        </div>

        {/* Hover analytical micro metrics box */}
        {hoverIndex !== null && chartData[hoverIndex] && (
          <div className="absolute top-1.5 left-1.5 bg-black/85 border border-cyan-500/20 px-2.5 py-1.5 rounded flex items-center gap-4 shadow-lg animate-fade-in pointer-events-none z-10 font-mono text-[9px] min-w-[170px]">
            <div>
              <span className="text-white/40 block uppercase">TIMESTAMP</span>
              <span className="text-cyan-400 font-bold block">{chartData[hoverIndex].date}</span>
            </div>
            <div className="border-l border-white/10 pl-2">
              <span className="text-white/40 block uppercase">VALUATION</span>
              <span className="text-white font-black block">₹{chartData[hoverIndex].value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="border-l border-white/10 pl-2">
              <span className="text-white/40 block uppercase">VOLUME</span>
              <span className="text-white/70 block">{chartData[hoverIndex].volume.toLocaleString()} WT</span>
            </div>
          </div>
        )}
      </div>

      {/* Interactive indicator panel summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        <div className="p-2 bg-white/[0.01] border border-white/5 rounded text-left">
          <span className="text-[8px] text-white/33 uppercase">SMA SUPPORT</span>
          <span className="text-[11px] font-bold text-white block">₹{(price * 0.957).toFixed(1)}</span>
        </div>
        <div className="p-2 bg-white/[0.01] border border-white/5 rounded text-left">
          <span className="text-[8px] text-white/33 uppercase">SMA RESISTANCE</span>
          <span className="text-[11px] font-bold text-white block">₹{(price * 1.054).toFixed(1)}</span>
        </div>
        <div className="p-2 bg-white/[0.01] border border-white/5 rounded text-left">
          <span className="text-[8px] text-white/33 uppercase">BOLLINGER WIDTH</span>
          <span className="text-[11px] font-bold text-cyan-300 block">7.8% Delta</span>
        </div>
        <div className="p-2 bg-white/[0.01] border border-white/5 rounded text-left">
          <span className="text-[8px] text-white/33 uppercase">RELATIVE DELTA</span>
          <span className="text-[11px] font-bold text-yellow-400 block font-mono">1.14 Beta</span>
        </div>
      </div>
    </div>
  );
}
export default StockChart;
