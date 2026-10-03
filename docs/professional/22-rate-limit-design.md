# Rate Limit Design

Rate limiting deve considerar identidade, IP, endpoint, risco e janela temporal.

Aplicar limites mais fortes a login, recuperação, OTP, criação de recurso e operações caras. Responder de forma previsível e registrar abuso sem expor lógica interna.