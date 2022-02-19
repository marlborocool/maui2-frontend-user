import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { compose } from 'redux';
import { connect } from 'react-redux';
import { toast } from "react-toastify";
import transakSDK from "@transak/transak-sdk";

import { appConfig } from '../../../../appConfig';
import Checkbox from '../../../../components/Form/Checkbox';
import InputAmount from '../../../../components/Form/InputAmount';
import SelectCurrency from '../../../../components/Form/SelectCurrency';
import SelectWallet from '../../../../components/Form/SelectWallet';
import { unmaskCurrency } from '../../../../utils/masks';
import Button from '../../../../components/Button';
import { updateBalance } from '../../../../saga/actions/workflow';
import RightBar from './rightbar';

let preventSeveralCalling = false;
function TabFiat (props) {
  // get functions to build form with useForm() hook
  const hookForm = useForm();
	const { handleSubmit, setValue } = hookForm;
  // set initial values
  useEffect(() => {
    setValue('amount', 0);
  }, [props.data, setValue]);

  const [ isAgreed, setIsAgreed ] = useState(false);
  const [ isLoading, setIsLoading ] = useState(false);
  const [ selectedFiat, setSelectedFiat ] = useState('USD');
  const [ selectedFiatWallet, setSelectedFiatWallet ] = useState('USD');

  const depositFiat = (amount, to) => {
    setIsLoading(true);
    preventSeveralCalling = false;
    let transak = new transakSDK({
      apiKey: appConfig.transakAPIKey, // Your API Key
      environment: "STAGING", // STAGING/PRODUCTION
      defaultCryptoCurrency: "UST",
      network: "terra",
      walletAddress: to, // Your customer's wallet address
      themeColor: "#536DFE", // App theme color
      fiatCurrency: "EUR", // INR/GBP // ----------vdg
      fiatAmount: amount,
      // email: "", // Your customer's email address
      redirectURL: "",
      hostURL: window.location.origin,
      widgetHeight: "550px",
      widgetWidth: "450px",
    });

    transak.init();
    transak.on(transak.EVENTS.TRANSAK_WIDGET_CLOSE, (offerData) => {
      if (preventSeveralCalling)
        return;
      preventSeveralCalling = true;
      setIsLoading(false);
      resetForm();
      props.updateBalance(to);
      transak.close();
    });
  };

  function handleFiatChange(symbol) {
    setSelectedFiat(symbol);
  }
  function handleFiatWalletChange(symbol) {
    setSelectedFiatWallet(symbol);
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
    const to = props.workflow.mauiAddress;
    depositFiat(data.amount, to);
		return false;
	}
  return (
    <form className='flex p-20 justify-between' onSubmit={handleSubmit(onSubmit)}>
      <div className='w-[45%]'>
        <SelectCurrency
          isCrypto={false}
          className="mt-[10px]"
          label={<div className='text-[#273855] dark:text-[#F9D3B4] text-[16px] transition-all duration-1000'>Select currency and payment method</div>}
          selectedSymbol={selectedFiat}
          onChange={handleFiatChange}
        />
        <div className='h-[30px]'></div>
        <SelectWallet
          isCrypto={false}
          className="mt-[10px]"
          label={<div className='text-[#273855] dark:text-[#F9D3B4] text-[16px] transition-all duration-1000'>Bank transfer <span className='text-[#888888]'>(reccomended)</span></div>}
          selectedSymbol={selectedFiatWallet}
          onChange={handleFiatWalletChange}
        />
        <InputAmount
          name="amount"
          className="mt-[40px]"
          label={<div className='ml-[15px] text-[#273855] dark:text-[#F9D3B4] text-[16px] transition-all duration-1000'>Enter amount</div>}
          hookForm={hookForm}
          validate={validateAmount}
        />
        <div className='ml-5 mt-[30px]'>
          <div className='flex text-[14px] items-center'>
            <div className='text-[#6B8CFF]'>Fee</div>
            <div className='ml-[10px] text-black dark:text-white text-[16px] font-semibold'>4</div>
          </div>
          <div className='flex text-[14px] items-center'>
            <div className='text-[#6B8CFF]'>You will get</div>
            <div className='ml-[10px] text-black dark:text-white text-[16px] font-semibold'>196</div>
          </div>
        </div>
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
        <RightBar isCrypto={false} />
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
)(TabFiat);