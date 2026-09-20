import React, { useEffect, useState } from 'react';
import { 
  APIProvider, 
  Map, 
  AdvancedMarker, 
  Pin, 
  InfoWindow, 
  Circle,
  useMap 
} from '@vis.gl/react-google-maps';
import { MapPin, Navigation as NavIcon, Phone, ExternalLink, LocateFixed } from 'lucide-react';
import { Language } from '../types';
import { GovernmentHelpCenter, ServiceCategory } from '../data/governmentLocations';
import { toNepaliDigits } from '../utils/nepaliCalendar';

interface GoogleMapsNepalViewProps {
  lang: Language;
  filteredCenters: GovernmentHelpCenter[];
  selectedCenter: GovernmentHelpCenter | null;
  onSelectCenter: (center: GovernmentHelpCenter) => void;
  userLocation: { lat: number; lng: number } | null;
  focusTarget: { lat: number; lng: number; zoom?: number } | null;
  onLocateMe?: () => void;
  isLocating?: boolean;
}

const CATEGORY_COLORS: Record<ServiceCategory, string> = {
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

// Camera Controller inside Map
function GoogleMapCameraController({
  target,
}: {
  target: { lat: number; lng: number; zoom?: number } | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map || !target) return;
    map.panTo({ lat: target.lat, lng: target.lng });
    if (target.zoom) {
      map.setZoom(target.zoom);
    }
  }, [map, target]);

  return null;
}

