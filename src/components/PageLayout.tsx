import { useEffect } from 'preact/hooks'
import Layout from './Layout'

export default function PageLayout({
  title,
  children,
}: {
  title: string
  children: preact.ComponentChildren
}) {
  useEffect(() => {
    document.title = `${title} | SeattleJS`
  }, [title])

  return (
    <Layout>
      <div id="page">
        <div class="page-title">
          <h1>{title}</h1>
        </div>
        <div class="page-body">{children}</div>
      </div>
    </Layout>
  )
}
