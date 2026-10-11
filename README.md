# CYBEREXTRA

Coleção de exercícios de **Cybersecurity** executados no navegador, com foco em Blue Team, AppSec e simulações controladas.

O projeto foi montado para testar raciocínio de segurança sem depender de infraestrutura externa. Os cenários trabalham com dados sintéticos e servem para analisar falhas, registrar evidências e pensar na contramedida defensiva.

## O que tem no projeto

- análise de vulnerabilidades em cenários locais
- exercícios de AppSec e lógica de negócio
- threat modeling
- scorecards e relatórios
- busca e command palette
- self-test da interface
- documentação de detecção, mitigação e validação

## Estrutura

- `index.html` — interface principal
- `app.js` — lógica central
- `js/` — módulos de busca, relatório, preferências, scorecard e self-test
- `data/` — dados usados pelos cenários
- `docs/` — documentação técnica
- `assets/` — recursos visuais

## Execução

O projeto roda como aplicação client-side. Pode ser servido localmente com qualquer servidor estático.

## Uso responsável

Os exemplos existem para estudo em ambiente controlado. Não há justificativa para apontar este projeto contra sistemas de terceiros sem autorização.

Dados reais, tokens, cookies, credenciais e informações corporativas não devem ser adicionados ao repositório.

## Segurança verificável e evidências

A segurança deste projeto é tratada como processo contínuo, **não como promessa de software invulnerável**:

- [Registro de riscos e superfície de ataque](docs/SECURITY_RISK_REGISTER.md)
- [Plano reproduzível de testes](docs/SECURITY_VALIDATION_PLAN.md)
- [Guia de implantação segura](docs/SECURE_DEPLOYMENT.md)
- [Resposta a incidentes e recuperação](docs/INCIDENT_PLAYBOOK.md)
- [Evidências e estudo de caso para portfólio](docs/PORTFOLIO_EVIDENCE.md)

O workflow `.github/workflows/security-guard.yml` detecta classes de credenciais expostas em arquivos rastreados e executa testes regressivos do detector. **Não substitui SAST, DAST, pentest, proteção de branch, autenticação, revisão humana nem varredura completa do histórico Git.** Verifique o status do CI na revisão que pretende publicar. Use somente dados sintéticos em demonstrações públicas.
