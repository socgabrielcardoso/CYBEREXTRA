# CSRF Review

Operações que dependem de cookies podem exigir proteção contra CSRF.

Controles incluem SameSite, tokens anti-CSRF e validação de origem. APIs com bearer token fora de cookie têm modelo diferente, mas ainda precisam de autorização robusta.