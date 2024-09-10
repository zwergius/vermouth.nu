export function slugify(text: string) {
  return text
    .toString() // Convert to string
    .normalize('NFKD') // Normalize the string (removes accents)
    .toLowerCase() // Convert to lowercase
    .trim() // Trim leading/trailing spaces
    .replace(/[^a-z0-9 -]/g, '') // Remove invalid characters
    .replace(/\s+/g, '-') // Replace spaces with dashes
    .replace(/-+/g, '-') // Replace multiple dashes with a single dash
}
