(() => {
  const button=document.querySelector("#exportReport");
  if(!button)return;
  function toast(message){
    let el=document.querySelector("#toast");
    if(!el){el=document.createElement("div");el.id="toast";el.className="toast";document.body.appendChild(el)}
    el.textContent=message;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),1800);
  }
  button.addEventListener("click",()=>{
    const modules=[...document.querySelectorAll(".module-card")].map(c=>({
      name:c.querySelector("h3")?.textContent.trim(),
      teams:c.dataset.team,
      description:c.querySelector("p")?.textContent.trim()
    }));
    const lines=[
      "CYBEREXTRA SECURITY LAB",
      "Generated locally: "+new Date().toISOString(),
      "",
      "Modules: "+modules.length,
      ...modules.flatMap((m,i)=>["",`${String(i+1).padStart(2,"0")}. ${m.name}`,`Teams: ${m.teams}`,m.description])
    ];
    const blob=new Blob([lines.join("\n")],{type:"text/plain;charset=utf-8"});
    const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="cyberextra-report.txt";a.click();URL.revokeObjectURL(a.href);
    toast("Relatório local exportado");
  });
})();