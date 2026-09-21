(() => {
  const input=document.querySelector("#moduleSearch");
  if(!input)return;
  const normalize=v=>v.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
  input.addEventListener("input",()=>{
    const q=normalize(input.value.trim());
    document.querySelectorAll(".module-card").forEach(card=>{
      const hit=!q||normalize(card.textContent).includes(q);
      card.classList.toggle("search-hidden",!hit);
      card.style.display=hit?"":"none";
    });
  });
})();