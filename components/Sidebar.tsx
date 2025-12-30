
import React from 'react';
import { format, addDays, subDays } from 'date-fns';
import { GibsLayer, DisasterEvent } from '../types';
import { BASE_LAYERS, OVERLAY_LAYERS, DISASTER_EVENTS } from '../constants';
import { X, Calendar, Layers, ChevronLeft, ChevronRight, Info, Globe, TriangleAlert, Play, Pause } from './Icons';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentDate: Date;
  onDateChange: (date: Date) => void;
  selectedBaseLayer: GibsLayer;
  onBaseLayerChange: (layer: GibsLayer) => void;
  selectedOverlays: string[];
  onToggleOverlay: (layerId: string) => void;
  opacities: Record<string, number>;
  onOpacityChange: (layerId: string, opacity: number) => void;
  onDisasterSelect: (event: DisasterEvent) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  currentDate,
  onDateChange,
  selectedBaseLayer,
  onBaseLayerChange,
  selectedOverlays,
  onToggleOverlay,
  opacities,
  onOpacityChange,
  onDisasterSelect,
  isPlaying,
  onTogglePlay
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute top-0 left-0 h-full w-80 bg-white/95 backdrop-blur-md border-r border-gray-200 text-gray-900 z-[1000] flex flex-col shadow-2xl transition-transform duration-300">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
        <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Control Panel
        </h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <X size={20} className="text-gray-500" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-8 custom-scrollbar">
        
        {/* Date Controls */}
        <section>
          <div className="flex items-center gap-2 mb-3 text-blue-600">
            <Calendar size={18} />
            <h3 className="font-semibold uppercase tracking-wider text-xs">Date Selection</h3>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <button 
                onClick={() => onDateChange(subDays(currentDate, 1))}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-600"
                disabled={isPlaying}
              >
                <ChevronLeft size={20} />
              </button>
              <div className="flex flex-col items-center">
                 <span className="font-mono text-lg font-bold tracking-wide text-gray-800">{format(currentDate, 'yyyy-MM-dd')}</span>
                 {isPlaying && <span className="text-[10px] text-green-600 animate-pulse uppercase tracking-wider font-bold">Time-lapse Active</span>}
              </div>
              <button 
                onClick={() => onDateChange(addDays(currentDate, 1))}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-600"
                disabled={format(currentDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') || isPlaying}
              >
                <ChevronRight size={20} className={format(currentDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') ? 'text-gray-300' : ''} />
              </button>
            </div>
            
            <div className="flex gap-2">
              <input 
                type="date" 
                value={format(currentDate, 'yyyy-MM-dd')}
                max={format(new Date(), 'yyyy-MM-dd')}
                onChange={(e) => {
                  if (e.target.value) onDateChange(new Date(e.target.value));
                }}
                disabled={isPlaying}
                className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50 text-sm"
              />
              <button
                onClick={onTogglePlay}
                className={`px-4 py-2 rounded-lg border transition-all ${
                  isPlaying 
                    ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100' 
                    : 'bg-green-50 border-green-200 text-green-600 hover:bg-green-100'
                }`}
                title={isPlaying ? "Pause Time-lapse" : "Start Time-lapse"}
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} />}
              </button>
            </div>
          </div>
        </section>

        {/* Significant Events */}
        <section>
          <div className="flex items-center gap-2 mb-3 text-red-600">
            <TriangleAlert size={18} />
            <h3 className="font-semibold uppercase tracking-wider text-xs">Significant Events</h3>
          </div>
          
          <div className="grid grid-cols-1 gap-2">
            {DISASTER_EVENTS.map((event) => (
               <button
                 key={event.id}
                 onClick={() => onDisasterSelect(event)}
                 className="text-left bg-white hover:bg-gray-50 border border-gray-200 hover:border-red-400 p-3 rounded-xl transition-all group shadow-sm"
               >
                 <div className="flex justify-between items-start">
                   <span className="font-semibold text-sm group-hover:text-red-700 text-gray-800">{event.name}</span>
                   <span className="text-[10px] text-gray-500 font-mono bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">{event.date}</span>
                 </div>
                 <p className="text-xs text-gray-500 mt-1 line-clamp-1">{event.description}</p>
               </button>
            ))}
          </div>
        </section>

        {/* Base Layers */}
        <section>
          <div className="flex items-center gap-2 mb-3 text-purple-600">
            <Layers size={18} />
            <h3 className="font-semibold uppercase tracking-wider text-xs">Base Layer</h3>
          </div>
          
          <div className="space-y-2">
            {BASE_LAYERS.map((layer) => (
              <button
                key={layer.id}
                onClick={() => onBaseLayerChange(layer)}
                className={`w-full text-left p-3 rounded-xl border transition-all duration-200 ${
                  selectedBaseLayer.id === layer.id
                    ? 'bg-purple-50 border-purple-300 shadow-md ring-1 ring-purple-200'
                    : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                }`}
              >
                <div className="font-bold text-sm mb-1 text-gray-800">{layer.name}</div>
                <div className="text-xs text-gray-500 leading-relaxed">{layer.description}</div>
              </button>
            ))}
          </div>
        </section>

        {/* Overlays */}
        <section>
          <div className="flex items-center gap-2 mb-3 text-teal-600">
            <Globe size={18} />
            <h3 className="font-semibold uppercase tracking-wider text-xs">Overlays</h3>
          </div>
          
          <div className="space-y-2">
            {OVERLAY_LAYERS.map((layer) => {
              const isActive = selectedOverlays.includes(layer.id);
              const opacity = opacities[layer.id] ?? 1;

              return (
                <div
                  key={layer.id}
                  className={`w-full rounded-xl border transition-all duration-200 ${
                    isActive
                      ? 'bg-teal-50 border-teal-300'
                      : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                  }`}
                >
                  <div 
                    onClick={() => onToggleOverlay(layer.id)}
                    className="flex items-center justify-between p-3 cursor-pointer"
                  >
                    <span className="text-sm font-semibold text-gray-800">{layer.name}</span>
                    <div className={`w-4 h-4 rounded-full border-2 transition-colors ${
                      isActive ? 'bg-teal-500 border-teal-600' : 'bg-transparent border-gray-300'
                    }`} />
                  </div>
                  
                  {isActive && (
                    <div className="px-3 pb-3 pt-0 animate-in fade-in slide-in-from-top-1 duration-200">
                       <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] uppercase text-teal-700 font-bold tracking-wider">Layer Opacity</span>
                          <span className="text-[10px] text-teal-700 font-mono font-bold">{Math.round(opacity * 100)}%</span>
                       </div>
                       <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={opacity}
                          onChange={(e) => onOpacityChange(layer.id, parseFloat(e.target.value))}
                          className="w-full h-1.5 bg-teal-100 rounded-full appearance-none cursor-pointer accent-teal-600 hover:accent-teal-500"
                       />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3 text-sm text-blue-700 shadow-sm">
          <Info className="shrink-0 mt-0.5 text-blue-500" size={16} />
          <p className="text-xs font-medium">
            Images provided by NASA GIBS. Real-time satellite swaths may contain black gaps depending on daily orbital paths.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
