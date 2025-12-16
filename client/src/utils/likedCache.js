// Simple in-memory cache for liked movies per user email.
// Exposes a promise-based getter so concurrent callers share the same request.
const cache = new Map();

export function invalidateLikedCache(email) {
  cache.delete(email);
}

export function getLikedMovies(email) {
  if (!email) return Promise.resolve([]);
  const key = String(email).toLowerCase();
  if (cache.has(key)) return cache.get(key);

  const p = fetch(`${process.env.REACT_APP_DATABASE}/api/likedmovie/${encodeURIComponent(email)}`)
    .then((res) => res.json())
    .then((data) => {
      if (data && data.msg === 'Success') return data.movies || [];
      return [];
    })
    .catch(() => [])
    .finally(() => {
      // keep the cache entry; to invalidate use invalidateLikedCache
    });

  cache.set(key, p);
  return p;
}
