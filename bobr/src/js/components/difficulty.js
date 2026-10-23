export const diffChip = (level, levels) => `<span class="diff d${level}">${levels[level]}</span>`;
export const ladder = l => `<span class="ladder" aria-hidden="true">${[1, 2, 3, 4].map(i => `<i class="${i <= l ? "on" : ""}" style="height:${4 + i * 3}px"></i>`).join("")}</span>`;
