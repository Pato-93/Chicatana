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

   const registrarUsuario = async () => {
    const { error } = await supabase
      .from("usuarios")
      .insert([
        {
          nombre,
          telefono,
          correo,
          password,
        },
      ]);

    if (error) {
      console.error(error);
      alert("Error al registrar usuario");
      return;
    }

    alert("Usuario registrado correctamente");
  };


  return (
    <main className="min-h-screen bg-gradient-to-b from-[#082F49] via-[#0369A1] to-[#14B8A6] flex flex-col items-center justify-center p-6">
       <div className="mb-8 flex flex-col items-center text-white">
            {/* Logo */}
               <div className="overflow-hidden rounded-full border-4 border-white shadow-2xl">
                 <Image
                   src="/Chicatana.jpg"
                   alt="Logo Chicatana"
                   width={320}
                   height={320} />
               </div>
            <p className="mt-2 text-lg text-white/90">
            Moviendo la Costa, viaje a viaje.
            </p>
        </div>
      
        
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">

        <h1 className="text-3xl font-bold text-center">
          👤 Registro de Usuario
        </h1>

        <p className="mt-2 text-center text-gray-500">
          Crea tu cuenta en Chicatana
        </p>

        <div className="mt-6 space-y-4">

         <input
              type="text"
              placeholder="Nombre completo"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full rounded-xl border p-3"
            />

          <input
              type="tel"
              placeholder="Teléfono"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className="w-full rounded-xl border p-3"
            />

          <input
              type="email"
              placeholder="Correo electrónico"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="w-full rounded-xl border p-3"
            />


          <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border p-3"
            />

          <button
              onClick={registrarUsuario}
              className="w-full rounded-xl bg-sky-600 p-4 font-bold text-white"
            >
              Crear Cuenta
            </button>

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
      </div>
    </main>
  );
}