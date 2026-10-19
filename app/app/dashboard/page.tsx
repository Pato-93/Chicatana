"use client";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Car, Package, Clock, User, DollarSign, Motorbike } from "lucide-react";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

const Mapa = dynamic(
  () => import("@/components/Mapa"),
  {
    ssr: false,
  }
);

export default function DashboardPage() {
  const [buscando, setBuscando] = useState(false);
  const [conductorEncontrado, setConductorEncontrado] = useState(false);
  const [viajeActivo, setViajeActivo] = useState(false);
  const [conductorEnCamino, setConductorEnCamino] = useState(false);
  const [viajeConfirmado, setViajeConfirmado] = useState(false);
  const [viajeCompletado, setViajeCompletado] = useState(false);
  const [destino, setDestino] = useState("");
  const [sugerencias, setSugerencias] = useState<any[]>([]);
  const [destinoBuscado, setDestinoBuscado] = useState("");
  const [origenLat, setOrigenLat] = useState<number | null>(null);
  const [origenLng, setOrigenLng] = useState<number | null>(null);
  const [destinoLat, setDestinoLat] = useState<number | null>(null);
  const [destinoLng, setDestinoLng] = useState<number | null>(null);
  const [distancia, setDistancia] = useState(0);
  const [tiempo, setTiempo] = useState(0);
  const [usuario, setUsuario] = useState<any>(null);
  const [viaje, setViaje] = useState<any>(null);
  const [nombreConductor, setNombreConductor] = useState("");
  const userName = usuario?.nombre || "Usuario";
  const [viajeCalificado, setViajeCalificado] = useState(false);
  const [direccionActual, setDireccionActual] = useState("");
  const [ubicacionBuscada, setUbicacionBuscada] = useState("");
  const [referenciaOrigen, setReferenciaOrigen] = useState("");
  const [referenciaDestino, setReferenciaDestino] = useState("");
  const [sugerenciasOrigen, setSugerenciasOrigen] = useState<any[]>([]);
  const [editandoOrigen, setEditandoOrigen] = useState(false);
  const [editandoDestino, setEditandoDestino] = useState(false);
  const [conductorLat, setConductorLat] = useState<number | null>(null);
  const [conductorLng, setConductorLng] = useState<number | null>(null);
  const [distanciaConductor, setDistanciaConductor] = useState(0);
  const [minutosLlegada, setMinutosLlegada] = useState(0);


  useEffect(() => {
  
}, [conductorLat, conductorLng]);



useEffect(() => {
  if (
    !conductorLat ||
    !conductorLng ||
    !origenLat ||
    !origenLng
  )
    return;

  const R = 6371;

  const dLat =
    ((origenLat - conductorLat) * Math.PI) / 180;

  const dLng =
    ((origenLng - conductorLng) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) *
      Math.sin(dLat / 2) +
    Math.cos(
      (conductorLat * Math.PI) / 180
    ) *
      Math.cos(
        (origenLat * Math.PI) / 180
      ) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c =
    2 * Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  const distancia = R * c;

  setDistanciaConductor(
    Number(distancia.toFixed(1))
  );

  setMinutosLlegada(
    Math.max(
      1,
      Math.round((distancia / 20) * 60)
    )
  );
}, [
  conductorLat,
  conductorLng,
  origenLat,
  origenLng,
]);




  useEffect(() => {
      
      }, [
        origenLat,
        origenLng,
        destinoLat,
        destinoLng,
      ]);

        useEffect(() => {
          if (
            origenLat === null ||
            origenLng === null ||
            destinoLat === null ||
            destinoLng === null
          )
            return;

          const R = 6371;

          const dLat =
            ((destinoLat - origenLat) * Math.PI) / 180;

          const dLng =
            ((destinoLng - origenLng) * Math.PI) / 180;

          const a =
            Math.sin(dLat / 2) *
              Math.sin(dLat / 2) +
            Math.cos((origenLat * Math.PI) / 180) *
              Math.cos((destinoLat * Math.PI) / 180) *
              Math.sin(dLng / 2) *
              Math.sin(dLng / 2);

          const c =
            2 *
            Math.atan2(
              Math.sqrt(a),
              Math.sqrt(1 - a)
            );

          const km = R * c;

          setDistancia(km);

          setTiempo(Math.round(km / 40 * 60));
        }, [
          origenLat,
          origenLng,
          destinoLat,
          destinoLng,
        ]);



                useEffect(() => {
                if (direccionActual.length < 3) {
                  setSugerenciasOrigen([]);
                  return;
                }

                      {/* Limitar las zonas de busqueda */}

                const buscarSugerencias = async () => {
                  try {
                   const respuesta = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                      direccionActual + " Tuscaloosa Alabama"
                    )}&limit=3`
                  );

                    const data = await respuesta.json();

                    setSugerenciasOrigen(data);
                  } catch (error) {
                    console.error(error);
                  }
                };

                const timeout = setTimeout(buscarSugerencias, 500);

                return () => clearTimeout(timeout);
              }, [direccionActual]);




                      useEffect(() => {
              if (!destino) {
                setDestinoLat(null);
                setDestinoLng(null);
                setSugerencias([]);
                return;
              }

              if (destino.length < 3) {
                setSugerencias([]);
                return;
              }

                    {/* limitar las zonas de busqueda */}

              const buscarSugerencias = async () => {
                try {
                const respuesta = await fetch(
                  `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                    destino + " Tuscaloosa Alabama"
                  )}&limit=3`
                );

                  const data = await respuesta.json();

                  setSugerencias(data);
                } catch (error) {
                  console.error(error);
                }
              };

              const timeout = setTimeout(buscarSugerencias, 500);

              return () => clearTimeout(timeout);
            }, [destino]);


    useEffect(() => {
      const usuarioGuardado =
        localStorage.getItem("usuario");

      if (!usuarioGuardado) {
        window.location.href = "/login";
        return;
      }

      setUsuario(JSON.parse(usuarioGuardado));
    }, []);

          useEffect(() => {
          if (!usuario?.id) return;

          verificarViaje();
          cargarViajesRecientes();

          const intervalo = setInterval(() => {
            verificarViaje();
          }, 2000);

          return () => clearInterval(intervalo);
        }, [usuario]);

        const confirmarViaje = async () => {
          const { error } = await supabase
            .from("viajes")
            .update({
              estado: "confirmado",
            })
            .eq("id", viaje?.id);

          if (error) {
            console.error(error);
            return;
          }
        };
   const buscarOtroConductor = async () => {
            const { error } = await supabase
              .from("viajes")
              .update({
                estado: "pendiente",
                conductor_id: null,
              })
              .eq("id", viaje?.id);

            if (error) {
              console.error(error);
              return;
            }

            setConductorEncontrado(false);
            setBuscando(true);
          };

          const cancelarViaje = async () => {
            const { error } = await supabase
              .from("viajes")
              .update({
                estado: "cancelado",
              })
              .eq("id", viaje?.id);

            if (error) {
              console.error(error);
              return;
            }

            setConductorEncontrado(false);
            setBuscando(false);
            setViaje(null);
          };

        const verificarViaje = async () => {
            const { data, error } = await supabase
            .from("viajes")
            .select("*")
            .eq("usuario_id", usuario?.id)
            .order("created_at", { ascending: false })
            .limit(1);

      if (error) {
        console.error(error);
        return;
      }

    const viajeActual = data?.[0];

        if (!viajeActual) return;

        if (
          viajeActual.estado === "calificado" ||
          viajeActual.estado === "cancelado"
        ) {
          return;
        }

        setViaje(viajeActual);

        setDestinoLat(viajeActual.destino_lat);
        setDestinoLng(viajeActual.destino_lng);
        setDestinoBuscado(viajeActual.destino);


        setOrigenLat(viajeActual.origen_lat);
        setOrigenLng(viajeActual.origen_lng);

                    if (viajeActual.conductor_id) {

                const { data: conductor } = await supabase
                  .from("conductores")
                  .select("nombre, latitud, longitud")
                  .eq("id", viajeActual.conductor_id)
                  .single();

                if (conductor) {
                  setNombreConductor(conductor.nombre);

                  setConductorLat(conductor.latitud);
                  setConductorLng(conductor.longitud);
                }
              }
        if (!viajeActual) return;

                  if (viajeActual.estado === "aceptado") {
              setConductorEncontrado(true);
            }

            if (viajeActual.estado === "confirmado") {
            setBuscando(false);
            setConductorEncontrado(false);
            setConductorEnCamino(true);
          }
            if (viajeActual.estado === "en_curso") {
              setBuscando(false);
              setConductorEncontrado(false);
              setConductorEnCamino(false);
              setViajeActivo(true);
            }
            if (
              viajeActual.estado === "completado" &&
              !viajeCalificado
            ) {
              setBuscando(false);
              setConductorEncontrado(false);
              setConductorEnCamino(false);
              setViajeActivo(false);

              setViajeCompletado(true);
              setMostrarCalificacion(true);
            }

           if (viajeActual.estado === "calificado") {
            setBuscando(false);
            setConductorEncontrado(false);
            setConductorEnCamino(false);
            setViajeActivo(false);
            setViajeCompletado(false);
            setMostrarCalificacion(false);

            setDestino("");
            setDestinoBuscado("");

            setDestinoLat(null);
            setDestinoLng(null);

            setDistancia(0);
            setTiempo(0);

            setViaje(null);

            return;
          }

        if (viajeActual.estado === "cancelado") {
          setDestino("");
          setDestinoBuscado("");

          setDestinoLat(null);
          setDestinoLng(null);

          setDistancia(0);
          setTiempo(0);

          setReferenciaDestino("");

          setViaje(null);

          return;
        }

    };

     const solicitarViaje = async () => {
      
          if (!destino) {
            alert("Ingresa un destino");
            return;
          }
          

                        if (!referenciaOrigen.trim()) {
                alert("Ingresa una referencia de origen");
                return;
              }

              if (!referenciaDestino.trim()) {
                alert("Ingresa una referencia de destino");
                return;
              }



          const { error } = await supabase
            .from("viajes")
          .insert([
          {
            usuario_id: usuario?.id,

            origen: direccionActual,
            destino: destino,

            referencia_origen: referenciaOrigen,
            referencia_destino: referenciaDestino,

            origen_direccion: direccionActual,

            origen_lat: origenLat,
            origen_lng: origenLng,

            destino_lat: destinoLat,
            destino_lng: destinoLng,

            distancia_km: distancia,
            tiempo_min: tiempo,

            estado: "pendiente",
          },
        ]);


          if (error) {
            console.error(error);
            alert("Error al solicitar viaje");
            return;
          }

          alert("Viaje solicitado correctamente");
          setViajeCompletado(false);
          setBuscando(true);
         
        };

          const finalizarViaje = () => {
          setViajeActivo(false);
          setViajeCompletado(true);
          setMostrarCalificacion(true);
        };


    const [calificacion, setCalificacion] = useState(0);
    const [mostrarCalificacion, setMostrarCalificacion] = useState(false);

     const [viajesRecientes, setViajesRecientes] = useState<
              {
            ruta: string;
            conductor: string;
            calificacion?: number;
          }[]
      >([]);

                    const cargarViajesRecientes = async () => {
                const { data, error } = await supabase
                  .from("viajes")
                  .select(`
                          *,
                          conductores (
                            nombre
                          )
                        `)
                  .eq("usuario_id", usuario?.id)
                  .eq("estado", "calificado")
                  .order("created_at", { ascending: false });

                if (error) {
                  console.error(error);
                  return;
                }

                  setViajesRecientes(
                      (data || []).map((viaje) => ({
                        ruta: viaje.destino,
                        conductor: viaje.conductores?.nombre || "Sin conductor",
                        calificacion: viaje.calificacion,
                      }))
                    );
              };

      const calificarConductor = async (estrellas: number) => {
              setCalificacion(estrellas);

              await supabase
              .from("viajes")
              .update({
                calificacion: estrellas,
                estado: "calificado",
              })
              .eq("id", viaje?.id);

           await cargarViajesRecientes();

              setMostrarCalificacion(false);
              setViajeCompletado(false);
              setViajeCalificado(true);
              setReferenciaDestino("");

            setDestino("");
            setDestinoBuscado("");
            setDestinoLat(null);
            setDestinoLng(null);
            setDistancia(0);
            setTiempo(0);
            setViaje(null);
            setDestino("");
            setReferenciaOrigen("");
            setReferenciaDestino("");

            };



  return (
    
    <main className="min-h-screen bg-slate-100 pb-24">
     
            {/* Barra inferior */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
              <div className="max-w-md mx-auto flex justify-around py-3">

                <Link
                  href="/"
                  className="flex flex-col items-center text-gray-500">
                 🏠
                 <span className="text-xs">Inicio</span>
                </Link>

                <button className="flex flex-col items-center text-gray-500">
                  <span>🚕</span>
                  <span className="text-xs">Viajes</span>
                </button>

                <button className="flex flex-col items-center text-gray-500">
                  <span>📦</span>
                  <span className="text-xs">Mandados</span>
                </button>

                <button className="flex flex-col items-center text-gray-500">
                  <span>👤</span>
                  <span className="text-xs">Perfil</span>
                </button>

              </div>
            </div>

           <Mapa
             destino={
                viaje?.estado === "confirmado"
                  ? ""
                  : destinoBuscado
              }
              ubicacionBuscada={ubicacionBuscada}
              estadoViaje={viaje?.estado}
              conductorLat={conductorLat}
              conductorLng={conductorLng}
              destinoLat={destinoLat}
              destinoLng={destinoLng}
              onUbicacionChange={(lat, lng) => {
                setOrigenLat(lat);
                setOrigenLng(lng);
              }}
              onDestinoChange={(lat, lng) => {
                setDestinoLat(lat);
                setDestinoLng(lng);
              }}
              onDestinoDireccionChange={(direccion) => {
                setDestino(direccion);
              }}
              onDireccionChange={(direccion) => {
                setDireccionActual(direccion);
              }}
              
            />



<div className="max-w-md mx-auto">
           {/* Header */}
            <div className="bg-white rounded-2xl shadow-lg p-5 -mt-4 mx-4 relative z-50">
              <div className="flex items-center justify-between">
                
                <div>
                  <h2 className="text-2xl font-bold">
                    👋 Hola, {userName}
                  </h2>

                  <p className="text-green-600 font-semibold">
                    💳 Créditos: {usuario?.creditos ?? 0}
                  </p>

                  <button
                  onClick={() => {
                    localStorage.removeItem("usuario");
                    window.location.href = "/login";
                  }}
                  className="mt-3 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl"
                >
                  🚪 Cerrar Sesión
                </button>

                  

                </div>

                <img
                  src="/Chicatana.jpg"
                  alt="Chicatana"
                  className="w-30 h-30 rounded-full"/>
        </div>
         </div>


       {/* Tarjeta principal */}
        <div className="mt-10 w-full max-w-md rounded-3xl bg-white p-6 text-black shadow-xl">
              <h2 className="mb-4 text-2xl font-bold">
            ¿En donde estoy?
          </h2>
            <input
                value={direccionActual}
                onFocus={() => setEditandoOrigen(true)}
                onBlur={() => {
                      setTimeout(() => {
                        setEditandoOrigen(false);
                      }, 200);
                    }}
                onChange={(e) => setDireccionActual(e.target.value)}
                className="w-full rounded-xl border border-gray-300 p-3 outline-none"
              />
                           {editandoOrigen &&
                            direccionActual.length > 3 &&
                            sugerenciasOrigen.length > 0 && (
                <div className="bg-white border rounded-xl mt-2 overflow-hidden shadow">
                  {sugerenciasOrigen.map((sugerencia, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => {
                          const direccionCorta = sugerencia.display_name
                          .split(",")
                          .slice(0, 3)
                          .join(",")
                          .trim();

                        setDireccionActual(direccionCorta);
                        setUbicacionBuscada(sugerencia.display_name);
                                                  setSugerenciasOrigen([]);
                        }}
                      className="w-full text-left p-3 hover:bg-gray-100 border-b"
                    >
                     📍 {sugerencia.display_name.split(",").slice(0, 2).join(",")}
                    </button>
                  ))}
                </div>
              )}
               <input
                type="text"
                placeholder="📝Referencia donde estoy (portón rojo, iglesia, etc.)"
                value={referenciaOrigen}
                onChange={(e) =>
                  setReferenciaOrigen(e.target.value)
                }
                className="w-full mt-3 rounded-xl border p-3"
              />

          <h2 className="mb-3 text-2xl font-bold">
            ¿A dónde vas?
          </h2>

         <input
                    type="text"
                    placeholder="🏁 Ingresa tu destino"
                    value={destino}
                    onFocus={() => setEditandoDestino(true)}
                    onBlur={() => {
                      setTimeout(() => {
                        setEditandoDestino(false);
                      }, 200);
                    }}
                    onChange={(e) => setDestino(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 p-3 outline-none"
                  />
         {editandoDestino && sugerencias.length > 0 && (
                <div className="bg-white border rounded-xl mt-2 overflow-hidden">
                  {sugerencias.map((sugerencia, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => {
                        const destinoCorto = sugerencia.display_name
                          .split(",")
                          .slice(0, 3)
                          .join(",")
                          .trim();

                        setDestino(destinoCorto);
                        setDestinoBuscado(sugerencia.display_name);
                        setSugerencias([]);
                        setEditandoDestino(false);
                      }}
                      className="w-full text-left p-3 hover:bg-gray-100 border-b"
                    >
                      📍 {sugerencia.display_name.split(",").slice(0, 2).join(",")}
                    </button>
                  ))}
                </div>
              )}

       <input
            type="text"
            placeholder="📝Referencia donde voy (portón rojo, iglesia, etc.)"
            value={referenciaDestino}
            onChange={(e) =>
              setReferenciaDestino(e.target.value)
            }
            className="w-full mt-3 rounded-xl border p-3"
          />

      {/* Acciones */}
      <section className="p-4">
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={solicitarViaje}
            className="bg-green-600 text-white rounded-3xl p-6 shadow-lg">
            <Motorbike size={40} />
            <span>Pedir Viaje</span>
          </button>


          <button className="h-32 bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-3xl shadow-xl flex flex-col items-center justify-center">
            <Package size={36} />
            <span className="mt-2 font-semibold">
              Mandadito
            </span>
          </button>
        </div>
      </section>

      {/* Tarifa */}
     {distancia > 0 &&
      !conductorEnCamino &&
      !viajeActivo &&
      !viajeCompletado &&
      !mostrarCalificacion && (
      <section className="px-4">
       <div className="bg-white border-2 border-green-500 rounded-3xl p-6 shadow-lg">
          <h3 className="text-green-600 font-bold text-lg">
            📍 Resumen del viaje
          </h3>

          <div className="mt-4">
            <p className="text-sm text-gray-500">
              Distancia
            </p>

            <p className="text-4xl font-bold text-green-600">
              {distancia.toFixed(1)} km
            </p>
          </div>

          <div className="mt-4">
            <p className="text-sm text-gray-500">
              Tiempo estimado
            </p>

            <p className="text-xl font-semibold">
              ⏱️ {tiempo} min aprox.
            </p>
          </div>
        </div>
      </section>

      )}

      

          {/* Viaje en curso */}
          <section className="px-4">
                  {conductorEnCamino && (
                        <div className="mt-4 bg-yellow-500 text-white rounded-3xl p-5">
                          <h3 className="text-xl font-bold">
                            🛵 Conductor en camino
                          </h3>

                          <div className="mt-2">
                            <p>👤 {nombreConductor}</p>
                          </div>

                          <p>
                            Vehículo: Mototaxi
                          </p>
                                                        <p>
                                📍 Distancia: {distanciaConductor} km
                              </p>

                              <p>
                                ⏱️ Llegada estimada: {minutosLlegada} min
                              </p>

                          <p className="font-bold mt-2">
                            Estado: En camino hacia ti 🛵
                          </p>
                        </div>
                      )}

                      
                      {viajeActivo && (
                        <div className="mt-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-3xl p-5">
                          <h3 className="text-xl font-bold">
                            🚖 Viaje en curso
                          </h3>

                          <div className="mt-2">
                            <p>👤 Conductor: {nombreConductor}</p>
                          </div>

                          <p>
                            Vehículo: Mototaxi
                          </p>

                          <p>
                          📍 Distancia restante: {distancia.toFixed(1)} km
                        </p>

                        <p>
                          ⏱️ Tiempo restante: {tiempo} min
                        </p>

                          <p className="font-bold mt-2">
                            Estado: En camino ✅
                          </p>
                          <div className="grid grid-cols-2 gap-4 mt-4">
                              <button
                                onClick={() => setViajeActivo(false)}
                                className="bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold"
                              >
                                Cancelar
                              </button>

                              <button
                                onClick={() => finalizarViaje()}
                                className="bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-semibold"
                              >
                                Finalizar 
                              </button>
                            </div>
                        </div>
                        
                      )}

                      {/* Viaje completado */}

                      {viajeCompletado && (
                    <div className="mt-4 bg-blue-600 text-white rounded-3xl p-5 shadow-lg">
                      <h3 className="text-xl font-bold">
                        🎉 Viaje completado
                      </h3>

                      <p className="mt-2">
                        Gracias por viajar con Chicatana
                      </p>

                      <p className="text-sm mt-1">
                        Esperamos verte pronto 🚖
                      </p>
                    </div>
                  )}

                  {/* Mostrar calificacion */}
            {viajeCompletado && mostrarCalificacion && (
              <div className="bg-yellow-400 rounded-3xl p-6 mt-4 text-center">
                <h3 className="font-bold text-2xl">
                  ⭐ Califica tu conductor
                </h3>

                <p className="mt-2">
                  ¿Cómo fue tu experiencia?
                </p>

                <div className="flex justify-center gap-2 mt-3">
                  {[1, 2, 3, 4, 5].map((estrella) => (
                    <button
                      key={estrella}
                      onClick={() => calificarConductor(estrella)}
                      className="text-4xl"
                    >
                      ⭐
                    </button>
                  ))}
                </div>
              </div>
            )}
                
              
          </section>
      
      
          

      {/* Viajes recientes*/}
      <section className="p-4">
        <h2 className="flex items-center gap-2 font-bold text-lg mb-3">
          <Clock size={20} />
          Viajes recientes
        </h2>

          {/* Viajes calificaciones*/}
              <div className="space-y-5 mt-5">
             {viajesRecientes.slice(0, 2).map((viaje, index) => (
                <div
                  key={index}
                  className="border rounded-2xl p-5 bg-white mb-5 shadow-sm"
                >
                  <p className="font-semibold">
                    📍{viaje.ruta}
                  </p>

                  <p className="text-gray-500">
                    👤{viaje.conductor}
                  </p>

                  {"calificacion" in viaje && (
              <p className="text-yellow-500">
                {"⭐".repeat(Number(viaje.calificacion))}
              </p>
            )}
                </div>
              ))}
            </div>

      </section>




      {/* Perfil */}
      <section className="px-4">
        <button className="w-full border rounded-2xl p-4 flex items-center gap-3">
          <User size={22} className="text-green-600" />
          <span>Mi Perfil</span>
        </button>
      </section>

      {/* Botón flotante */}
      <button className="fixed bottom-6 right-6 w-16 h-16 bg-green-600 rounded-full shadow-2xl text-white flex items-center justify-center">
        <Car size={28} />
      </button>
          </div>
            </div>
      {/* Buscando */}
            {buscando && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white p-8 rounded-3xl shadow-xl text-center">
                <div className="text-5xl mb-4">🔍</div>

                <h2 className="text-2xl font-bold">
                  Buscando conductor...
                </h2>

                <p className="text-gray-500 mt-2">
                  Buscando motos cercanas
                </p>
              </div>
            </div>
          )}

         {/* Conductor encontrado */}
          {conductorEncontrado && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white p-8 rounded-3xl shadow-xl w-[350px] text-center">

      <div className="text-5xl mb-4">
        ✅
      </div>

      <h2 className="text-2xl font-bold text-green-600">
        Conductor encontrado
      </h2>

      <div className="mt-6 space-y-3 text-left">
        <p>👤 {nombreConductor}</p>
        <p>🛵 Mototaxi</p>
        <p>📍 {distanciaConductor} km</p>
        <p>⏱️ Llegada: {minutosLlegada} min</p>
      </div>

                  <div className="mt-6 space-y-3">
              <button
                onClick={confirmarViaje}
                className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold"
              >
                ✅ Aceptar conductor
              </button>

              <button
                onClick={buscarOtroConductor}
                className="w-full bg-yellow-500 text-white py-3 rounded-xl font-semibold"
              >
                🔄 Buscar otro conductor
              </button>
              <button
                onClick={cancelarViaje}
                className="w-full bg-red-500 text-white py-3 rounded-xl font-semibold"
              >
                ❌ Cancelar viaje
              </button>
            </div>
    </div>
  </div>
)}


    </main>

  );
}