import { catchApiError, catchTxApiError, DeriEnv, fromWei, hexToNumberString, toChecksumAddress } from "../../shared";
import { databaseDeriVoteFactory } from "../../shared/factory/database";
import { getDeriVoteConfig } from "../config";
import { deriVoteFactory } from "../contract/factory";

const keyPrefix = () => (DeriEnv.get() === 'prod' ? 'VID1' : 'VID1');

const votingId = '2'

export const getVotingResult = async() => {
  return catchApiError(async() => {
    const db = databaseDeriVoteFactory()
    const keys = [
      `${keyPrefix()}.OP1.vote`,
      `${keyPrefix()}.OP2.vote`,
      `${keyPrefix()}.OP3.vote`,
    ]
    const res = await db.getValues(keys)
    return res.map((v) => fromWei(hexToNumberString(v)) )
  }, [], 'getOptionsVotingPowers', '')
}

export const getUserVotingPower = async(accountAddress) => {
  return catchApiError(async() => {
    accountAddress = toChecksumAddress(accountAddress)
    const db = databaseDeriVoteFactory()
    const keys = [
      `${keyPrefix()}.${accountAddress}.vote`,
    ]
    const res = await db.getValues(keys)
    return res.map((v) => fromWei(hexToNumberString(v)))[0]
  }, [accountAddress], 'getUserVotingPowers', '')
}


export const getUserVotingResult = async(chainId, accountAddress) => {
  const args = [chainId, accountAddress]
  return catchApiError(async() => {
    chainId = chainId.toString()
    const config = getDeriVoteConfig(chainId)
    const deriVote = deriVoteFactory(chainId, config.address)
    return await deriVote.votingOptions(votingId, accountAddress)
  }, args, 'getVoteResult', '')
}

export const vote = async(chainId, accountAddress, votingOption) => {
  const args = [chainId, accountAddress, votingOption]
  return catchTxApiError(async() => {
    chainId = chainId.toString()
    const config = getDeriVoteConfig(chainId)
    const deriVote = deriVoteFactory(chainId, config.address)
    const voteId = await deriVote.votingId()
    if (voteId !== votingId) {
      console.log(
        `Deri Vote: votingId is not match (${votingId} !== ${voteId}) `
      );
      throw new Error(
        `Deri Vote: votingId is not match (${votingId} !== ${voteId}) `
      );
    }
    return await deriVote.vote(votingOption, accountAddress)
  }, args)
}