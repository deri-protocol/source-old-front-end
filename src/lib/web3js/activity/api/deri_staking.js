import { catchApiError, bg, deriToNatural, databaseActivityFactory, toChecksumAddress, DeriEnv, max } from '../../shared';

const range = (n) => (new Array(n)).fill(0).map((i,index) => index)

const keyPrefix = () => (DeriEnv.get() === 'prod' ? 'TE3' : 'TE2');

export const getStakingTop10Users = async () => {
  return catchApiError(
    async () => {
      const db = databaseActivityFactory();
      const key = range(10).reduce(
        (acc, i) =>
          acc.concat([
            `${keyPrefix()}.top.${i + 1}.account`,
            `${keyPrefix()}.top.${i + 1}.fee`,
            `${keyPrefix()}.top.${i + 1}.score`,
            `${keyPrefix()}.top.${i + 1}.cont`,
          ]),
        []
      );
      //console.log(key)
      const res = await db.getValues(key)
      //console.log(res)
      if (Array.isArray(res) && res.length === 4 * 10) {
        let result = []
        for (let i = 0; i < res.length; i++) {
          if ((i + 1) % 4 === 0) {
            const info = res.slice(i - 3, i + 1);
            const index = (i + 1) / 4
            result.push({
              no: index,
              userAddr: info[0].slice(0, 42),
              feePaid: deriToNatural(info[1]).toString(),
              score: deriToNatural(info[2]).toString(),
              evgCoeff: deriToNatural(info[1]).eq(0)
                ? '0'
                : bg(info[3]).div(info[1]).toString(),
              rewardBNB:
                index <= 5
                  ? index <= 4
                    ? index <= 3
                      ? index <= 2
                        ? index <= 1
                          ? '200000'
                          : '100000'
                        : '50000'
                      : '35000'
                    : '25000'
                  : '18000',
            });
          }
        }
        return result.filter((r) => r.userAddr !== '0x0000000000000000000000000000000000000000')
      } else {
        return []
      }
    },
    [],
    'getStakingTop10Users',
    [],
  );
};

export const getUserStakingInfo = async (accountAddress) => {
  const args = [accountAddress];
  return catchApiError(
    async (accountAddress) => {
      accountAddress = toChecksumAddress(accountAddress)
      const db = databaseActivityFactory();
      const key = [
        `${keyPrefix()}.Q1.cont`,
        `${keyPrefix()}.Q2.cont`,
        `${keyPrefix()}.Q3.cont`,
        `${keyPrefix()}.Q4.cont`,
        `${keyPrefix()}.${accountAddress}.Q1.cont`,
        `${keyPrefix()}.${accountAddress}.Q2.cont`,
        `${keyPrefix()}.${accountAddress}.Q3.cont`,
        `${keyPrefix()}.${accountAddress}.Q4.cont`,
        `${keyPrefix()}.${accountAddress}.fee`,
        `${keyPrefix()}.${accountAddress}.coef`,
      ];
      const res = await db.getValues(key)
      const scoreQ1 = bg(res[0]).eq(0) ? '0': bg(10000).times(bg(res[4]).div(res[0]))
      const scoreQ2 = bg(res[1]).eq(0) ? '0': bg(20000).times(bg(res[5]).div(res[1]))
      const scoreQ3 = bg(res[2]).eq(0) ? '0': bg(30000).times(bg(res[6]).div(res[2]))
      const scoreQ4 = bg(res[3]).eq(0) ? '0': bg(50000).times(bg(res[7]).div(res[3]))

      const coef = deriToNatural(res[9])
      return {
        userAddr: accountAddress,
        feePaid: deriToNatural(res[8]).toString(),
        coef: max(coef, bg(1)).toString(),
        score: bg(scoreQ1).plus(scoreQ2).plus(scoreQ3).plus(scoreQ4).toString()
      }
    },
    args,
    'getUserStakingInfo',
    {
      userAddr: '',
      feePaid: '',
      coef: '',
      score: '',
    }
  );
};

