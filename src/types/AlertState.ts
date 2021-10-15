export type AlertState = {
  severity: Severity;
  message: string;
}

export enum Severity {
  error = "error",
  warning = "warning",
  info = "info",
  success = "success",
}
