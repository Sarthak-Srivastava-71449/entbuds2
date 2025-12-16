import './App.css';
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import ErrorBoundary from './components/common/ErrorBoundary';
import LoadingFallback from './components/common/LoadingFallback';

// Lazy load route-level components to improve initial bundle size
const Home = React.lazy(() => import('./components/Home/Home'));
const MediaPage = React.lazy(() => import('./components/FilmPage/Media/MediaPage'));
const SearchPage = React.lazy(() => import('./components/Navbar/SearchPage'));
const GenrePage = React.lazy(() => import('./components/Lists/GenrePage'));
const ListPage = React.lazy(() => import('./components/FilmPage/UserPage/ListPage'));
const PrivacyPolicy = React.lazy(() => import('./components/Footer/Policy/PrivacyPolicy'));
const Terms = React.lazy(() => import('./components/Footer/Terms/T&C'));
const Book = React.lazy(() => import('./components/Booking/Book'));

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <ErrorBoundary>
          <Suspense fallback={<LoadingFallback /> }>
            <Routes>
              <Route index element={<Home />} />
              <Route path="movie/:id" element={<MediaPage mediaType="movie" />} />
              <Route path="series/:id" element={<MediaPage mediaType="tv" />} />
              <Route path="movies/search" element={<SearchPage />} />
              <Route path="movies/:genre" element={<GenrePage />} />
              <Route path="userList" element={<ListPage />} />
              <Route path="tvhome" element={<Home mediaType="tv" />} />
              <Route path="privacy" element={<PrivacyPolicy />} />
              <Route path="terms" element={<Terms />} />
              <Route path="booking" element={<Book />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