export const getUserStakingReward = async (accountAddress) => {
  const args = [accountAddress];
  return catchApiError(
    async (accountAddress) => {
      accountAddress = toChecksumAddress(accountAddress)
      const db = databaseActivityFactory();
      const key = [
        `${keyPrefix()}.Q1.cont`,
        `${keyPrefix()}.Q2.cont`,
        `${keyPrefix()}.Q3.cont`,
        `${keyPrefix()}.Q4.cont`,
        `${keyPrefix()}.${accountAddress}.Q1.cont`,
        `${keyPrefix()}.${accountAddress}.Q2.cont`,
        `${keyPrefix()}.${accountAddress}.Q3.cont`,
        `${keyPrefix()}.${accountAddress}.Q4.cont`,
        `${keyPrefix()}.top.1.account`,
        `${keyPrefix()}.top.2.account`,
        `${keyPrefix()}.top.3.account`,
        `${keyPrefix()}.top.4.account`,
        `${keyPrefix()}.top.5.account`,
        `${keyPrefix()}.top.6.account`,
        `${keyPrefix()}.top.7.account`,
        `${keyPrefix()}.top.8.account`,
        `${keyPrefix()}.top.9.account`,
        `${keyPrefix()}.top.10.account`,
      ];
      const res = await db.getValues(key);
      const scoreQ1 = bg(res[0]).eq(0) ? '0': bg(10000).times(bg(res[4]).div(res[0]))
      const scoreQ2 = bg(res[1]).eq(0) ? '0': bg(20000).times(bg(res[5]).div(res[1]))
      const scoreQ3 = bg(res[2]).eq(0) ? '0': bg(30000).times(bg(res[6]).div(res[2]))
      const scoreQ4 = bg(res[3]).eq(0) ? '0': bg(50000).times(bg(res[7]).div(res[3]))
      const score = bg(scoreQ1).plus(scoreQ2).plus(scoreQ3).plus(scoreQ4);
      const rewardDERI = bg(1000000).times(bg(score).div(110000)).toString();

      const topUsers = res.slice(8).map((u) => toChecksumAddress(u.slice(0, 42)));
      let rewardBNB = '0';
      if (topUsers.includes(accountAddress)) {
        if (accountAddress === topUsers[0]) {
          rewardBNB = '200000';
        } else if (accountAddress === topUsers[1]) {
          rewardBNB = '100000';
        } else if (accountAddress === topUsers[2]) {
          rewardBNB = '50000';
        } else if (accountAddress === topUsers[3]) {
          rewardBNB = '35000';
        } else if (accountAddress === topUsers[4]) {
          rewardBNB = '25000';
        } else {
          rewardBNB = '18000';
        }
      }
      return {
        userAddr: accountAddress,
        rewardBNB,
        rewardDERI,
      };
    },
    args,
    'getUserStakingReward',
    { userAddr: '', rewardBNB: '', rewardDERI: '' }
  );
};

export const getUserStakingContribution = async (accountAddress) => {
  const args = [accountAddress];
  return catchApiError(
    async (accountAddress) => {
      accountAddress = toChecksumAddress(accountAddress);
      const db = databaseActivityFactory();
      const key = [
        `${keyPrefix()}.Q1.cont`,
        `${keyPrefix()}.Q2.cont`,
        `${keyPrefix()}.Q3.cont`,
        `${keyPrefix()}.Q4.cont`,
        `${keyPrefix()}.${accountAddress}.Q1.cont`,
        `${keyPrefix()}.${accountAddress}.Q2.cont`,
        `${keyPrefix()}.${accountAddress}.Q3.cont`,
        `${keyPrefix()}.${accountAddress}.Q4.cont`,
      ];
      const res = await db.getValues(key);
      return {
        userAddr: accountAddress,
        totalContrib: deriToNatural(
          bg(res[0]).plus(res[1]).plus(res[2]).plus(res[3])
        ).toString(),
        userContrib: deriToNatural(
          bg(res[4]).plus(res[5]).plus(res[6]).plus(res[7])
        ).toString(),
      };
    },
    args,
    'getUserStakingContribution',
    { userAddr: '', totalContrib: '', userContrib: '' }
  );
};