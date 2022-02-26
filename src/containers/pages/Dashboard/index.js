import React, { useEffect } from 'react';
import { gsap, Power3 } from 'gsap';
import Card from './card';

function Main(props) {
  useEffect(() => {
    if (props.state === 'entering') {
      // gsap.timeline().fromTo("#main-righttop", 1, {opacity: 0, scale: 0}, {opacity: 1, scale: 1, transformOrigin:"right top"});
      gsap.timeline().from("#main-lefttop", {opacity: 0, y: -500}).duration(1);
      gsap.timeline().from("#main-leftbottom", {opacity: 0, y: -500}).duration(1);
      gsap.timeline().from("#main-center", {opacity: 0, y: -1000, ease: Power3.easeIn}).duration(1);
      gsap.timeline().from("#main-card-earn", {opacity: 0, y: -500}).duration(1);
      gsap.timeline().from("#main-card-borrow", {opacity: 0, y: -500}).duration(1);
      gsap.timeline().from("#main-card-stocks", {opacity: 0, y: -500}).duration(1);
      gsap.timeline().from("#main-card-cards", {opacity: 0, x: 500}).duration(1);
      gsap.timeline().from("#main-righttop", {opacity: 0, scale: 0, transformOrigin:"right top"}).duration(1);
    }
    if (props.state === 'exiting') {
      gsap.timeline().to("#main-lefttop", {opacity: 0, y: -500}).duration(1);
      gsap.timeline().to("#main-leftbottom", {opacity: 0, y: -500}).duration(1);
      gsap.timeline().to("#main-center", {opacity: 0, y: -1000, ease: Power3.easeIn}).duration(1);
      gsap.timeline().to("#main-card-earn", {opacity: 0, y: -500}).duration(1);
      gsap.timeline().to("#main-card-borrow", {opacity: 0, y: -500}).duration(1);
      gsap.timeline().to("#main-card-stocks", {opacity: 0, y: -500}).duration(1);
      gsap.timeline().to("#main-card-cards", {opacity: 0, x: 500}).duration(1);
      gsap.timeline().to("#main-righttop", {opacity: 0, scale: 0, transformOrigin:"right top"}).duration(1);
    }
    return function unmount() {}
  }, [props.state]);
  return (
    <div className='relative bg-main-background dark:bg-main-background-dark bg-center bg-cover w-full min-h-[1200px] transition-all duration-1000'>
      <div id='main-lefttop' className='bg-main-lefttop dark:bg-main-lefttop-dark bg-center bg-cover absolute top-[210px] left-[10%] w-[464px] h-[260px]'></div>
      <div id='main-leftbottom' className='bg-main-leftbottom dark:bg-main-leftbottom-dark bg-center bg-cover absolute bottom-0 left-[10%] w-[672px] h-[633px]'></div>
      <div id='main-righttop' className='bg-main-righttop dark:bg-main-righttop-dark bg-center bg-cover absolute top-[71px] right-[12px] w-[750px] h-[797px]'></div>
      <div id='main-center' className='bg-main-center dark:bg-main-center-dark bg-center bg-cover absolute left-[calc(50%-280px)] top-[calc(50%-170px)]  w-[550px] h-[450px] z-10 pointer-events-none'></div>
      <Card
        id='main-card-earn'
        url='/earn'
        img="bg-main-card-earn-banner w-[117px] h-[168px] shadow-main-card-banner"
        className="left-[calc(50%-450px)] top-[250px]"
        title1="Earn with 15% APY"
        btnTitle="Earn"
        description={<div><span className='text-transparent bg-clip-text bg-gradient-to-r from-[#745FF2] to-[#00DDA2]'>Earn</span> on your deposits. Withdraw anytime.</div>}
      />
      <Card
        id='main-card-borrow'
        url='/borrow'
        img="bg-main-card-borrow-banner w-[160px] h-[133px]"
        className="right-[calc(50%-450px)] top-[320px]"
        title1="Borrow instantly"
        title2="Loan repays itself"
        btnTitle="Borrow"
        description={<div><span className='text-transparent bg-clip-text bg-gradient-to-r from-[#745FF2] to-[#00DDA2]'>Borrow</span> up to <span className='text-[#00DDA2]'>50%</span> of your collateral. No repayments. Your yield pays off your loan!</div>}
      />
      <Card
        id='main-card-cards'
        url='/cards'
        img="bg-main-card-cards-banner w-[168px] h-[246px]"
        className="left-[calc(50%-450px)] top-[650px]"
        title1="No Fees. Crypto"
        title2="Mastercards"
        btnTitle="Cards"
        description={<div><p>Crypto or Fiat, for choice.</p><br /><p>Connect to your cards & enjoy your <span className='text-transparent bg-clip-text bg-gradient-to-r from-[#745FF2] to-[#00DDA2]'>MAUI</span> Benefits</p></div>}
      />
      <Card
        id='main-card-stocks'
        url='/stocks'
        img="bg-main-card-stocks-banner w-[146px] h-[143px]"
        className="right-[calc(50%-450px)] top-[720px] z-20"
        title1="Neutral strategy"
        btnTitle="Stocks"
        description={<div><span className='text-transparent bg-clip-text bg-gradient-to-r from-[#745FF2] to-[#00DDA2]'>Delta Neutral</span><br/>Strategy with one click.</div>}
      />
    </div>
  )
}

export default Main;