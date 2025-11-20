import PropTypes from 'prop-types';
import './LuxeLoader.css';

const LuxeLoader = ({ message = 'Curating the Luxe wardrobe...' }) => {
  return (
    <div className="luxe-loader-wrapper" role="status" aria-live="polite">
      <div className="luxe-loader">
        <span className="loader-crest" />
        <span className="loader-ring primary" />
        <span className="loader-ring secondary" />
        <span className="loader-orb" />
      </div>
      <p className="luxe-loader-copy">{message}</p>
    </div>
  );
};

LuxeLoader.propTypes = {
  message: PropTypes.string
};

export default LuxeLoader;
