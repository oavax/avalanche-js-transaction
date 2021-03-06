/**
 * @packageDocumentation
 * @module avalanche-transaction
 * @hidden
 */
/// <reference types="bn.js" />
import { BN } from 'avalanche-js-crypto';
import { Messenger, Emitter } from 'avalanche-js-network';
import { TxStatus, TransasctionReceipt } from './types';
import { AbstractTransaction } from './abstractTransaction';
export declare class TransactionBase implements AbstractTransaction {
    static normalizeAddress(address: string): string;
    emitter: Emitter;
    messenger: Messenger;
    txStatus: TxStatus;
    blockNumbers: string[];
    confirmations: number;
    confirmationCheck: number;
    cxStatus: TxStatus;
    cxBlockNumbers: string[];
    cxConfirmations: number;
    cxConfirmationCheck: number;
    receipt?: TransasctionReceipt;
    id: string;
    shardID: number | string;
    constructor(messenger: Messenger, txStatus: TxStatus);
    setMessenger(messenger: Messenger): void;
    setTxStatus(txStatus: TxStatus): void;
    getTxStatus(): TxStatus;
    setCxStatus(cxStatus: TxStatus): void;
    getCxStatus(): TxStatus;
    isInitialized(): boolean;
    isSigned(): boolean;
    isPending(): boolean;
    isRejected(): boolean;
    isConfirmed(): boolean;
    isCxPending(): boolean;
    isCxRejected(): boolean;
    isCxConfirmed(): boolean;
    observed(): Emitter;
    trackTx(txHash: string, shardID: number | string): Promise<boolean>;
    txConfirm(txHash: string, maxAttempts: number, interval: number, shardID: number | string): Promise<TransactionBase>;
    socketConfirm(txHash: string, maxAttempts: number, shardID: number | string): Promise<TransactionBase>;
    emitTransactionHash(transactionHash: string): void;
    emitReceipt(receipt: any): void;
    emitError(error: any): void;
    emitConfirm(data: any): void;
    emitTrack(data: any): void;
    emitCxReceipt(receipt: any): void;
    emitCxConfirm(data: any): void;
    emitCxTrack(data: any): void;
    getBlockNumber(shardID: number | string): Promise<BN>;
    getBlockByNumber(blockNumber: string): Promise<any>;
    cxConfirm(txHash: string, maxAttempts: number, interval: number, toShardID: number | string): Promise<TransactionBase>;
    trackCx(txHash: string, toShardID: number | string): Promise<boolean>;
    socketCxConfirm(txHash: string, maxAttempts: number, toShardID: number | string): Promise<TransactionBase>;
}
