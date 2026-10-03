# API Security Baseline

APIs devem exigir autenticação e autorização consistentes, validar schema, limitar tamanho e frequência, proteger segredos e registrar operações sensíveis.

## Testar
- BOLA/IDOR;
- excesso de dados;
- mass assignment;
- ausência de rate limiting;
- enumeração;
- métodos não esperados;
- erros verbosos;
- confiança em campos controlados pelo cliente.