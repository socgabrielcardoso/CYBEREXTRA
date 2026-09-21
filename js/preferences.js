(() => {
  const key="cyberextra.preferences";
  const stored=JSON.parse(localStorage.getItem(key)||"{}");
  if(stored.highContrast)document.body.classList.add("high-contrast");

  const toggle=document.querySelector("#themeToggle");
  toggle?.addEventListener("click",()=>{
    requestAnimationFrame(()=>{
      localStorage.setItem(key,JSON.stringify({highContrast:document.body.classList.contains("high-contrast")}));
    });
  });

  document.documentElement.dataset.cyberextra="ready";
})();