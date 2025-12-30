
import React, { useState, useEffect } from 'react';
import MapComponent from './components/MapComponent';
import Sidebar from './components/Sidebar';
import ChatPanel from './components/ChatPanel';
import { GibsLayer, ViewState, DisasterEvent } from './types';
import { BASE_LAYERS, OVERLAY_LAYERS } from './constants';
import { Menu, MessageSquare, MapIcon } from './components/Icons';
import { subDays, addDays } from 'date-fns';

const App: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isChatOpen, setChatOpen] = useState(false);
  const [date, setDate] = useState<Date>(subDays(new Date(), 1));
  const [baseLayer, setBaseLayer] = useState<GibsLayer>(BASE_LAYERS[0]);
  const [selectedOverlayIds, setSelectedOverlayIds] = useState<string[]>(['Coastlines_15m', 'Reference_Features_15m']);
  const [overlayOpacities, setOverlayOpacities] = useState<Record<string, number>>({});
  const [viewState, setViewState] = useState<ViewState | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleToggleOverlay = (id: string) => {
    setSelectedOverlayIds(prev => 
      prev.includes(id) 
        ? prev.filter(x => x !== id)
        : [...prev, id]
    );
  };

  const handleOpacityChange = (layerId: string, opacity: number) => {
    setOverlayOpacities(prev => ({
      ...prev,
      [layerId]: opacity
    }));
  };

  const handleDisasterSelect = (event: DisasterEvent) => {
    setDate(new Date(event.date));
    const base = BASE_LAYERS.find(l => l.id === event.baseLayerId);
    if (base) setBaseLayer(base);
    setSelectedOverlayIds(event.overlayIds);
    setViewState(event.location);
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying) {
      interval = setInterval(() => {
        setDate(prevDate => addDays(prevDate, 1));
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleDateChange = (newDate: Date) => {
    setIsPlaying(false);
    setDate(newDate);
  };

  const activeOverlays = OVERLAY_LAYERS.filter(l => selectedOverlayIds.includes(l.id));

  useEffect(() => {
    if (window.innerWidth < 768) {
      if (isSidebarOpen) setChatOpen(false);
    }
  }, [isSidebarOpen]);

  useEffect(() => {
    if (window.innerWidth < 768) {
      if (isChatOpen) setSidebarOpen(false);
    }
  }, [isChatOpen]);

  return (
    <div className="relative w-full h-screen bg-gray-50 overflow-hidden flex">
      
      <div className="flex-1 relative">
        <MapComponent 
          baseLayer={baseLayer} 
          overlays={activeOverlays}
          opacities={overlayOpacities}
          date={date}
          viewState={viewState}
        />

        {/* Brand Header - Frosted Glass Light */}
        <div className="absolute top-4 left-4 z-[400] pointer-events-none">
          <div className="flex items-center gap-3">
             <div className="bg-white/70 backdrop-blur-md p-2.5 rounded-xl border border-white shadow-xl">
                <MapIcon className="text-blue-600" size={26} />
             </div>
             <div>
               <h1 className="text-2xl font-black text-gray-900 drop-shadow-sm tracking-tight">OrbitView</h1>
               <p className="text-[10px] text-blue-700 font-bold uppercase tracking-[0.2em]">NASA GIBS Explorer</p>
             </div>
          </div>
        </div>

        {/* Main Controls - Light Styled */}
        <div className="absolute top-4 right-4 z-[400] flex gap-2">
          {!isChatOpen && (
            <button
              onClick={() => setChatOpen(true)}
              className="bg-white/80 backdrop-blur-md hover:bg-white text-gray-800 p-3 rounded-full border border-gray-200 shadow-xl transition-all group"
              title="Ask AI Scientist"
            >
              <MessageSquare size={24} className="group-hover:text-orange-500 transition-colors" />
            </button>
          )}
        </div>

        <div className="absolute bottom-8 left-4 z-[400]">
           {!isSidebarOpen && (
             <button
              onClick={() => setSidebarOpen(true)}
              className="bg-white/80 backdrop-blur-md hover:bg-white text-gray-800 p-3 rounded-full border border-gray-200 shadow-xl transition-all group"
              title="Open Controls"
             >
               <Menu size={24} className="group-hover:text-blue-600 transition-colors" />
             </button>
           )}
        </div>
      </div>

      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        currentDate={date}
        onDateChange={handleDateChange}
        selectedBaseLayer={baseLayer}
        onBaseLayerChange={setBaseLayer}
        selectedOverlays={selectedOverlayIds}
        onToggleOverlay={handleToggleOverlay}
        opacities={overlayOpacities}
        onOpacityChange={handleOpacityChange}
        onDisasterSelect={handleDisasterSelect}
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
      />

      <ChatPanel 
        isOpen={isChatOpen} 
        onClose={() => setChatOpen(false)}
        context={{
          date,
          baseLayer,
          overlays: activeOverlays,
          viewState
        }}
      />
    </div>
  );
};

export default App;
