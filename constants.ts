import { GibsLayer } from './types';
import { DisasterEvent } from './types';

// We default to the "GoogleMapsCompatible_Level9" MatrixSet for EPSG:3857 (Web Mercator)
// which is compatible with standard Leaflet/Google Maps projections.

export const BASE_LAYERS: GibsLayer[] = [
  {
    id: 'VIIRS_NOAA20_CorrectedReflectance_TrueColor',
    name: 'True Color (VIIRS/NOAA-20)',
    description: 'Latest generation satellite. Highest quality daily imagery.',
    format: 'jpg',
    matrixSet: 'GoogleMapsCompatible_Level9'
  },
  {
    id: 'VIIRS_SNPP_CorrectedReflectance_TrueColor',
    name: 'True Color (VIIRS/Suomi NPP)',
    description: 'Standard high-res realistic view. Good for daily viewing.',
    format: 'jpg',
    matrixSet: 'GoogleMapsCompatible_Level9'
  },
  {
    id: 'MODIS_Terra_CorrectedReflectance_TrueColor',
    name: 'True Color (MODIS Terra)',
    description: 'Morning pass. Realistic view.',
    format: 'jpg',
    matrixSet: 'GoogleMapsCompatible_Level9'
  },
  {
    id: 'MODIS_Aqua_CorrectedReflectance_TrueColor',
    name: 'True Color (MODIS Aqua)',
    description: 'Afternoon pass. Realistic view.',
    format: 'jpg',
    matrixSet: 'GoogleMapsCompatible_Level9'
  },
  {
    id: 'VIIRS_SNPP_DayNightBand_ENCC',
    name: 'Night Lights (VIIRS)',
    description: 'Earth at Night. Shows city lights and nighttime activity (Grayscale).',
    format: 'jpg',
    matrixSet: 'GoogleMapsCompatible_Level9'
  },
  {
    id: 'MODIS_Terra_CorrectedReflectance_Bands721',
    name: 'False Color 7-2-1 (Terra)',
    description: 'Vegetation is green, burn scars red, water black.',
    format: 'jpg',
    matrixSet: 'GoogleMapsCompatible_Level9'
  },
  {
    id: 'MODIS_Aqua_CorrectedReflectance_Bands721',
    name: 'False Color 7-2-1 (Aqua)',
    description: 'Afternoon False Color. Good for burn scars and floods.',
    format: 'jpg',
    matrixSet: 'GoogleMapsCompatible_Level9'
  },
  {
    id: 'MODIS_Terra_CorrectedReflectance_Bands367',
    name: 'False Color 3-6-7 (Snow/Ice)',
    description: 'Snow/Ice is red, Vegetation green, Clouds white. Good for poles.',
    format: 'jpg',
    matrixSet: 'GoogleMapsCompatible_Level9'
  },
  {
    id: 'GHRSST_L4_MUR_Sea_Surface_Temperature',
    name: 'Sea Surface Temperature',
    description: 'Global ocean temperature gradients (Colorized).',
    format: 'png',
    matrixSet: 'GoogleMapsCompatible_Level9'
  },
  {
    id: 'ASTER_GDEM_Color_Shaded_Relief',
    name: 'Elevation (ASTER GDEM)',
    description: 'Global Digital Elevation Model. Static topographic map.',
    format: 'jpg',
    matrixSet: 'GoogleMapsCompatible_Level12',
    timeParameter: 'default',
    maxZoom: 12
  },
  {
    id: 'BlueMarble_ShadedRelief_Bathymetry',
    name: 'Blue Marble (Static)',
    description: 'Static background map of Earth topography and bathymetry.',
    format: 'jpg',
    matrixSet: 'GoogleMapsCompatible_Level8',
    timeParameter: 'default',
    maxZoom: 8
  }
];

