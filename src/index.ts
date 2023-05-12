import { encrypt as rawEncrypt } from './encrypt';
import { withInitialization } from './init';

export const encrypt = withInitialization(rawEncrypt);
