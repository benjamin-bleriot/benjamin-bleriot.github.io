/**
 * Endroits visités, affichés sur la page privée /trip/.
 *
 * Pour en ajouter un : son nom, le code du pays (ISO 3166-1 alpha-2, ex. 'IT' pour l'Italie)
 * et ses coordonnées en degrés décimaux (clic droit sur la carte d'OpenStreetMap ou de Google Maps).
 * Le pays est mis en couleur automatiquement ; l'ordre de la liste fixe l'ordre des couleurs.
 */
export interface Place {
  name: string;
  /** Code pays ISO 3166-1 alpha-2. */
  country: string;
  lat: number;
  lon: number;
}

export const places: Place[] = [
  { name: 'Londres', country: 'GB', lat: 51.5072, lon: -0.1276 },
  { name: 'Brighton', country: 'GB', lat: 50.8225, lon: -0.1372 },
  { name: 'Madrid', country: 'ES', lat: 40.4168, lon: -3.7038 },
  { name: 'Séville', country: 'ES', lat: 37.3891, lon: -5.9845 },
  { name: 'Grenade', country: 'ES', lat: 37.1773, lon: -3.5986 },
  { name: 'New York', country: 'US', lat: 40.7128, lon: -74.006 },
  { name: 'Lisbonne', country: 'PT', lat: 38.7223, lon: -9.1393 },
  { name: 'Faro', country: 'PT', lat: 37.0194, lon: -7.9304 },
  { name: 'Santiago', country: 'CL', lat: -33.4378, lon: -70.6504 },
  { name: 'Ushuaia', country: 'AR', lat: -54.8019, lon: -68.303 },
  { name: 'Puerto Natales', country: 'CL', lat: -51.7277, lon: -72.5065 },
  { name: 'Pucón', country: 'CL', lat: -39.2822, lon: -71.9545 },
  { name: 'Oslo', country: 'NO', lat: 59.9139, lon: 10.7522 },
  { name: 'Dublin', country: 'IE', lat: 53.3498, lon: -6.2603 },
  { name: 'Bruxelles', country: 'BE', lat: 50.8467, lon: 4.3525 },
  { name: 'Spa', country: 'BE', lat: 50.492, lon: 5.864 },
  { name: 'Cologne', country: 'DE', lat: 50.9413, lon: 6.9583 },
  { name: 'Amsterdam', country: 'NL', lat: 52.3731, lon: 4.8926 },
  { name: 'Genève', country: 'CH', lat: 46.2044, lon: 6.1432 },
  { name: 'Lausanne', country: 'CH', lat: 46.5197, lon: 6.6323 },
  { name: 'Rome', country: 'IT', lat: 41.8933, lon: 12.4829 },
  { name: 'Florence', country: 'IT', lat: 43.7696, lon: 11.2558 },
  { name: 'Milan', country: 'IT', lat: 45.4642, lon: 9.19 },
  { name: 'Palerme', country: 'IT', lat: 38.1157, lon: 13.3615 },
  { name: 'Catane', country: 'IT', lat: 37.5079, lon: 15.083 },
  { name: 'Barcelone', country: 'ES', lat: 41.3874, lon: 2.1686 },
  { name: 'Fuerteventura', country: 'ES', lat: 28.3333, lon: -14.0167 },
  { name: 'Stavanger', country: 'NO', lat: 58.97, lon: 5.7331 },
  { name: 'Bergen', country: 'NO', lat: 60.3913, lon: 5.3221 },
];
