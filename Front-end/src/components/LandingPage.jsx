import './LandingPage.css';
import VehicleImage from '../images/offroad.png';
function LandingPage() {
  return (
    <>
      <div className="landing-container">
        <div className="landing-text">
          <p className="small-text">All discount just for you</p>
          <h1 className="highlight-text">Need A Ride?</h1>
          <h2 className="bold-text">CHOOSE YOUR<br />COMFORTABLE VEHICLES</h2>
          <p className="sub-text">Best worldwide VEHICLE hire deals!!!!!</p>
          <button className="contact-button">Contact Now</button>
        </div>
        <div className="landing-image">
          <img src={VehicleImage} alt="Vehicle" />
        </div>
      </div>
    </>
  )
}

export default LandingPage
