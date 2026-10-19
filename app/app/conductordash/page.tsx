"use client";
import { supabase } from "@/lib/supabase";
import dynamic from "next/dynamic";

const Mapa = dynamic(
  () => import("@/components/Mapa"),
  {
    ssr: false,
  }
);

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ConductorDashboard() {
  const [conductor, setConductor] = useState<any>(null);
  const [miLat, setMiLat] = useState<number | null>(null);
const [miLng, setMiLng] = useState<number | null>(null);
  const [disponible, setDisponible] = useState(true);
  const [viajes, setViajes] = useState<any[]>([]);
  const [calificacionPromedio, setCalificacionPromedio] = useState(0);
  const [viajesCompletados, setViajesCompletados] = useState(0);
  const [viajeActual, setViajeActual] = useState<any>(null);
  const [distanciaPasajero, setDistanciaPasajero] = useState(0);
  const [llegoPasajero, setLlegoPasajero] = useState(false);

const calcularDistancia = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  const R = 6371;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) *
      Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return Number((R * c).toFixed(1));
};


  const cargarViajes = async () => {
  const { data, error } = await supabase
  .from("viajes")
  .select("*");

        if (error) {
          console.error(error);
          return;
        }

        const pendientes =
        data?.filter(
          (v) => v.estado === "pendiente"
        ) || [];

          const activo =
            data
              ?.filter(
                (v) =>
                  v.estado === "aceptado" ||
                  v.estado === "confirmado" ||
                  v.estado === "en_curso"
              )
              .sort(
                (a, b) =>
                  new Date(b.created_at).getTime() -
                  new Date(a.created_at).getTime()
              )[0];


      setViajes(pendientes);
      setViajeActual(activo || null);
      if (
  activo &&
  conductor?.id &&
  activo.origen_lat &&
  activo.origen_lng
) {
  const {
    data: conductorActual,
  } = await supabase
    .from("conductores")
    .select("latitud, longitud")
    .eq("id", conductor.id)
    .single();

  if (conductorActual) {
    const R = 6371;

    const dLat =
      ((activo.origen_lat -
        conductorActual.latitud) *
        Math.PI) /
      180;

    const dLng =
      ((activo.origen_lng -
        conductorActual.longitud) *
        Math.PI) /
      180;

    const a =
      Math.sin(dLat / 2) *
        Math.sin(dLat / 2) +
      Math.cos(
        (conductorActual.latitud *
          Math.PI) /
          180
      ) *
        Math.cos(
          (activo.origen_lat *
            Math.PI) /
            180
        ) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c =
      2 *
      Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
      );

    const distancia = R * c;

    setDistanciaPasajero(
      Number(
        distancia.toFixed(2)
      )
    );

    setLlegoPasajero(
      distancia <= 0.2
    );
  }
}
        const viajesCalificados =
          data?.filter(
            (v) =>
              v.conductor_id === conductor?.id &&
              v.calificacion
          ) || [];

        if (viajesCalificados.length > 0) {
          const promedio =
            viajesCalificados.reduce(
              (sum, viaje) => sum + viaje.calificacion,
              0
            ) / viajesCalificados.length;

          setCalificacionPromedio(
            Number(promedio.toFixed(1))
          );
        }
              const completados =
                data?.filter(
                  (v) =>
                    v.conductor_id === conductor?.id &&
                    v.estado === "calificado"
                ) || [];

              setViajesCompletados(completados.length);

      };

  useEffect(() => {
    const conductorGuardado =
      localStorage.getItem("conductor");

    if (!conductorGuardado) {
      window.location.href = "/loginconductor";
      return;
    }

    setConductor(JSON.parse(conductorGuardado));
  }, []);

      useEffect(() => {
        if (!conductor?.id) return;

        cargarViajes();

        const intervalo = setInterval(() => {
          cargarViajes();
        }, 2000);

        return () => clearInterval(intervalo);
      }, [conductor]);

      useEffect(() => {
  if (!conductor?.id) return;

  const actualizarUbicacion = () => {
    // PASO 1 FASE 2
    navigator.geolocation.getCurrentPosition(
      async (posicion) => {
        const lat = posicion.coords.latitude;
        const lng = posicion.coords.longitude;
        setMiLat(lat);
        setMiLng(lng);

        

       await supabase
          .from("conductores")
          .update({
            latitud: lat,
            longitud: lng,
          })
          .eq("id", conductor.id);
     

      },
      (error) => {
        console.error(error);
      }
    );
  };

  // PASO 2 FASE 2

  actualizarUbicacion();

  const intervalo = setInterval(
    actualizarUbicacion,
    2000
  );

  return () => clearInterval(intervalo);
}, [conductor]);


    const aceptarViaje = async (viajeId: string) => {
        const { error } = await supabase
          .from("viajes")
          .update({
            estado: "aceptado",
            conductor_id: conductor?.id,
          })
          .eq("id", viajeId);

        if (error) {
          console.error(error);
          return;
        }

        cargarViajes();
      };

      const iniciarViaje = async (viajeId: string) => {
        if (!viajeActual) return;
                const { data: conductorActual } = await supabase
            .from("conductores")
            .select("latitud, longitud")
            .eq("id", conductor.id)
            .single();

          if (!conductorActual) return;


        const usuarioLat = viajeActual.origen_lat;
        const usuarioLng = viajeActual.origen_lng;


        // calculo de distancia 

        const R = 6371;

        const dLat =
          ((usuarioLat - conductorActual.latitud) * Math.PI) / 180;

        const dLng =
          ((usuarioLng - conductorActual.longitud) * Math.PI) / 180;

        const a =
          Math.sin(dLat / 2) *
            Math.sin(dLat / 2) +
          Math.cos(
            (conductorActual.latitud * Math.PI) / 180
          ) *
            Math.cos(
              (usuarioLat * Math.PI) / 180
            ) *
            Math.sin(dLng / 2) *
            Math.sin(dLng / 2);

        const c =
          2 *
          Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
          );

        const distancia = R * c;

        if (distancia > 0.2) {
  alert(
    `Debes llegar al pasajero. Distancia actual: ${distancia.toFixed(2)} km`
  );

  return;
}



        const { error } = await supabase
          .from("viajes")
          .update({
            estado: "en_curso",
          })
          .eq("id", viajeId);

        if (error) {
          console.error(error);
          return;
        }

        cargarViajes();
      };

      const finalizarViaje = async (viajeId: string) => {
      const { error } = await supabase
        .from("viajes")
        .update({
          estado: "completado",
        })
        .eq("id", viajeId);

      if (error) {
        console.error(error);
        return;
      }

      cargarViajes();
    };

