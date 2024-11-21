import React from 'react';
import MaxWidthWrapper from './common/MaxWidthWrapper';
import Link from "next/link";
import Image from "next/image";
import NavbarMobile from './navbar-mobile';
import { buttonVariants } from './ui/button';
import {LayoutDashboardIcon, Presentation } from 'lucide-react';
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import {KindeUser} from "@kinde-oss/kinde-auth-nextjs/types";

const NavbarDesktop = async () => {
  const { getUser } = getKindeServerSession();
  const user: KindeUser<object> | null = await getUser();
  return (
    <MaxWidthWrapper className=" flex items-center justify-between px-8 py-4 text-gray-900 border-b ">
        <div className="flex items-center space-x-8">
        <Link href="/" >
           <Image src="/logo2.png" className="w-auto h-auto hover:scale-110" alt="TubeDeck Logo" width={30} height={30} />   
        </Link>
        <Link href="/" className="flex gap-2 text-xl font-bold hover:scale-110 items-center">
           <span>SlideTube</span>
        </Link>
        <div className="space-x-4 hidden md:flex text-sm">
          <Link href="/generate" className="hover:text-blue-800 text-lg">Generate</Link>
        </div>
        </div>
        
        <NavbarMobile user={user}/>
        <div className='space-x-4 flex, items-center'>{
          user ? (
            <Link href={"/dashboard"} className={buttonVariants({className: "hover:bg-purple-800"})}>Dashboard <LayoutDashboardIcon className='w-4 h-4'/></Link>
          ) : (
            <div>
            <LoginLink className={buttonVariants({variant:"ghost"})}>Login</LoginLink>
            <RegisterLink className={buttonVariants()}>Signup</RegisterLink>
            </div>
          )
       }</div>
        
    </MaxWidthWrapper>
  );
}

export default NavbarDesktop;
