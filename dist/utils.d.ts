/**
 * @packageDocumentation
 * @module avalanche-transaction
 * @hidden
 */
import { Signature } from 'avalanche-js-crypto';
import { Messenger } from 'avalanche-js-network';
import { TxParams } from './types';
import { Transaction } from './transaction';
export declare const transactionFields: ({
    name: string;
    length: number;
    fix: boolean;
    transform?: undefined;
} | {
    name: string;
    length: number;
    fix: boolean;
    transform: string;
} | {
    name: string;
    fix: boolean;
    length?: undefined;
    transform?: undefined;
})[];
export declare const transactionFieldsETH: ({
    name: string;
    length: number;
    fix: boolean;
    transform?: undefined;
} | {
    name: string;
    length: number;
    fix: boolean;
    transform: string;
} | {
    name: string;
    fix: boolean;
    length?: undefined;
    transform?: undefined;
})[];
export declare const handleNumber: (value: string) => string;
export declare const handleAddress: (value: string) => string;
export declare const recover: (rawTransaction: string) => TxParams;
export declare const recoverETH: (rawTransaction: string) => TxParams;
export declare const sleep: (ms: number) => Promise<unknown>;
export declare enum TransactionEvents {
    transactionHash = "transactionHash",
    error = "error",
    confirmation = "confirmation",
    receipt = "receipt",
    track = "track",
    cxConfirmation = "cxConfirmation",
    cxReceipt = "cxReceipt",
    cxTrack = "cxTrack"
}
export declare const defaultMessenger: Messenger;
export declare const RLPSign: (transaction: Transaction, prv: string) => [Signature, string];
