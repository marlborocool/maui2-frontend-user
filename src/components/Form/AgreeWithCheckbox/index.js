import { useState } from 'react';
import { Popover } from 'react-tiny-popover';
import Checkbox from '../Checkbox';
function AgreeWithCheckbox({className, checked, onChange, position='top', align='start'}) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  function handleClick (e) {
    console.log('here');
    e.stopPropagation();
    e.preventDefault();
    setIsPopoverOpen(!isPopoverOpen);
  }
  return (
    <Checkbox
      className={className}
      checked={checked}
      onChange={onChange}
    >
      <div className='text-[12px] md:text-[16px] pt-[4px] md:pt-[6px] text-[#000] dark:text-[#FFF]'>I Agree with&nbsp;
        {/* <Popover
          containerClassName='z-[999999] pl-[20px]'
          isOpen={isPopoverOpen}
          positions={[position]} // preferred positions by priority
          align={align}
          padding={2}
          onClickOutside={() => setIsPopoverOpen(false)}
          content={
            <>
              <div className='rounded-md border border-[#00214732] p-5 bg-[#ffffff] m-auto max-w-[90%] md:max-w-[600px] max-h-[500px] overflow-y-auto text-[#3f556e] text-[14px] scrollbar'>
                <p>Disclaimer to be ticked by customers when they deposit with Maui UAB™:</p>
                <br/>
                <p>Maui UAB™ is a software with smart contracts on blockchains developed by Maui UAB™.  Maui UAB™ offers banking services, however it is not a bank and does not offer any federal or state banking or depositary services to its customers. Maui UAB™ offers a seamless connection between users and smart contracts on Anchor, Mirror and Alchemix protocols, which are decentralised blockchain protocols powered by Terraform Labs Pte. Ltd and Alchemix. Maui UAB™ does not generate yield (or any form of return) for its members. Yields are generated by the Anchor, Mirror and Alchemix Protocols.</p>
                <div className='h-[10px]'/>
                <p>The currently displayed interest rate may be lower or higher than currently stated. Historical interest rates on supplying digital assets to the Anchor Protocol are not an indicator that these rates will be available in the future. Funds supplied to Anchor Protocol through Maui UAB™ are not insured by the Federal Deposit Insurance Corporation (FDIC) or any other federal, state, or local regulatory agency.</p>
                <div className='h-[10px]'/>
                <p>Certain Maui UAB™ product features listed are currently in development and are not available.</p>
                <div className='h-[10px]'/>
                <p>Digital assets are NOT bank deposits, are NOT legal tender, are NOT backed by the government, and accounts and value balances are NOT subject to Federal Deposit Insurance Corporation or Securities Investor Protection Corporation or any other governmental or government-backed protections. Legislative and regulatory changes or actions at the State, Federal, or international level may adversely affect the use, transfer, exchange, and value of digital assets.</p>
                <div className='h-[10px]'/>
                <p>* Based on Anchor, Mirror and Alchemix protocols yields.</p>
                <div className='h-[8px]'/>
                <p>There are risks involved with supplying funds or digital assets to the Anchor, Mirror and Alchemix protocols via Maui UAB™.  Customers may lose all funds. For more information about information and risk relating to the Anchor, Mirror and Alchemix Protocols, please refer to: </p>
                <div className='h-[8px]'/>
                <p><a rel="noreferrer" href='https://docs.anchorprotocol.com' className='underline cursor-pointer' target="_blank">https://docs.anchorprotocol.com</a></p>
                <p><a rel="noreferrer" href='https://alchemix-finance.gitbook.io/alchemix-finance/' className='underline cursor-pointer' target="_blank">https://alchemix-finance.gitbook.io/alchemix-finance/</a></p>
                <p><a rel="noreferrer" href='https://docs.mirror.finance/' className='underline cursor-pointer' target="_blank">https://docs.mirror.finance/</a></p>
              </div>
              <span className='arrow left-2 hidden md:block' />
            </>
          }
        >
          <span className='underline text-[#745FF2]' onClick={handleClick}>Terms and conditions</span>
        </Popover> */}
      </div>
    </Checkbox>
  )
}

export default AgreeWithCheckbox;