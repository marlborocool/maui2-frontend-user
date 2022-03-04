import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import InputAmount from '../../../components/Form/InputAmount';
import { unmaskCurrency } from '../../../utils/masks';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { toast } from "react-toastify";
import { Dec } from "@terra-money/terra.js";
import { apiEarnDeposit } from '../../../saga/actions/workflow';
import Button from '../../../components/Button';
import { appConfig } from '../../../appConfig';
import AgreeWithCheckbox from '../../../components/Form/AgreeWithCheckbox';

function Cards (props) {
	// get functions to build form with useForm() hook
  const hookForm = useForm();
	const { handleSubmit, setValue } = hookForm;
  // set initial values
  useEffect(() => {
    setValue('amount', 0);
  }, [setValue]);
  
  const [ isAgreed, setIsAgreed ] = useState(false);
  const [ isLoading, setIsLoading ] = useState(false);
  
  const resetForm = () => {
    setValue('amount', 0);
    setIsAgreed(false);
  }
  
  function handleAgreeChange(e) {
    setIsAgreed(e.target.checked);
  }

  function validateAmount(val) {
    const value = unmaskCurrency(val);
    if (!value) {
      return 'This input field is required.';
    }
    if (!props.isDeposit) {
      if ( Number(value) > new Dec(props.austVal).mul(props.marketExchangeRate).div(appConfig.MICRO) ) {
        return 'Not enough deposit';
      }
    } else {
      if ( Number(value) > Number(props.workflow.balance) ) {
        return 'Insufficient balance';
      }
    }
    return null;
  }

  // handle functions
	const onSubmit = (data) => {
    if (!props.workflow.isLogged) {
      toast.error("Please login first.");
      return false;
    }
    setIsLoading(true);
    props.apiEarnDeposit({
      url: props.isDeposit ? '/deposit' : '/withdraw',
      method: 'POST',
      data: {
        amount: unmaskCurrency(data.amount),
        network: props.workflow.network,
      },
      success: (response) => {
        setIsLoading(false);
        props.handleAfterSubmit();
        resetForm();
        toast.success("Transaction success");
      },
      fail: (error) => {
        props.handleAfterSubmit();
        console.log('error', error);
        setIsLoading(false);
        toast.error("Transaction fail");
      }
    })
		return false;
	}

  return (
    <form name={props.name} id={props.name} className='w-full bg-earn-card rounded-[40px] p-[30px] pl-[50px] border dark:border-[#FFFFFF30]' onSubmit={handleSubmit(onSubmit)}>
      { props.isDeposit ?
        <div className=' font-semibold text-[24px] text-[#273855] dark:text-[#F9D3B4]'>Enter an amount for 15% APY <span className='text-[#745FF2]'>Deposit</span></div>
      :
        <div className=' font-semibold text-[24px] text-[#273855] dark:text-[#F9D3B4]'>How much would you like to <span className='text-transparent bg-clip-text bg-gradient-to-b from-[#FF0000FF] to-[#FF000010]'>Withdraw</span> ?</div>
      }
      
      <InputAmount
        name="amount"
        className="mt-[30px]"
        label={<div className='ml-[15px] text-[#273855] dark:text-[#F9D3B4] text-[16px] transition-all duration-1000'>Enter amount</div>}
        hookForm={hookForm}
        validate={validateAmount}
      />
      <AgreeWithCheckbox
        className="ml-4 mb-3 mt-[30px]"
        checked={isAgreed}
        onChange={handleAgreeChange}
        position="right"
        align="center"
      />
      <Button
        type="submit"
        isDisabled={!isAgreed}
        isLoading={isLoading}
        className={`${props.isDeposit ? 'bg-deposit-card-btn': 'bg-earn-withdraw-card-btn'} shadow-main-card-btn rounded-[26px] text-[20px] text-[#F0F5F9] tracking-[3px] p-2 w-full mt-[20px]`}
      >
        {props.isDeposit ? 'Deposit' : 'Withdraw'}
      </Button>
    </form>
  )
}

export default compose(
  connect(
    state => ({
      workflow: state.workflow
    }),
    {
      apiEarnDeposit
    }
  )
)(Cards);