export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
export function isId(value: unknown): value is number {
  return typeof value === "number" && Number.isSafeInteger(value) && value > 0;
}
export function parseId(value: string): number {
  return /^[0-9]+$/.test(value) && isId(Number(value)) ? Number(value) : 0;
}
export function text(value: unknown, max = 200): value is string {
  return (
    typeof value === "string" && value.trim().length > 0 && value.length <= max
  );
}
export function allowed(body: Record<string, unknown>, fields: string[]) {
  const keys = Object.keys(body);
  return keys.length > 0 && keys.every((key) => fields.includes(key));
}
export function validDate(value: unknown): value is string {
  if (
    typeof value !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(value) ||
    value.startsWith("0000")
  )
    return false;
  const date = new Date(value + "T00:00:00Z");
  return (
    !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
  );
}
