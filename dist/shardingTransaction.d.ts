/**
 * @packageDocumentation
 * @module avalanche-transaction
 * @hidden
 */
import { Messenger } from 'avalanche-js-network';
import { Transaction } from './transaction';
import { TxParams, TxStatus } from './types';
export declare class ShardingTransaction extends Transaction {
    constructor(params?: TxParams | any, messenger?: Messenger, txStatus?: TxStatus);
}
