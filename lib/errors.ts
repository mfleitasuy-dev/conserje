/** Error de regla de negocio. `code` permite mapear a un status HTTP. */
export class DomainError extends Error {
  constructor(
    message: string,
    public code: "invalid" | "not_found" | "conflict" = "invalid",
  ) {
    super(message);
    this.name = "DomainError";
  }
}