export const OVERLAY_LAYERS: GibsLayer[] = [
  {
    id: 'Coastlines_15m',
    name: 'Coastlines',
    description: 'Major coastlines in red.',
    format: 'png',
    matrixSet: 'GoogleMapsCompatible_Level9',
    isOverlay: true,
    timeParameter: 'default'
  },
  {
    id: 'Reference_Features_15m',
    name: 'Borders & Roads',
    description: 'Country borders and major roads.',
    format: 'png',
    matrixSet: 'GoogleMapsCompatible_Level9',
    isOverlay: true,
    timeParameter: 'default'
  },
  {
    id: 'Reference_Labels_15m',
    name: 'Place Labels',
    description: 'City and country names.',
    format: 'png',
    matrixSet: 'GoogleMapsCompatible_Level9',
    isOverlay: true,
    timeParameter: 'default'
  },
  {
    id: 'VIIRS_NOAA20_Thermal_Anomalies_375m_All',
    name: 'Active Fires (VIIRS)',
    description: 'Thermal anomalies showing active fires (Red dots).',
    format: 'png',
    matrixSet: 'GoogleMapsCompatible_Level9',
    isOverlay: true
  },
  {
    id: 'MODIS_Terra_Aerosol',
    name: 'Aerosols (Dust/Smoke)',
    description: 'Particulates in the atmosphere like dust and smoke.',
    format: 'png',
    matrixSet: 'GoogleMapsCompatible_Level9',
    isOverlay: true
  },
  {
    id: 'MODIS_Terra_Chlorophyll_A',
    name: 'Chlorophyll A',
    description: 'Ocean biology and phytoplankton concentrations.',
    format: 'png',
    matrixSet: 'GoogleMapsCompatible_Level9',
    isOverlay: true
  },
  {
    id: 'SMAP_L4_Soil_Moisture_Surface',
    name: 'Soil Moisture (SMAP)',
    description: 'Surface soil moisture data (9km).',
    format: 'png',
    matrixSet: 'GoogleMapsCompatible_Level9',
    isOverlay: true
  },
  {
    id: 'AIRS_L3_Carbon_Monoxide_Day',
    name: 'Carbon Monoxide (AIRS)',
    description: 'Atmospheric CO levels.',
    format: 'png',
    matrixSet: 'GoogleMapsCompatible_Level9',
    isOverlay: true
  }
];

export const DISASTER_EVENTS: DisasterEvent[] = [
  {
    id: 'maui-fires-2023',
    name: 'Maui Wildfires',
    date: '2023-08-08',
    location: { lat: 20.8, lng: -156.3, zoom: 10 },
    description: 'Devastating wildfires in Lahaina, Hawaii.',
    baseLayerId: 'VIIRS_SNPP_CorrectedReflectance_TrueColor',
    overlayIds: ['VIIRS_NOAA20_Thermal_Anomalies_375m_All', 'Coastlines_15m']
  },
  {
    id: 'hurricane-ian-2022',
    name: 'Hurricane Ian',
    date: '2022-09-28',
    location: { lat: 26.5, lng: -82.5, zoom: 7 },
    description: 'Category 5 hurricane making landfall in Florida.',
    baseLayerId: 'MODIS_Terra_CorrectedReflectance_TrueColor',
    overlayIds: ['Coastlines_15m', 'Reference_Features_15m']
  },
  {
    id: 'tonga-eruption-2022',
    name: 'Hunga Tonga Eruption',
    date: '2022-01-15',
    location: { lat: -20.5, lng: -175.4, zoom: 6 },
    description: 'Massive volcanic eruption visible from space.',
    baseLayerId: 'VIIRS_SNPP_CorrectedReflectance_TrueColor',
    overlayIds: []
  },
  {
    id: 'australian-bushfires-2020',
    name: 'Australian Bushfires',
    date: '2020-01-04',
    location: { lat: -36.0, lng: 149.0, zoom: 6 },
    description: 'Black Summer bushfires in New South Wales.',
    baseLayerId: 'MODIS_Terra_CorrectedReflectance_Bands721',
    overlayIds: ['VIIRS_NOAA20_Thermal_Anomalies_375m_All', 'MODIS_Terra_Aerosol']
  },
  {
    id: 'hurricane-katrina-2005',
    name: 'Hurricane Katrina',
    date: '2005-08-28',
    location: { lat: 27.5, lng: -89.0, zoom: 6 },
    description: 'Category 5 hurricane in the Gulf of Mexico.',
    baseLayerId: 'MODIS_Terra_CorrectedReflectance_TrueColor',
    overlayIds: ['Coastlines_15m']
  }
];

export const WMTS_ENDPOINT = 'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best';