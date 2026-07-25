import { Hero } from '../ui/hero.js';
import { site } from '../config/site.js';

export default function HomePage() {
  return <Hero title={site.name} subtitle={site.description} />;
}
