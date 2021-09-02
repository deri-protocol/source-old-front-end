import { factory } from '../shared/utils/factory'
import { PerpetualPoolLite } from './contract/perpetual_pool'
import { PerpetualPoolLiteManager } from './contract/perpetual_pool_lite_manager'
import { PerpetualPoolLiteViewer } from './contract/perpetual_pool_lite_viewer'

export const perpetualPoolLiteFactory = factory(PerpetualPoolLite)
export const perpetualPoolLiteViewerFactory = factory(PerpetualPoolLiteViewer)
export const perpetualPoolLiteManagerFactory = factory(PerpetualPoolLiteManager)
