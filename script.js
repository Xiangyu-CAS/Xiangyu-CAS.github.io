const scholarMetrics = [
  { label: "Citations", value: 1094 },
  { label: "h-index", value: 6 },
  { label: "i10-index", value: 5 }
];

const citationByYear = [
  { year: 2019, value: 88 },
  { year: 2020, value: 132 },
  { year: 2021, value: 190 },
  { year: 2022, value: 216 },
  { year: 2023, value: 165 },
  { year: 2024, value: 148 },
  { year: 2025, value: 98 },
  { year: 2026, value: 8 }
];

const featuredProjects = [
  {
    title: "xiaohongshu-ops-skill",
    description: "Openclaw-based Xiaohongshu automation toolkit.",
    stars: 281,
    github: "https://github.com/Xiangyu-CAS/xiaohongshu-ops-skill"
  },
  {
    title: "HandFixer",
    description: "One-click hand repair workflow for ComfyUI pipelines.",
    stars: 209,
    github: "https://github.com/Xiangyu-CAS/HandFixer"
  }
];

function renderMetrics() {
  const wrap = document.getElementById("scholar-metrics");
  wrap.innerHTML = scholarMetrics
    .map(
      (item) =>
        `<div class="metric"><span class="label">${item.label}</span><span class="value">${item.value}</span></div>`
    )
    .join("");
}

function renderBars() {
  const max = Math.max(...citationByYear.map((d) => d.value));
  const wrap = document.getElementById("citation-bars");
  wrap.innerHTML = citationByYear
    .map((d) => {
      const h = Math.max(4, Math.round((d.value / max) * 160));
      return `<div class="bar-item"><div class="bar" style="--h:${h}px"></div><span>${d.year}</span></div>`;
    })
    .join("");
}

function renderProjects() {
  const wrap = document.getElementById("project-grid");
  wrap.innerHTML = featuredProjects
    .map(
      (p) =>
        `<article class="project"><h3>${p.title}</h3><p>${p.description}</p><div class="project-meta"><span class="stars">★ ${p.stars}</span><a class="repo-link" href="${p.github}" target="_blank" rel="noopener noreferrer">View on GitHub</a></div></article>`
    )
    .join("");
}

renderMetrics();
renderBars();
renderProjects();
