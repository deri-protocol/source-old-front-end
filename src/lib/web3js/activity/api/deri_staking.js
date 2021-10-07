import { catchApiError, catchTxApiError } from '../../shared';
import { getDeriStakingConfig } from '../config';
import { deriStakingFactory } from '../contract/factory';

export const getStakingBalance = async (chainId, accountAddress) => {
  const args = [chainId, accountAddress];
  return catchApiError(
    async (chainId, accountAddress) => {
      chainId = chainId.toString()
      const config = getDeriStakingConfig(chainId);
      const contract = deriStakingFactory(chainId, config.address);
      return await contract.getAccountBalance(accountAddress);
    },
    args,
    'getStakingBalance',
    ''
  );
};
export const getTotalStakingBalance = async (chainId) => {
  const args = [chainId];
  return catchApiError(
    async (chainId) => {
      chainId = chainId.toString()
      const config = getDeriStakingConfig(chainId);
      const contract = deriStakingFactory(chainId, config.address);
      return await contract.getTotalBalance();
    },
    args,
    'getTotalStakingBalance',
    ''
  );
};
export const getStakingScore = async (chainId, accountAddress) => {
  const args = [chainId, accountAddress];
  return catchApiError(
    async (chainId, accountAddress) => {
      chainId = chainId.toString()
      const config = getDeriStakingConfig(chainId);
      const contract = deriStakingFactory(chainId, config.address);
      return await contract.getAccountScore(accountAddress);
    },
    args,
    'getStakingScore',
    ''
  );
};
export const getTotalStakingScore = async (chainId) => {
  const args = [chainId];
  return catchApiError(
    async (chainId) => {
      chainId = chainId.toString()
      const config = getDeriStakingConfig(chainId);
      const contract = deriStakingFactory(chainId, config.address);
      return await contract.getTotalScore();
    },
    args,
    'getTotalStakingScore',
    ''
  );
};

// tx
export const depositStaking = async (chainId, accountAddress, amount) => {
  const args = [chainId, accountAddress, amount];
  return catchTxApiError(async (chainId, accountAddress, amount) => {
    chainId = chainId.toString()
    const config = getDeriStakingConfig(chainId);
    const contract = deriStakingFactory(chainId, config.address);
    return await contract.deposit(accountAddress, amount);
  }, args);
};

export const withdrawStaking = async (chainId, accountAddress, amount) => {
  const args = [chainId, accountAddress, amount];
  return catchTxApiError(async (chainId, accountAddress) => {
    chainId = chainId.toString()
    const config = getDeriStakingConfig(chainId);
    const contract = deriStakingFactory(chainId, config.address);
    return await contract.withdraw(accountAddress, amount);
  }, args);
};
