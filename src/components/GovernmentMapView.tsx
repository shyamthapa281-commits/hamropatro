import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Building2, 
  Phone, 
  MapPin, 
  Search, 
  Navigation as NavIcon, 
  ExternalLink, 
  Clock, 
  Shield, 
  Activity, 
  Flame, 
  HeartHandshake, 
  Compass, 
  Users, 
  Car, 
  Check, 
  Copy, 
  Filter, 
  AlertTriangle, 
  Layers, 
  X,
  ChevronRight,
  LocateFixed,
  Maximize2
} from 'lucide-react';
import { Language } from '../types';
import { 
  GovernmentHelpCenter, 
  GOVERNMENT_HELP_CENTERS, 
  SERVICE_CATEGORIES, 
  PROVINCES, 
  ServiceCategory, 
  ProvinceName 
} from '../data/governmentLocations';
import { toNepaliDigits } from '../utils/nepaliCalendar';
import { GoogleMapsNepalView } from './GoogleMapsNepalView';

interface GovernmentMapViewProps {
  lang: Language;
}

// Calculate distance in kilometers between two coordinates
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// Generate category-specific SVG marker icon HTML
function getCategoryMarkerHtml(center: GovernmentHelpCenter, isSelected: boolean): string {
  const categoryColors: Record<ServiceCategory, string> = {
    all: '#B91C1C',
    police: '#1D4ED8',
    health: '#059669',
    fire: '#EA580C',
    citizen_service: '#7C3AED',
    administration: '#DC2626',
    transport: '#D97706',
    helpline: '#DB2777',
    disaster: '#E11D48',
  };

  const color = categoryColors[center.category] || '#B91C1C';
  const size = isSelected ? 42 : 34;
  const hotlineText = center.hotline ? center.hotline : '';

  // Icon symbol SVG
  let iconSvg = '';
  switch (center.category) {
    case 'police':
      iconSvg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>';
      break;
    case 'health':
      iconSvg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>';
      break;
    case 'fire':
      iconSvg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>';
      break;
    case 'transport':
      iconSvg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 10.9 2 11.2 2 11.5V16c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>';
      break;
    case 'helpline':
      iconSvg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>';
      break;
    default:
      iconSvg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M8 10h.01"/><path d="M16 10h.01"/><path d="M8 14h.01"/><path d="M16 14h.01"/></svg>';
      break;
  }

  return `
    <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
      ${isSelected ? `<div style="position: absolute; top: -4px; width: ${size + 8}px; height: ${size + 8}px; border-radius: 50%; background: ${color}33; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>` : ''}
      <div style="
        width: ${size}px; 
        height: ${size}px; 
        background: ${color}; 
        border-radius: 50% 50% 50% 0; 
        transform: rotate(-45deg); 
        display: flex; 
        align-items: center; 
        justify-content: center;
        border: 2.5px solid #ffffff;
        box-shadow: 0 4px 10px rgba(0,0,0,0.35);
        transition: transform 0.2s ease;
      ">
        <div style="transform: rotate(45deg); display: flex; align-items: center; justify-content: center;">
          ${iconSvg}
        </div>
      </div>
      ${hotlineText ? `
        <div style="
          position: absolute; 
          bottom: -10px; 
          background: #1c1917; 
          color: #fef08a; 
          font-size: 9px; 
          font-weight: 800; 
          padding: 1px 4px; 
          border-radius: 4px; 
          border: 1px solid #78716c;
          box-shadow: 0 2px 4px rgba(0,0,0,0.4);
          white-space: nowrap;
        ">
          ${hotlineText}
        </div>
      ` : ''}
    </div>
  `;
}

export const GovernmentMapView: React.FC<GovernmentMapViewProps> = ({ lang }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});
  const userMarkerRef = useRef<L.Marker | null>(null);
  const userCircleRef = useRef<L.Circle | null>(null);

  // States
  const googleApiKey = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string) || '';
  const [mapProvider, setMapProvider] = useState<'google' | 'osm'>(googleApiKey ? 'google' : 'osm');
  const [focusTarget, setFocusTarget] = useState<{ lat: number; lng: number; zoom?: number } | null>({
    lat: 27.7050,
    lng: 85.3200,
    zoom: 12,
  });
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>('all');
  const [selectedProvince, setSelectedProvince] = useState<ProvinceName>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [only24x7, setOnly24x7] = useState<boolean>(false);
  const [selectedCenter, setSelectedCenter] = useState<GovernmentHelpCenter | null>(
    GOVERNMENT_HELP_CENTERS[0]
  );
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'both' | 'map' | 'list'>('both');

  // Filtered Help Centers
  const filteredCenters = useMemo(() => {
    return GOVERNMENT_HELP_CENTERS.filter((center) => {
      // Category filter
      if (selectedCategory !== 'all' && center.category !== selectedCategory) {
        return false;
      }
      // Province filter
      if (selectedProvince !== 'all' && center.province !== selectedProvince) {
        return false;
      }
      // 24x7 filter
      if (only24x7 && !center.is24x7) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = 
          center.nameNe.toLowerCase().includes(query) ||
          center.nameEn.toLowerCase().includes(query);
        const matchesDistrict = center.district.toLowerCase().includes(query);
        const matchesAddress = 
          center.addressNe.toLowerCase().includes(query) ||
          center.addressEn.toLowerCase().includes(query);
        const matchesHotline = center.hotline && center.hotline.includes(query);
        const matchesServices = 
          center.servicesNe.some((s) => s.toLowerCase().includes(query)) ||
          center.servicesEn.some((s) => s.toLowerCase().includes(query));

        if (!matchesName && !matchesDistrict && !matchesAddress && !matchesHotline && !matchesServices) {
          return false;
        }
      }
      return true;
    }).map((center) => {
      // Add distance if user location is available
      if (userLocation) {
        const dist = calculateDistanceKm(userLocation.lat, userLocation.lng, center.lat, center.lng);
        return { ...center, distanceKm: dist };
      }
      return { ...center, distanceKm: undefined };
    }).sort((a, b) => {
      // Sort by distance if user location known, else keep initial order
      if (a.distanceKm !== undefined && b.distanceKm !== undefined) {
        return a.distanceKm - b.distanceKm;
      }
      return 0;
    });
  }, [selectedCategory, selectedProvince, searchQuery, only24x7, userLocation]);

  // Top 4 nearest centers when user location is known
  const nearestCenters = useMemo(() => {
    if (!userLocation) return [];
    return filteredCenters
      .filter((c) => (c as any).distanceKm !== undefined)
      .slice(0, 4);
  }, [filteredCenters, userLocation]);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Center Nepal initially (Kathmandu Valley view)
      const map = L.map(mapContainerRef.current, {
        center: [27.7050, 85.3200],
        zoom: 12,
        zoomControl: false,
        attributionControl: true,
      });

      // CartoDB Voyager / OpenStreetMap High-quality tile layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      // Add zoom control at bottom-right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      if (userCircleRef.current) {
        userCircleRef.current.remove();
        userCircleRef.current = null;
      }
      if (userMarkerRef.current) {
        userMarkerRef.current.remove();
        userMarkerRef.current = null;
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Markers when centers or selection change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach((m) => {
      (m as L.Marker)?.remove();
    });
    markersRef.current = {};

    filteredCenters.forEach((center) => {
      const isSelected = selectedCenter?.id === center.id;
      const customIcon = L.divIcon({
        className: 'gov-service-marker',
        html: getCategoryMarkerHtml(center, isSelected),
        iconSize: [40, 48],
        iconAnchor: [20, 48],
        popupAnchor: [0, -44],
      });

      const marker = L.marker([center.lat, center.lng], { icon: customIcon })
        .addTo(map)
        .on('click', () => {
          setSelectedCenter(center);
        });

      // Bind simple tooltip on hover
      marker.bindTooltip(
        `<div style="font-weight: 700; font-size: 11px; padding: 2px 4px; color: #1c1917;">${lang === 'ne' ? center.nameNe : center.nameEn}</div>`,
        { direction: 'top', offset: [0, -38] }
      );

      markersRef.current[center.id] = marker;
    });
  }, [filteredCenters, selectedCenter, lang]);

  // Sync Leaflet size when switching back to OpenStreetMap
  useEffect(() => {
    if (mapProvider === 'osm' && mapInstanceRef.current) {
      setTimeout(() => {
        mapInstanceRef.current?.invalidateSize();
      }, 150);
    }
  }, [mapProvider]);

  // Center on Selected Center
  const focusOnCenter = (center: GovernmentHelpCenter) => {
    setSelectedCenter(center);
    setFocusTarget({ lat: center.lat, lng: center.lng, zoom: 15 });
    const map = mapInstanceRef.current;
    if (map) {
      map.flyTo([center.lat, center.lng], 15, {
        duration: 0.9,
      });
    }
  };

  // Province Quick Zoom
  const handleProvinceChange = (provinceId: ProvinceName) => {
    setSelectedProvince(provinceId);
    const prov = PROVINCES.find((p) => p.id === provinceId);
    if (prov) {
      setFocusTarget({ lat: prov.centerLat, lng: prov.centerLng, zoom: prov.zoom });
      if (mapInstanceRef.current) {
        mapInstanceRef.current.flyTo([prov.centerLat, prov.centerLng], prov.zoom, {
          duration: 1.1,
        });
      }
    }
  };

  // User Geolocation
  const handleLocateUser = () => {
    if (!navigator.geolocation) {
      setLocationError(
        lang === 'ne'
          ? 'तपाईँको ब्राउजरले स्थान (GPS) समर्थन गर्दैन।'
          : 'Geolocation not supported by your browser.'
      );
      return;
    }

    // If user already located, instantly center map while refreshing position
    if (userLocation) {
      setFocusTarget({ lat: userLocation.lat, lng: userLocation.lng, zoom: 15 });
      if (mapInstanceRef.current) {
        mapInstanceRef.current.flyTo([userLocation.lat, userLocation.lng], 15, { duration: 0.8 });
      }
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setFocusTarget({ lat: latitude, lng: longitude, zoom: 14 });

        const map = mapInstanceRef.current;
        if (map) {
          if (userMarkerRef.current) {
            userMarkerRef.current.remove();
          }
          if (userCircleRef.current) {
            userCircleRef.current.remove();
          }

          // User blue pulsing marker
          const userIcon = L.divIcon({
            className: 'user-location-marker',
            html: `
              <div style="position: relative; display: flex; align-items: center; justify-content: center;">
                <div style="position: absolute; width: 34px; height: 34px; border-radius: 50%; background: rgba(37, 99, 235, 0.35); animation: ping 1.8s infinite;"></div>
                <div style="width: 16px; height: 16px; border-radius: 50%; background: #2563eb; border: 3px solid #ffffff; box-shadow: 0 2px 8px rgba(0,0,0,0.5);"></div>
              </div>
            `,
            iconSize: [34, 34],
            iconAnchor: [17, 17],
          });

          // Draw 3 km proximity circle in Leaflet
          userCircleRef.current = L.circle([latitude, longitude], {
            radius: 3000,
            color: '#2563eb',
            fillColor: '#3b82f6',
            fillOpacity: 0.08,
            weight: 1.5,
            dashArray: '4, 6',
          }).addTo(map);

          userMarkerRef.current = L.marker([latitude, longitude], { icon: userIcon })
            .addTo(map)
            .bindPopup(
              `<div style="font-weight: bold; font-size: 12px; color: #1e3a8a;">${lang === 'ne' ? '📍 तपाईँको हालको स्थान' : '📍 Your Current Location'}</div>`
            )
            .openPopup();

          map.flyTo([latitude, longitude], 14, { duration: 1 });
        }
      },
      (error) => {
        setIsLocating(false);
        let errorMsg = lang === 'ne'
          ? 'स्थान पत्ता लगाउन सकिएन। कृपया अनुमति (GPS Permission) जाँच्नुहोस्।'
          : 'Could not detect location. Please check browser GPS permissions.';

        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = lang === 'ne'
            ? 'स्थान अनुमति अस्वीकार गरियो। कृपया ब्राउजर सेटिङ्सबाट अनुमति दिनुहोस्।'
            : 'Location permission denied. Please allow location access in your browser.';
        } else if (error.code === error.TIMEOUT) {
          errorMsg = lang === 'ne'
            ? 'स्थान पत्ता लगाउन समय समाप्त भयो। कृपया पुन: प्रयास गर्नुहोस्।'
            : 'Location request timed out. Please try again.';
        }
        setLocationError(errorMsg);
      },
      { timeout: 12000, enableHighAccuracy: true, maximumAge: 30000 }
    );
  };

  const copyPhone = (phone: string) => {
    navigator.clipboard.writeText(phone);
    setCopiedPhone(phone);
    setTimeout(() => setCopiedPhone(null), 2000);
  };

  return (
    <div className="space-y-4 w-full">
      {/* Search and Quick Filters Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                lang === 'ne'
                  ? 'सेवा केन्द्र, प्रहरी, अस्पताल, राहदानी वा जिल्ला खोज्नुहोस्...'
                  : 'Search by office name, police, hospital, passport, district...'
              }
              className="w-full text-xs sm:text-sm pl-9 pr-8 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-red-600 focus:bg-white focus:outline-none transition-all font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Province Selector */}
          <div className="flex items-center gap-2">
            <select
              value={selectedProvince}
              onChange={(e) => handleProvinceChange(e.target.value as ProvinceName)}
              className="text-xs sm:text-sm font-bold py-2.5 px-3 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-red-600 cursor-pointer"
            >
              {PROVINCES.map((prov) => (
                <option key={prov.id} value={prov.id}>
                  {lang === 'ne' ? prov.nameNe : prov.nameEn}
                </option>
              ))}
            </select>

            {/* Geolocation Button */}
            <button
              onClick={handleLocateUser}
              disabled={isLocating}
              className={`py-2.5 px-3.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 border active:scale-95 ${
                userLocation
                  ? 'bg-blue-600 text-white border-blue-700 shadow-xs'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-200'
              }`}
              title={lang === 'ne' ? 'मेरो नजिकको केन्द्र पत्ता लगाउनुहोस्' : 'Find nearest service centers to me'}
            >
              <LocateFixed className={`w-4 h-4 ${userLocation ? 'text-white' : 'text-blue-600'} ${isLocating ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">
                {userLocation
                  ? (lang === 'ne' ? 'मेरो स्थान सक्रिय' : 'GPS Active')
                  : (lang === 'ne' ? 'मेरो नजिक' : 'Near Me')}
              </span>
            </button>

            {/* 24/7 Filter Toggle */}
            <button
              onClick={() => setOnly24x7(!only24x7)}
              className={`py-2.5 px-3 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 border ${
                only24x7
                  ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs'
                  : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{lang === 'ne' ? '२४/७ सेवा मात्र' : '24/7 Only'}</span>
            </button>
          </div>
        </div>

        {/* Category Pills Slider */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1">
          {SERVICE_CATEGORIES.map((cat) => {
            const isCatActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  isCatActive
                    ? 'bg-red-700 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: isCatActive ? '#ffffff' : cat.color }}
                />
                <span>{lang === 'ne' ? cat.nameNe : cat.nameEn}</span>
              </button>
            );
          })}
        </div>

        {locationError && (
          <div className="text-xs text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200 flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
            <span>{locationError}</span>
          </div>
        )}
      </div>

      {/* Main Map + Side Details Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left/Main Column: Map Container */}
        <div className="lg:col-span-8 flex flex-col space-y-3">
          <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px] bg-stone-100 rounded-3xl overflow-hidden border border-stone-200 shadow-xs z-0">
            {/* Google Maps Platform View */}
            {mapProvider === 'google' && (
              <div className="w-full h-full relative z-0">
                <GoogleMapsNepalView
                  lang={lang}
                  filteredCenters={filteredCenters}
                  selectedCenter={selectedCenter}
                  onSelectCenter={focusOnCenter}
                  userLocation={userLocation}
                  focusTarget={focusTarget}
                  onLocateMe={handleLocateUser}
                  isLocating={isLocating}
                />
              </div>
            )}

            {/* Leaflet / OpenStreetMap View */}
            <div
              ref={mapContainerRef}
              className={`w-full h-full ${mapProvider === 'osm' ? 'block' : 'hidden'}`}
            />

            {/* Map Top Floating Overlay Info */}
            <div className="absolute top-3 left-3 z-[10] pointer-events-auto flex items-center gap-2">
              <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-2xl shadow-sm border border-stone-200/80 flex items-center gap-2 text-xs font-bold text-stone-800">
                <MapPin className="w-3.5 h-3.5 text-red-600" />
                <span>
                  {lang === 'ne'
                    ? `${toNepaliDigits(filteredCenters.length)} वटा सेवा केन्द्रहरू`
                    : `${filteredCenters.length} Centers`}
                </span>
              </div>

              {/* Map Provider Switcher */}
              <div className="bg-white/95 backdrop-blur-md p-1 rounded-2xl shadow-sm border border-stone-200/80 flex items-center gap-1 text-[11px] font-bold">
                <button
                  onClick={() => setMapProvider('google')}
                  className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
                    mapProvider === 'google'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                  title="Google Maps (Satellite, Terrain, Street View)"
                >
                  Google Maps
                </button>
                <button
                  onClick={() => setMapProvider('osm')}
                  className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
                    mapProvider === 'osm'
                      ? 'bg-stone-800 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                  title="OpenStreetMap (Leaflet)"
                >
                  OSM
                </button>
              </div>
            </div>

            {/* Floating Map Actions (Reset to KTM / Reset to Nepal) */}
            <div className="absolute top-3 right-3 z-[10] flex flex-col gap-1.5 pointer-events-auto">
              <button
                onClick={() => {
                  handleProvinceChange('Bagmati');
                }}
                className="px-2.5 py-1.5 bg-white/95 hover:bg-white text-stone-700 hover:text-red-700 rounded-xl shadow-sm border border-stone-200 text-[11px] font-bold transition-all cursor-pointer active:scale-95"
                title={lang === 'ne' ? 'काठमाडौँ उपत्यका' : 'Kathmandu Valley'}
              >
                {lang === 'ne' ? 'काठमाडौँ' : 'KTM'}
              </button>
              <button
                onClick={() => {
                  handleProvinceChange('all');
                }}
                className="px-2.5 py-1.5 bg-white/95 hover:bg-white text-stone-700 hover:text-red-700 rounded-xl shadow-sm border border-stone-200 text-[11px] font-bold transition-all cursor-pointer active:scale-95"
                title={lang === 'ne' ? 'सम्पूर्ण नेपाल' : 'All Nepal'}
              >
                {lang === 'ne' ? 'नेपाल' : 'Nepal'}
              </button>
            </div>

            {/* Floating 'Locate Me' Button on Map Viewport */}
            <div className="absolute bottom-4 left-4 z-[10] pointer-events-auto flex flex-wrap items-center gap-2 max-w-[calc(100%-2rem)]">
              <button
                onClick={handleLocateUser}
                disabled={isLocating}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold rounded-2xl shadow-lg border border-blue-400/40 flex items-center gap-2 text-xs transition-all cursor-pointer backdrop-blur-sm group"
                title={lang === 'ne' ? 'मेरो हालको स्थान पत्ता लगाउनुहोस् र नजिकका सेवाहरू हेर्नुहोस्' : 'Locate my current position and find nearby services'}
              >
                <LocateFixed className={`w-4 h-4 text-blue-100 ${isLocating ? 'animate-spin text-white' : 'group-hover:rotate-45 transition-transform'}`} />
                <span>
                  {isLocating
                    ? (lang === 'ne' ? 'स्थान खोज्दै...' : 'Locating...')
                    : (lang === 'ne' ? 'मेरो स्थान (Locate Me)' : 'Locate Me')}
                </span>
              </button>

              {userLocation && (
                <div className="bg-white/95 backdrop-blur-md px-3 py-2 rounded-2xl shadow-md border border-blue-200 flex items-center gap-2 text-xs text-stone-800">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse shrink-0" />
                  <span className="font-semibold text-blue-900">
                    {lang === 'ne' ? 'स्थान सक्रिय' : 'GPS Active'}
                  </span>
                  {nearestCenters[0] && (nearestCenters[0] as any).distanceKm !== undefined && (
                    <span className="text-stone-600 text-[11px] border-l border-stone-200 pl-2">
                      {lang === 'ne'
                        ? `नजिक: ${toNepaliDigits((nearestCenters[0] as any).distanceKm)} कि.मी.`
                        : `Nearest: ${(nearestCenters[0] as any).distanceKm} km`}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Nearby Proximity Help Centers Section */}
          {userLocation && nearestCenters.length > 0 && (
            <div className="bg-gradient-to-r from-blue-50/90 via-white to-blue-50/60 p-4 rounded-3xl border border-blue-200 shadow-xs">
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                    <LocateFixed className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-blue-950">
                      {lang === 'ne' ? 'तपाईँको स्थानबाट सबैभन्दा नजिकका सेवाहरू' : 'Public Services Nearest to Your Location'}
                    </h4>
                    <p className="text-[11px] text-blue-800/80">
                      {lang === 'ne'
                        ? 'दूरीका आधारमा क्रमबद्ध गरिएका आपतकालीन तथा सरकारी केन्द्रहरू'
                        : 'Emergency & government centers sorted by direct proximity'}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                  {lang === 'ne' ? '३ कि.मी. क्षेत्र' : '3 km Proximity'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2.5">
                {nearestCenters.map((center, index) => {
                  const isSelected = selectedCenter?.id === center.id;
                  const distKm = (center as any).distanceKm;
                  return (
                    <div
                      key={center.id}
                      onClick={() => focusOnCenter(center)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-white border-blue-500 shadow-md ring-2 ring-blue-400/30'
                          : 'bg-white/95 hover:bg-white border-stone-200/90 hover:border-blue-300 shadow-xs'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1.5">
                          <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                            #{index + 1} {lang === 'ne' ? 'नजिक' : 'Near'}
                          </span>
                          <span className="text-[11px] font-extrabold text-blue-700 flex items-center gap-0.5">
                            <MapPin className="w-3 h-3 text-blue-600" />
                            {lang === 'ne' ? `${toNepaliDigits(distKm)} कि.मी.` : `${distKm} km`}
                          </span>
                        </div>
                        <h5 className="text-xs font-bold text-stone-900 leading-snug line-clamp-1">
                          {lang === 'ne' ? center.nameNe : center.nameEn}
                        </h5>
                        <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                          {center.district} • {lang === 'ne' ? center.addressNe : center.addressEn}
                        </p>
                      </div>

                      <div className="pt-2 mt-2 border-t border-stone-100 flex items-center justify-between gap-1.5">
                        <a
                          href={`tel:${center.hotline || center.directPhone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="py-1 px-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-amber-300 font-extrabold text-[10px] flex items-center gap-1"
                          title={lang === 'ne' ? 'कल गर्नुहोस्' : 'Direct Call'}
                        >
                          <Phone className="w-2.5 h-2.5" />
                          <span>{center.hotline || center.directPhone}</span>
                        </a>

                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${center.lat},${center.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="py-1 px-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[10px] flex items-center gap-1"
                          title={lang === 'ne' ? 'गुगल नेभिगेसन खोल्नुहोस्' : 'Get Directions'}
                        >
                          <NavIcon className="w-2.5 h-2.5" />
                          <span>{lang === 'ne' ? 'दिशा' : 'Directions'}</span>
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Guidance & Google Maps Attribution Badge */}
          <div className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-stone-500">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse shrink-0" />
              <span>
                {lang === 'ne'
                  ? 'नक्सामा कुनै पनि पिन क्लिक गरेर प्रत्यक्ष फोन, दिशानिर्देश र सेवा विवरण हेर्नुहोस्।'
                  : 'Click any map pin to view emergency hotlines, direct dialing, and navigation directions.'}
              </span>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto text-[11px] text-stone-400">
              <span>
                {mapProvider === 'google' ? 'Powered by Google Maps Platform' : 'OpenStreetMap & Carto'}
              </span>
              {mapProvider === 'google' && (
                <a
                  href="https://cloud.google.com/maps-platform/terms?utm_campaign=gmp_mcp_codeassist_v1_aistudio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-stone-600"
                >
                  ToS
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Center Info Card & Centers List */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
          {/* Selected Center Full Detail Card */}
          {selectedCenter ? (
            <div className="bg-white rounded-3xl p-5 border-2 border-red-600/30 shadow-sm relative overflow-hidden">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
                      {selectedCenter.district}
                    </span>
                    {selectedCenter.is24x7 ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        <span>२४/७ सेवा (24/7)</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-stone-500">
                        {lang === 'ne' ? selectedCenter.operatingHoursNe : selectedCenter.operatingHoursEn}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-extrabold text-stone-900 leading-snug">
                    {lang === 'ne' ? selectedCenter.nameNe : selectedCenter.nameEn}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>{lang === 'ne' ? selectedCenter.addressNe : selectedCenter.addressEn}</span>
                  </p>
                </div>
              </div>

              {/* Distance from user if available */}
              {selectedCenter && (selectedCenter as any).distanceKm !== undefined && (
                <div className="mb-3 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-xl text-xs font-bold text-blue-800 flex items-center gap-1.5">
                  <LocateFixed className="w-3.5 h-3.5 text-blue-600" />
                  <span>
                    {lang === 'ne'
                      ? `तपाईँबाट करिब ${toNepaliDigits((selectedCenter as any).distanceKm)} कि.मि. टाढा`
                      : `Approximately ${(selectedCenter as any).distanceKm} km from your current location`}
                  </span>
                </div>
              )}

              {/* Description */}
              <p className="text-xs text-stone-600 leading-relaxed mb-4">
                {lang === 'ne' ? selectedCenter.descriptionNe : selectedCenter.descriptionEn}
              </p>

              {/* Services Offered List */}
              <div className="mb-4">
                <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-2">
                  {lang === 'ne' ? 'उपलब्ध प्रमुख नागरिक सेवाहरू:' : 'Key Citizen Services Provided:'}
                </span>
                <ul className="space-y-1.5">
                  {(lang === 'ne' ? selectedCenter.servicesNe : selectedCenter.servicesEn).map((svc, i) => (
                    <li key={i} className="text-xs text-stone-700 flex items-start gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0 mt-1.5" />
                      <span>{svc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons Row */}
              <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center gap-2">
                {/* Emergency Hotline or Direct Phone */}
                <a
                  href={`tel:${selectedCenter.hotline || selectedCenter.directPhone}`}
                  className="flex-1 py-2.5 px-3 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer truncate"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span className="truncate">
                    {selectedCenter.hotline
                      ? lang === 'ne' ? `हटलाइन: ${toNepaliDigits(selectedCenter.hotline)}` : `Hotline ${selectedCenter.hotline}`
                      : lang === 'ne' ? `फोन: ${toNepaliDigits(selectedCenter.directPhone)}` : `Call ${selectedCenter.directPhone}`}
                  </span>
                </a>

                {/* Copy Phone */}
                <button
                  onClick={() => copyPhone(selectedCenter.hotline || selectedCenter.directPhone)}
                  className="p-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl transition-colors cursor-pointer shrink-0"
                  title={lang === 'ne' ? 'नम्बर कपी गर्नुहोस्' : 'Copy phone number'}
                >
                  {copiedPhone === (selectedCenter.hotline || selectedCenter.directPhone) ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>

                {/* Directions on Google Maps */}
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${selectedCenter.lat},${selectedCenter.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                  title={lang === 'ne' ? 'गुगल म्यापमा दिशा हेर्नुहोस्' : 'Get Directions in Google Maps'}
                >
                  <NavIcon className="w-3.5 h-3.5 text-blue-600" />
                  <span>{lang === 'ne' ? 'दिशानिर्देश' : 'Directions'}</span>
                </a>

                {/* Official Website */}
                {selectedCenter.website && (
                  <a
                    href={selectedCenter.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl transition-colors cursor-pointer shrink-0"
                    title={lang === 'ne' ? 'आधिकारिक वेबसाइट खोल्नुहोस्' : 'Visit Official Portal'}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-stone-50 rounded-3xl p-6 border border-stone-200 text-center text-stone-500">
              <MapPin className="w-8 h-8 text-stone-300 mx-auto mb-2" />
              <p className="text-xs">
                {lang === 'ne'
                  ? 'विस्तृत जानकारी हेर्न नक्सा वा तलको सूचीबाट कुनै सेवा केन्द्र छान्नुहोस्।'
                  : 'Select a help center from the map or list below to view comprehensive details.'}
              </p>
            </div>
          )}

          {/* Filtered Centers Scrollable List */}
          <div className="bg-white rounded-3xl p-4 border border-stone-200 shadow-xs flex flex-col flex-1 max-h-[380px] overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-2">
              <span className="text-xs font-bold text-stone-700">
                {lang === 'ne' ? 'नजिकका सेवा केन्द्रहरू' : 'Nearby Help Centers'} ({filteredCenters.length})
              </span>
              <span className="text-[11px] text-stone-400">
                {lang === 'ne' ? 'क्लिक गरी नक्सामा हेर्नुहोस्' : 'Click to inspect'}
              </span>
            </div>

            <div className="overflow-y-auto space-y-2 pr-1 scrollbar-thin">
              {filteredCenters.length === 0 ? (
                <div className="py-8 text-center text-xs text-stone-400">
                  {lang === 'ne' ? 'कुनै सेवा केन्द्र फेला परेन।' : 'No government centers found matching filters.'}
                </div>
              ) : (
                filteredCenters.map((center) => {
                  const isCurrent = selectedCenter?.id === center.id;
                  return (
                    <button
                      key={center.id}
                      onClick={() => focusOnCenter(center)}
                      className={`w-full text-left p-3 rounded-2xl transition-all flex items-start justify-between gap-2 cursor-pointer border ${
                        isCurrent
                          ? 'bg-red-50/80 border-red-300 ring-1 ring-red-400 shadow-xs'
                          : 'bg-stone-50/60 border-stone-100 hover:bg-stone-100/80'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 mb-1">
                          {center.hotline && (
                            <span className="px-1.5 py-0.5 rounded-md bg-stone-900 text-amber-300 font-extrabold text-[10px]">
                              {center.hotline}
                            </span>
                          )}
                          <span className="text-[10px] font-semibold text-stone-400 truncate">
                            {center.district}
                          </span>
                          {(center as any).distanceKm !== undefined && (
                            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1 rounded ml-auto">
                              {toNepaliDigits((center as any).distanceKm)} km
                            </span>
                          )}
                        </div>
                        <h4 className="text-xs font-bold text-stone-900 truncate">
                          {lang === 'ne' ? center.nameNe : center.nameEn}
                        </h4>
                        <p className="text-[11px] text-stone-500 truncate mt-0.5">
                          {lang === 'ne' ? center.addressNe : center.addressEn}
                        </p>
                      </div>

                      <ChevronRight className={`w-4 h-4 shrink-0 mt-2 transition-transform ${isCurrent ? 'text-red-700 translate-x-0.5' : 'text-stone-300'}`} />
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
