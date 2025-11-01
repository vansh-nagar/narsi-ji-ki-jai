"use client";

import { motion, MotionValue, useScroll, useTransform } from "framer-motion";
import Lenis from "@studio-freight/lenis";

import { useEffect, useRef, useState } from "react";
import { HeroVideoDialog } from "@/components/ui/hero-video-dialog";
import Image from "next/image";
import { HoverExpand_001 } from "@/components/ui/skiper-ui/skiper52";
import Features from "@/components/features-4";

const images = [
  "https://res.cloudinary.com/dum6rd3ye/image/upload/v1762012998/DSC03563_mtatpi.jpg",
  "https://res.cloudinary.com/dum6rd3ye/image/upload/v1762012895/DSC03828_d79ocl.jpg",
  "https://res.cloudinary.com/dum6rd3ye/image/upload/v1762012997/DSC03682_q5nlx3.jpg",
  "https://res.cloudinary.com/dum6rd3ye/image/upload/v1762012894/DSC03822_dpt0xk.jpg",
  "https://res.cloudinary.com/dum6rd3ye/image/upload/v1762012892/DSC03510_hppdiz.jpg",
  "https://res.cloudinary.com/dum6rd3ye/image/upload/v1762012894/DSC03847_b6ua9l.jpg",
  "https://res.cloudinary.com/dum6rd3ye/image/upload/v1762012892/DSC03550_bzuteb.jpg",
  "https://res.cloudinary.com/dum6rd3ye/image/upload/v1762012891/DSC03761_p8yrh1.jpg",
  "https://res.cloudinary.com/dum6rd3ye/image/upload/v1762012889/DSC03771_knu2ia.jpg",
  "https://res.cloudinary.com/dum6rd3ye/image/upload/v1762012888/DSC03731_o87ls3.jpg",
  "https://res.cloudinary.com/dum6rd3ye/image/upload/v1762012888/DSC03511_qiwl1m.jpg",
 

];

// Using the hover expand component with custom images
const imagess = [
  {
    src: "https://res.cloudinary.com/dum6rd3ye/image/upload/v1762015364/WhatsApp_Image_2025-11-01_at_15.57.59_g2rsqt.jpg",
    alt: "Description 1",
    code: "# 01",
  },
  {
    src: "https://res.cloudinary.com/dum6rd3ye/image/upload/v1762017892/WhatsApp_Image_2025-11-01_at_15.58.07_ly4lyx.jpg",
    alt: "Description 2",
    code: "# 02",
  },
  {
    src: "https://res.cloudinary.com/dum6rd3ye/image/upload/v1762017937/WhatsApp_Image_2025-11-01_at_15.57.59_fn3yga.jpg",
    alt: "Description 3",
    code: "# 03",
  },
  {
    src: "https://res.cloudinary.com/dum6rd3ye/image/upload/v1762017938/WhatsApp_Image_2025-11-01_at_15.58.01_grdz5q.jpg",
    alt: "Description 4",
    code: "# 04",
  },
  {
    src: "https://res.cloudinary.com/dum6rd3ye/image/upload/v1762017939/WhatsApp_Image_2025-11-01_at_15.58.00_k021kf.jpg",
    alt: "Description 5",
    code: "# 05",
  },
  {
    src: "https://res.cloudinary.com/dum6rd3ye/image/upload/v1762017939/WhatsApp_Image_2025-11-01_at_15.58.00_1_kyzmfu.jpg",
    alt: "Description 6",
    code: "# 06",
  },
  {
    src: "https://res.cloudinary.com/dum6rd3ye/image/upload/v1762017940/WhatsApp_Image_2025-11-01_at_15.57.58_1_ckrhxo.jpg",
    alt: "Description 7",
    code: "# 07",
  },
  {
    src: "https://res.cloudinary.com/dum6rd3ye/image/upload/v1762017940/WhatsApp_Image_2025-11-01_at_15.57.58_ujryh1.jpg",
    alt: "Description 8",
    code: "# 08",
  },
  {
    src: "https://res.cloudinary.com/dum6rd3ye/image/upload/v1762017940/WhatsApp_Image_2025-11-01_at_15.57.57_ixvqm4.jpg",
    alt: "Description 9",
    code: "# 09",
  },
];

const Skiper30 = () => {
  const gallery = useRef<HTMLDivElement>(null);
  const [dimension, setDimension] = useState({ width: 0, height: 0 });

  const { scrollYProgress } = useScroll({
    target: gallery,
    offset: ["start end", "end start"],
  });

  const { height } = dimension;
  const y = useTransform(scrollYProgress, [0, 1], [0, height * 2]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, height * 3.3]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, height * 1.25]);
  const y4 = useTransform(scrollYProgress, [0, 1], [0, height * 3]);

  useEffect(() => {
    const lenis = new Lenis();

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    const resize = () => {
      setDimension({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", resize);
    requestAnimationFrame(raf);
    resize();

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <main className="w-full bg-background ">
      <div className="font-geist flex h-screen items-center justify-center gap-2 relative">
          <Features />
    
      </div>

      <div
        ref={gallery}
        className="relative box-border flex h-[175vh] gap-[2vw] overflow-hidden bg-background p-[2vw]"
      >
        <Column images={[images[0], images[1], images[2]]} y={y} />
        <Column images={[images[3], images[4], images[5]]} y={y2} />
        <Column images={[images[6], images[7], images[8]]} y={y3} />
        <Column images={[images[6], images[7], images[8]]} y={y4} />
      </div>
      <div className="font-geist relative flex  flex-col h-screen items-center justify-center gap-2">
        <div className="text-3xl font-bold mb-4">Teams</div>
         <HoverExpand_001 images={imagess} className="" />
      </div>
    </main>
  );
};

type ColumnProps = {
  images: string[];
  y: MotionValue<number>;
};

const Column = ({ images, y }: ColumnProps) => {
  return (
    <motion.div
      className="relative -top-[45%] flex h-full w-1/4 min-w-[250px] flex-col gap-[2vw] first:top-[-45%] [&:nth-child(2)]:top-[-95%] [&:nth-child(3)]:top-[-45%] [&:nth-child(4)]:top-[-75%]"
      style={{ y }}
    >
      {images.map((src, i) => (
        <div key={i} className="relative h-full w-full overflow-hidden">
          <img
            src={`${src}`}
            alt="image"
            className="pointer-events-none object-cover h-full w-full"
          />
        </div>
      ))}
    </motion.div>
  );
};

export { Skiper30 };

/**
 * Skiper 30 Parallax_002 — React + framer motion + lenis
 * Inspired by and adapted from https://www.siena.film/films/my-project-x
 * We respect the original creators. This is an inspired rebuild with our own taste and does not claim any ownership.
 * These animations aren’t associated with the siena.film . They’re independent recreations meant to study interaction design
 *
 * License & Usage:
 * - Free to use and modify in both personal and commercial projects.
 * - Attribution to Skiper UI is required when using the free version.
 * - No attribution required with Skiper UI Pro.
 *
 * Feedback and contributions are welcome.
 *
 * Author: @gurvinder-singh02
 * Website: https://gxuri.in
 * Twitter: https://x.com/Gur__vi
 */
