export async function renderMarkdownRoute(
  markdownPath: string
): Promise<preact.ComponentType> {
  const [frontMatter, marked] = await Promise.all([
    import('front-matter'),
    import('marked'),
  ])

  const res = await fetch(markdownPath)
  const text = await res.text()

  const { attributes, body } = frontMatter.default(text)
  const html = await marked.marked(body)

  return () => <div dangerouslySetInnerHTML={{ __html: html }}></div>
}
