import { LoaderFunctionArgs } from '@remix-run/server-runtime';
import React, { useEffect, useRef, useState } from 'react';
import Footer from '~/components/Footer';
import Hero from '~/components/Hero';
import TobaccoLeaf from '../assets/tobacco_leaf.png'
import ManWithTobaccoLeafs from '../assets/man_with_tobacco_leafs.png'
import Reveal from '~/components/Reveal';
import { MetaFunction } from '@remix-run/react';
import Heading from '~/components/Heading';

export const meta: MetaFunction = () => {
    return [{title: 'Don Misima 66 | About Us'}];
  };

export default function About() {
    return(
        <div className="page_wrapper margin_top_200">
            {/* <Hero /> */}
            <section>
                <Heading heading="About Us"/>
                <div className="page_container">
                    <div className="our-way-wrapper">
                        <Reveal delay={0.35} width='100%'>
                            <h2>Don Misima way</h2>
                        </Reveal>
                        <div className="our-way-text-wrapper">
                            <Reveal delay={0.45}>
                            <p className="our-way-text">
                                In the heart of the Caribbean nestled amongst the lush tobacco fields of Mexico, Nicaragua, and the Dominican Republic, there exists a legacy that has spanned generations.
                            </p>
                            </Reveal>
                            <Reveal delay={0.35}>
                            <p className="our-way-text">
                                A tradition of quality and an unwavering commitment to excellence that would ultimately birth a legend: the Don Misima Cigar.
                            </p>
                            </Reveal>
                        </div>
                    </div>
                </div>
            </section>

            <div className="about-image-block about-image-block-first">
                <div className="page_container">
                    <Reveal>
                        <div className="about-image-block-text-wrapper">
                            <p>
                                For centuries farmers cultivated some of the world's finest tobacco, nurturing a tradition as rich as the fertile soil itself. The land’s gentle trade winds, temperate climate, and seasoned farmers combined to create the perfect environment for the cultivation of tobacco leaves that would soon capture the imagination of cigar connoisseurs around the globe.
                            </p>
                            <a href='/cigars'>View Our Cigars</a>
                        </div>
                    </Reveal>
                </div>
            </div>

            <div className='page_container'>
                <Reveal width='100%'>
                <div className="text-image-block">
                    <div className="our-way-text-wrapper">
                        <p className="text-image-text">
                            Today the Don Misima brand is a testament to the relentless pursuit of perfection. Each tobacco leaf is painstakingly selected by the master blenders who inherited their craft from ancestors who had worked the fields for generations. Don Misima’s artisans know the land intimately, recognising the subtleties of each leaf’s unique texture, aroma and flavor.
                        </p>
                    </div>
                    <img alt='tobacco leaf' src={TobaccoLeaf}/>
                </div>
                </Reveal>
            </div>

            <div className='page_container'>
                <Reveal width='100%'>
                    <div className="text-image-block second-text-image-block">
                        <img alt='tobacco leaf' src={ManWithTobaccoLeafs}/>
                        <div className="our-way-text-wrapper">
                            <p className="text-image-text">
                                Don Misima cigars are a fusion of the finest tobacco leaves from across the Caribbean, Mexico, Nicaragua and the Dominican Republic. These leaves bear the history and traditions of their respective regions, each adding its own layer of depth and character to the blend. The resulting smoke is an exquisite symphony of flavors, crafted to appeal to the most discerning palates.
                            </p>
                        </div>
                    </div>
                </Reveal>
            </div>

            <div className="about-image-block about-image-block-second">
                <div className="page_container">
                    <div style={{width: '100%', display: 'flex', justifyContent: 'end'}}>
                        <Reveal>
                            <div className="about-image-block-text-wrapper">
                                <p>
                                    To ensure the highest quality, Don Misima's tobacco is grown free from harsh chemicals or pesticides and the leaves are harvested at their peak of maturity, then patiently aged in carefully controlled environments.
                                </p>
                            </div>
                        </Reveal>
                    </div>
                </div>
                <div className="page_container">
                    <Reveal>
                        <div className="about-image-block-text-wrapper">
                            <p>
                                Every step of the production process is guided by a reverence for the past, yet with an eye toward innovation, perfection and the future.
                            </p>
                            <a href='/cigars'>View Our Cigars</a>
                        </div>
                    </Reveal>
                </div>
            </div>

            <div className="page_container"> 
                <Reveal width='100%'>
                    <p className="our-way-text">
                    The Don Misima Cigar Company is a name whispered with reverence in smoke-filled lounges where aficionados gather to share their passion for the finest tobacco experiences. Don Misima not only creates cigars; it curates moments of indulgence, steeped in history and crafted with uncompromising care.<br />
                    As the sun dips below the Caribbean horizon, casting an orange and pink hue over the tobacco fields, it is assured that the Don Misima legacy will continue to burn bright. Our cigars are a tribute to the tobacco traditions of three nations and an enduring commitment by generations to the purity and quality that has made them legendary. In the world of cigars, Don Misima is more than a brand; it is a testament to the enduring power of tradition, history, and the pursuit of excellence.<br />
                    Don Misima is a Swiss owned company and commits itself to ensuring the hightest standards of quality control.
                    </p>
                </Reveal>
            </div>

            <Footer />

        </div>
    )
}