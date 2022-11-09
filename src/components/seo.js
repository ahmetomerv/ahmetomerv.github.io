/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { useStaticQuery, graphql } from 'gatsby';
import favicon from '../../static/favicon.ico';

const SEO = (data) => {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            social {
              twitter
              dribbble
              github
            }
          }
        }
      }
    `
  )

  const metaDescription = data.description || site.siteMetadata.description
  const defaultTitle = site.siteMetadata?.title
  const previewImg = 'https://ahmetomer.net' + data.preview?.src

  return (
    <Helmet
      htmlAttributes={{
        lang: data.lang,
      }}
      title={data.title}
      titleTemplate={defaultTitle ? `%s | ${defaultTitle}` : null}
      meta={[
        {
          name: `description`,
          content: metaDescription,
        },
        {
          property: `og:title`,
          content: data.title,
        },
        {
          property: `og:description`,
          content: metaDescription,
        },
        {
          property: `og:image`,
          content: previewImg,
        },
        {
          property: `og:type`,
          content: `article`,
        },
        {
          name: `twitter:creator`,
          content: site.siteMetadata?.social?.twitter || ``,
        },
        {
          name: `twitter:title`,
          content: data.title,
        },
        {
          name: `twitter:card`,
          content: `summary_large_image`,
        },
        {
          name: `twitter:domain`,
          content: 'ahmetomer.net',
        },
        {
          name: `twitter:image`,
          content: previewImg,
        },
        {
          name: `twitter:description`,
          content: metaDescription,
        },
      ].concat(data.meta)}
    >
      <link rel="icon" href={favicon} />
    </Helmet>
  )
}

SEO.defaultProps = {
  lang: `en`,
  meta: [],
  description: ``,
}

SEO.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string.isRequired,
}

export default SEO
