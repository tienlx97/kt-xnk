import { Hero } from '../../features/home/index.js';
import { site } from '../../shared/config/site.js';

export default function HomePage() {
  return <Hero title={site.name} subtitle={site.description} />;
}
