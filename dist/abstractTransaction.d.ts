/**
 * @packageDocumentation
 * @module avalanche-transaction
 * @hidden
 */
import { Messenger } from 'avalanche-js-network';
import { TxStatus } from './types';
export declare abstract class AbstractTransaction {
    abstract setMessenger(messenger: Messenger): void;
    abstract setTxStatus(txStatus: TxStatus): void;
    abstract getTxStatus(): TxStatus;
    abstract isInitialized(): boolean;
    abstract isSigned(): boolean;
    abstract isPending(): boolean;
    abstract isRejected(): boolean;
    abstract isConfirmed(): boolean;
    abstract trackTx(txHash: string, shardID: number | string): Promise<boolean>;
    abstract txConfirm(txHash: string, maxAttempts: number | undefined, interval: number | undefined, shardID: string | number): Promise<any>;
    abstract socketConfirm(txHash: string, maxAttempts: number, shardID: number | string): Promise<any>;
    abstract getBlockNumber(shardID: number | string): Promise<any>;
    abstract getBlockByNumber(blockNumber: string): Promise<any>;
}
