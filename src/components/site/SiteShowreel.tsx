export function SiteShowreel({ videoId }: { videoId: string }) {
  return (
    <div className="site-showreel">
      <h2>OUR SHOWREEL</h2>
      <div className="site-showreel-frame">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&playsinline=1&rel=0`}
          title="Promptthum showreel"
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        />
      </div>
    </div>
  )
}
