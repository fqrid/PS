import React, { useEffect, useRef, useCallback } from 'react'; // Agregamos useCallback
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Configuración de iconos (mantener esto fuera del componente para que no se re-ejecute)
const configureLeafletIcons = () => {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
  });
};

configureLeafletIcons(); // Ejecutar una vez al cargar el módulo

// Componente auxiliar para manejar la lógica de interacción del mapa
const MapInteractionHandler = ({ setCoordinates, isInteractive, currentPosition }) => {
    const markerRef = useRef(null);
    const mapRef = useRef(null); // Ref para la instancia del mapa

    // Hook para manejar eventos del mapa
    const mapEvents = useMapEvents({
        click(e) {
            if (isInteractive && typeof setCoordinates === 'function') {
                setCoordinates({ lat: e.latlng.lat, lng: e.latlng.lng });
            }
        },
        // Opcional: Centrar el mapa si la posición cambia y el mapa ya está cargado
        // moveend: () => {
        //     if (mapRef.current && currentPosition) {
        //         mapRef.current.setView(currentPosition, mapRef.current.getZoom());
        //     }
        // }
    });

    // Guardar la instancia del mapa cuando esté lista
    useEffect(() => {
        if (mapEvents) { // `mapEvents` es la instancia del mapa
            mapRef.current = mapEvents;
        }
    }, [mapEvents]);


    const eventHandlers = useCallback(
        {
            // Permite arrastrar el marcador
            dragend() {
                const marker = markerRef.current;
                if (marker != null && isInteractive && typeof setCoordinates === 'function') {
                    setCoordinates({
                        lat: marker.getLatLng().lat,
                        lng: marker.getLatLng().lng
                    });
                }
            },
        },
        [setCoordinates, isInteractive],
    );

    useEffect(() => {
        // Centrar el mapa en la posición actual cuando cambia
        if (mapRef.current && currentPosition && currentPosition[0] !== null && currentPosition[1] !== null) {
            // mapRef.current.setView(currentPosition, mapRef.current.getZoom());
            mapRef.current.panTo(currentPosition); // `panTo` es más suave
        }
    }, [currentPosition]);


    return currentPosition && currentPosition[0] !== null && currentPosition[1] !== null ? (
        <Marker
            position={currentPosition}
            draggable={isInteractive} // Solo arrastrable si es interactivo
            eventHandlers={eventHandlers}
            ref={markerRef}
        />
    ) : null;
};

const MapaEvento = ({ lat, lng, setCoordinates, isInteractive = false }) => {
    // Usamos Mocoa, Putumayo, Colombia como centro predeterminado si no hay coordenadas iniciales
    const defaultCenter = [4.5828456, -76.0125746];
    const position = lat !== null && lng !== null ? [lat, lng] : defaultCenter;

    return (
        <MapContainer
            center={position}
            zoom={isInteractive ? 13 : 10} // Un zoom un poco más alejado para vista, más cercano para edición
            scrollWheelZoom={isInteractive} // Deshabilita el zoom con rueda si no es interactivo
            doubleClickZoom={isInteractive}
            dragging={isInteractive}
            style={{ height: '100%', width: '100%', borderRadius: '8px' }} // Altura y ancho al 100% para que el contenedor controle el tamaño
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {/* Pasamos la posición actual para que el handler pueda centrar el mapa si es necesario */}
            <MapInteractionHandler
                setCoordinates={setCoordinates}
                isInteractive={isInteractive}
                currentPosition={[lat, lng]}
            />
        </MapContainer>
    );
};

export default MapaEvento;