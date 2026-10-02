import type { APIRoute, GetStaticPaths } from 'astro';
import { loadRides } from '../../lib/rides';

// Trace détaillée d'une sortie, chargée à la demande par /rides/.
export const getStaticPaths = (() =>
  loadRides().map((ride) => ({ params: { slug: ride.summary.slug }, props: { track: ride.track } }))) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) =>
  new Response(JSON.stringify(props.track), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
