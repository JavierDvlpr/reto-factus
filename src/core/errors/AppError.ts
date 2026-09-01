/**
 * Domain Error Hierarchy — OOP / SOLID Single-Responsibility
 * All application errors extend from AppError, allowing typed catch blocks.
 */

export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly context?: Record<string, unknown>;

  constructor(
    message: string,
    code: string = "APP_ERROR",
    statusCode: number = 500,
    context?: Record<string, unknown>
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.context = context;
    // Restore prototype chain in transpiled environments
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id?: string) {
    super(
      id ? `${resource} con id '${id}' no encontrado` : `${resource} no encontrado`,
      "NOT_FOUND",
      404
    );
  }
}

export class ValidationError extends AppError {
  public readonly fields?: Record<string, string>;
  constructor(message: string, fields?: Record<string, string>) {
    super(message, "VALIDATION_ERROR", 400);
    this.fields = fields;
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "No tienes autorización para realizar esta acción") {
    super(message, "UNAUTHORIZED", 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Acceso denegado") {
    super(message, "FORBIDDEN", 403);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, "CONFLICT", 409);
  }
}

export class ExternalServiceError extends AppError {
  constructor(service: string, message: string, context?: Record<string, unknown>) {
    super(`Error en servicio externo [${service}]: ${message}`, "EXTERNAL_SERVICE_ERROR", 502, context);
  }
}
