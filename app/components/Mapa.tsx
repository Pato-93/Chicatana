"use client";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Tooltip,useMap } from "react-leaflet";




function CentrarMapa({
  lat,
  lng,
}: {
  lat: number;
  lng: number;
}) {
  const map = useMap();

 useEffect(() => {
  map.setView([lat, lng], 16);
}, [lat, lng, map]);

  return null;
}


function AjustarVista({
  origenLat,
  origenLng,
  destinoLat,
  destinoLng,
  estadoViaje,
}: {
  origenLat: number;
  origenLng: number;
  destinoLat: number | null;
  destinoLng: number | null;
  estadoViaje?: string;
}) {
  const map = useMap();

  useEffect(() => {
    if (!destinoLat || !destinoLng) return;
    map.fitBounds(
      [
        [origenLat, origenLng],
        [destinoLat, destinoLng],
      ],
      {
        padding: [120, 120],
      }
    );
 }, [
  origenLat,
  origenLng,
  destinoLat,
  destinoLng,
  estadoViaje,
  map,
]);

  return null;
}



function AjustarVistaConductor({
  usuarioLat,
  usuarioLng,
  conductorLat,
  conductorLng,
}: {
  usuarioLat: number;
  usuarioLng: number;
  conductorLat: number | null;
  conductorLng: number | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (!conductorLat || !conductorLng) return;

    map.fitBounds(
      [
        [usuarioLat, usuarioLng],
        [conductorLat, conductorLng],
      ],
      {
        padding: [50, 50],
      }
    );
  }, [
    usuarioLat,
    usuarioLng,
    conductorLat,
    conductorLng,
    map,
  ]);

  return null;
}



delete (L.Icon.Default.prototype as any)._getIconUrl;

    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
export default function Mapa({
  destino,
  ubicacionBuscada,
  estadoViaje,
  conductorLat,
  conductorLng,
  pasajeroLat,
  pasajeroLng,
  onUbicacionChange,
  onDireccionChange,
  onDestinoChange,
  onDestinoDireccionChange,
}: {

  destino: string;
  ubicacionBuscada: string;
  estadoViaje?: string;
  onUbicacionChange?: (lat: number, lng: number) => void;
  onDireccionChange?: (direccion: string) => void;
  onDestinoChange?: (lat: number, lng: number) => void;
  onDestinoDireccionChange?: (direccion: string) => void;
  conductorLat?: number | null;
  conductorLng?: number | null; 
  destinoLat?: number | null;
 destinoLng?: number | null;
   pasajeroLat?: number | null;
  pasajeroLng?: number | null;
})

 {

const [latitud, setLatitud] = useState<number | null>(null);
const [longitud, setLongitud] = useState<number | null>(null);


const [destinoLat, setDestinoLat] = useState<number | null>(null);
const [destinoLng, setDestinoLng] = useState<number | null>(null);
const [direccionActual, setDireccionActual] = useState("");
const [ruta, setRuta] = useState<[number, number][]>([]);


const mostrarRutaDestino =
  estadoViaje === undefined ||
  estadoViaje === "pendiente" ||
  estadoViaje === "confirmado" ||
  estadoViaje === "en_curso";

          useEffect(() => {
            const watchId =
              navigator.geolocation.watchPosition(
                (posicion) => {
                  const lat = posicion.coords.latitude;
                  const lng = posicion.coords.longitude;

                  setLatitud(lat);
                  setLongitud(lng);


                  onUbicacionChange?.(lat, lng);
                },
                (error) => {
                  console.error(error);
                }
              );

            return () => {
              navigator.geolocation.clearWatch(watchId);
            };
          }, []);

                  


              useEffect(() => {
              if (!ubicacionBuscada || ubicacionBuscada.length < 3) return;

              const buscarUbicacion = async () => {
                try {
                  const respuesta = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                      ubicacionBuscada
                    )}`
                  );

                  const data = await respuesta.json();

                  if (data.length > 0) {
                    setLatitud(Number(data[0].lat));
                    setLongitud(Number(data[0].lon));
                  }
                } catch (error) {
                  console.error(error);
                }
              };

              buscarUbicacion();
            }, [ubicacionBuscada]);

                  useEffect(() => {
            if (!destino) {
              setDestinoLat(null);
              setDestinoLng(null);
              return;
            }

            if (destino.length < 3) {
              return;
            }

            const buscarDestino = async () => {
                  try {
                    const respuesta = await fetch(
                      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                        destino
                      )}`
                    );

                
                    const data = await respuesta.json();

                    if (data.length > 0) {
                      setDestinoLat(Number(data[0].lat));
                      setDestinoLng(Number(data[0].lon));
                      onDestinoChange?.(
                        Number(data[0].lat),
                        Number(data[0].lon)
                      );
                    }
                  } catch (error) {
                    console.error(error);
                  }
                };

                buscarDestino();
              }, [destino]);


