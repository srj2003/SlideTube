import React from 'react';
import MaxWidthWrapper from '../common/MaxWidthWrapper';
import Link from 'next/link';
import Image from 'next/image';
import { Card } from '../ui/card';
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
  } from "@/components/ui/hover-card"
  import { CalendarIcon } from "@radix-ui/react-icons"
  import { Button } from "@/components/ui/button"
  import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";

import { buttonVariants } from '../ui/button';
const Hero = () => {
  return (
    <section className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100'>
        <MaxWidthWrapper>
            <div className='text-center grid lg:grid-cols-2 items-center'>
                <div className='lg:text-left text-center'>
                    <h1 className="mb-6 text-4xl font-black leading-tight text-gray-900 lg:text-6xl hover:scale-110 ">
                        Generate Educational <span className='text-blue-800 hover:text-purple-800'>Powerpoints</span> from Youtube Videos
                    </h1>
                    
                    <p className='mb-9 text-lg text-gray-900 hover:scale-110'>
                        using SlideTube, you can generate professional, engaging, and visually 
                        appealing powerpoints in minutes from Youtube videos.
                    </p>  
                    <div className="flex flex-col sm:flex-row justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4 my-4">
                        <RegisterLink className={buttonVariants({className: "w-full sm:w-auto  hover:bg-purple-800 hover:text-white"})}>
                            Get Started
                        </RegisterLink>
                        <LoginLink href='/generate' className={buttonVariants({variant: "outline", className: "w-full sm:w-auto hover:bg-gray-600 hover:text-white"})}>
                            Generate Powerpoint
                        </LoginLink>
                    </div>     
                </div>
                
                <div className='lg:text-right text-center'>
                    <Card className="overflow-hidden shadow-2xl hover:scale-110">
                        <Image src="/crop.jpg" className="w-full h-auto object-cover space-y-6" alt="hero image" width={450} height={800}/>
                    </Card>
                    <br />
                    <HoverCard>
                    <HoverCardTrigger className='text-lg font-black font-bold'><Button variant="link" className='text-lg text-black-600 font-bold'>About</Button></HoverCardTrigger>
                    <HoverCardContent className='lg:text=left text-left space-y-1'>
                    <h4 className="text-sm font-semibold items-center">SlideTube</h4>
                    <p className="text-sm">
                    The React Framework – created and maintained by @srinjoy.
                </p>
                    <div className="flex items-center pt-2">
                    <CalendarIcon className="mr-2 h-4 w-4 opacity-70 lg:items=center items-center" />{" "}
                       <span className="text-xs text-muted-foreground lg:text=center text-center">
                       Started at October 2024
                 </span>
            </div>

                    </HoverCardContent>
                    </HoverCard>
                </div>
            </div>
        </MaxWidthWrapper>
    </section>
    
  );
}

export default Hero;
