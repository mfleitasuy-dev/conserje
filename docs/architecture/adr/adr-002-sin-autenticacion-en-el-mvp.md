# ADR-002 — Sin autenticación en el MVP

## Estado

Aceptada — 2026-08-03.

## Contexto

El MVP tiene un scope acotado y prioriza demostrar las reglas de negocio (accesos y
cocheras). La app está pensada como **kiosko físico de portería**: una sola pantalla de uso
interno, operada por el portero dentro del edificio, no expuesta a internet. Implementar
login, sesiones y roles habría consumido una parte importante del esfuerzo disponible, en
detrimento de lo que el MVP debe demostrar.

## Decisión

El MVP **no tiene autenticación**: ni login en la web ni credenciales en el MCP. El control de
acceso es físico (quién está frente al kiosko). Autenticación y roles
(Admin/Portero/Residente) quedan explícitamente en el roadmap.

## Consecuencias

### Positivas

- El esfuerzo del MVP se invierte en reglas de negocio (visitas, cocheras, noticias, alertas,
  denuncias) en lugar de infraestructura de login.
- Menos fricción para el portero: el kiosko queda siempre listo, sin sesiones que expiren.
- Menos superficie de código en el MVP: no hay manejo de contraseñas, sesiones ni permisos.

### Negativas

- **No apto para exponer a internet**: cualquiera con acceso a la URL puede operar el sistema.
  Solo es aceptable en una red interna con acceso físico controlado.
- Sin auditoría: no queda registrado quién hizo cada acción (todas las operaciones son
  anónimas).
- El MCP tampoco autentica: cualquier agente con acceso al proceso y a la `DATABASE_URL` puede
  operar el edificio.
- Incorporar roles más adelante tocará transversalmente páginas, handlers y tools MCP.
