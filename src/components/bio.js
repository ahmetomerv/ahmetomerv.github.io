/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import React from 'react';
import { Link, useStaticQuery, graphql } from 'gatsby';
import Image from 'gatsby-image';

const Bio = () => {
  const data = useStaticQuery(graphql`
    query BioQuery {
      avatar: file(absolutePath: { regex: "/profile-pic.jpg/" }) {
        childImageSharp {
          fixed(width: 50, height: 50, quality: 95) {
            ...GatsbyImageSharpFixed
          }
        }
      }
      site {
        siteMetadata {
          author {
            name
            summary
          }
          social {
            twitter
            dribbble
            github
          }
        }
      }
    }
  `)

  // Set these values by editing "siteMetadata" in gatsby-config.js
  const author = data.site.siteMetadata?.author;
  const social = data.site.siteMetadata?.social;
  const avatar = data?.avatar?.childImageSharp?.fixed;

  return (
    <div className="bio">
      {avatar && (
        <Image
          fixed={avatar}
          alt={author?.name || ``}
          className="bio-avatar"
        />
      )}
      {author?.name && (
        <React.Fragment>
          <div>
            {author?.summary || null}
            <br/>
            <Link className="post-page-nav-item bio-link" to="/translations">
              Translations
            </Link>
            <span> / </span>
            <a className="bio-link" target="_blank" rel="noreferrer" href={`${social?.twitter || ``}`}>
              Twitter
            </a>
            <span> / </span>
            <a className="bio-link" target="_blank" rel="noreferrer" href={`${social?.github || ``}`}>
              GitHub
            </a>
            <span> / </span>
            <a className="bio-link" target="_blank" rel="noreferrer" href={`${social?.dribbble || ``}`}>
              Dribbble
            </a>
          </div>
        </React.Fragment>
      )}
    </div>
  )
}

export default Bio;
