import React from 'react';
import { graphql, Link } from 'gatsby';

import Layout from '../components/layout';
import SEO from '../components/seo';

const Translations = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`;
  const posts = data.allMarkdownRemark.nodes;

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title="Translations" />

      <div>
        <h3>Translation Works</h3>

        <ol style={{ listStyle: `none`, paddingLeft: 0 }}>
        { posts.map(post => {
          if (post.frontmatter.isTranslation) {
            const title = post.frontmatter.title || post.fields.slug;
            
            return (
              <li key={post.fields.slug}>
                <article
                  className="post-list-item"
                  itemScope
                  itemType="http://schema.org/Article"
                >
                  <header>
                    <h2 className="post-list-header">
                      <Link to={post.fields.slug} itemProp="url">
                        <span itemProp="headline">{title}</span>
                      </Link>
                    </h2>
                    <small className="post-list-date">{post.frontmatter.date}</small>
                  </header>
                  <section>
                    <p
                      className="post-list-description"
                      dangerouslySetInnerHTML={{
                        __html: post.frontmatter.description || post.excerpt,
                      }}
                      itemProp="description"
                    />
                  </section>
                </article>
              </li>
            )
          }
        })}
      </ol>

        <h6>The Mythical Man-Month
          <span>
            (<a className="main-link" href="https://docs.google.com/document/d/1dgtlRGY7-j688c6kTX0IEFYzjqvEu2OWoaV5z6W4Eg0/edit?usp=sharing" rel="noreferrer" target="_blank">Turkish translation</a>, unfinished)
          </span>
        </h6>

        <div className="iframe-container">
          <iframe width="560" height="315" style={{ border: '1px solid #dddddd' }} frameBorder="0" src="https://docs.google.com/document/d/e/2PACX-1vSdEyWcXqvw7K2ieJUOoXsoas_CRiy-kXj2eVVsUSF4Hlh-Z8ZgqRu4BuY-mA9_TBr7Fpxo3gz1yqK4/pub?embedded=true"></iframe>
        </div>

        <h6>Ayn Rand - On Altruism, Free Economy, And The Original Sin (Turkish subtitles)</h6>
        <div className="iframe-container">
          <iframe width="560" height="315" src="https://www.youtube.com/embed/KS0dJd9SNLk" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
        </div>

        <h6>Ayn Rand - On The Mind (Turkish subtitles)</h6>
        <div className="iframe-container">
          <iframe width="560" height="315" src="https://www.youtube.com/embed/M_D_oV-R_40" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
        </div>
      </div>
    </Layout>
  )
}

export default Translations;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      nodes {
        excerpt
        fields {
          slug
        }
        frontmatter {
          date(formatString: "MMMM DD, YYYY")
          title
          description
          isTranslation
        }
      }
    }
  }
`;
