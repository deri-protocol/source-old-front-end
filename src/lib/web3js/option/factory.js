import { factory } from '../shared';
import { EverlastingOption } from './contract/everlasting_option';
import { EverlastingOptionViewer } from './contract/everlasting_option_viewer';
import { LTokenOption } from './contract/l_token_option';
import { PTokenOption } from './contract/p_token_option';

export const everlastingOptionFactory = factory(EverlastingOption);
export const everlastingOptionViewerFactory = factory(EverlastingOptionViewer);
export const lTokenOptionFactory = factory(LTokenOption);
export const pTokenOptionFactory = factory(PTokenOption);