import { catchApiError, bg, deriToNatural, databaseActivityFactory, toChecksumAddress, DeriEnv, max } from '../../shared';

const range = (n) => (new Array(n)).fill(0).map((i,index) => index)

const keyPrefix = (epoch) => {
  if (!epoch || epoch.toString() === '1') {
    return DeriEnv.get() === 'prod' ? 'TE' : 'TE2'
  } else if (epoch.toString() === '2') {
    return DeriEnv.get() === 'prod' ? 'TE2' : 'TE6'
  }
}

export const getStakingTop10Users = async (epoch) => {
  return catchApiError(
    async () => {
      //console.log('key', keyPrefix(epoch))
      const db = databaseActivityFactory();
      const key = range(10).reduce(
        (acc, i) =>
          acc.concat([
            `${keyPrefix(epoch)}.top.${i + 1}.account`,
            `${keyPrefix(epoch)}.top.${i + 1}.fee`,
            `${keyPrefix(epoch)}.top.${i + 1}.score`,
            `${keyPrefix(epoch)}.top.${i + 1}.cont`,
            `${keyPrefix(epoch)}.toppnl.${i + 1}.account`,
            `${keyPrefix(epoch)}.toppnl.${i + 1}.pnl`,
          ]),
        []
      );
      //console.log(key)
      const res = await db.getValues(key);
      //console.log(res)
      if (Array.isArray(res) && res.length === 6 * 10) {
        let result = [],
          resultPnl = [];
        for (let i = 0; i < res.length; i++) {
          if ((i + 1) % 6 === 0) {
            const info = res.slice(i - 5, i + 1);
            const index = (i + 1) / 6;
            result.push({
              no: index,
              userAddr: info[0].slice(0, 42),
              feePaid: deriToNatural(info[1]).toString(),
              score: deriToNatural(info[2]).toString(),
              evgCoeff: deriToNatural(info[1]).eq(0)
                ? '0'
                : bg(info[3]).div(info[1]).toString(),
              specialRewardsA:
                index <= 5
                  ? index <= 4
                    ? index <= 3
                      ? index <= 2
                        ? index <= 1
                          ? '80000'
                          : '60000'
                        : '40000'
                      : '20000'
                    : '10000'
                  : '8000',
            });
            resultPnl.push({
              no: index,
              userAddr: info[4].slice(0, 42),
              pnl: deriToNatural(info[5]).toString(),
              specialRewardsB:
                index <= 5
                  ? index <= 4
                    ? index <= 3
                      ? index <= 2
                        ? index <= 1
                          ? '80000'
                          : '60000'
                        : '40000'
                      : '20000'
                    : '10000'
                  : '8000',
            });
          }
        }
        return {
          top10: result.filter(
            (r) => r.userAddr !== '0x0000000000000000000000000000000000000000'
          ),
          top10Pnl: resultPnl.filter(
            (r) => r.userAddr !== '0x0000000000000000000000000000000000000000'
          ),
        };
      } else {
        return { top10: [], top10Pnl: [] };
      }
    },
    [],
    'getStakingTop10Users',
    { top10: [], top10Pnl: [] }
  );
};

