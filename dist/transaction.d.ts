/**
 * @packageDocumentation
 * @module avalanche-transaction
 */
import { Signature } from 'avalanche-js-crypto';
import { Messenger } from 'avalanche-js-network';
import { TxParams, TxStatus } from './types';
import { TransactionBase } from './transactionBase';
declare class Transaction extends TransactionBase {
    /** @hidden */
    private from;
    /** @hidden */
    private nonce;
    /** @hidden */
    private to;
    /** @hidden */
    private toShardID;
    /** @hidden */
    private gasLimit;
    /** @hidden */
    private gasPrice;
    /** @hidden */
    private data;
    /** @hidden */
    private value;
    /** @hidden */
    private chainId;
    /** @hidden */
    private rawTransaction;
    /** @hidden */
    private unsignedRawTransaction;
    /** @hidden */
    private signature;
    /**
     *
     * @Params
     * ```javascript
     * id:               string;
      from:             string;
      to:               string;
      nonce:            number | string;
      gasLimit:         number | string | BN;
      gasPrice:         number | string | BN;
      shardID:          number | string;
      toShardID:        number | string;
      data:             string;
      value:            number | string | BN;
      chainId:          number;
      rawTransaction:   string;
      unsignedRawTransaction: string;
      signature:        Signature;
      receipt?:         TransasctionReceipt;
     * ```
     */
    constructor(params?: TxParams | any, messenger?: Messenger, txStatus?: TxStatus);
    /**
     *
     * @example
     * ```javascript
     * const unsigned = txn.getRLPUnsigned(txn);
     * console.log(unsigned);
     * ```
     */
    getRLPUnsigned(): [string, any[]];
    getRLPSigned(raw: any[], signature: Signature): string;
    /**
     * @example
     * ```javascript
     * console.log(txn.getRawTransaction());
     * ```
     */
    getRawTransaction(): string;
    /** @hidden */
    recover(rawTransaction: string): Transaction;
    /**
     * get the payload of transaction
     *
     * @example
     * ```
     * const payload = txn.txPayload;
     * console.log(payload);
     * ```
     */
    get txPayload(): {
        from: string;
        to: string;
        shardID: string;
        toShardID: string;
        gas: string;
        gasPrice: string;
        value: string;
        data: string;
        nonce: string;
    };
    /**
     * get transaction params
     *
     * @example
     * ```
     * const txParams = txn.txParams;
     * console.log(txParams)
     * ```
     */
    get txParams(): TxParams;
    /**
     * set the params to the txn
     *
     * @example
     * ```
     * txn.setParams({
     *   to: 'avax1ew56rqrucu6p6n598fmjmnfh8dd4xpg6atne9c',
     *   value: '1200',
     *   gasLimit: '230000',
     *   shardID: 1,
     *   toShardID: 0,
     *   gasPrice: new hmy.utils.Unit('101').asGwei().toWei(),
     *   signature: {
     *     r: '0xd693b532a80fed6392b428604171fb32fdbf953728a3a7ecc7d4062b1652c042',
     *     s: '0x24e9c602ac800b983b035700a14b23f78a253ab762deab5dc27e3555a750b354',
     *     v: 0
     *   },
     * });
     * console.log(txn);
     * ```
     */
    setParams(params: TxParams): void;
    /** @hidden */
    map(fn: any): this;
    /**
     * Check whether the transaction is cross shard
     *
     * @example
     * ```javascript
     * console.log(txn.isCrossShard());
     * ```
     */
    isCrossShard(): boolean;
    /**
     *
     * @example
     * ```
     * txn.sendTransaction().then((value) => {
     *   console.log(value);
     * });
     * ```
     */
    sendTransaction(): Promise<[Transaction, string]>;
    confirm(txHash: string, maxAttempts?: number, interval?: number, shardID?: number | string, toShardID?: number | string): Promise<TransactionBase>;
}
export { Transaction };
