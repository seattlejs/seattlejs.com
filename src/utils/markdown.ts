import { marked } from 'marked'

export function toHTML(markdown: string): string {
  return marked(markdown, { async: false })
}
