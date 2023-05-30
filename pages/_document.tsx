
import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>

          <meta property="og:type" content="website"></meta>
          <meta property="og:site_name" content="GRANDERBY"></meta>
          <meta property="og:title" content="GRANDERBY"></meta>
          <meta property="og:description" content="powered by MOMOCON"></meta>
          <meta property="og:image" content="/intro-bg.png"></meta>
          <meta property="og:image:width" content="1400"></meta>
          <meta property="og:image:height" content="1400"></meta>

          <meta name="twitter:card" content="summary_large_image"></meta> 
          <meta name="twitter:image" content="/intro-bg.png"></meta>



            <link rel="icon" href="/favicon.ico" />
            <link rel="preconnect" href="https://fonts.googleapis.com"/>
            <link rel="preconnect" href="https://fonts.gstatic.com"/>
            <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@500&family=Montserrat:wght@700&display=swap" rel="stylesheet"/>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument