import {
  isUsedRestOracle,
  mapToSymbol,
  mapToSymbolInternal,
  normalizeOptionSymbol,
  getVolatilitySymbols,
  getNormalizedOptionSymbols,
} from '../config/token';

describe('Token Config', () => {
  test('isUsedRestOracle', () => {
    expect(isUsedRestOracle('AXSUSDT')).toEqual(true);
    expect(isUsedRestOracle('MANAUSDT')).toEqual(true);
    expect(isUsedRestOracle('IBSCDEFI')).toEqual(true);
    expect(isUsedRestOracle('BTCUSD')).toEqual(false);
    expect(isUsedRestOracle('iBSCDEFI')).toEqual(false);
  });
  test('mapToSymbol', () => {
    expect(mapToSymbol('IBSCDEFI')).toEqual('iBSCDEFI');
    expect(mapToSymbol('BTCUSD')).toEqual('BTCUSD');
  });
  test('mapToSymbolInternal', () => {
    expect(mapToSymbolInternal('iBSCDEFI')).toEqual('IBSCDEFI');
    expect(mapToSymbol('BTCUSD')).toEqual('BTCUSD');
  });
  test('normalizeOptionSymbol', () => {
    expect(normalizeOptionSymbol('BTCUSD-20000-C')).toEqual('BTCUSD');
  });
  test('getNormalizedOptionSymbols', () => {
    const input = [
      'BTCUSD-30000-C',
      'BTCUSD-40000-C',
      'BTCUSD-30000-P',
      'BTCUSD-40000-P',
      'ETHUSD-30000-C',
      'ETHUSD-3000-P',
      'BNBUSD-400-C',
      'BNBUSD-400-C',
    ];
    const output = ['BTCUSD', 'ETHUSD', 'BNBUSD'];
    expect(getNormalizedOptionSymbols(input)).toEqual(output);
  });
  test('getVolatilitySymbols', () => {
    const input = [
      'BTCUSD-30000-C',
      'BTCUSD-40000-C',
      'BTCUSD-30000-P',
      'BTCUSD-40000-P',
      'ETHUSD-30000-C',
    ];
    const output = ['VOL-BTCUSD', 'VOL-ETHUSD'];
    expect(getVolatilitySymbols(input)).toEqual(output);
  });
});
