import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { compose } from 'redux';
import { connect } from 'react-redux';
import { toast } from "react-toastify";
import { useWallet } from "@terra-money/wallet-provider";

import InputAmount from '../../../../components/Form/InputAmount';
import SelectCurrency from '../../../../components/Form/SelectCurrency';
import SelectWallet from '../../../../components/Form/SelectWallet';
import { unmaskCurrency } from '../../../../utils/masks';
import Button from '../../../../components/Button';
import RightBar from './rightbar';
import { depositCrypto } from '../../../../utils/wallet';
import AgreeWithCheckbox from '../../../../components/Form/AgreeWithCheckbox';
import { apiHistoryRecord, updateBalance } from '../../../../saga/actions/workflow';
import { CURRENCY_USD, HISTORY_DEPOSIT_CRYPTO } from '../../../../utils/appConstants';

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
  // const [ selectedCryptoFiat, setSelectedCryptoFiat ] = useState('USD');

  const deposit = async (amount, from, to, network) => {
    setIsLoading(true);
    depositCrypto(amount, from, to, network, sign, () => {
      props.apiHistoryRecord({
        url: '/recordHistory',
        method: 'POST',
        data: {
          type: HISTORY_DEPOSIT_CRYPTO,
          terraAddress: from,
          mauiAddress: to,
          amount: amount,
          currency: CURRENCY_USD,
          network: `${props.workflow.network.name}:${props.workflow.network.chainID}`,
          note: 'DONE',
        },
        success: (res) => {
          console.log('recordSuccess', res);
        },
        fail: (error) => {
          console.log('recordError', error);
        }
      });
      props.updateBalance(to);
      setIsLoading(false);
      resetForm();
      toast.success("Transaction success");
    }, (err) => {
      console.log('deposit error', err);
      setIsLoading(false);
      toast.error("Transaction fails");
    })
  };

  function handleCryptoChange(symbol) {
    setSelectedCrypto(symbol);
  }
  function handleCryptoWalletChange(symbol) {
    setSelectedCryptoWallet(symbol);
  }
  // function handleCryptoFiatChange(symbol) {
  //   setSelectedCryptoFiat(symbol);
  // }
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
    const network = props.workflow.network;
    deposit(unmaskCurrency(data.amount), from, to, network);
		return false;
	}
  return (
    <form className='flex p-10 md:p-20 flex-col-reverse md:flex-row justify-between' onSubmit={handleSubmit(onSubmit)}>
      <div className='w-full md:w-[45%]'>
        <SelectCurrency
          isCrypto={true}
          className="mt-[40px] md:mt-[10px]"
          label={<div className='text-[#273855] dark:text-[#F9D3B4] text-[13px] md:text-[16px] transition-all duration-1000'>Select crypto you want to <span className='text-transparent bg-clip-text bg-gradient-to-r from-[#745FF2] to-[#00DDA2]'>Deposit</span></div>}
          selectedSymbol={selectedCrypto}
          onChange={handleCryptoChange}
        />
        <div className='h-[30px]'></div>
        <SelectWallet
          isCrypto={true}
          className="mt-[10px]"
          label={<div className='text-[#273855] dark:text-[#F9D3B4] text-[13px] md:text-[16px] transition-all duration-1000'>Transfer from</div>}
          selectedSymbol={selectedCryptoWallet}
          onChange={handleCryptoWalletChange}
        />
        <InputAmount
          name="amount"
          className="mt-[40px]"
          label={<div className='ml-[15px] text-[#273855] dark:text-[#F9D3B4] text-[13px] md:text-[16px] transition-all duration-1000'>Enter amount</div>}
          hookForm={hookForm}
          validate={validateAmount}
        />
        <AgreeWithCheckbox
          className="ml-2 md:ml-4 mb-3 mt-[30px]"
          checked={isAgreed}
          onChange={handleAgreeChange}
        />
        <Button
          type="submit"
          isDisabled={!isAgreed}
          isLoading={isLoading}
          className='mt-[10px] bg-deposit-card-btn shadow-main-card-btn rounded-[26px] text-[14px] md:text-[20px] text-[#F0F5F9] tracking-[3px] p-2 w-full'
        >
          Deposit
        </Button>
      </div>
      <div className='w-full mt-[10px] md:mt-0 md:w-[45%]'>
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
      apiHistoryRecord,
      updateBalance
    }
  )
)(TabCrypto);