"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";

export default function RegistroPage() {
const [nombre, setNombre] = useState("");
const [telefono, setTelefono] = useState("");
const [correo, setCorreo] = useState("");
const [password, setPassword] = useState("");
const [vehiculo, setVehiculo] = useState("");
const [placa, setPlaca] = useState("");
const [licencia, setLicencia] = useState("");
const [fechaVencimiento, setFechaVencimiento] = useState("");
const registrarConductor = async () => {
const { error } = await supabase
        .from("conductores")
        .insert([
          {
            nombre,
            telefono,
            correo,
            password,
            vehiculo,
            placa,
            licencia,
            fecha_vencimiento: fechaVencimiento,
          },
        ]);

      if (error) {
        console.error(error);
        alert("Error al registrar conductor");
        return;
      }

      alert("Conductor registrado correctamente");
    };
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#082F49] via-[#0369A1] to-[#14B8A6] flex flex-col items-center justify-center p-6">
       <div className="mb-8 flex flex-col items-center text-white">
            {/* Logo */}
               <div className="overflow-hidden rounded-full border-4 border-white shadow-2xl">
                 <Image
                   src="/Chicatana.jpg"
                   alt="Logo Chicatana"
                   width={220}
                   height={220} />
               </div>
            <p className="mt-2 text-lg text-white/90">
            Moviendo la Costa, viaje a viaje.
            </p>
            <p className="mt-2 text-center text-sm text-gray-500">
            ✔ Horarios flexibles • ✔ Más viajes • ✔ Más ingresos
            </p>
            
        </div>
      
        
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">

        <h1 className="text-3xl font-bold text-center">
          🛵 Registro de Conductor
        </h1>

        <p className="mt-2 text-center text-gray-500">
          Gana dinero moviendo Río Grande
        </p>
        <br/>

        {/* INFORMACIÓN PERSONAL */}
        <div className="rounded-xl bg-sky-50 px-3 py-2">
        👤 Información Personal
        </div>
  <br/>
        <input
        type="text"
        placeholder="Nombre completo"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        className="w-full rounded-xl border p-3"
      />
  <br/>
    <br/>
       <input
        type="tel"
        placeholder="Teléfono"
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
        className="w-full rounded-xl border p-3"
      />
  <br/>
    <br/>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          className="w-full rounded-xl border p-3"
        />
  <br/>
    <br/>
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl border p-3"
/>
    <br/>
    <br/>
        {/* VEHÍCULO */}
        <div className="rounded-xl bg-sky-50 px-3 py-2">
        🛵 Información del Vehículo
        </div>
    <br/>
        <select
            value={vehiculo}
            onChange={(e) => setVehiculo(e.target.value)}
            className="w-full rounded-xl border p-3"
          >
            <option value="">Selecciona un vehículo</option>
            <option value="Mototaxi">Mototaxi</option>
            <option value="Motocicleta">Motocicleta</option>
            <option value="Automóvil">Automóvil</option>
          </select>
  <br/>
    <br/>
        <input
          type="text"
          placeholder="Placa"
          value={placa}
          onChange={(e) => setPlaca(e.target.value)}
          className="w-full rounded-xl border p-3"
        />
  <br/>
    <br/>
        {/* LICENCIA */}
        <div className="rounded-xl bg-sky-50 px-3 py-2">
        📄 Licencia
        </div>

    <br/>
        <input
          type="text"
          placeholder="Número de licencia"
          value={licencia}
          onChange={(e) => setLicencia(e.target.value)}
          className="w-full rounded-xl border p-3"
        />
    <br/>
    <br/>
        <input
            type="date"
            value={fechaVencimiento}
            onChange={(e) => setFechaVencimiento(e.target.value)}
            className="w-full rounded-xl border p-3"
          />
  <br/>
    <br/>
        <p className="rounded-xl bg-sky-50 p-3 text-sm text-slate-600">
        🔒 Tus datos serán utilizados únicamente para validar tu cuenta de conductor.
        </p>
        <br/>
  
        <button
          onClick={registrarConductor}
          className="w-full rounded-xl bg-sky-600 p-4 font-bold text-white shadow-lg transition hover:bg-sky-700"
        >

        🛵 Empezar a ganar dinero
        </button>

          <br/>
            <br/>

        <Link
          href="/"
          className="block w-full rounded-2xl bg-[#FF6B6B] py-4 text-center font-bold text-white shadow-xl hover:opacity-90">
         ← Volver al Inicio
         </Link>

        {/* Botón flotante */}
              <button className="fixed bottom-6 right-6 rounded-full bg-sky-600 p-5 text-2xl text-white shadow-2xl transition hover:scale-110">
                🚕
              </button>
              
        </div>
    </main>
  );
}