useEffect(() => {
 const latFinal =
  estadoViaje === "confirmado"
    ? (pasajeroLat ?? conductorLat)
    : destinoLat;

const lngFinal =
  estadoViaje === "confirmado"
    ? (pasajeroLng ?? conductorLng)
    : destinoLng;

    
 
if (
  estadoViaje === undefined ||
  estadoViaje === "calificado" ||
  estadoViaje === "cancelado"
) {
  return;
}

  if (
  latitud === null ||
  longitud === null ||
  latFinal === null ||
  latFinal === undefined ||
  lngFinal === null ||
  lngFinal === undefined
)
   {
    return;
  }

  const obtenerRuta = async () => {
    try {
     const respuesta = await fetch(
  `https://router.project-osrm.org/route/v1/driving/${longitud},${latitud};${lngFinal},${latFinal}?overview=full&geometries=geojson`
);

      const data = await respuesta.json();

      const coordenadas =
        data.routes?.[0]?.geometry?.coordinates?.map(
          (coord: number[]) => [
            coord[1],
            coord[0],
          ]
        ) || [];


      setRuta(coordenadas);
    } catch (error) {
      console.error(error);
    }
  };

  obtenerRuta();
}, [
  latitud,
  longitud,
  destinoLat,
  destinoLng,
  pasajeroLat,
  pasajeroLng,
  estadoViaje,
]);

useEffect(() => {
  if (
    estadoViaje === undefined ||
    estadoViaje === "calificado" ||
    estadoViaje === "cancelado"
  ) {
    
  }
}, [estadoViaje]);
          

           useEffect(() => {
              if (latitud === null || longitud === null) return;

              const obtenerDireccion = async () => {
                try {
                  const respuesta = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitud}&lon=${longitud}`
                  );

                  const data = await respuesta.json();

                 

                 const partes = (data.display_name || "").split(",");

                  const direccionCorta = [
                    partes[0]?.trim(),
                    partes[2]?.trim(),
                    partes[4]?.trim(),
                  ]
                    .filter(Boolean)
                    .join(", ");

                  setDireccionActual(direccionCorta);

                  onDireccionChange?.(direccionCorta);
                  
                } catch (error) {
                  console.error(error);
                }
              };

              obtenerDireccion();
            }, [latitud, longitud]);

              if (latitud === null || longitud === null) {
  return (
    <div className="w-full h-[350px] flex items-center justify-center bg-gray-100">
      📍 Obteniendo ubicación...
    </div>
  );
}
  return (
   <div className="w-full rounded-b-3xl">
    <MapContainer
      center={[latitud, longitud]}
          zoom={16}
          style={{ height: "350px", width: "100%" }}
        >
        <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://a.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
          />
    {(!estadoViaje ||
          estadoViaje === "calificado" ||
          estadoViaje === "cancelado") && (
          <CentrarMapa
            lat={latitud}
            lng={longitud}
          />
        )}

   {(estadoViaje === "confirmado" ||
      estadoViaje === "en_curso") && (
      <AjustarVistaConductor
        usuarioLat={latitud}
        usuarioLng={longitud}
        conductorLat={conductorLat ?? null}
        conductorLng={conductorLng ?? null}
      />
    )}

      <AjustarVista
          origenLat={latitud}
          origenLng={longitud}
          destinoLat={destinoLat}
          destinoLng={destinoLng}
          estadoViaje={estadoViaje}
        />

      <Marker
          position={[latitud, longitud]}
          draggable={true}
          eventHandlers={{
           dragend: (e) => {
              const marker = e.target;
              const position = marker.getLatLng();
             
              setLatitud(position.lat);
              setLongitud(position.lng);

              onUbicacionChange?.(position.lat, position.lng);
            },
          }}
        >
          <Tooltip permanent direction="top">
              🐜 Tu
            </Tooltip>
        </Marker>
        {estadoViaje === "confirmado" &&
          conductorLat !== null &&
          conductorLat !== undefined &&
          conductorLng !== null &&
          conductorLng !== undefined && (

           <Marker
            key={`${conductorLat}-${conductorLng}`}
            position={[conductorLat, conductorLng]}
          >
            <Tooltip permanent direction="top">
              🛵 Conductor
            </Tooltip>
</Marker>
        )}

          {estadoViaje === "confirmado" &&
          pasajeroLat !== null &&
          pasajeroLat !== undefined &&
          pasajeroLng !== null &&
          pasajeroLng !== undefined && (
            <Marker
              position={[pasajeroLat, pasajeroLng]}
            >
            <Tooltip permanent direction="top">
              🐜 Pasajero
            </Tooltip>
          </Marker>
      )}

      {mostrarRutaDestino &&
  ruta.length > 0 && (
            <Polyline
              positions={ruta}
              pathOptions={{
                color: "#16a34a",
                weight: 5,
                opacity: 0.8,
              }}
            />
        )}

       {mostrarRutaDestino &&
            destinoLat &&
            destinoLng && (
            <Marker
            position={[destinoLat, destinoLng]}
                draggable={true}
                eventHandlers={{
                  dragend: async (e) => {

                    const marker = e.target;
                    const position =marker.getLatLng();

                    setDestinoLat(position.lat);
                    setDestinoLng(position.lng);

                    onDestinoChange?.(
                      position.lat,
                      position.lng
                    );

                    const respuesta = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.lat}&lon=${position.lng}`
                  );

                  const data = await respuesta.json();

                  const partes = (data.display_name || "").split(",");

                  const direccionCorta = [
                    partes[0]?.trim(),
                    partes[2]?.trim(),
                    partes[4]?.trim(),
                  ]
                    .filter(Boolean)
                    .join(", ");

                  onDestinoDireccionChange?.(direccionCorta);


                  },
                }}
              >
                <Tooltip permanent direction="top">
          🏁 Destino
        </Tooltip>
          </Marker>
            )}
     </MapContainer>


       

    </div>
  );
}