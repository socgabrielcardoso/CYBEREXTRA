(() => {
  const host=document.querySelector("#scorecardGrid");
  if(!host)return;
  const cards=[...document.querySelectorAll(".module-card")];
  const count=t=>cards.filter(c=>c.dataset.team.includes(t)).length;
  const stats=[
    ["modules",cards.length],
    ["blue coverage",count("blue")],
    ["red coverage",count("red")],
    ["purple coverage",count("purple")]
  ];
  host.innerHTML=stats.map(([label,value])=>`<article class="scorecard-card"><strong>${value}</strong><span>${label}</span></article>`).join("");
})();