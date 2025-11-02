import Features from "@/components/features-4";
import HeroSection from "@/components/hero-section";
import { Skiper30 } from "@/components/mine/landing/images";
import { HeroVideoDialog } from "@/components/ui/hero-video-dialog";
import { HoverExpand_001 } from "@/components/ui/skiper-ui/skiper52";
const cloudinaryOpt = (url: string) =>
  typeof url === "string"
    ? url.replace("/upload/", "/upload/f_auto,q_auto/")
    : url;


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

const page = () => {
  return (
    <>
      <HeroSection />
               <div className="font-geist flex h-screen items-center justify-center gap-2 relative">
                  <Features />
                   
                </div>
        <div className=" flex  justify-center item-center">
         
               <HeroVideoDialog  videoSrc="https://res.cloudinary.com/dolnup1vc/video/upload/v1762024493/bob_auction_qkxn5l.mp4" thumbnailSrc="https://res.cloudinary.com/dolnup1vc/image/upload/v1762024445/d893ee88-6769-43aa-94a9-3d54bfab230d.png"/>
               </div>
                <div className="font-geist relative flex  flex-col h-screen items-center justify-center gap-2">
                  <HoverExpand_001 images={imagess.map(i => ({ ...i, src: cloudinaryOpt(i.src) }))} className="" />
                </div>
      
    </>
  );
};

export default page;