export const getUserStakingInfo = async (accountAddress, epoch) => {
  const args = [accountAddress];
  return catchApiError(
    async (accountAddress) => {
      accountAddress = toChecksumAddress(accountAddress)
      const db = databaseActivityFactory();
      const key = [
        `${keyPrefix(epoch)}.Q1.cont`,
        `${keyPrefix(epoch)}.Q2.cont`,
        `${keyPrefix(epoch)}.Q3.cont`,
        `${keyPrefix(epoch)}.Q4.cont`,
        `${keyPrefix(epoch)}.${accountAddress}.Q1.cont`,
        `${keyPrefix(epoch)}.${accountAddress}.Q2.cont`,
        `${keyPrefix(epoch)}.${accountAddress}.Q3.cont`,
        `${keyPrefix(epoch)}.${accountAddress}.Q4.cont`,
        `${keyPrefix(epoch)}.${accountAddress}.fee`,
        `${keyPrefix(epoch)}.${accountAddress}.coef`,
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

export const getUserStakingReward = async (accountAddress, epoch) => {
  const args = [accountAddress];
  return catchApiError(
    async (accountAddress) => {
      accountAddress = toChecksumAddress(accountAddress);
      const db = databaseActivityFactory();
      const key = [
        `${keyPrefix(epoch)}.Q1.cont`,
        `${keyPrefix(epoch)}.Q2.cont`,
        `${keyPrefix(epoch)}.Q3.cont`,
        `${keyPrefix(epoch)}.Q4.cont`,
        `${keyPrefix(epoch)}.${accountAddress}.Q1.cont`,
        `${keyPrefix(epoch)}.${accountAddress}.Q2.cont`,
        `${keyPrefix(epoch)}.${accountAddress}.Q3.cont`,
        `${keyPrefix(epoch)}.${accountAddress}.Q4.cont`,
        `${keyPrefix(epoch)}.top.1.account`,
        `${keyPrefix(epoch)}.top.2.account`,
        `${keyPrefix(epoch)}.top.3.account`,
        `${keyPrefix(epoch)}.top.4.account`,
        `${keyPrefix(epoch)}.top.5.account`,
        `${keyPrefix(epoch)}.top.6.account`,
        `${keyPrefix(epoch)}.top.7.account`,
        `${keyPrefix(epoch)}.top.8.account`,
        `${keyPrefix(epoch)}.top.9.account`,
        `${keyPrefix(epoch)}.top.10.account`,
        `${keyPrefix(epoch)}.toppnl.1.account`,
        `${keyPrefix(epoch)}.toppnl.2.account`,
        `${keyPrefix(epoch)}.toppnl.3.account`,
        `${keyPrefix(epoch)}.toppnl.4.account`,
        `${keyPrefix(epoch)}.toppnl.5.account`,
        `${keyPrefix(epoch)}.toppnl.6.account`,
        `${keyPrefix(epoch)}.toppnl.7.account`,
        `${keyPrefix(epoch)}.toppnl.8.account`,
        `${keyPrefix(epoch)}.toppnl.9.account`,
        `${keyPrefix(epoch)}.toppnl.10.account`,
      ];
      const res = await db.getValues(key);
      const scoreQ1 = bg(res[0]).eq(0)
        ? '0'
        : bg(10000).times(bg(res[4]).div(res[0]));
      const scoreQ2 = bg(res[1]).eq(0)
        ? '0'
        : bg(20000).times(bg(res[5]).div(res[1]));
      const scoreQ3 = bg(res[2]).eq(0)
        ? '0'
        : bg(30000).times(bg(res[6]).div(res[2]));
      const scoreQ4 = bg(res[3]).eq(0)
        ? '0'
        : bg(50000).times(bg(res[7]).div(res[3]));
      const score = bg(scoreQ1).plus(scoreQ2).plus(scoreQ3).plus(scoreQ4);
      const rewardDERI = bg(1000000).times(bg(score).div(110000)).toString();

      const topUsers = res
        .slice(8)
        .map((u) => toChecksumAddress(u.slice(0, 42)));
      const topPnlUsers = res
        .slice(18)
        .map((u) => toChecksumAddress(u.slice(0, 42)));
      let specialRewardsA = '0';
      if (topUsers.includes(accountAddress)) {
        if (accountAddress === topUsers[0]) {
          specialRewardsA = '80000';
        } else if (accountAddress === topUsers[1]) {
          specialRewardsA = '60000';
        } else if (accountAddress === topUsers[2]) {
          specialRewardsA = '40000';
        } else if (accountAddress === topUsers[3]) {
          specialRewardsA = '20000';
        } else if (accountAddress === topUsers[4]) {
          specialRewardsA = '10000';
        } else {
          specialRewardsA = '8000';
        }
      }
      let specialRewardsB = '0';
      if (topPnlUsers.includes(accountAddress)) {
        if (accountAddress === topPnlUsers[0]) {
          specialRewardsB = '80000';
        } else if (accountAddress === topPnlUsers[1]) {
          specialRewardsB = '60000';
        } else if (accountAddress === topPnlUsers[2]) {
          specialRewardsB = '40000';
        } else if (accountAddress === topPnlUsers[3]) {
          specialRewardsB = '20000';
        } else if (accountAddress === topPnlUsers[4]) {
          specialRewardsB = '10000';
        } else {
          specialRewardsB = '8000';
        }
      }
      return {
        userAddr: accountAddress,
        rewardDERI,
        specialRewardsA,
        specialRewardsB,
      };
    },
    args,
    'getUserStakingReward',
    { userAddr: '', rewardDERI: '', specialRewardsA: '', specialRewardsA: '' }
  );
};

export const getUserStakingContribution = async (accountAddress, epoch) => {
  const args = [accountAddress];
  return catchApiError(
    async (accountAddress) => {
      accountAddress = toChecksumAddress(accountAddress);
      const db = databaseActivityFactory();
      const key = [
        `${keyPrefix(epoch)}.Q1.cont`,
        `${keyPrefix(epoch)}.Q2.cont`,
        `${keyPrefix(epoch)}.Q3.cont`,
        `${keyPrefix(epoch)}.Q4.cont`,
        `${keyPrefix(epoch)}.${accountAddress}.Q1.cont`,
        `${keyPrefix(epoch)}.${accountAddress}.Q2.cont`,
        `${keyPrefix(epoch)}.${accountAddress}.Q3.cont`,
        `${keyPrefix(epoch)}.${accountAddress}.Q4.cont`,
      ];
      const res = await db.getValues(key);
      const scoreQ1 = bg(res[0]).eq(0) ? '0': bg(10000).times(bg(res[4]).div(res[0]))
      const scoreQ2 = bg(res[1]).eq(0) ? '0': bg(20000).times(bg(res[5]).div(res[1]))
      const scoreQ3 = bg(res[2]).eq(0) ? '0': bg(30000).times(bg(res[6]).div(res[2]))
      const scoreQ4 = bg(res[3]).eq(0) ? '0': bg(50000).times(bg(res[7]).div(res[3]))

      return {
        userAddr: accountAddress,
        totalContrib: deriToNatural(
          bg(res[0]).plus(res[1]).plus(res[2]).plus(res[3])
        ).toString(),
        userContrib: deriToNatural(
          bg(res[4]).plus(res[5]).plus(res[6]).plus(res[7])
        ).toString(),
        Q1Contrib: deriToNatural(res[0]).toString(),
        Q2Contrib: deriToNatural(res[1]).toString(),
        Q3Contrib: deriToNatural(res[2]).toString(),
        Q4Contrib: deriToNatural(res[3]).toString(),
        userQ1Contrib: deriToNatural(res[4]).toString(),
        userQ2Contrib: deriToNatural(res[5]).toString(),
        userQ3Contrib: deriToNatural(res[6]).toString(),
        userQ4Contrib: deriToNatural(res[7]).toString(),
        userQ1Point: scoreQ1.toString(),
        userQ2Point: scoreQ2.toString(),
        userQ3Point: scoreQ3.toString(),
        userQ4Point: scoreQ4.toString(),
      };
    },
    args,
    'getUserStakingContribution',
    { userAddr: '', totalContrib: '', userContrib: '' }
  );
};