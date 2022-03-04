import { put, call, takeEvery, select } from 'redux-saga/effects';
import { WorkflowConstants } from '../constants/workflowConstants';
import request from '../../utils/fetch';
import { fetchBalance } from '../../utils/wallet';

const getWorkflow = state => state.workflow;

function* signIn(action) {
  yield call(request({
    type: WorkflowConstants.SIGNIN_ACTION,
    method: 'POST',
    url: action.payload.url,
  }), action);
}

function* signOut() {
  yield put({ type: `${WorkflowConstants.SIGNOUT_ACTION}_SUCCESS` });
}

function walletInfoAction(address, network) {
  return fetchBalance(address, network);
}

function* updateBalance(action) {  
  const state = yield select(getWorkflow);
  try {
    const balance = yield call(walletInfoAction, action.payload, state?.network);
    yield put({ type: `${WorkflowConstants.UPDATEBALANCE_ACTION}_SUCCESS`, payload: balance });
  } catch (err) {
    yield put({ type: `${WorkflowConstants.UPDATEBALANCE_ACTION}_FAILURE` });
  }
}

function* updateNetwork(action) {
  try {
    yield put({ type: `${WorkflowConstants.UPDATENETWORK_ACTION}_SUCCESS`, payload: action.payload });
  } catch (err) {
    yield put({ type: `${WorkflowConstants.UPDATENETWORK_ACTION}_FAILURE` });
  }
}

function* earnDeposit(action) {
  yield call(request({
    type: WorkflowConstants.EARNDEPOSIT_ACTION,
    method: 'POST',
    url: action.payload.url,
  }), action);
}

function* depositSend(action) {
  yield call(request({
    type: WorkflowConstants.DEPOSITSEND_ACTION,
    method: 'POST',
    url: action.payload.url,
  }), action);
}

function* getIPAddress(action) {
  yield call(request({
    type: WorkflowConstants.GET_IP_ADDRESS,
    method: 'GET',
    apiUrl: 'https://api.ipify.org?format=json&callback=?',
  }), action);
}


export default function* workflowSaga() {
  yield takeEvery(WorkflowConstants.GET_IP_ADDRESS, getIPAddress);
  yield takeEvery(WorkflowConstants.SIGNIN_ACTION, signIn);
  yield takeEvery(WorkflowConstants.SIGNOUT_ACTION, signOut);
  yield takeEvery(WorkflowConstants.UPDATEBALANCE_ACTION, updateBalance);
  yield takeEvery(WorkflowConstants.UPDATENETWORK_ACTION, updateNetwork);
  yield takeEvery(WorkflowConstants.EARNDEPOSIT_ACTION, earnDeposit);
  yield takeEvery(WorkflowConstants.DEPOSITSEND_ACTION, depositSend);
}
