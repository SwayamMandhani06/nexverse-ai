'use client';

// EarphoneModel.tsx — Placeholder (add GLTF model to /public/models for Phase 2)
export default function EarphoneModel() {
  return (
    <div
      className="w-full h-full flex items-center justify-center rounded-2xl glass"
      style={{ minHeight: '400px', border: '1px dashed var(--accent)' }}
    >
      <div className="text-center" style={{ color: 'var(--text-secondary)' }}>
        <div className="text-5xl mb-3">🎧</div>
        <p className="text-sm font-mono tracking-wide">EarphoneModel</p>
        <p className="text-xs mt-1 opacity-60">3D model loads here</p>
      </div>
    </div>
  );
}
