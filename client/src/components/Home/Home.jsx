import React, { useEffect, useState } from "react";
import "./Home.css";
import { fetchPopularMovies } from '../../services/tmdbService';
import { getErrorMessage } from '../../utils/apiHelpers';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/swiper-bundle.css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, EffectCoverflow, Pagination, Navigation } from "swiper";
import { Link } from "react-router-dom";
import MediaList from '../Lists/MediaList';
import genres from '../../config/genres';


const Home = ({ mediaType = 'movie' }) => {
  const [latestmovie, setMovie] = useState([]);

  useEffect(() => {
    let mounted = true;
    const fetchLatest = async () => {
      try {
        const res = await fetchPopularMovies(1);
        if (!mounted) return;
        setMovie(res.data?.results || []);
      } catch (e) {
        console.error('Error fetching popular movies:', getErrorMessage(e));
        // swallow — don't block render
      }
    };
    fetchLatest();
    return () => { mounted = false };
  }, []);

  return (
    <div>
      {latestmovie?.length > 0 && (
        <Swiper
          effect={"coverflow"}
          grabCursor={true}
          centeredSlides={true}
          loop={true}
          slidesPerView={"auto"}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false
          }}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 0,
          }}
          pagination={{ el: ".swiper-pagination", clickable: true }}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
            clickable: true,
          }}
          modules={[Autoplay, EffectCoverflow, Pagination, Navigation]}
          className="swiper_container"
        >
          {latestmovie.map((movie) => (
            <SwiperSlide key={movie.id}>
              <Link
                style={{ textDecoration: "none", color: "white" }}
                to={`/movie/${movie.id}`}
              >
                <div className="container1">
                  <div className="partImage">
                    <img
                      alt="thumnsil"
                      className="partimage"
                      src={`https://image.tmdb.org/t/p/original${
                        movie && movie.backdrop_path
                      }`}
                    />
                  </div>
                  <div className="partimage-overlay">
                    <div className="partimage-title">
                      {movie ? movie.original_title : ""}
                    </div>
                    <div className="partimage-run">
                      {movie ? movie.release_date : ""}
                      <span className="partimage-rating">
                        {movie ? movie.vote_average : ""}
                      </span>
                    </div>
                    <div className="partimage-desc">
                      {movie ? movie.overview : ""}
                    </div>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
          <div className="slider-controler">
            <div className="swiper-button-prev slider-arrow">
              <ion-icon name="arrow-back-outline"></ion-icon>
            </div>
            <div className="swiper-button-next slider-arrow">
              <ion-icon name="arrow-forward-outline"></ion-icon>
            </div>
          </div>
        </Swiper>
      )}
      <div className="allCategoriesContainer">
        {/* Render configured genres filtered by mediaType. Keep Top Rated special for movies. */}
        {mediaType === 'movie' && genres.toprated && (
          <MediaList key="toprated" title={genres.toprated.title} mediaType="movie" onHome={true} />
        )}

        {Object.entries(genres)
          .filter(([slug, info]) => info.mediaType === mediaType && slug !== 'toprated')
          .map(([slug, info]) => (
            <MediaList
              key={slug}
              title={info.title}
              mediaType={info.mediaType}
              genreId={info.genreId || null}
              onHome={true}
            />
          ))}
      </div>
    </div>
  );
};

export default Home;
