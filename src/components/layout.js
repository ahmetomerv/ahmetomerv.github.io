import React from "react"
import { Link, useStaticQuery, graphql } from "gatsby"

const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath
  let header
  const data = useStaticQuery(graphql`
    query SecondBioQuery {
      site {
        siteMetadata {
          social {
            twitter
            dribbble
            behance
            github
          }
        }
      }
    }
  `)
  const social = data.site.siteMetadata?.social;

  if (isRootPath) {
    header = (
      <h1 className="main-heading">
        <Link to="/">{title}</Link>
      </h1>
    )
  } else {
    header = (
      <div className="post-page-nav-container">
        <Link className="post-page-nav-item post-page-nav-header" to="/">
          {title}
        </Link>
  
        { social && (
          <React.Fragment>
            <a className="post-page-nav-item bio-link" href={`${social?.twitter || ``}`}>
              Twitter
            </a>
            <a className="post-page-nav-item bio-link" href={`${social?.github || ``}`}>
              GitHub
            </a>
            <a className="post-page-nav-item bio-link" href={`${social?.dribbble || ``}`}>
              Dribbble
            </a>
            <a className="post-page-nav-item bio-link" href={`${social?.behance || ``}`}>
              Behance
            </a>
          </React.Fragment>
        )}
      </div>
    )
  }

  return (
    <div className="global-wrapper" data-is-root-path={isRootPath}>
      <header className="global-header">{header}</header>
      <main>{children}</main>
      <footer>
        <div>
          © {new Date().getFullYear()}, Ahmet Ömer
        </div>
        <div>
          * * *
        </div>
      </footer>
    </div>
  )
}

export default Layout
