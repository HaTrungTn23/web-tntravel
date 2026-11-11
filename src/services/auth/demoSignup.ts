export function isDemoGmail(value: string) {
  return /^[^\s@]+@gmail\.com$/i.test(value.trim());
}
