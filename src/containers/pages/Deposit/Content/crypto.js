import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { compose } from 'redux';
import { connect } from 'react-redux';
import { toast } from "react-toastify";
import { useWallet } from "@terra-money/wallet-provider";
import { LCDClient, Dec, MsgSend } from "@terra-money/terra.js";

import { appConfig } from '../../../../appConfig';
import Checkbox from '../../../../components/Form/Checkbox';
import InputAmount from '../../../../components/Form/InputAmount';
import SelectCurrency from '../../../../components/Form/SelectCurrency';
import SelectWallet from '../../../../components/Form/SelectWallet';
import { unmaskCurrency } from '../../../../utils/masks';
import Button from '../../../../components/Button';
import { updateBalance } from '../../../../saga/actions/workflow';
import RightBar from './rightbar';

function TabCrypto(props) {  
  const { sign } = useWallet();
  // get functions to build form with useForm() hook
  const hookForm = useForm();
	const { handleSubmit, setValue } = hookForm;
  // set initial values
  useEffect(() => {
    setValue('amount', 0);
  }, [props.data, setValue]);

  const [ isAgreed, setIsAgreed ] = useState(false);
  const [ isLoading, setIsLoading ] = useState(false);
  const [ selectedCrypto, setSelectedCrypto ] = useState('BTC');
  const [ selectedCryptoWallet, setSelectedCryptoWallet ] = useState('BTC');
  const [ selectedCryptoFiat, setSelectedCryptoFiat ] = useState('USD');

  const depositCrypto = async (amount, from, to) => {
    setIsLoading(true);
    try {
      const terra = new LCDClient({
        URL: appConfig.lcdURL,
        chainID: appConfig.lcdChainId,
      });
      const pool_contract = new MsgSend(from, to, {
        uusd: new Dec(amount).mul(appConfig.MICRO).toNumber(),
      });

      // Sign transaction
      const result = await sign({
        msgs: [pool_contract],
        feeDenoms: ["uusd"],
        gasPrices: "0.15uusd",
      });

      const tx = result.result;

      await terra.tx.broadcast(tx);
      props.updateBalance(to);
      setIsLoading(false);
      resetForm();
      toast.success("Transaction success");
      // dispatch(getWalletInfo(to));
    } catch (error) {
      setIsLoading(false);
      toast.error("Transaction fails");
    }
  };

  function handleCryptoChange(symbol) {
    setSelectedCrypto(symbol);
  }
  function handleCryptoWalletChange(symbol) {
    setSelectedCryptoWallet(symbol);
  }
  function handleCryptoFiatChange(symbol) {
    setSelectedCryptoFiat(symbol);
  }
  function handleAgreeChange(e) {
    setIsAgreed(e.target.checked);
  }
  function validateAmount(val) {
    const value = unmaskCurrency(val);
    if (!value) {
      return 'This input field is required.';
    } else if (parseInt(value) <= 0 || parseInt(value) > 99999){
      return 'The amount must be between $0.1 and $99,999';
    }
    return null;
  }
  // handle functions
  const resetForm = () => {
    setValue('amount', 0);
    setIsAgreed(false);
  }
	const onSubmit = (data) => {
    if (!props.workflow.isLogged) {
      toast.error("Please login first.");
      return false;
    }
    const from = props.workflow.terraAddress;
    const to = props.workflow.mauiAddress;
    depositCrypto(data.amount, from, to);
		return false;
	}
  return (
    <form className='flex p-20 justify-between' onSubmit={handleSubmit(onSubmit)}>
      <div className='w-[45%]'>
        <SelectCurrency
          isCrypto={true}
          className="mt-[10px]"
          label={<div className='text-[#273855] dark:text-[#F9D3B4] text-[16px] transition-all duration-1000'>Select crypto you want to <span className='text-transparent bg-clip-text bg-gradient-to-r from-[#745FF2] to-[#00DDA2]'>Deposit</span></div>}
          selectedSymbol={selectedCrypto}
          onChange={handleCryptoChange}
        />
        <div className='h-[30px]'></div>
        <SelectWallet
          isCrypto={true}
          className="mt-[10px]"
          label={<div className='text-[#273855] dark:text-[#F9D3B4] text-[16px] transition-all duration-1000'>Transfer from</div>}
          selectedSymbol={selectedCryptoWallet}
          onChange={handleCryptoWalletChange}
        />
        <InputAmount
          name="amount"
          className="mt-[40px]"
          label={<div className='ml-[15px] text-[#273855] dark:text-[#F9D3B4] text-[16px] transition-all duration-1000'>Enter amount</div>}
          hookForm={hookForm}
          validate={validateAmount}
          selectedCurrency={selectedCryptoFiat}
          isCurrencySelectable={true}
          onCurrencyChange={handleCryptoFiatChange}
        />
        <Checkbox
          className="ml-4 mb-3 mt-[30px]"
          checked={isAgreed}
          onChange={handleAgreeChange}
        >
          <div className='text-[16px] pt-[6px] text-[#000] dark:text-[#FFF]'>I Agree with&nbsp;<span className='underline text-[#745FF2]'>Terms and conditions</span></div>
        </Checkbox>
        <Button
          type="submit"
          isDisabled={!isAgreed}
          isLoading={isLoading}
          className='bg-deposit-card-btn shadow-main-card-btn rounded-[26px] text-[20px] text-[#F0F5F9] tracking-[3px] p-2 w-full'
        >
          Deposit
        </Button>
      </div>
      <div className='w-[45%]'>
        <RightBar isCrypto={true} />
      </div>
    </form>
  )
}

export default compose(
  connect(
    state => ({
      workflow: state.workflow
    }),
    {
      updateBalance
    }
  )
)(TabCrypto);