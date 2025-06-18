import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  image: string;
  alt: string;
  description: string;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Grammar-Based',
    image: require('@site/static/img/figure-1.png').default,
    alt: 'Schematic with three boxes. The middle box has arrows to the left and right box. The left box (A), titled ‘Gosling Visualization,’ shows a heatmap matrix. The middle box (B), titled ‘Gosling JSON Specification,’ shows text in JSON format. The right box (C), titled ‘AltGosling Text Description,’ shows text in a quotation mark. The text in the right box reads ‘Matrix. Chart is titled ‘Hi-C for HFFc6 Cells’. The Genome is shown on both the x- and y-axes. Both axes show intervals. The height of the expression values is shown with colors.',
    description: 'Based on flexible grammar-based genomics toolkit Gosling',
  },
  {
    title: 'Flexible',
    image: require('@site/static/img/figure-2.png').default,
    alt: 'Schematic with two sections. On the top left is a file icon with ‘Gosling Spec’. This points to the right section, labeled ‘Gosling.js,’ and the bottom section, labeled ‘AltGosling’.',
    description: 'Various options for text descriptions',
  },
  {
    title: 'Navigable',
    image: require('@site/static/img/figure-3.png').default,
    alt: 'Screenshot of AltGosling in browser. On top is a Gosling visualization with two scatter plots. Below are two partially expanded panels, showing information such as title, tracks, appearance, and data table.',
    description: 'Deliver descriptions in easy navigable format',
  },
];

function Feature({title, image, alt, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <img className={styles.featureimage} src={image} alt={alt}/>
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
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