export const GoogleMapsNepalView: React.FC<GoogleMapsNepalViewProps> = ({
  lang,
  filteredCenters,
  selectedCenter,
  onSelectCenter,
  userLocation,
  focusTarget,
  onLocateMe,
  isLocating,
}) => {
  const apiKey = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string) || '';
  const [activeInfoWindow, setActiveInfoWindow] = useState<GovernmentHelpCenter | null>(null);
  const [showUserLocationInfo, setShowUserLocationInfo] = useState<boolean>(false);

  // Sync active info window when selectedCenter changes
  useEffect(() => {
    if (selectedCenter) {
      setActiveInfoWindow(selectedCenter);
    }
  }, [selectedCenter]);

  // Show user location tooltip on first locate
  useEffect(() => {
    if (userLocation) {
      setShowUserLocationInfo(true);
    }
  }, [userLocation]);

  if (!apiKey) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-stone-50">
        <MapPin className="w-10 h-10 text-stone-400 mb-2" />
        <p className="text-sm font-bold text-stone-700">
          {lang === 'ne' ? 'गुगल म्याप्स एपीआई कुञ्जी उपलब्ध छैन।' : 'Google Maps API key not configured.'}
        </p>
        <p className="text-xs text-stone-500 mt-1 max-w-sm">
          {lang === 'ne'
            ? 'कृपया सेटिङ्समा VITE_GOOGLE_MAPS_API_KEY जाँच्नुहोस् वा OpenStreetMap दृश्य प्रयोग गर्नुहोस्।'
            : 'Please check your Google Maps API key in secrets or switch to OpenStreetMap mode.'}
        </p>
      </div>
    );
  }

  return (
    <APIProvider apiKey={apiKey}>
      <Map
        id="nepal-public-services-map"
        mapId="DEMO_MAP_ID"
        internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
        defaultCenter={{ lat: 27.7050, lng: 85.3200 }}
        defaultZoom={12}
        gestureHandling="greedy"
        mapTypeControl={true}
        streetViewControl={true}
        fullscreenControl={true}
        zoomControl={true}
        className="w-full h-full"
      >
        <GoogleMapCameraController target={focusTarget} />

        {/* User Location Proximity Radius & Pulse Marker */}
        {userLocation && (
          <>
            <Circle
              center={{ lat: userLocation.lat, lng: userLocation.lng }}
              radius={3000}
              strokeColor="#2563EB"
              strokeOpacity={0.7}
              strokeWeight={1.5}
              fillColor="#3B82F6"
              fillOpacity={0.08}
            />

            <AdvancedMarker
              position={{ lat: userLocation.lat, lng: userLocation.lng }}
              title={lang === 'ne' ? 'तपाईँको हालको स्थान' : 'Your Current Location'}
              zIndex={250}
              onClick={() => setShowUserLocationInfo(true)}
            >
              <div className="relative flex items-center justify-center cursor-pointer">
                <div className="absolute w-8 h-8 rounded-full bg-blue-500/40 animate-ping pointer-events-none" />
                <div className="w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-md" />
              </div>
            </AdvancedMarker>

            {showUserLocationInfo && (
              <InfoWindow
                position={{ lat: userLocation.lat, lng: userLocation.lng }}
                onCloseClick={() => setShowUserLocationInfo(false)}
                pixelOffset={[0, -20]}
                headerContent={
                  <div className="text-xs font-bold text-blue-700 flex items-center gap-1 pr-2">
                    <LocateFixed className="w-3.5 h-3.5 text-blue-600" />
                    <span>{lang === 'ne' ? 'तपाईँको हालको स्थान' : 'Your Current Location'}</span>
                  </div>
                }
              >
                <div className="p-1 max-w-[220px] text-xs text-stone-700">
                  <p className="text-[11px] text-stone-500">
                    GPS: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                  </p>
                  {filteredCenters[0] && (filteredCenters[0] as any).distanceKm !== undefined && (
                    <div className="mt-1.5 pt-1.5 border-t border-stone-200">
                      <span className="text-[10px] text-stone-400 font-semibold block uppercase">
                        {lang === 'ne' ? 'सबैभन्दा नजिकको सेवा:' : 'Closest Service:'}
                      </span>
                      <div className="font-bold text-stone-800 text-[11px] mt-0.5">
                        {lang === 'ne' ? filteredCenters[0].nameNe : filteredCenters[0].nameEn}
                      </div>
                      <div className="text-blue-700 font-bold text-[11px]">
                        {lang === 'ne' 
                          ? `${toNepaliDigits((filteredCenters[0] as any).distanceKm)} कि.मी. टाढा` 
                          : `${(filteredCenters[0] as any).distanceKm} km away`}
                      </div>
                    </div>
                  )}
                </div>
              </InfoWindow>
            )}
          </>
        )}

        {/* Help Centers Markers */}
        {filteredCenters.map((center) => {
          const isSelected = selectedCenter?.id === center.id;
          const pinColor = CATEGORY_COLORS[center.category] || '#DC2626';

          return (
            <AdvancedMarker
              key={center.id}
              position={{ lat: center.lat, lng: center.lng }}
              onClick={() => {
                onSelectCenter(center);
                setActiveInfoWindow(center);
              }}
              title={lang === 'ne' ? center.nameNe : center.nameEn}
              zIndex={isSelected ? 150 : 10}
            >
              <Pin
                background={pinColor}
                borderColor="#FFFFFF"
                glyphColor="#FFFFFF"
                scale={isSelected ? 1.25 : 1.0}
              />
            </AdvancedMarker>
          );
        })}

        {/* InfoWindow for Active Center */}
        {activeInfoWindow && (
          <InfoWindow
            position={{ lat: activeInfoWindow.lat, lng: activeInfoWindow.lng }}
            onCloseClick={() => setActiveInfoWindow(null)}
            pixelOffset={[0, -38]}
            headerContent={
              <div className="text-xs font-bold text-stone-900 pr-2">
                {lang === 'ne' ? activeInfoWindow.nameNe : activeInfoWindow.nameEn}
              </div>
            }
          >
            <div className="p-1 max-w-[260px] text-xs text-stone-700 space-y-2">
              <div className="text-[11px] text-stone-500 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-red-600 shrink-0" />
                <span>
                  {activeInfoWindow.district} - {lang === 'ne' ? activeInfoWindow.addressNe : activeInfoWindow.addressEn}
                </span>
              </div>

              {activeInfoWindow.hotline && (
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-900 text-amber-300 font-extrabold text-[11px]">
                  <Phone className="w-3 h-3 text-amber-300" />
                  <span>
                    {lang === 'ne' ? `हटलाइन: ${toNepaliDigits(activeInfoWindow.hotline)}` : `Hotline: ${activeInfoWindow.hotline}`}
                  </span>
                </div>
              )}

              <p className="text-[11px] text-stone-600 line-clamp-2">
                {lang === 'ne' ? activeInfoWindow.descriptionNe : activeInfoWindow.descriptionEn}
              </p>

              <div className="pt-1.5 border-t border-stone-100 flex items-center justify-between gap-2">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${activeInfoWindow.lat},${activeInfoWindow.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-600 text-white rounded-md text-[11px] font-bold hover:bg-blue-700 transition-colors"
                >
                  <NavIcon className="w-3 h-3" />
                  <span>{lang === 'ne' ? 'गुगल नेभिगेसन' : 'Directions'}</span>
                </a>

                {activeInfoWindow.website && (
                  <a
                    href={activeInfoWindow.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-stone-500 hover:text-stone-800"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>{lang === 'ne' ? 'वेबसाइट' : 'Website'}</span>
                  </a>
                )}
              </div>
            </div>
          </InfoWindow>
        )}
      </Map>
    </APIProvider>
  );
};
