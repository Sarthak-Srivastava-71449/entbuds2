import PropTypes from 'prop-types';
import Card from './Card';

/**
 * TVCard component - a wrapper around Card for TV shows
 * Eliminates code duplication by reusing the Card component with tv mediaType
 */
const TVCard = (props) => <Card {...props} mediaType="tv" />;

TVCard.propTypes = {
  movie: PropTypes.shape({
    id: PropTypes.number.isRequired,
    poster_path: PropTypes.string,
    original_title: PropTypes.string,
    original_name: PropTypes.string,
    release_date: PropTypes.string,
    first_air_date: PropTypes.string,
    vote_average: PropTypes.number,
    overview: PropTypes.string,
  }).isRequired,
  onRemove: PropTypes.func,
};

export default TVCard;