const obtenerZona = (direccion: string) => {
  if (!direccion) return "Zona desconocida";

  const partes = direccion.split(",");

  if (partes.length > 1) {
    return partes[1].trim();
  }

  return partes[0].replace(/^\d+\s*/, "").trim();
};



  return (
   <main className="min-h-screen bg-slate-100 pb-24">

                    <Mapa
              destino={
                viajeActual?.estado === "en_curso"
                  ? viajeActual?.destino
                  : ""
              }
              ubicacionBuscada=""
              estadoViaje={viajeActual?.estado}
              pasajeroLat={viajeActual?.origen_lat}
              pasajeroLng={viajeActual?.origen_lng}
            />

      <div className="max-w-md mx-auto -mt-4 relative z-50">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-lg p-6">
          <h1 className="text-2xl font-bold">
            👋 Hola, {conductor?.nombre || "Conductor"}
          </h1>

          <p className="mt-2 text-green-600 font-semibold">
            💳 Créditos: {conductor?.creditos ?? 0}
          </p>

          <p className="mt-2">
            {conductor?.verificado
              ? "✅ Conductor verificado"
              : "⏳ Pendiente de verificación"}
          </p>

          <button
            onClick={() => {
              localStorage.removeItem("conductor");
              window.location.href =
                "/loginconductor";
            }}
            className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl"
          >
            🚪 Cerrar sesión
          </button>
        </div>

        {/* Estado */}
        <div className="mt-4 bg-white rounded-3xl shadow-lg p-6">
          <h2 className="text-xl font-bold">
            Estado del conductor
          </h2>

          <div
            onClick={() => setDisponible(!disponible)}
            className={`mt-3 rounded-xl p-3 font-semibold cursor-pointer ${
              disponible
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {disponible
              ? "🟢 Disponible"
              : "🔴 No disponible"}

          </div>

        {/* Solicitudes */}
        <div className="mt-4 bg-white rounded-3xl shadow-lg p-6">
          <h2 className="text-xl font-bold">
            📥 Solicitudes de Viaje
          </h2>
                {!disponible ? (
              <div className="mt-3 rounded-xl bg-red-50 p-4 text-center">
                <h3 className="font-semibold text-red-700">
                  📴 No estás recibiendo viajes
                </h3>

                <p className="mt-2 text-sm text-gray-600">
                  Cambia tu estado a Disponible para comenzar a recibir solicitudes.
                </p>
              </div>  
            ) : (
           viajes.length === 0 ? (
            <div className="mt-3 rounded-xl bg-blue-50 p-4 text-center">
              <h3 className="font-semibold text-blue-700">
                🚕 Esperando solicitudes
              </h3>

              <p className="mt-2 text-sm text-gray-600">
                Te notificaremos cuando un usuario solicite un viaje.
              </p>
            </div>
          ) : (
            <div className="mt-3 rounded-xl bg-yellow-50 p-4 text-center">
              <h3 className="font-semibold text-yellow-700">
                🚨 Solicitud nueva
              </h3>
            </div>
          )
          )}

          {disponible &&
           viajes.map((viaje) => (
                              <div
                                key={viaje.id}
                                className="mt-3 rounded-xl bg-green-50 p-4"
                              >

                               
                          <p>
                            📍 Cliente a{" "}
                            {calcularDistancia(
                              conductor?.latitud,
                              conductor?.longitud,
                              viaje.origen_lat,
                              viaje.origen_lng
                            )} km
                          </p>

                         <p>
                      📍 Zona origen:
                      {obtenerZona(viaje.origen)}
                    </p>

                          <p>
                            🏁 Zona destino:
                            {obtenerZona(viaje.destino)}
                          </p>

                          <p>
                            Estado: {viaje.estado}
                          </p>
                                <div className="grid grid-cols-2 gap-2 mt-3">

                                 <button
                                    onClick={() => aceptarViaje(viaje.id)}
                                    className="bg-green-600 text-white py-2 rounded-xl"
                                  >
                                    ✅ Aceptar
                                  </button>

                                  <button
                                    className="bg-red-500 text-white py-2 rounded-xl"
                                  >
                                    ❌ Rechazar
                                  </button>
                                </div>
                              </div>
                            ))}
                  </div>
                    {viajeActual && (
                      <div className="mt-4 bg-green-600 text-white rounded-3xl shadow-lg p-6">
                        <h2 className="text-xl font-bold">
                          🚖 Viaje Actual
                        </h2>

                       {viajeActual.estado === "aceptado" && (
                      <>
                        <p className="font-bold mt-3 text-yellow-200">
                          ⏳ Esperando confirmación del usuario
                        </p>

                        <p className="mt-2 text-sm">
                          El usuario debe confirmar que desea viajar contigo.
                        </p>
                      </>
                    )}


                        {viajeActual.estado === "confirmado" && (
                          <>
                            <p className="mt-3">
                              📍 Recoger pasajero:
                            </p>

                            <p>
                              {viajeActual.origen}
                            </p>

                            <p>
                              📝 {viajeActual.referencia_origen}
                            </p>

                            <p className="font-bold mt-2">
                              🛵 Pasajero esperando
                            </p>

                          <p className="mt-2">
                          📍 Distancia al pasajero:
                          {distanciaPasajero} km
                        </p>
                          {llegoPasajero && (
                          <p className="font-bold text-yellow-200 mt-2">
                            ✅ Has llegado al pasajero
                          </p>
                        )}
                          </>
                        )}

                        {viajeActual.estado === "en_curso" && (
                          <>
                            <p className="mt-3">
                              🏁 Destino:
                            </p>

                            <p>
                              {viajeActual.destino}
                            </p>

                            <p>
                              📝 {viajeActual.referencia_destino}
                            </p>

                            <p className="font-bold mt-2">
                              🚖 Viaje en curso
                            </p>
                          </>
                        )}

                {viajeActual.estado === "en_curso" && (
                  <div className="mt-3">
                    <button
                      onClick={() => finalizarViaje(viajeActual.id)}
                      className="w-full bg-red-700 text-white py-2 rounded-xl"
                    >
                      ✅ Finalizar Viaje
                    </button>
                  </div>
                )}


                    {viajeActual.estado === "confirmado" && (
                        <div className="grid grid-cols-2 gap-2 mt-3">
                          <button
                            onClick={() => iniciarViaje(viajeActual.id)}
                            disabled={!llegoPasajero}
                            className={`py-2 rounded-xl text-white ${
                              llegoPasajero
                                ? "bg-blue-500 hover:bg-blue-600"
                                : "bg-gray-400 cursor-not-allowed"
                            }`}
                          >
                            {llegoPasajero
                              ? "🚕 Iniciar Viaje"
                              : "📍 Llega al pasajero"}
                          </button>

                          <button
                          onClick={() => finalizarViaje(viajeActual.id)}
                          className="bg-red-700 text-white py-2 rounded-xl"
                        >
                          ✅ Finalizar
                        </button>
                        </div>
                      )}
                      </div>
                    )}
        {/* Estadísticas */}
        <div className="mt-4 bg-white rounded-3xl shadow-lg p-6">
          <h2 className="text-xl font-bold">
            📊 Resumen
          </h2>

          <div className="mt-4 space-y-3">
            <div className="border rounded-xl p-3">
              🚕 Viajes completados: {viajesCompletados}
            </div>

            <div className="border rounded-xl p-3">
              ⭐ Calificación promedio: {calificacionPromedio}
            </div>

            <div className="border rounded-xl p-3">
              📈 Tasa de aceptación: 95%
            </div>
          </div>
        </div>

        {/* Vehículo */}
        <div className="mt-4 bg-white rounded-3xl shadow-lg p-6">
          <h2 className="text-xl font-bold">
            🛵 Información del Vehículo
          </h2>

          <p className="mt-3">
            Vehículo: {conductor?.vehiculo}
          </p>

          <p>
            Placa: {conductor?.placa}
          </p>
        </div>

      </div>
      </div>
    </main>
  );
}