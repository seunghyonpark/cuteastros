import React, { ReactNode } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import {useRouter} from 'next/router';



type Props = {
    children?: ReactNode
}

const Layout = ({children}: Props) => {
  const router = useRouter();

  return (
    <>
        <Head>
            <title>GRANDERBY</title>
            <meta name="description" content="GRANDERBY is a game where players raise and manage NFT horses to enter them into races and earn tokens"/>
        </Head>

        <div className='w-full min-h-screen'>
            <nav className='mt-4 mr-6'>
            <ul className='flex justify-end items-center gap-x-4 body-font'>
                
                <li className={`${router.asPath == "/"? 'font-bold text-white': 'text-slate-400'}`}>
                    <Link href='/'>mint</Link>
                </li>
                <li className={`${router.asPath == "/about"? 'font-bold text-white': 'text-slate-400'}`}>
                    <Link href="/about">about</Link>
                </li>
                <li className={`${router.asPath == "/credits"? 'font-bold text-white': 'text-slate-400'}`}>
                    <Link href="/credits">credits</Link>
                </li>
                <li className={`${router.asPath == "https://opensea.io/collection/vienna-mania"? 'font-bold text-white': 'text-slate-400'}`}>
                    <Link href="https://opensea.io/collection/vienna-mania">opensea</Link>
                </li>
                <li className={`${router.asPath == "https://granderby-manager.vercel.app/search-horse"? 'font-bold text-white': 'text-slate-400'}`}>
                    <Link href="https://granderby-manager.vercel.app/search-horse">management</Link>
                </li>
            
            
            </ul>
            </nav>

            <main className='min-h-[90vh] flex justify-center'>
                {children}
            </main>
        </div>
    </>
  )
}

export default Layout