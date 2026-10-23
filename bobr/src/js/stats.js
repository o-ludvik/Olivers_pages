/* Statistiky z uloženého stavu. sections = [{ slug, tasks: [{ slug, level }] }], tasks = { "sekce/uloha": { status, stars, attempts, seen } } */
export function computeStats(sections, tasks) {
  const s = { total: 0, solved: 0, stars: 0, maxStars: 0, perfect: 0, byLevel: {}, stubborn: 0, sectionsTouched: 0, sectionsComplete: 0, sectionCount: sections.length, bySection: {} };
  for (const sec of sections) {
    const b = s.bySection[sec.slug] = { solved: 0, total: sec.tasks.length, stars: 0 };
    for (const t of sec.tasks) {
      const st = tasks[`${sec.slug}/${t.slug}`];
      if (!st || st.status !== "done") continue;
      b.solved++; b.stars += st.stars;
      if (st.stars === 3) s.perfect++;
      s.byLevel[t.level] = (s.byLevel[t.level] || 0) + 1;
      if (!st.seen && st.attempts >= 4) s.stubborn++;
    }
    s.total += b.total; s.solved += b.solved; s.stars += b.stars;
    if (b.solved > 0) s.sectionsTouched++;
    if (b.solved === b.total) s.sectionsComplete++;
  }
  s.maxStars = s.total * 3;
  return s;
}

const RULES = {
  solved: (s, r) => s.solved >= r.min,
  perfect: (s, r) => s.perfect >= r.min,
  level: (s, r) => (s.byLevel[r.level] || 0) >= r.min,
  stubborn: (s, r) => s.stubborn >= r.min,
  everySection: s => s.sectionsTouched === s.sectionCount,
  sectionsComplete: (s, r) => s.sectionsComplete >= r.min,
  all: s => s.solved === s.total
};

export const hasBadge = (badge, s) => RULES[badge.rule.type](s, badge.rule);
export const earnedBadges = (badges, s) => badges.filter(b => hasBadge(b, s)).map(b => b.id);
