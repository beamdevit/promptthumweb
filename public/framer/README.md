# Premium Showreel for Framer

Create a Code Component in Framer and replace its contents with PremiumShowreel.tsx. Place it on the canvas, choose Fill width and a cinematic frame height, and set Video URL to a publicly accessible HTTPS MP4/WebM file. Poster Image is optional. No third-party packages need installing in Framer.

All playback, sizing, glass button, typography, animation, perspective and scale controls are exposed in the property panel. Autoplay is muted by default; if the browser blocks autoplay the play button remains available. Playback icons follow native video events. Keyboard focus and reduced-motion preferences are supported.

This standalone Framer component uses HTML5 video. YouTube watch links cannot be used as an HTML5 source. The deployed Next.js site also includes a YouTube adapter for the requested clip; choose a direct file in Admin → วิดีโอเว็บไซต์ to switch the website to HTML5.

The animation uses native CSS transitions rather than an extra animation dependency. The website loads Syne; the standalone component uses Syne when available and a sans-serif fallback otherwise.

Property-control reference: https://www.framer.com/developers/property-controls
