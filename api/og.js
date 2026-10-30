// GET /api/og → 1200×630 PNG of today's poster for link previews.
// The only server-side code; date, tagline and crown logic are shared with the page.
import { ImageResponse } from '@vercel/og';
import { getState, secondsToLondonMidnight } from '../lib/countdown.js';
import { crownSvg } from '../lib/crown.js';

export const config = { runtime: 'edge' };

const RED = '#D7261E';
const CREAM = '#F4EEE0';

// Bundled with the function; loaded once per isolate, no runtime Google Fonts call.
const fontData = fetch(new URL('../fonts/Oswald-Bold.ttf', import.meta.url)).then((r) => r.arrayBuffer());
const crownSrc = `data:image/svg+xml,${encodeURIComponent(crownSvg(CREAM))}`;

// Satori takes plain React-element-shaped objects, so no JSX or build step is needed.
const h = (type, style, ...children) => ({
  type,
  props: { style: { display: 'flex', ...style }, children: children.length === 1 ? children[0] : children },
});
const img = (src, width, height) => ({ type: 'img', props: { src, width, height } });

function poster(s) {
  const text = (size, spacing, content, extra) =>
    h('div', { fontSize: size, letterSpacing: spacing, lineHeight: 1, whiteSpace: 'nowrap', ...extra }, content);

  const left = h('div', { flexDirection: 'column', alignItems: 'center', width: 520 },
    img(crownSrc, 220, 154),
    text(96, 8, 'KEEP CALM', { marginTop: 28 }),
  );

  const right = s.ready
    ? h('div', { flexDirection: 'column', alignItems: 'center', width: 640 },
        text(92, 6, 'WE ARE'),
        text(100, 6, 'NOW READY*', { marginTop: 16 }),
        text(36, 3, '*probably', { marginTop: 22, opacity: 0.85 }),
      )
    : h('div', { flexDirection: 'column', alignItems: 'center', width: 640 },
        text(s.days >= 1000 ? 270 : 320, 4, String(s.days)),
        text(74, 8, 'DAYS TO GO', { marginTop: 16 }),
      );

  return h('div', {
      width: '100%', height: '100%', background: RED, color: CREAM, fontFamily: 'Oswald',
      flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    },
    h('div', { alignItems: 'center', justifyContent: 'center', width: '100%' }, left, right),
    ...(s.ready ? [] : [
      h('div', { width: 140, height: 4, background: CREAM, marginTop: 40, opacity: 0.85 }),
      text(40, 5, s.tagline, { marginTop: 28 }),
    ]),
  );
}

export default async function handler() {
  const now = new Date();
  const s = getState(now);
  // Edge cache for at most an hour, and never past UK midnight.
  const ttl = Math.max(60, Math.min(3600, secondsToLondonMidnight(now)));
  const res = new ImageResponse(poster(s), {
    width: 1200,
    height: 630,
    fonts: [{ name: 'Oswald', data: await fontData, weight: 700, style: 'normal' }],
  });
  // set(), not the headers option: that would append to @vercel/og's default "immutable, max-age=1y".
  res.headers.set('Cache-Control', `public, max-age=0, s-maxage=${ttl}, stale-while-revalidate=600`);
  return res;
}
