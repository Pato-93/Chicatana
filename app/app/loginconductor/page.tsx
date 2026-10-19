"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");

  const iniciarSesion = async () => {
  const { data, error } = await supabase
  .from("conductores")
  .select("*")
  .eq("correo", correo)
  .eq("password", password);
  if (error) {
    alert("Error a* iniciar sesión");
    return;
  }
  if (data.length === 0) {
    alert("Correo o contraseña incorrectos");
    return;
  }

  alert("Inicio de sesión correcto");

    localStorage.setItem(
  "conductor",
  JSON.stringify(data[0])
);

    window.location.href = "/conductordash";
    };

  
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#082F49] via-[#0369A1] to-[#14B8A6] flex flex-col items-center justify-center p-6">

      {/* Logo */}
     <div className="overflow-hidden rounded-full border-4 border-white shadow-2xl">
     <Image
    src="/Chicatana.jpg"
    alt="Logo Chicatana"
    width={320}
    height={320} />
          </div>            

        <h1 className="mt-4 text-5xl font-extrabold tracking-wider">
          CHICATANA
        </h1>

        <p className="mt-2 text-xl">
          Bienvenido de nuevo
        </p>
     

      {/* Tarjeta */}
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">

        <h2 className="text-center text-3xl font-bold">
          🔐 Iniciar Sesión
        </h2>

        <p className="mt-2 text-center text-gray-500">
          Accede a tu cuenta y muévete con Chicatana.
        </p>

        <div className="mt-6 space-y-4">

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
            onClick={iniciarSesion}
            className="block w-full rounded-2xl bg-[#2791F5] py-4 text-center font-bold text-white shadow-xl"
          >
            🛵 Entrar a Chicatana
          </button>
 
           <Link
          href="/conductor"
          className="block w-full rounded-2xl bg-[#2791F5] py-4 text-center font-bold text-white shadow-xl hover:opacity-90">
         ¿No tienes cuenta? Crear Cuenta
         </Link>
            

          <button className="w-full rounded-xl bg-sky-600 p-4 font-bold text-white shadow-lg">
            ¿Olvidaste tu contraseña?
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