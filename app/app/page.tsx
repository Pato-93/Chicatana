import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#082F49] via-[#0369A1] to-[#14B8A6]">
      <div className="flex flex-col items-center px-6 pt-12 text-white">
        {/* Logo */}
        <div className="overflow-hidden rounded-full border-4 border-white shadow-2xl">
          <Image
            src="/Chicatana.jpg"
            alt="Logo Chicatana"
            width={180}
            height={180} />
        </div>

        {/* Título */}
        <h1 className="mt-6 text-center text-5xl font-extrabold tracking-wider">
          CHICATANA
        </h1>

        {/* Eslogan */}
        <p className="mt-3 text-center text-xl text-white/90">
          Moviendo la Costa, Viaje a viaje.
        </p>

        <p className="mt-1 text-center text-white/70">
          Río Grande, Oaxaca
        </p>

        {/* Tarjeta principal */}
        <div className="mt-10 w-full max-w-md rounded-3xl bg-white p-6 text-black shadow-2xl">
          <h2 className="mb-4 text-2xl font-bold">
            ¿A dónde vas?
          </h2>

          <input
            type="text"
            placeholder="📍 Ingresa tu destino"
            className="w-full rounded-xl border border-gray-300 p-3 outline-none"
          />

          <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-100 p-4">
            <span>💰 Tarifa estimada</span>
            <span className="font-bold text-green-600">
              $35 - $50 MXN
            </span>
          
          </div>
          <Link
          href="/login"
          className="block w-full rounded-2xl bg-[#FF6B6B] py-4 text-center font-bold text-white shadow-xl hover:opacity-90">
         🐜 Pedir chicatana
         </Link>
        </div>

        {/* Servicios */}

        <div className="mt-12 grid w-full max-w-5xl gap-5 md:grid-cols-2">
          <div className="rounded-3xl bg-white p-6 text-black shadow-xl">
            <div className="text-4xl">🛵</div>
            <h3 className="mt-3 text-xl font-bold">
              Mototaxi
            </h3>
            <p className="mt-2 text-gray-500">
              Viajes rápidos dentro de Río Grande.
            </p>
           
          </div>

          <div className="rounded-3xl bg-white p-6 text-black shadow-xl">
            <div className="text-4xl">🛒</div>
            <h3 className="mt-3 text-xl font-bold">
              Mandaditos
            </h3>
            <p className="mt-2 text-gray-500">
              Compras y encargos a domicilio.
            </p>

      
          </div>

          <div className="rounded-3xl bg-white p-6 text-black shadow-xl">
            <div className="text-4xl">📦</div>
            <h3 className="mt-3 text-xl font-bold">
              Paquetería
            </h3>
            <p className="mt-2 text-gray-500">
              Entrega segura de paquetes
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 text-black shadow-xl">
            <div className="text-4xl">🔥</div>
            <h3 className="mt-3 text-xl font-bold">
              Promociones locales 
            </h3>
            <p className="mt-2 text-gray-500">
               
              🔥 50 creditos gratis cuando te registras por primera vez
            </p>
          </div>
        </div>

        {/* Registro Usuario */}
        <div className="mt-8 w-full max-w-5xl space-y-4 pb-20">
          <Link
          href="/login"
          className="block w-full rounded-2xl bg-[#FF6B6B] py-4 text-center font-bold text-white shadow-xl hover:opacity-90">
         👤 Iniciar como Usuario
         </Link>

          
        {/* Registro de Conductor */}
          <Link
          href="/loginconductor"
          className="block w-full rounded-2xl bg-[#0369A1] py-4 text-center font-bold text-white shadow-xl hover:opacity-90">
         🛵 Iniciar como conductor
         </Link>
        </div>
        </div>
        
      

      {/* Botón flotante */}
      <button className="fixed bottom-6 right-6 rounded-full bg-sky-600 p-5 text-2xl text-white shadow-2xl transition hover:scale-110">
        🚕
      </button>
    </main>
  );
}