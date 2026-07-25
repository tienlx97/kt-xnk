import { site } from '../config/site.js';
import { Hero } from '../ui/hero.js';

export default function HomePage() {
  return <Hero title={site.name} subtitle={site.description} />;
}
