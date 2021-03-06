import React from "react";
import classnames from "classnames";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useBaseUrl from "@docusaurus/useBaseUrl";
import styles from "./styles.module.css";
import chunk from "lodash/chunk";

const features = [
  {
    title: <>Containerised</>,
    imageUrl: "img/pico-containerised.svg",
    description: (
      <>
        Everything that can be in a container, should be. This provides a
        unified way of managing, configuring and monitoring services.
      </>
    ),
  },
  {
    title: <>Git-Ops and Infrastructure-As-Code</>,
    imageUrl: "img/pico-iac.svg",
    description: (
      <>
        Your infrastructure is just as important as your code. So treat it the
        same. The Pico Stack encourages and implements this wherever possible.
      </>
    ),
  },
  {
    title: <>Automated</>,
    imageUrl: "img/pico-automated.svg",
    description: (
      <>
        Whatever can be automated, should be. But it should also be easy to
        intervene when things go wrong. Because things always go wrong!
      </>
    ),
  },
];

function Feature({ imageUrl, title, description }) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={classnames("col col--4", styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  return (
    <Layout title={siteConfig.title} description={siteConfig.tagline}>
      <header className={classnames("hero hero--primary", styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className={classnames(
                "button button--outline button--secondary button--lg",
                styles.getStarted
              )}
              to={useBaseUrl("docs/intro/introduction")}
            >
              Introduction
            </Link>
          </div>
        </div>
      </header>
      <main>
        {features && features.length && (
          <section className={styles.features}>
            <div className="container">
              {chunk(features, 3).map((sub, idx) => (
                <div className={classnames("row", styles.row)} key={idx}>
                  {sub.map((props, idx) => (
                    <Feature key={idx} {...props} />
                  ))}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}

export default Home;
