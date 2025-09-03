import * as React from "react";
import { Link, graphql, PageProps } from "gatsby";
import { GatsbyImage, getImage, IGatsbyImageData } from "gatsby-plugin-image";

import Bio from "../components/bio";
import Hero from "../components/hero";
import Layout from "../components/layout";
import Seo from "../components/seo";

type BlogIndexProps = PageProps & {
  data: {
    site: {
      siteMetadata: {
        title: string;
      };
    };
    allMarkdownRemark: {
      nodes: Array<{
        excerpt: string;
        fields: {
          slug: string;
        };
        frontmatter: {
          title: string;
          date: string;
          description?: string;
          featuredAlt?: string;
          featured?: {
            childImageSharp: {
              gatsbyImageData: IGatsbyImageData;
            };
          };
        };
      }>;
    };
  };
};

const BlogIndex: React.FC<BlogIndexProps> = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`;
  const posts = data.allMarkdownRemark.nodes;

  if (posts.length === 0) {
    return (
      <Layout location={location} title={siteTitle}>
        <Hero />
        <p>
          No blog posts found. Add markdown posts to "content/blog" (or the
          directory you specified for the "gatsby-source-filesystem" plugin in
          gatsby-config.js).
        </p>
      </Layout>
    );
  }

  return (
    <Layout location={location} title={siteTitle}>
      <Hero />
      <h2>Recent Posts</h2>
      <ol style={{ listStyle: `none` }}>
        {posts.map((post) => {
          const title = post.frontmatter.title || post.fields.slug;
          const featuredImage = post.frontmatter.featured
            ? getImage(post.frontmatter.featured.childImageSharp.gatsbyImageData)
            : null;
          const alt = post.frontmatter.featuredAlt || title;

          return (
            <li key={post.fields.slug}>
              <article
                className="post-list-item"
                itemScope
                itemType="http://schema.org/Article"
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "1rem",
                }}
              >
                {featuredImage && (
                  <Link to={post.fields.slug} aria-label={`Open ${title}`}>
                    <GatsbyImage
                      image={featuredImage}
                      alt={alt}
                      style={{ width: "150px", height: "150px", flexShrink: 0 }}
                    />
                  </Link>
                )}
                <div
                  style={{
                    flex: 1,
                    width: featuredImage ? "auto" : "100%",
                  }}
                >
                  <header>
                    <h2>
                      <Link to={post.fields.slug} itemProp="url">
                        <span itemProp="headline">{title}</span>
                      </Link>
                    </h2>
                    <small>{post.frontmatter.date}</small>
                  </header>
                  <section>
                    <p
                      dangerouslySetInnerHTML={{
                        __html:
                          post.frontmatter.description || post.excerpt,
                      }}
                      itemProp="description"
                    />
                  </section>
                </div>
              </article>
            </li>
          );
        })}
      </ol>
      <hr />
      <Bio />
    </Layout>
  );
};

export default BlogIndex;

/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head: React.FC = () => <Seo title="All posts" />;

export const pageQuery = graphql`
  {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { frontmatter: { date: DESC } }) {
      nodes {
        excerpt
        fields {
          slug
        }
        frontmatter {
          date(formatString: "MMMM DD, YYYY")
          title
          description
          featuredAlt
          featured {
            childImageSharp {
              gatsbyImageData(width: 150, height: 150, placeholder: BLURRED, quality: 85)
            }
          }
        }
      }
    }
  }
`;
