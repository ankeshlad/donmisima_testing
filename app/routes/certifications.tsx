import { LoaderFunctionArgs } from '@remix-run/server-runtime';
import React, { useEffect, useRef, useState } from 'react';
import Footer from '~/components/Footer';
import Hero from '~/components/Hero';
import Certificate from "../assets/certificate.png";
import { MetaFunction } from '@remix-run/react';
import Heading from '~/components/Heading';

export const meta: MetaFunction = () => {
    return [{title: 'Don Misima 66 | Certifications'}];
  };

export default function Certifications() {
    const [isOpen, setIsOpen] = useState(false);
    return( 
        <div className="page_wrapper margin_top_200">
            {/* <Hero /> */}
            <section>
                <Heading heading='Our Certifications'/>
                <div className="page_container">
                    <div className="our-way-wrapper">
                        <h2>Our certificates</h2>
                        <div className="our-way-text-wrapper">
                            <p className="our-way-text">
                                This Certificate of Authenticity certifies that each DM66 cigar is crafted with the utmost care and dedication to provide you with a premium smoking experience.
                            </p>
                            <p className="our-way-text">
                                We take great pride in our commitment to excellence, and every DM66 cigar is a testament to our passion for the art of cigar making. 
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="page_container">
                <p className="certifications-text">
                At DM66, we believe that the foundation of an exceptional cigar lies in the selection of the finest tobacco leaves. We carefully source our tobacco from the most renowned and trusted tobacco growers, ensuring that only the highest quality leaves find their way into our cigars.<br /><br />
Our tobacco experts meticulously inspect and handpick each leaf, ensuring that it meets our stringent standards for flavour, aroma, and texture.  Our master blenders and rollers bring years of experience and expertise to the crafting of DM66 cigars. They skilfully blend the chosen tobacco leaves to create a harmonious and complex flavour profile that is unique to DM66.<br /><br />
With a delicate balance of flavours, each draw of a DM66 cigar is a journey through a world of rich and nuanced tastes.  To maintain the exceptional quality and freshness of DM66 cigars, we store them in controlled environments, ensuring that they reach you in perfect condition. Our commitment to quality extends to the packaging, ensuring that every DM66 cigar is presented to you in an elegant and distinctive manner.<br /><br />
We take pride in the craftsmanship that goes into each DM66 cigar, and we stand by the authenticity of our brand. This Certificate of Authenticity is a symbol of our dedication to providing you with a premium smoking experience, unmatched in quality and sophistication.  Cigars must be kept in a humidor well away from any products that emit strong odors and in the correct conditions of temperature (16°C - 18°C) and relative humidity (65% -70%).
                </p>
            </div>

            <div className="page_container">
                <div className="certificate-wrapper">
                    <img alt='Certificate' src={Certificate} className='certificate' />
                </div>
            </div>

            <Footer />

        </div>
    )
}