import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"

type SeoProps = {
  title: string
  description?: string
  image?: string
  pathname?: string
  children?: React.ReactNode
}

const Seo: React.FC<SeoProps> = ({
  title,
  description,
  image,
  pathname = "",
  children,
}) => {
  const { site } = useStaticQuery<{
    site: {
      siteMetadata: {
        title?: string
        description?: string
        siteUrl?: string
        social?: { x?: string }
      }
    }
  }>(graphql`
    query {
      site {
        siteMetadata {
          title
          description
          siteUrl
          social {
            x
          }
        }
      }
    }
  `)

  const metaDescription = description || site.siteMetadata.description || ""
  const defaultTitle = site.siteMetadata?.title
  const siteUrl = site.siteMetadata?.siteUrl || ""
  const url =
    siteUrl && pathname ? new URL(pathname, siteUrl).toString() : siteUrl
  const metaImage = image
    ? new URL(image, siteUrl || "http://localhost:8000").toString()
    : undefined
  const twitterHandle = site.siteMetadata?.social?.x || ""

  return (
    <>
      <title>{defaultTitle ? `${title} | ${defaultTitle}` : title}</title>
      <meta name="description" content={metaDescription} />

      {/* Canonical */}
      {url && <link rel="canonical" href={url} />}

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      {url && <meta property="og:url" content={url} />}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={metaDescription} />
      {metaImage && <meta property="og:image" content={metaImage} />}
      {metaImage && <meta property="og:image:alt" content={title} />}

      {/* Twitter */}
      <meta
        name="twitter:card"
        content={metaImage ? "summary_large_image" : "summary"}
      />
      {twitterHandle && <meta name="twitter:creator" content={twitterHandle} />}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={metaDescription} />
      {metaImage && <meta name="twitter:image" content={metaImage} />}

      {children}
    </>
  )
}

export default Seo
