import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Multiple Authentication Providers',
    Svg: require('@site/static/img/auth-providers.svg').default,
    description: (
      <>
        Integrate with popular OAuth providers like GitHub, Google, Auth0,
        Facebook, and Keycloak. Support for email/password and custom authentication.
      </>
    ),
  },
  {
    title: 'Role-Based Authentication',
    Svg: require('@site/static/img/role-based-auth.svg').default,
    description: (
      <>
        Control access with user, moderator, and admin roles. Easily implement
        permission-based access control in your application.
      </>
    ),
  },
  {
    title: 'Database Integration',
    Svg: require('@site/static/img/database.svg').default,
    description: (
      <>
        PostgreSQL with Prisma for persistent storage. Includes connection pooling,
        rate limiting, and configurable data retention strategies.
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
