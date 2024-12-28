import { memo } from './memo'
import PageLayout from '../components/PageLayout'

export async function createMarkdownRoute(
  markdownPath: string
): Promise<preact.ComponentType> {
  const [frontMatter, marked] = await Promise.all([
    import('front-matter'),
    import('marked'),
  ])

  const res = await fetch(markdownPath)
  const text = await res.text()

  const { attributes, body } = frontMatter.default<Record<string, any>>(text)
  const html = await marked.marked(body)

  function MarkdownRoute() {
    return (
      <PageLayout title={attributes.title}>
        <div
          class="markdown-content"
          dangerouslySetInnerHTML={{ __html: html }}
        ></div>
      </PageLayout>
    )
  }

  return memo(MarkdownRoute)
}
