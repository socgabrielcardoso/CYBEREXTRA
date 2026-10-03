# Secure Error Handling

Mensagens ao usuário devem ser úteis sem revelar stack trace, query, caminho interno, segredo ou detalhe de infraestrutura.

Detalhe técnico pertence ao log protegido. O cliente recebe erro consistente, identificador de correlação e orientação segura.