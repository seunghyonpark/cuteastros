import React from 'react'
import Head from 'next/head'

const about = () => {
  return (
    <>
        <Head>
            <title>GRANDERBY credits</title>
        </Head>
      <div className='w-full min-h-screen flex justify-center items-center'>
        <div className='about__content mint__card p-4 rounded-lg w-5/6 md:w-3/5'>
            <h1 className='heading text-xl font-bold'>credits</h1>
            <p className='body-font mt-4'>
              Background <a href="https://twitter.com/nftgranderby" target="_blank" rel="noopener noreferrer" className='underline'>image by MOMOCON</a> on SG
              <br/>
              <br/>
              Horses <a href="https://twitter.com/nftgranderby" target="_blank" className='underline' rel="noopener noreferrer"> by MOMOCON</a> on SG
            </p>
        </div>
      </div>
    </>
  )
}

export default about