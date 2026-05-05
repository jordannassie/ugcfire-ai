export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Brand */}
        <div className="flex items-center justify-center gap-1">
          <span
            className="text-4xl font-black tracking-tight"
            style={{ color: '#FF5C00' }}
          >
            UGCFire
          </span>
          <span className="text-4xl font-black tracking-tight text-white">.ai</span>
        </div>

        {/* Headline */}
        <h1 className="text-2xl md:text-3xl font-semibold text-white leading-snug">
          Create branded UGC content yourself with AI.
        </h1>

        {/* Description */}
        <p className="text-gray-400 text-base md:text-lg leading-relaxed">
          Upload your product, logo, and brand style.
          <br className="hidden md:block" />
          Generate images, videos, hooks, and content assets in minutes.
        </p>

        {/* Coming soon badge */}
        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-orange-500/40 bg-orange-500/10">
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: '#FF5C00' }}
          />
          <span className="text-sm font-medium" style={{ color: '#FF5C00' }}>
            Coming soon
          </span>
        </div>
      </div>
    </main>
  );
}
