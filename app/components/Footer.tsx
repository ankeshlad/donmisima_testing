import Logo from "../assets/headerLogo.svg"
import Inst from "../assets/InstagramLogo.svg"

const Footer = () => {

    const year = new Date().getFullYear();

    return(
      <div className="footer">
      <div className="footerPattern"></div>
      <div className="footerContent">
          <div className="columnSpaceBetween">
              <div className="row">
                  <img alt="Don Misima Logo" src={Logo}/>
                  <a className="socialMedia" href="https://www.instagram.com/donmisima" target="_blank"><img alt="Don Misima Logo" src={Inst}/></a>
              </div>
              <p className="smallText">© {year} Don Misima. All Rights Reserved.</p>
          </div>

          <div className="columnSpaceBetween">
              <div className="column">
                  <a href="/cigars" className="footerLink">Our Cigars</a>
                  <a href="/about" className="footerLink">About Us</a>
                  <a href="/certifications" className="footerLink">Certifications</a>
              </div>
              <div className="row">
                  <a className="smallTextLink" href='/terms'>Terms and Conditions</a>
              </div>
          </div>

          <div className="columnGap">
              <div className="columnNoGap">
                  <p className="smallLightText">Email</p>
                  <a href="mailto:hello@donmisima.com" className="smallTextLink">hello@donmisima.com</a>
              </div>
              <div className="columnNoGap">
                  <p className="smallLightText">Phone</p>
                  <a href="tel:+15551234567" className="smallTextLink">+ 1 (555) 123-4567</a>
              </div>
          </div>
      </div>
    </div>
    )
}

export default Footer;