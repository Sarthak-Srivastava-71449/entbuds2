const build = {
    moviePopular: (params = {}) => ({ url: '/movie/popular', params: { language: 'en-US', ...params } }),
    movieTopRated: (params = {}) => ({ url: '/movie/top_rated', params: { language: 'en-US', ...params } }),
    discoverByGenre: (genreId, params = {}) => ({ url: '/discover/movie', params: { with_genres: genreId, ...params } }),
    searchMulti: (query, params = {}) => ({ url: '/search/multi', params: { query, ...params } }),
    movieDetails: (id, params = {}) => ({ url: `/movie/${id}`, params }),
    tvDetails: (id, params = {}) => ({ url: `/tv/${id}`, params }),
    discoverTV: (params = {}) => ({ url: '/discover/tv', params }),
};

export default build;


