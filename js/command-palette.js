(() => {
  const palette=document.querySelector("#commandPalette");
  const input=document.querySelector("#commandInput");
  const results=document.querySelector("#commandResults");
  const trigger=document.querySelector("#commandTrigger");
  if(!palette||!input||!results)return;

  const commands=()=>[
    ...Array.from(document.querySelectorAll(".module-card")).map(card=>({
      label:"Abrir "+card.querySelector("h3").textContent,
      hint:"lab",
      run:()=>window.openModule?.(card.dataset.module)
    })),
    {label:"Ir para Arsenal",hint:"nav",run:()=>location.hash="arsenal"},
    {label:"Executar diagnóstico",hint:"system",run:()=>document.querySelector("#runAll")?.click()},
    {label:"Alternar contraste",hint:"ui",run:()=>document.querySelector("#themeToggle")?.click()},
    {label:"Exportar relatório",hint:"report",run:()=>document.querySelector("#exportReport")?.click()}
  ];

  function draw(){
    const q=input.value.toLowerCase();
    const list=commands().filter(c=>c.label.toLowerCase().includes(q));
    results.innerHTML="";
    list.forEach((c,i)=>{
      const b=document.createElement("button");
      b.className="command-item"+(i===0?" active":"");
      b.innerHTML="<span>"+c.label+"</span><small>"+c.hint+"</small>";
      b.onclick=()=>{c.run();close()};
      results.appendChild(b);
    });
  }
  function open(){palette.classList.add("open");input.value="";draw();setTimeout(()=>input.focus(),20)}
  function close(){palette.classList.remove("open")}
  trigger?.addEventListener("click",open);
  input.addEventListener("input",draw);
  palette.addEventListener("click",e=>{if(e.target===palette)close()});
  document.addEventListener("keydown",e=>{
    if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){e.preventDefault();palette.classList.contains("open")?close():open()}
    if(e.key==="Escape")close();
  });
})();