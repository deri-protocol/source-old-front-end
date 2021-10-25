import { DeriEnv } from "../../shared";
import { getUserVotingPower, getUserVotingResult, getVotingResult } from "../api/deri_vote"

const TIMEOUT = 30000

const account = '0xFFe85D82409c5b9D734066C134b0c2CCDd68C4dF'

describe('Deri Vote', () => {
  it(
    'getVotingResult',
    async () => {
      DeriEnv.set('prod');
      // expect(await getVotingResult()).toEqual([
      //   '655714.514339910173851648',
      //   '409486.589079234057076736',
      //   '0',
      // ]);
      expect(await getVotingResult()).toEqual([
        '0',
        '0',
        '0',
      ]);
      DeriEnv.set('dev');
    },
    TIMEOUT
  );
  it(
    'getUserVotingPower',
    async () => {
      DeriEnv.set('prod')
      expect(
        await getUserVotingPower('0xcf577364cc9aB06DBA850edcce62122F4Eb0C34F')
      ).toEqual('656.295172466975309824');
      DeriEnv.set('dev')
    },
    TIMEOUT
  );
  it(
    'getUserVotingResult',
    async () => {
      DeriEnv.set('prod')
      expect(await getUserVotingResult('56', account)).toEqual('0');
      DeriEnv.set('dev')
    },
    TIMEOUT
  );
});