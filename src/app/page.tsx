import { CosmicTornado3D } from "@/components/CosmicTornado3D";

export default function Page() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full text-center mb-8">
        <h1 className="text-4xl font-extrabold tracking-wider bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-2">
          ELICIT '26 ARCHIVE
        </h1>
        <p className="text-gray-400 text-sm">Immersive 3D Memory Vortex</p>
      </div>

      {/* The 3D WebGL Canvas Component */}
      <CosmicTornado3D />
    </main>
  );
}