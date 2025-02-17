import "./T-Shirt.css"
import { Link } from 'react-router-dom';


export default function TshirtCollection() {
  const materials = ["Cashmere Material", "Merino Wool Material", "Alpaca Wool Material", "Linen Material"]

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-container">
          <nav className="nav-menu">
            <a href="#" className="nav-link">
              Shop Men
            </a>
            <a href="#" className="nav-link">
              Shop Women
            </a>
            <a href="#" className="nav-link">
              Support
            </a>
          </nav>

          <div className="logo">
            <h1>The Luxe Estate</h1>
          </div>

          <div className="header-icons">
            <button className="icon-button">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </button>
            <button className="icon-button">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>
            <button className="icon-button">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <h2 className="collection-title">T-Shirt Collection</h2>

        {/* Product Sections */}
        {materials.map((material) => (
          <section key={material} className="product-section">
            <h3 className="material-title">{material}</h3>
            <div className="product-grid">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="product-card">
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Mens%20T-shirt-pH2QpyajHp87IjpXvhH75MGLWl4XM3.png"
                    alt={`${material} T-shirt ${index + 1}`}
                    className="product-image"
                  />
                  <div className="product-tag">NEW</div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-columns">
          <h3>The Luxe Estate</h3>
          <p>Kedar Business Hub Katargam Ved Road Surat Gujarat</p>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/shop">Shop</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
        <div className="footer-columns">
          <h4>Links</h4>
          <ul>
            <li><Link to="/payment-options">Payment Options</Link></li>
            <li><Link to="/returns">Returns</Link></li>
            <li><Link to="/privacy-policies">Privacy Policies</Link></li>
          </ul>
        </div>
        <div className="footer-columns">
          <h4>Help</h4>
          {/* Add your help links here */}
        </div>
        <div className="footer-columns">
          <h4>Newsletter</h4>
          <form onSubmit={handleNewsletterSubmit}>
            <input
              type="email"
              placeholder="Enter Your Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">SUBSCRIBE</button>
          </form>
        </div>
        <div className="copyright">
          <p>2023 The Luxe Estate. All rights reserved</p>
        </div>
      </footer>
    </div>
  )
}

