export function categoryName(
  value: number | { name?: string | null } | null | undefined,
  fallback: string,
): string {
  return typeof value === 'object' && value?.name ? value.name : fallback
}
