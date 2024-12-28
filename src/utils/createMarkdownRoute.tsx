import { useEffect } from 'preact/hooks'
import Layout from '../components/Layout'
import { memo } from './memo'

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
    useEffect(() => {
      document.title = `${attributes.title} | SeattleJS`
    }, [])

    return (
      <Layout>
        <div id="page">
          <div class="page-title">
            <div>
              <h1>{attributes.title}</h1>
            </div>
          </div>
          <div
            class="page-body"
            dangerouslySetInnerHTML={{ __html: html }}
          ></div>
        </div>
      </Layout>
    )
  }

  return memo(MarkdownRoute)
}
