import Features from "@/components/features-4";
import HeroSection from "@/components/hero-section";
import { Skiper30 } from "@/components/mine/landing/images";
import { HeroVideoDialog } from "@/components/ui/hero-video-dialog";
import { Skiper28 } from "@/components/ui/skiper-ui/skiper28";
import React from "react";

const page = () => {
  return (
    <>
      <HeroSection />
        <div className=" flex  justify-center item-center">
         
               <HeroVideoDialog  videoSrc="https://res.cloudinary.com/dolnup1vc/video/upload/v1762024493/bob_auction_qkxn5l.mp4" thumbnailSrc="https://res.cloudinary.com/dolnup1vc/image/upload/v1762024445/d893ee88-6769-43aa-94a9-3d54bfab230d.png"/>
               </div>
      <Skiper30 />
      
    </>
  );
};

export default page;
