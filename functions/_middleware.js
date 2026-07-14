// LE TICKET — Middleware Cloudflare Pages
// S'exécute AVANT le service des fichiers statiques (contrairement à _redirects).
// Bloque l'accès aux chemins sensibles (dossier .git, fichiers d'environnement,
// fichiers cachés de config) qui pourraient traîner dans le déploiement.
export async function onRequest(context) {
  const path = new URL(context.request.url).pathname.toLowerCase();

  const bloque =
    path.startsWith('/.git') ||
    path.startsWith('/.env') ||
    path.startsWith('/.hg') ||
    path.startsWith('/.svn') ||
    path === '/deploy.sh' ||
    path.endsWith('/.ds_store') ||
    path.endsWith('.env');

  if (bloque) {
    return new Response('Not Found', {
      status: 404,
      headers: { 'X-Robots-Tag': 'noindex, nofollow' }
    });
  }

  // Tout le reste : service normal des fichiers statiques.
  return context.next();
}
