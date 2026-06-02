import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        background: '#0a0a0a',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        padding: '60px 80px',
        fontFamily: 'sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle dot grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(249,115,22,0.25) 1.5px, transparent 1.5px)',
          backgroundSize: '40px 40px',
          opacity: 0.6,
        }}
      />

      {/* Orange glow blob top-right */}
      <div
        style={{
          position: 'absolute',
          top: -80,
          right: -80,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(249,115,22,0.25) 0%, transparent 70%)',
        }}
      />

      {/* Content */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '14px', zIndex: 1 }}>

        <div style={{ color: '#f97316', fontSize: '16px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          naderlobandi.com
        </div>

        <div style={{ color: '#ededed', fontSize: '62px', fontWeight: 700, lineHeight: 1.05, letterSpacing: '-0.02em' }}>
          Nader Lobandi
        </div>

        <div style={{ color: '#f97316', fontSize: '24px', fontWeight: 500 }}>
          ML Engineer &amp; PhD Researcher
        </div>

        <div style={{ color: 'rgba(237,237,237,0.55)', fontSize: '18px', lineHeight: 1.6 }}>
          University of Denver · 4+ years production AI/ML · 4 IEEE publications
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '6px', flexWrap: 'wrap' }}>
          {['PyTorch', 'LLMs & RAG', 'Computer Vision', 'Azure Databricks'].map((tag) => (
            <div
              key={tag}
              style={{
                background: 'rgba(249,115,22,0.12)',
                border: '1px solid rgba(249,115,22,0.35)',
                borderRadius: '999px',
                padding: '5px 18px',
                color: '#f97316',
                fontSize: '14px',
                fontWeight: 500,
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    </div>,
    { ...size }
  )
}
