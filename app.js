const modules = {
  soc: {
    title: "Sentinel Forge",
    render: () => `
      <div class="lab-layout">
        <section class="lab-main">
          <h3 class="lab-title">SOC Event Triage</h3>
          <p class="lab-subtitle">Correlacione eventos sintéticos e gere um parecer inicial de incidente.</p>
          <div class="panel">
            <label class="field-label" for="socEvent">Evento</label>
            <select class="lab-select" id="socEvent">
              <option value="tor">Conexão recorrente para nó TOR</option>
              <option value="admin">Login administrativo fora do horário</option>
              <option value="powershell">PowerShell codificado em endpoint</option>
              <option value="dns">Pico de DNS para domínio recém-observado</option>
            </select>
            <button class="lab-button" id="socAnalyze">Analisar evento</button>
            <div class="result" id="socResult">Selecione um evento e execute a análise.</div>
          </div>
          <div class="panel">
            <h4>Timeline sintética</h4>
            <div class="signal"><span class="signal-dot"></span><div><p>Endpoint WIN-OPS-044 autenticou no diretório</p><small>00:02:14</small></div></div>
            <div class="signal"><span class="signal-dot"></span><div><p>Processo filho iniciou sessão de rede</p><small>00:03:08</small></div></div>
            <div class="signal"><span class="signal-dot"></span><div><p>Destino classificado pelo laboratório</p><small>00:03:11</small></div></div>
          </div>
        </section>
        <aside class="lab-side">
          <div class="panel"><span class="score" id="socScore">42</span><div class="score-label">risk score</div></div>
          <div class="panel">
            <h4>MITRE mapping</h4>
            <div class="killchain"><span>T1071</span><span>T1059</span><span>T1021</span><span>T1098</span></div>
          </div>
          <div class="panel">
            <h4>Playbook</h4>
            <div class="finding-list">
              <div class="finding"><strong>1. Validar identidade</strong><small>usuário, origem, MFA e horário</small></div>
              <div class="finding"><strong>2. Conter se necessário</strong><small>isolar host ou revogar sessão</small></div>
              <div class="finding"><strong>3. Preservar evidência</strong><small>process tree, rede e autenticação</small></div>
            </div>
          </div>
        </aside>
      </div>`,
    bind() {
      const data = {
        tor:{score:78,text:"ALTO // padrão persistente de saída para infraestrutura anonimizada.\nEvidências: conexão repetida + porta incomum + destino classificado.\nAção: validar processo originador e necessidade de negócio antes de bloquear."},
        admin:{score:66,text:"MÉDIO/ALTO // privilégio administrativo em janela atípica.\nEvidências: login válido, grupo privilegiado, horário fora da baseline.\nAção: confirmar atividade com responsável e revisar MFA/sessão."},
        powershell:{score:91,text:"CRÍTICO // execução codificada merece investigação imediata.\nEvidências: PowerShell + argumento ofuscado + processo pai incomum.\nAção: preservar comando, árvore de processos e isolar caso haja sinais adicionais."},
        dns:{score:58,text:"MÉDIO // anomalia de resolução pode ser legítima ou C2.\nEvidências: volume súbito + domínio sem histórico local.\nAção: correlacionar processo, reputação e frequência."}
      };
      document.querySelector("#socAnalyze").onclick=()=>{const k=document.querySelector("#socEvent").value;document.querySelector("#socScore").textContent=data[k].score;document.querySelector("#socResult").textContent=data[k].text};
    }
  },
  web: {
    title:"Web Breach Lab",
    render:()=>`
      <div class="lab-layout">
        <section class="lab-main">
          <h3 class="lab-title">OWASP Local Simulator</h3>
          <p class="lab-subtitle">Analise padrões ofensivos sem enviar payload a nenhum servidor.</p>
          <div class="panel">
            <label class="field-label" for="webVector">Classe de vulnerabilidade</label>
            <select class="lab-select" id="webVector">
              <option value="xss">Cross-Site Scripting</option>
              <option value="sqli">SQL Injection</option>
              <option value="idor">IDOR / Broken Access Control</option>
              <option value="traversal">Path Traversal</option>
              <option value="cmd">Command Injection</option>
            </select>
            <label class="field-label" for="webInput" style="margin-top:14px">Entrada para classificação local</label>
            <input class="lab-input" id="webInput" value="&lt;script&gt;alert(1)&lt;/script&gt;" autocomplete="off">
            <button class="lab-button" id="webAnalyze">Simular validação</button>
            <div class="result" id="webResult">O laboratório apenas classifica a entrada. Nenhuma requisição é enviada.</div>
          </div>
          <div class="panel">
            <h4>Controle recomendado</h4>
            <div class="finding-list" id="webControls"></div>
          </div>
        </section>
        <aside class="lab-side">
          <div class="panel"><h4>Superfície de teste</h4><div class="risk"><b>Frontend local</b><span class="sev-low">ATIVO</span></div><div class="risk"><b>Internet outbound</b><span class="sev-critical">DESATIVADO</span></div><div class="risk"><b>Dados reais</b><span class="sev-critical">NÃO</span></div></div>
          <div class="panel"><h4>Objetivo Red</h4><p style="color:var(--muted);font-size:.84rem">Entender o ponto de quebra e comunicar impacto de forma reproduzível.</p></div>
          <div class="panel"><h4>Objetivo Blue</h4><p style="color:var(--muted);font-size:.84rem">Criar validação, telemetria, bloqueio e evidência suficiente para resposta.</p></div>
        </aside>
      </div>`,
    bind(){
      const controls={
        xss:["Output encoding contextual","CSP restritiva","Evitar innerHTML para entrada não confiável"],
        sqli:["Queries parametrizadas","Conta de banco com menor privilégio","Validação e logging de erro sem vazar stack"],
        idor:["Autorização server-side por objeto","Negar por padrão","Registrar tentativa de acesso cruzado"],
        traversal:["Canonicalizar caminho","Allowlist de diretórios","Separar identificador lógico de path físico"],
        cmd:["Evitar shell","APIs nativas com argumentos tipados","Allowlist e privilégio mínimo"]
      };
      document.querySelector("#webAnalyze").onclick=()=>{
        const type=document.querySelector("#webVector").value;
        const value=document.querySelector("#webInput").value;
        const patterns={
          xss:/<|>|script|onerror|javascript:/i,
          sqli:/('|--|\bunion\b|\bselect\b|\bor\s+1\s*=\s*1)/i,
          idor:/\b(id|user|account|invoice)\s*[=:]\s*\d+/i,
          traversal:/\.\.\/|\.\.\\/i,
          cmd:/[;&|\x60]|$\(/i
        };
        const hit=patterns[type].test(value);
        document.querySelector("#webResult").textContent=hit
          ? "PADRÃO SUSPEITO DETECTADO // entrada seria bloqueada pelo simulador.\nResultado: vulnerabilidade potencial exige validação no código e no controle de autorização."
          : "SEM ASSINATURA ÓBVIA // isso não prova segurança.\nResultado: combine testes de lógica, revisão de código e validação de autorização.";
        document.querySelector("#webControls").innerHTML=controls[type].map((x,i)=>`<div class="finding"><strong>${i+1}. ${x}</strong><small>controle defensivo sugerido</small></div>`).join("");
      };
    }
  },
  identity:{
    title:"Identity Rift",
    render:()=>`
      <div class="lab-layout">
        <section class="lab-main">
          <h3 class="lab-title">Identity Exposure Graph</h3>
          <p class="lab-subtitle">Caminhos de privilégio em uma organização fictícia.</p>
          <div class="table-wrap panel">
            <table class="lab-table">
              <thead><tr><th>Identidade</th><th>Tipo</th><th>MFA</th><th>Privilégio</th><th>Risco</th></tr></thead>
              <tbody>
                <tr><td>svc_backup</td><td>service</td><td>n/a</td><td>Backup Operators</td><td><span class="sev-high">alto</span></td></tr>
                <tr><td>ana.silva</td><td>user</td><td>sim</td><td>Finance</td><td><span class="sev-low">baixo</span></td></tr>
                <tr><td>adm.legacy</td><td>admin</td><td>não</td><td>Tier 0</td><td><span class="sev-critical">crítico</span></td></tr>
                <tr><td>app.deploy</td><td>service</td><td>n/a</td><td>Local Admin</td><td><span class="sev-medium">médio</span></td></tr>
              </tbody>
            </table>
          </div>
          <div class="panel">
            <label class="field-label" for="identityChoice">Teste de caminho</label>
            <select class="lab-select" id="identityChoice"><option value="legacy">adm.legacy → Tier 0</option><option value="backup">svc_backup → backup scope</option><option value="deploy">app.deploy → endpoints</option></select>
            <button class="lab-button" id="identityTrace">Traçar risco</button>
            <div class="result" id="identityResult">Escolha uma identidade para traçar o caminho.</div>
          </div>
        </section>
        <aside class="lab-side">
          <div class="panel"><h4>Controles prioritários</h4><div class="finding-list"><div class="finding"><strong>MFA resistente a phishing</strong><small>administradores e acessos críticos</small></div><div class="finding"><strong>Tiering administrativo</strong><small>reduzir salto entre camadas</small></div><div class="finding"><strong>JIT/JEA</strong><small>privilégio somente quando necessário</small></div><div class="finding"><strong>Rotação de segredos</strong><small>contas de serviço e aplicações</small></div></div></div>
        </aside>
      </div>`,
    bind(){
      const traces={
        legacy:"CRÍTICO // conta administrativa sem MFA + privilégio Tier 0.\nCaminho simulado: credencial → sessão privilegiada → controle de diretório.\nMitigação: bloquear login interativo, exigir MFA forte, PAW e acesso just-in-time.",
        backup:"ALTO // conta de serviço com capacidade de ler artefatos sensíveis.\nCaminho simulado: segredo exposto → serviço → escopo de backup.\nMitigação: gMSA/segredo gerenciado, deny logon e monitoramento de uso.",
        deploy:"MÉDIO // privilégio local distribuído aumenta blast radius.\nCaminho simulado: aplicação → agente → endpoints.\nMitigação: escopo mínimo, assinatura de pacote e EDR."
      };
      document.querySelector("#identityTrace").onclick=()=>document.querySelector("#identityResult").textContent=traces[document.querySelector("#identityChoice").value];
    }
  },
  network:{
    title:"Packet Watch",
    render:()=>`
      <div class="lab-layout">
        <section class="lab-main">
          <h3 class="lab-title">Network Hunting Console</h3>
          <p class="lab-subtitle">Fluxos sintéticos para hunting defensivo.</p>
          <div class="table-wrap panel">
            <table class="lab-table">
              <thead><tr><th>Origem</th><th>Destino</th><th>Porta</th><th>Bytes</th><th>Perfil</th></tr></thead>
              <tbody id="flowRows"></tbody>
            </table>
          </div>
          <button class="lab-button" id="huntNetwork">Executar hunting</button>
          <div class="result" id="networkResult">Aguardando hunting.</div>
        </section>
        <aside class="lab-side">
          <div class="panel"><h4>Detecções</h4><div class="risk"><b>Beaconing</b><span class="sev-high">TUNE</span></div><div class="risk"><b>Port scan</b><span class="sev-medium">ON</span></div><div class="risk"><b>TOR egress</b><span class="sev-high">ON</span></div><div class="risk"><b>DNS anomaly</b><span class="sev-medium">ON</span></div></div>
          <div class="panel"><h4>Baseline</h4><div class="bar"><i style="width:72%"></i></div><p style="color:var(--muted);font-size:.78rem">72% dos fluxos simulados aderem ao perfil esperado.</p></div>
        </aside>
      </div>`,
    bind(){
      const flows=[["10.20.4.31","198.51.100.24","443","82 KB","normal"],["10.20.8.19","203.0.113.77","9001","41 KB","tor-like"],["10.20.4.31","198.51.100.24","443","81 KB","beacon"],["10.20.9.52","10.20.1.0/24","445","9 KB","scan"],["10.20.2.14","192.0.2.10","53","4 KB","normal"]];
      document.querySelector("#flowRows").innerHTML=flows.map(f=>`<tr>${f.map((x,i)=>`<td>${i===4?'<span class="'+(x==='normal'?'sev-low':'sev-high')+'">'+x+'</span>':x}</td>`).join("")}</tr>`).join("");
      document.querySelector("#huntNetwork").onclick=()=>document.querySelector("#networkResult").textContent="3 SINAIS PRIORIZADOS\n01 beaconing periódico para destino externo\n02 saída compatível com nó anonimizado\n03 tentativa horizontal em SMB\n\nPróximo passo: correlacionar processo, usuário e ativo antes de contenção.";
    }
  },
  intel:{
    title:"IOC Observatory",
    render:()=>`
      <div class="lab-layout">
        <section class="lab-main">
          <h3 class="lab-title">IOC Enrichment</h3>
          <p class="lab-subtitle">Classifique indicadores reservados para documentação e teste.</p>
          <div class="panel">
            <label class="field-label" for="iocInput">Indicador</label>
            <input class="lab-input" id="iocInput" value="198.51.100.42">
            <button class="lab-button" id="iocAnalyze">Enriquecer</button>
            <div class="result" id="iocResult">Use IPs RFC 5737, domínios .test ou hashes fictícios para manter o laboratório seguro.</div>
          </div>
          <div class="panel"><h4>Relacionamentos</h4><div class="killchain"><span>indicator</span><span>→</span><span>campaign-demo</span><span>→</span><span>endpoint-lab</span></div></div>
        </section>
        <aside class="lab-side">
          <div class="panel"><h4>Confidence model</h4><div class="risk"><b>Fonte</b><span class="sev-low">40%</span></div><div class="risk"><b>Recência</b><span class="sev-low">25%</span></div><div class="risk"><b>Correlação</b><span class="sev-low">35%</span></div></div>
          <div class="panel"><h4>Regra</h4><p style="color:var(--muted);font-size:.82rem">IOC isolado não é veredito. Contexto, telemetria local e tempo alteram a confiança.</p></div>
        </aside>
      </div>`,
    bind(){
      document.querySelector("#iocAnalyze").onclick=()=>{
        const v=document.querySelector("#iocInput").value.trim();
        const safe=/^(192\.0\.2\.|198\.51\.100\.|203\.0\.113\.)\d{1,3}$|\.test$/i.test(v);
        document.querySelector("#iocResult").textContent=safe
          ?"INDICADOR DE DOCUMENTAÇÃO // seguro para demonstração.\nReputação: sintética\nConfidence: 74/100\nContexto: campanha-demo / laboratório local"
          :"INDICADOR NÃO RESERVADO // por segurança, este módulo não consulta reputação externa.\nUse 192.0.2.0/24, 198.51.100.0/24, 203.0.113.0/24 ou domínio .test.";
      };
    }
  },
  secrets:{
    title:"Secret Scope",
    render:()=>`
      <div class="lab-layout">
        <section class="lab-main">
          <h3 class="lab-title">Local Secret Scanner</h3>
          <p class="lab-subtitle">Cole somente dados fictícios. A análise ocorre no navegador.</p>
          <div class="panel">
            <label class="field-label" for="secretInput">Trecho para análise</label>
            <textarea class="lab-textarea" id="secretInput">API_KEY="demo_1234567890_secret"
user="analyst"
password="Summer2026!"</textarea>
            <button class="lab-button" id="secretScan">Escanear localmente</button>
            <div class="result" id="secretResult">Nenhum dado sai deste navegador.</div>
          </div>
        </section>
        <aside class="lab-side">
          <div class="panel"><h4>Policy</h4><div class="risk"><b>Tokens hardcoded</b><span class="sev-critical">BLOCK</span></div><div class="risk"><b>Senhas em código</b><span class="sev-critical">BLOCK</span></div><div class="risk"><b>Valores de exemplo</b><span class="sev-medium">REVIEW</span></div></div>
          <div class="panel"><h4>Resposta</h4><div class="finding-list"><div class="finding"><strong>Revogar</strong><small>segredo real potencialmente exposto</small></div><div class="finding"><strong>Rotacionar</strong><small>emitir nova credencial</small></div><div class="finding"><strong>Remover do histórico</strong><small>quando aplicável e autorizado</small></div></div></div>
        </aside>
      </div>`,
    bind(){
      document.querySelector("#secretScan").onclick=()=>{
        const t=document.querySelector("#secretInput").value;
        const hits=[];
        if(/api[_-]?key\s*[:=]/i.test(t))hits.push("padrão de API key");
        if(/password\s*[:=]/i.test(t))hits.push("senha declarada");
        if(/secret\s*[:=]|_secret/i.test(t))hits.push("segredo nomeado");
        if(/bearer\s+[a-z0-9._-]{12,}/i.test(t))hits.push("token bearer");
        document.querySelector("#secretResult").textContent=hits.length?`${hits.length} ACHADO(S)\n- ${hits.join("\n- ")}\n\nAção: tratar como exposição até confirmar que o valor é apenas fictício.`:"SEM PADRÕES ÓBVIOS // ainda é recomendável usar secret manager e revisão de histórico.";
      };
    }
  },
  phish:{
    title:"Phish Autopsy",
    render:()=>`
      <div class="lab-layout">
        <section class="lab-main">
          <h3 class="lab-title">Email Threat Autopsy</h3>
          <p class="lab-subtitle">Classifique um e-mail totalmente fictício por sinais de engenharia social.</p>
          <div class="panel">
            <label class="field-label" for="phishSample">Amostra</label>
            <select class="lab-select" id="phishSample"><option value="invoice">Fatura urgente com domínio parecido</option><option value="mfa">Redefinição de MFA inesperada</option><option value="normal">Comunicado interno esperado</option></select>
            <button class="lab-button" id="phishAnalyze">Dissecar</button>
            <div class="result" id="phishResult">Selecione uma amostra.</div>
          </div>
          <div class="panel"><h4>Checklist técnico</h4><div class="killchain"><span>From</span><span>Reply-To</span><span>SPF/DKIM</span><span>URLs</span><span>Attachment</span><span>Context</span></div></div>
        </section>
        <aside class="lab-side">
          <div class="panel"><h4>Princípio</h4><p style="color:var(--muted);font-size:.84rem">Urgência sozinha não prova phishing. O diagnóstico melhora quando domínio, autenticação, link, anexo e contexto convergem.</p></div>
          <div class="panel"><h4>Containment</h4><div class="finding-list"><div class="finding"><strong>Quarentena</strong><small>quando confirmado ou altamente provável</small></div><div class="finding"><strong>Busca retroativa</strong><small>mensagens equivalentes</small></div><div class="finding"><strong>Revogar sessão</strong><small>se houve captura de credencial</small></div></div></div>
        </aside>
      </div>`,
    bind(){
      const d={
        invoice:"ALTO // domínio lookalike + urgência financeira + link divergente.\nSinais: From semelhante, Reply-To externo, ação imediata.\nResposta: quarentena, busca por mensagens correlatas e validação fora do e-mail.",
        mfa:"ALTO // redefinição de identidade não solicitada.\nSinais: página de login externa + pressão temporal.\nResposta: não autenticar pelo link; validar pelo portal oficial e revisar sessões.",
        normal:"BAIXO // remetente esperado, domínio consistente e contexto conhecido.\nAinda assim: anexos e links devem obedecer às políticas da organização."
      };
      document.querySelector("#phishAnalyze").onclick=()=>document.querySelector("#phishResult").textContent=d[document.querySelector("#phishSample").value];
    }
  },
  endpoint:{
    title:"Endpoint Lens",
    render:()=>`
      <div class="lab-layout">
        <section class="lab-main">
          <h3 class="lab-title">Endpoint Forensics</h3>
          <p class="lab-subtitle">Árvore de processos e persistência em um host completamente fictício.</p>
          <div class="panel">
            <h4>Process tree</h4>
            <div class="finding-list">
              <div class="finding"><strong>explorer.exe</strong><small>PID 2140 • usuário analyst</small></div>
              <div class="finding"><strong>↳ powershell.exe</strong><small>PID 4812 • argumento codificado</small></div>
              <div class="finding"><strong>↳ rundll32.exe</strong><small>PID 5104 • child process incomum</small></div>
            </div>
          </div>
          <button class="lab-button" id="endpointAnalyze">Correlacionar comportamento</button>
          <div class="result" id="endpointResult">Aguardando correlação.</div>
        </section>
        <aside class="lab-side">
          <div class="panel"><h4>Telemetry</h4><div class="risk"><b>Process create</b><span class="sev-low">ON</span></div><div class="risk"><b>Network</b><span class="sev-low">ON</span></div><div class="risk"><b>Registry</b><span class="sev-low">ON</span></div><div class="risk"><b>Script block</b><span class="sev-medium">PARTIAL</span></div></div>
          <div class="panel"><h4>DFIR flow</h4><div class="killchain"><span>Scope</span><span>Collect</span><span>Timeline</span><span>Contain</span><span>Recover</span></div></div>
        </aside>
      </div>`,
    bind(){
      document.querySelector("#endpointAnalyze").onclick=()=>document.querySelector("#endpointResult").textContent="RISCO ALTO // encadeamento de interpretador + processo LOLBin + argumento ofuscado.\nNão é veredito isolado. Validar command line, assinatura, usuário, destino de rede e persistência antes da contenção.";
    }
  },
  cloud:{
    title:"Cloud Exposure Lab",
    render:()=>`
      <div class="lab-layout">
        <section class="lab-main">
          <h3 class="lab-title">Cloud Misconfiguration Review</h3>
          <p class="lab-subtitle">Escolha uma falha fictícia e veja o caminho de exposição e o controle esperado.</p>
          <div class="panel">
            <label class="field-label" for="cloudCase">Cenário</label>
            <select class="lab-select" id="cloudCase">
              <option value="storage">Storage com leitura pública</option>
              <option value="role">Role com privilégio excessivo</option>
              <option value="sg">Regra de rede 0.0.0.0/0 administrativa</option>
            </select>
            <button class="lab-button" id="cloudAnalyze">Avaliar exposição</button>
            <div class="result" id="cloudResult">Ambiente sintético. Nenhum provedor é consultado.</div>
          </div>
        </section>
        <aside class="lab-side">
          <div class="panel"><h4>Guardrails</h4><div class="finding-list"><div class="finding"><strong>Least privilege</strong><small>identidade e escopo mínimos</small></div><div class="finding"><strong>Private by default</strong><small>dados e serviços não públicos</small></div><div class="finding"><strong>Continuous posture</strong><small>detectar drift de configuração</small></div></div></div>
        </aside>
      </div>`,
    bind(){
      const c={
        storage:"CRÍTICO // leitura pública pode expor dados sem autenticação.\nRed: confirmar a condição somente em ambiente autorizado.\nBlue: remover acesso público, revisar logs e classificar objetos potencialmente expostos.",
        role:"ALTO // role ampla aumenta blast radius caso a identidade seja comprometida.\nRed: mapear permissões efetivas no lab.\nBlue: reduzir ações e recursos, aplicar JIT e monitorar elevação.",
        sg:"CRÍTICO // porta administrativa aberta globalmente amplia superfície de ataque.\nRed: validar apenas a regra no lab, sem scan externo.\nBlue: limitar origem, usar bastion/VPN e registrar mudanças."
      };
      document.querySelector("#cloudAnalyze").onclick=()=>document.querySelector("#cloudResult").textContent=c[document.querySelector("#cloudCase").value];
    }
  },
  vuln:{
    title:"Vuln Prioritizer",
    render:()=>`
      <div class="lab-layout">
        <section class="lab-main">
          <h3 class="lab-title">Risk Based Vulnerability Management</h3>
          <p class="lab-subtitle">CVSS sozinho não manda na fila. Contexto do ativo muda a prioridade.</p>
          <div class="table-wrap panel">
            <table class="lab-table">
              <thead><tr><th>ID</th><th>CVSS</th><th>Exposto</th><th>Exploração</th><th>Ativo</th><th>Prioridade</th></tr></thead>
              <tbody>
                <tr><td>CVE-DEMO-001</td><td>9.8</td><td>não</td><td>não</td><td>lab-server</td><td><span class="sev-medium">P2</span></td></tr>
                <tr><td>CVE-DEMO-002</td><td>8.1</td><td>sim</td><td>sim</td><td>edge-demo</td><td><span class="sev-critical">P0</span></td></tr>
                <tr><td>CVE-DEMO-003</td><td>6.5</td><td>não</td><td>sim</td><td>workstation</td><td><span class="sev-high">P1</span></td></tr>
              </tbody>
            </table>
          </div>
          <button class="lab-button" id="vulnAnalyze">Explicar prioridade</button>
          <div class="result" id="vulnResult">Aguardando cálculo de contexto.</div>
        </section>
        <aside class="lab-side">
          <div class="panel"><h4>Fatores</h4><div class="risk"><b>Severity</b><span class="sev-low">CVSS</span></div><div class="risk"><b>Exploitability</b><span class="sev-high">EPSS/KEV</span></div><div class="risk"><b>Exposure</b><span class="sev-high">internet</span></div><div class="risk"><b>Asset value</b><span class="sev-medium">context</span></div></div>
        </aside>
      </div>`,
    bind(){
      document.querySelector("#vulnAnalyze").onclick=()=>document.querySelector("#vulnResult").textContent="P0 → CVE-DEMO-002\nMotivo: exploração conhecida + exposição externa + ativo de borda.\n\nP1 → CVE-DEMO-003\nMotivo: exploitability relevante apesar de CVSS menor.\n\nP2 → CVE-DEMO-001\nMotivo: severidade alta, porém sem exposição nem exploração observada no cenário.";
    }
  },
  yara:{
    title:"YARA Forge",
    render:()=>`
      <div class="lab-layout">
        <section class="lab-main">
          <h3 class="lab-title">YARA Pattern Workshop</h3>
          <p class="lab-subtitle">Monte uma regra didática e valide correspondência apenas contra texto sintético local.</p>
          <div class="panel">
            <label class="field-label" for="yaraNeedle">String de interesse</label>
            <input class="lab-input" id="yaraNeedle" value="demo_marker">
            <label class="field-label" for="yaraSample" style="margin-top:14px">Amostra sintética</label>
            <textarea class="lab-textarea" id="yaraSample">header=LAB
payload=demo_marker
status=synthetic</textarea>
            <button class="lab-button" id="yaraRun">Compilar lógica local</button>
            <div class="result" id="yaraResult">Nenhum arquivo real é lido por este laboratório.</div>
          </div>
        </section>
        <aside class="lab-side">
          <div class="panel"><h4>Regra gerada</h4><div class="result" id="yaraRule">rule cyberextra_demo {
  strings:
    $marker = "demo_marker"
  condition:
    $marker
}</div></div>
          <div class="panel"><h4>Boas práticas</h4><div class="finding-list"><div class="finding"><strong>Contexto</strong><small>evite string genérica sem significado</small></div><div class="finding"><strong>Precisão</strong><small>combine sinais para reduzir falso positivo</small></div><div class="finding"><strong>Teste</strong><small>valide em corpus autorizado</small></div></div></div>
        </aside>
      </div>`,
    bind(){
      const esc=v=>v.replace(/["\\]/g,m=>"\\"+m);
      document.querySelector("#yaraRun").onclick=()=>{
        const needle=document.querySelector("#yaraNeedle").value.trim();
        const sample=document.querySelector("#yaraSample").value;
        if(!needle){document.querySelector("#yaraResult").textContent="Informe uma string didática.";return}
        document.querySelector("#yaraRule").textContent='rule cyberextra_demo {\n  strings:\n    $marker = "'+esc(needle)+'"\n  condition:\n    $marker\n}';
        document.querySelector("#yaraResult").textContent=sample.includes(needle)
          ?"MATCH LOCAL // a amostra sintética contém o marcador informado.\nPróximo passo: adicionar contexto antes de promover uma regra para produção."
          :"NO MATCH // o marcador não aparece na amostra sintética.";
      };
    }
  },
  detection:{
    title:"Detection Rule Studio",
    render:()=>`
      <div class="lab-layout">
        <section class="lab-main">
          <h3 class="lab-title">Detection Engineering Studio</h3>
          <p class="lab-subtitle">Teste lógica de detecção contra eventos sintéticos e avalie precisão antes de promover uma regra.</p>
          <div class="panel">
            <label class="field-label" for="detectType">Hipótese</label>
            <select class="lab-select" id="detectType">
              <option value="encoded">PowerShell com argumento codificado</option>
              <option value="admin">Login privilegiado fora da janela</option>
              <option value="lolbin">Processo LOLBin com filho incomum</option>
            </select>
            <button class="lab-button" id="detectRun">Executar regra</button>
            <div class="result" id="detectResult">Aguardando teste contra dataset sintético.</div>
          </div>
          <div class="panel">
            <h4>Eventos de teste</h4>
            <div class="table-wrap">
              <table class="lab-table">
                <thead><tr><th>ID</th><th>Evento</th><th>Esperado</th></tr></thead>
                <tbody>
                  <tr><td>EVT-101</td><td>powershell.exe -EncodedCommand DEMO</td><td>alerta</td></tr>
                  <tr><td>EVT-102</td><td>powershell.exe Get-Process</td><td>normal</td></tr>
                  <tr><td>EVT-103</td><td>admin login 02:14</td><td>alerta</td></tr>
                  <tr><td>EVT-104</td><td>signed utility normal child</td><td>normal</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
        <aside class="lab-side">
          <div class="panel"><h4>Quality gates</h4><div class="risk"><b>True positives</b><span class="sev-low" id="detectTP">--</span></div><div class="risk"><b>False positives</b><span class="sev-medium" id="detectFP">--</span></div><div class="risk"><b>Coverage</b><span class="sev-low">synthetic</span></div></div>
          <div class="panel"><h4>Engineering loop</h4><div class="killchain"><span>Hypothesis</span><span>Telemetry</span><span>Rule</span><span>Test</span><span>Tune</span></div></div>
        </aside>
      </div>`,
    bind(){
      const cases={
        encoded:{tp:1,fp:0,text:"PASS // EVT-101 detectado; EVT-102 ignorado.\nLógica: processo PowerShell + argumento codificado.\nAprimoramento: adicionar contexto de parent process, signer e usuário."},
        admin:{tp:1,fp:0,text:"PASS // EVT-103 detectado por janela de horário + privilégio.\nAprimoramento: exceções devem ser justificadas, temporárias e auditáveis."},
        lolbin:{tp:1,fp:1,text:"TUNE // comportamento genérico gerou um falso positivo sintético.\nAprimoramento: correlacionar command line, processo pai, destino e assinatura."}
      };
      document.querySelector("#detectRun").onclick=()=>{
        const r=cases[document.querySelector("#detectType").value];
        document.querySelector("#detectTP").textContent=r.tp;
        document.querySelector("#detectFP").textContent=r.fp;
        document.querySelector("#detectResult").textContent=r.text;
      };
    }
  }
};

const workspace=document.querySelector("#workspace");
const workspaceTitle=document.querySelector("#workspaceTitle");
const workspaceContent=document.querySelector("#workspaceContent");

function openModule(key){
  const mod=modules[key];
  if(!mod)return;
  workspaceTitle.textContent=mod.title;
  workspaceContent.innerHTML=mod.render();
  workspace.classList.add("open");
  workspace.setAttribute("aria-hidden","false");
  document.body.style.overflow="hidden";
  mod.bind?.();
}

function closeModule(){
  workspace.classList.remove("open");
  workspace.setAttribute("aria-hidden","true");
  document.body.style.overflow="";
  workspaceContent.innerHTML="";
}

document.querySelectorAll("[data-open]").forEach(b=>b.addEventListener("click",()=>openModule(b.dataset.open)));
document.querySelector("#workspaceClose").addEventListener("click",closeModule);
workspace.addEventListener("click",e=>{if(e.target===workspace)closeModule()});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModule()});

document.querySelectorAll(".filter").forEach(btn=>btn.addEventListener("click",()=>{
  document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));
  btn.classList.add("active");
  const filter=btn.dataset.filter;
  document.querySelectorAll(".module-card").forEach(card=>card.classList.toggle("hidden",filter!=="all"&&!card.dataset.team.includes(filter)));
}));

document.querySelector("#themeToggle").addEventListener("click",()=>document.body.classList.toggle("high-contrast"));

document.querySelector("#runAll").addEventListener("click",()=>{
  const consoleBox=document.querySelector("#heroConsole");
  const lines=[
    "› scanning synthetic identity graph... 4 exposures",
    "› inspecting local web controls... 5 classes mapped",
    "› correlating network telemetry... 3 signals",
    "› validating secret scanner... ready",
    "› final posture... PURPLE LAB OPERATIONAL"
  ];
  consoleBox.innerHTML="";
  lines.forEach((line,i)=>setTimeout(()=>{const p=document.createElement("p");p.textContent=line;consoleBox.appendChild(p)},i*260));
});

document.querySelector("#year").textContent=new Date().getFullYear();
