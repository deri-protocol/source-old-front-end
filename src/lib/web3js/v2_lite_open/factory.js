import { factory } from '../shared/utils/factory'
import { PerpetualPoolLite } from './contract/perpetual_pool'
import { PerpetualPoolLiteManager } from './contract/perpetual_pool_lite_manager'

export const perpetualPoolLiteFactory = factory(PerpetualPoolLite)
export const perpetualPoolLiteManagerFactory = factory(PerpetualPoolLiteManager)
