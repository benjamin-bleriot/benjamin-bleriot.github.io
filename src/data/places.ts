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
];
