export function getInitial(name?: string | null, email?: string | null) {
  const source = name?.trim() || email?.trim();
  return source ? source.charAt(0).toUpperCase() : "?";
}
