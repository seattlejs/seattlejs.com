import Footer from './Footer'
import Header from './Header'

export default function Layout({
  children,
}: {
  children: preact.ComponentChildren
}) {
  // TODO: Figure out styling
  //
  //   <style>
  //   :host {
  //     display: flex;
  //     flex-direction: column;
  //     min-height: 100vh;
  //   }
  //   #main {
  //     flex: 1;
  //   }
  // </style>
  return (
    <div>
      <Header />
      <div id="main">{children} </div>
      <Footer />
    </div>
  )
}
