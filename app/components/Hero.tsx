import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion"
import HeroImage1 from '../assets/1.png';
import HeroImage2 from '../assets/2.png';
import HeroImage3 from '../assets/3.png';
import HeroImage4 from '../assets/4.png';
import HeroImage5 from '../assets/5.png';
import HeroImage6 from '../assets/6.png';
import HeroLogo from '../assets/mainPageLogo.svg';

const Hero = () => {
    const [logoScale, setLogoScale] = useState(250)
    const [isMobile, setIsMobile] = useState(false)
    const [margin1, setMargin1] = useState(0)
    const [margin2, setMargin2] = useState(0)
    const [margin3, setMargin3] = useState(0)
    const [margin4, setMargin4] = useState(0)
    const [margin5, setMargin5] = useState(0)
    const [margin6, setMargin6] = useState(0)

    useEffect(() => {

        let initialLogoScale = 720

        if(window.innerWidth < 768){
            setIsMobile(true)
        } else{
            setIsMobile(false)
        }

        if(window.innerWidth >= 1400){
            initialLogoScale = 720
        }
        else if(window.innerWidth >= 1280){
            initialLogoScale = 500
        }
        else if(window.innerWidth >= 768){
            initialLogoScale = 500
        }
        else {
            initialLogoScale = 250
        }

        setLogoScale(initialLogoScale)

        window.addEventListener('scroll', function () {
            if((window.scrollY / (window.innerHeight * 1.2)) < 1){
                const heroScrollPercent = (window.scrollY / (window.innerHeight * 1.2))
                const maxUp = (window.innerHeight * 1.5 - window.innerHeight * 1.2)
                setLogoScale(initialLogoScale + (heroScrollPercent*280))
                setMargin1((maxUp * heroScrollPercent)*-1)
                setMargin2((maxUp * heroScrollPercent)*-1)
                setMargin3(((maxUp/1.5) * heroScrollPercent)*-1)
                setMargin4(((maxUp/2) * heroScrollPercent)*-1)
                setMargin5(((maxUp/2.5) * heroScrollPercent)*-1)
                setMargin6(((maxUp/3) * heroScrollPercent)*-1)
            }
        });
    }, []);

    if(!isMobile){
        return(
            <div className="hero_firstBlock">
                <div className="hero_dark">
                    <div className="hero_logoWrapper">
                        <img className="hero_logo" src={HeroLogo} style={{width: `${logoScale}px`}} />
                    </div>
                </div>
                <div className="hero_scrollContainer"></div>
                <img className="hero_heroImage" src={HeroImage1} style={{top: `${margin1}px`,zIndex: 7}} alt="tobacco field"/>
                <img className="hero_heroImage" src={HeroImage2} style={{top: `${margin2}px`,zIndex: 6}} alt="tobacco field"/>
                <img className="hero_heroImage" src={HeroImage3} style={{top: `${margin3}px`,zIndex: 5}} alt="tobacco field"/>
                <img className="hero_heroImage" src={HeroImage4} style={{top: `${margin4}px`,zIndex: 4}} alt="tobacco field"/>
                <img className="hero_heroImage" src={HeroImage5} style={{top: `${margin5}px`,zIndex: 3}} alt="tobacco field"/>
                <img className="hero_heroImage" src={HeroImage6} style={{top: `${margin6}px`,zIndex: 2}} alt="tobacco field"/>
            </div>
        )
    } else {
        return(
            <div className="hero_firstBlock">
                <div className="hero_dark">
                    <div className="hero_logoWrapper">
                        <img className="hero_logo" src={HeroLogo} style={{width: `${logoScale}px`}} />
                    </div>
                </div>
                <img className="hero_heroImage" src={HeroImage6} alt="tobacco field"/>
            </div>
        )
    }
}

export default Hero;