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

// Be Ready checklist. Official items follow the government's Be Ready guidance (Oct 2026);
// extras rotate daily, three at a time, the same for everyone.
export const CHECKLIST_OFFICIAL = [
  { id: 'food', label: '3 days of food that needs no cooking or fridge' },
  { id: 'water', label: '9 litres of water per person (3 litres a day)' },
  { id: 'torch', label: 'Torch and spare batteries' },
  { id: 'radio', label: 'Battery or wind-up radio' },
  { id: 'power', label: 'Charged power bank' },
  { id: 'cash', label: 'Some cash' },
  { id: 'firstaid', label: 'First aid kit' },
  { id: 'meds', label: 'Essential prescription medicines' },
];

export const CHECKLIST_EXTRAS = [
  { id: 'beans', label: 'One (1) tin of beans' },
  { id: 'letter', label: 'Strongly worded letter drafted' },
  { id: 'umbrella', label: 'Know where the good umbrella is' },
  { id: 'teabags', label: 'Emergency teabag reserve established' },
  { id: 'kettle', label: 'Kettle descaled' },
  { id: 'biscuittin', label: 'Biscuit tin confirmed to contain biscuits, not sewing kit' },
  { id: 'bagforlife', label: 'Bag for life located' },
  { id: 'tinopener', label: 'Tin opener that actually works' },
  { id: 'wound', label: 'Wind-up radio actually wound up' },
  { id: 'weather', label: 'Opinion on the weather prepared' },
  { id: 'queue', label: 'Queueing etiquette refreshed' },
  { id: 'sparekey', label: "Neighbour's spare key located" },
  { id: 'lip', label: 'Stiff upper lip braced' },
  { id: 'hwb', label: 'Hot water bottle on standby' },
];

const EXTRAS_PER_DAY = 3;

export function getChecklist(days) {
  const n = CHECKLIST_EXTRAS.length;
  const start = (((days * EXTRAS_PER_DAY) % n) + n) % n;
  const extras = Array.from({ length: EXTRAS_PER_DAY }, (_, i) => CHECKLIST_EXTRAS[(start + i) % n]);
  return { official: CHECKLIST_OFFICIAL, extras };
}

// Institute for Government: since 2015 the average secretary of state has stayed in post 18 months.
export const CABINET_TENURE_DAYS = 18 * 30.44;
export const NOT_TOO_BAD_PER_DAY = 3;
// John Lewis Christmas adverts usually land in early-to-mid November; count one a year, assumed 10 Nov.
export const JOHN_LEWIS_RELEASE = { m: 11, d: 10 };

const fmt = (n, dp = 0) => n.toLocaleString('en-GB', { minimumFractionDigits: dp, maximumFractionDigits: dp });

// John Lewis release dates after today's London date and before the target date.
function johnLewisAdverts(now) {
  const t = londonParts(now);
  const today = Date.UTC(t.y, t.m - 1, t.d);
  const target = Date.UTC(TARGET.y, TARGET.m - 1, TARGET.d);
  let n = 0;
  for (let y = t.y; y <= TARGET.y; y++) {
    const release = Date.UTC(y, JOHN_LEWIS_RELEASE.m - 1, JOHN_LEWIS_RELEASE.d);
    if (release > today && release < target) n++;
  }
  return n;
}

export function britishUnits(days, now = new Date()) {
  const adverts = johnLewisAdverts(now);
  return [
    { value: fmt(days / 365.25, 1), label: 'series of The Great British Bake Off' },
    { value: fmt(Math.floor(days / 7)), label: 'weekends of rail replacement bus services' },
    { value: fmt(days / CABINET_TENURE_DAYS, 1), label: "full turnovers of the Cabinet, at the average Secretary of State's 18 months in post" },
    { value: fmt(adverts), label: adverts === 1 ? 'John Lewis Christmas advert' : 'John Lewis Christmas adverts' },
    { value: fmt(days * NOT_TOO_BAD_PER_DAY), label: `occasions of saying “Not too bad, yourself?” without expecting an answer (at ${NOT_TOO_BAD_PER_DAY} a day)` },
  ];
}

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
