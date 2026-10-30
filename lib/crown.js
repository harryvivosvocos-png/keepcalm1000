// Our own geometric crown (not the 1939 artwork). Shared by the page, the canvas
// poster and the OG image. If you change it, update favicon.svg by hand to match.

const circle = (cx, cy, r) =>
  `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0Z`;

export const CROWN = {
  width: 100,
  height: 70,
  // Each path is filled separately with the evenodd rule (the band's jewels are holes).
  paths: [
    'M12 52L6 24L18 40L27 16L39 35L50 9L61 35L73 16L82 40L94 24L88 52Z',
    'M10 55H90V67H10ZM27 58h6v6h-6ZM47 58h6v6h-6ZM67 58h6v6h-6Z',
    circle(6, 21, 3.5),
    circle(27, 13, 3.5),
    circle(50, 5.5, 4),
    circle(73, 13, 3.5),
    circle(94, 21, 3.5),
  ],
};

export function crownSvg(fill) {
  const paths = CROWN.paths.map((d) => `<path d="${d}"/>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${CROWN.width} ${CROWN.height}" ` +
    `width="${CROWN.width}" height="${CROWN.height}" fill="${fill}" fill-rule="evenodd">${paths}</svg>`;
}
