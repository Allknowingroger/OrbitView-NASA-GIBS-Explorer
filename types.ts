export interface GibsLayer {
  id: string;
  name: string;
  description: string;
  format: 'jpg' | 'png';
  matrixSet: string;
  // Some layers support overlays (transparent), others are base layers (opaque)
  isOverlay?: boolean;
  // For static layers that don't change daily (like Coastlines), set this to 'default'
  timeParameter?: string;
  // Override max native zoom if different from default (9)
  maxZoom?: number;
}

export interface ViewState {
  lat: number;
  lng: number;
  zoom: number;
}

export interface DisasterEvent {
  id: string;
  name: string;
  date: string;
  location: ViewState;
  description: string;
  baseLayerId: string;
  overlayIds: string[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface AppState {
  selectedBaseLayerId: string;
  selectedOverlayLayerIds: string[];
  date: Date;
  isSidebarOpen: boolean;
  isChatOpen: boolean;
}