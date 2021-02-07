import React from 'react';
import { graphql } from 'gatsby';

import Bio from '../components/bio';
import Layout from '../components/layout';
import SEO from '../components/seo';

const Youtube = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`;

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title="Translations" />
      <Bio />

      <div>
        <h3>Translation Works</h3>

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

export default Youtube;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`;
