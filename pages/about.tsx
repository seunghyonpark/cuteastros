import React from 'react'
import Head from 'next/head'

const about = () => {
  return (
    <>
        <Head>
            <title>About GRANDERBY</title>
        </Head>
        <div className='w-full min-h-screen flex justify-center items-center'>
            <div className='about__content mint__card p-4 rounded-lg w-5/6 md:w-3/5'>
                <h1 className='heading text-xl font-bold'>About GRANDERBY</h1>
                <p className='body-font mt-4'>GRANDERBY is a game where players raise and manage NFT horses to enter them into races and earn tokens.</p>
                <div>
                    <p className='mt-6 body-font'>made with ❤️ by <a href="https://twitter.com/nftgranderby" target="_blank" rel="noopener noreferrer">MOMOCON</a></p>
                </div>
            </div>
        </div>
    </>
  )
}

export default about