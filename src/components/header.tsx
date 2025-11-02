"use client";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import React from "react";

const menuItems = [
  { name: "Query", href: "/contact" },
  { name: "Coordinators", href: "/coordinators" },
    { name: "Gallery", href: "/gallery" },

];

export const HeroHeader = () => {
  const [menuState, setMenuState] = React.useState(false);
  return (
    <header>
      <nav
        data-state={menuState && "active"}
        className=" fixed z-20 w-full  backdrop-blur-xl"
      >
        <div className="mx-auto max-w-6xl px-6 transition-all duration-300">
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
            <div className="flex w-full items-center justify-between gap-12 lg:w-auto">
              <Link
                href="/"
                aria-label="home"
                className="flex items-center space-x-2 text-xl font-medium"
              >
                BATTLE OF BYTES
              </Link>

             

            </div>
            
              <div >
                <ul className="flex gap-8 text-sm">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <Link
                        href={item.href}
                        className=" hover:text-accent-foreground block duration-150"
                      >
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

         
            {/* <div className=" flex gap-2">
              <Button variant={"ghost"}>Sign In</Button>
              <Button variant={"ghost"}>Sign Up</Button>
            </div> */}
          </div>
        </div>
      </nav>
    </header>
  );
};
