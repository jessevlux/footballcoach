export default function ARPage() {
  return (
    <div className="grid grid-cols-4 gap-4 w-full h-screen bg-slate-300 max-w-sm mx-auto">
      <a
        rel="ar"
        href="/models/teapot.usdz"
        className="text-blue-600 underline text-xl col-start-2 col-span-2 self-center justify-self-center"
      >
        View Teapot in AR
      </a>
    </div>
  );
}
