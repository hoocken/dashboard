'use client';

import Image from "next/image";
import styles from "./page.module.css";
import { useState, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ReactLenis } from "lenis/react";
import { APP_PATH_ROUTES_MANIFEST } from "next/dist/shared/lib/constants";

const COVERS = [
  "https://i.scdn.co/image/ab67616d00001e020ecc8c4fd215d9eb83cbfdb3",
  "https://i.scdn.co/image/ab67616d00001e02d9194aa18fa4c9362b47464f",
  "https://i.scdn.co/image/ab67616d00001e02a7ea08ab3914c5fb2084a8ac",
  "https://i.scdn.co/image/ab67616d00001e0213ca80c3035333e5a6fcea59",
  "https://i.scdn.co/image/ab67616d00001e02df04e6071763615d44643725",
  "https://i.scdn.co/image/ab67616d00001e0239c7302c04f8d06f60e14403",
  "https://i.scdn.co/image/ab67616d00001e021c0bcf8b536295438d26c70d",
  "https://i.scdn.co/image/ab67616d00001e029bbd79106e510d13a9a5ec33",
  "https://i.scdn.co/image/ab67616d00001e021d97ca7376f835055f828139",
  "https://www.udiscovermusic.com/wp-content/uploads/2015/10/Kanye-West-Yeezus.jpg",
]

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const lineRef = useRef<SVGPathElement>(null);
  const imagesRef = useRef<HTMLDivElement>(null);
  const herobgImageRef = useRef<HTMLImageElement>(null);

  useGSAP(() => {
    gsap.set(herobgImageRef.current, {
     y: -400
    })
    gsap.to(
      herobgImageRef.current,
      {
        y: "+=-50",
        duration: 5,
        scrollTrigger: {
          trigger: "." + styles.hero,
          start: "top top",
          end: "bottom top",
          markers: true,
          scrub: 1
        }
      }
    )
  })

  useGSAP(() => {
    // modified from https://codepen.io/jh3y/pen/WNRvqJP?editors=0011
    const STAGGER = 0.2
    const DURATION = 1
    const OFFSET = 0
    const images = gsap.utils.toArray("." + styles.image)

    const LOOP = gsap.timeline({
      paused: true,
      repeat: -1,
      ease: 'none'
    })  

    const SHIFTS = [...images]

    SHIFTS.forEach((image, index) => {
      const image_timeline = gsap.timeline().set(image as gsap.TweenTarget, {
        xPercent: 400,
        opacity: 0.75
      })
      // Panning
      .fromTo(
        image as gsap.TweenTarget,
        {
          xPercent: 400,
        },
        {
          xPercent: -400,
          duration: 1,
          immediateRender: false,
          ease: 'none',
        },
        0
      ) 
      // Scale && Z
      .to(
        image as gsap.TweenTarget,
        {
          z: 100,
          scale: 1.5,
          duration: 0.2,
          repeat: 1,
          yoyo: true,
        },
        0.35
      )
      .fromTo(
        image as gsap.TweenTarget,
        {
          zIndex: 1,
        },
        {
          zIndex: images.length,
          repeat: 1,
          yoyo: true,
          ease: 'none',
          duration: 0.5,
          immediateRender: false
        },
        0
      )
      LOOP.add(image_timeline, index * STAGGER);
    })

    const CYCLE_DURATION = STAGGER * images.length
    const START_TIME = DURATION * 0.5 + OFFSET

    const LOOP_HEAD = gsap.fromTo(
      LOOP,
      {
        totalTime: START_TIME,
      },
      {
        totalTime: `+=${CYCLE_DURATION}`,
        duration: 1,
        ease: 'none',
        repeat: -1,
        paused: true,
      }
    )
    
    const PLAYHEAD = {
      position: 0,
    }

    const SCRUB = gsap.to(PLAYHEAD, {
      position: 0,
      onUpdate: () => {
        LOOP_HEAD.totalTime(PLAYHEAD.position)
        console.log(LOOP.totalTime())
      },
      paused: true,
      duration: 1,
      ease: 'power3',
    })
    
    const trigger = ScrollTrigger.create(
      {
        animation: SCRUB,
        trigger: "." + styles.images,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        onUpdate: self => {
          const NEW_POS = (self.progress) * LOOP_HEAD.duration()
          SCRUB.vars.position = NEW_POS
          SCRUB.invalidate().restart()
        }
      }
    )
  }, {scope: imagesRef});

  useGSAP(() => {
    const pathLength = lineRef.current?.getTotalLength()
    gsap.set(lineRef.current, {
      strokeDasharray: pathLength
    })

    gsap.fromTo(
      lineRef.current,
      {
        strokeDashoffset: pathLength
      },
      {
        strokeDashoffset: 0,
        duration: 10,
        scrollTrigger:{
          trigger: "." + styles.experiences,
          start: "top top",
          end: "bottom top",
          scrub: 1,
          markers: true,
          pin: true
        }
      }
    )
  })

  return (
    <ReactLenis root>
    <div className={styles.container}>
      <section className={styles.hero}>
        <div className={styles.herotext}>
          <h1>Dashboard</h1>
          <p>Welcome to my dashboard! I am Anthony, an Informatics student at TUM.</p>
        </div>
        <Image ref={herobgImageRef} className={styles.herobgimage} src="/abstract-azure-haze-darkness.jpg" alt="Background Image" width={3000} height={3000}/>
      </section>
      <section ref= {imagesRef} className={styles.images}>
        {COVERS.map((link) => 
          <Image key={link} src={link} className={styles.image} width={500} height={500} alt={link}/>
        )}
        <div className={styles.imagetext}>
          <h1>Projects</h1>
          <p>I have done numerous fun projects, including ...</p>
          <a href="">Go to Projects</a>
        </div>
      </section>
      <section className={styles.experiences}>
        <div className={styles.svgcontainer}>
          <svg height="100vh" viewBox="0 0 123 333" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path ref={lineRef} d="M56.9779 0.499306C25.7289 2.15105 -0.479934 34.6353 0.528098 85.8393C1.53613 137.043 56.9779 166.775 56.9779 166.775C122.5 202.012 122.5 259.823 122.5 259.823C121.996 320.937 56.9779 332.499 56.9779 332.499" strokeWidth="6" strokeLinecap="round" stroke="white" strokeDasharray="15"/>
          </svg>
        </div>
        <div className={styles.experiencestext}>
          <h1>Experiences</h1>
        </div>
        

      </section>
    </div>
    </ReactLenis>
  );
}

