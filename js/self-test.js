(() => {
  const output=document.querySelector("#selfTestResult");
  const button=document.querySelector("#selfTest");
  if(!output||!button)return;
  const run=()=>{
    const checks=[
      ["module cards",document.querySelectorAll(".module-card").length>=10],
      ["workspace",!!document.querySelector("#workspace")],
      ["app loader",typeof window.openModule==="function"],
      ["external forms",document.querySelectorAll("form[action^='http']").length===0],
      ["iframes",document.querySelectorAll("iframe").length===0]
    ];
    const ok=checks.filter(x=>x[1]).length;
    output.textContent=`SELF TEST ${ok}/${checks.length} PASS`;
    output.style.color=ok===checks.length?"var(--green)":"var(--amber)";
  };
  button.addEventListener("click",run);
  run();
})();