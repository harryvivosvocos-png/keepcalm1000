// Shared by the page (index.html) and the OG edge function (api/og.js).

// The ONE config constant: the target date, at 00:00 Europe/London.
// 1,000 days after the 25 Oct 2026 op-ed.
export const TARGET = { y: 2029, m: 7, d: 21 };

export const SITE_URL = 'https://keepcalm1000.co.uk';

export const TAGLINES = [
  'PUT THE KETTLE ON',
  'CHECK THE TINNED BEANS',
  'LOCATE THE GOOD UMBRELLA',
  'QUEUE ACCORDINGLY',
  '9 LITRES OF WATER, MINIMUM',
  'FIND THE WIND-UP RADIO',
  'CHARGE THE POWER BANK',
  'COUNT THE TEABAGS',
  'KNOW WHERE THE STOPCOCK IS',
  'AVOID MAKING A FUSS',
  'KEEP A TORCH HANDY',
  'SPARE BATTERIES, AA AND AAA',
  'RATION THE DIGESTIVES',
  'FORM AN ORDERLY LINE',
  'DUST OFF THE FIRST AID KIT',
  'HAVE A LITTLE SIT DOWN',
  'TALK ABOUT THE WEATHER',
  'WRITE DOWN SOME PHONE NUMBERS',
  'LEARN TO READ A PAPER MAP',
  'KEEP SOME CASH, JUST IN CASE',
  'PACK A SENSIBLE BAG',
  'SAY SORRY TO NO ONE',
  'CHECK ON THE NEIGHBOURS',
  'KEEP THE TIN OPENER CLOSE',
  'STIFF UPPER LIP, LOOSE CHANGE',
  'HAVE A BACKUP PLAN FOR TEA',
  'FILL THE HOT WATER BOTTLE',
  'MUSTER A BRAVE FACE',
  'TUT, BUT QUIETLY',
  'CARRY ON, BROADLY',
];

const DAY_MS = 864e5;
const pad = (n) => String(n).padStart(2, '0');

const londonFmt = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Europe/London',
  year: 'numeric', month: 'numeric', day: 'numeric',
  hour: 'numeric', minute: 'numeric', second: 'numeric', hourCycle: 'h23',
});

// Wall-clock date/time in London for an instant, regardless of the viewer's timezone.
export function londonParts(now = new Date()) {
  const p = {};
  for (const { type, value } of londonFmt.formatToParts(now)) p[type] = Number(value);
  return { y: p.year, m: p.month, d: p.day, hh: p.hour, mm: p.minute, ss: p.second };
}

// Compare calendar dates as UTC midnights, so every day is exactly 24h (DST-proof).
export function getState(now = new Date()) {
  const t = londonParts(now);
  const days = Math.round(
    (Date.UTC(TARGET.y, TARGET.m - 1, TARGET.d) - Date.UTC(t.y, t.m - 1, t.d)) / DAY_MS
  );
  const n = TAGLINES.length;
  return {
    days,
    ready: days <= 0,
    tagline: TAGLINES[((days % n) + n) % n],
    isoDate: `${t.y}-${pad(t.m)}-${pad(t.d)}`,
  };
}

// Seconds until the next London midnight (DST changes happen at 01:00/02:00, never at midnight).
export function secondsToLondonMidnight(now = new Date()) {
  const t = londonParts(now);
  return 86400 - (t.hh * 3600 + t.mm * 60 + t.ss);
}
