import {
  PerpetualPool,
  PerpetualPoolRouter,
  BToken,
  LToken,
  PToken,
} from '../../contract';
import { factory } from '../shared.js';

export const perpetualPoolFactory = factory(PerpetualPool)

export const perpetualPoolRouterFactory = factory(PerpetualPoolRouter)

export const bTokenFactory = factory(BToken)

export const lTokenFactory = factory(LToken)

export const pTokenFactory = factory(PToken)