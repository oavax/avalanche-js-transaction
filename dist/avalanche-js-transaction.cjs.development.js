'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var avalancheJsCrypto = require('avalanche-js-crypto');
var _regeneratorRuntime = _interopDefault(require('regenerator-runtime'));
var avalancheJsUtils = require('avalanche-js-utils');
var avalancheJsNetwork = require('avalanche-js-network');

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;

  _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

/**
 # avalanche-js-transaction

This package provides a collection of apis to create, sign/send transaction, and receive confirm/receipt.

## Installation

```
npm install avalanche-js-transaction
```

## Usage

Create a Avalanche instance connecting to testnet

```javascript
* const { Avalanche } = require('avalanche-js-core');
* const {
*   ChainID,
*   ChainType,
*   hexToNumber,
*   numberToHex,
*   fromWei,
*   Units,
*   Unit,
* } = require('avalanche-js-utils');

* const hmy = new Avalanche(
*     'https://api.s0.b.hmny.io/',
*     {
*         chainType: ChainType.Avalanche,
*         chainId: ChainID.HmyTestnet,
*     },
* );
```

Creating a new transaction using parameters
```javascript
* const txn = hmy.transactions.newTx({
*   to: 'avax166axnkjmghkf3df7xfvd0hn4dft8kemrza4cd2',
*   value: new Unit(1).asAVAX().toWei(),
*   // gas limit, you can use string
*   gasLimit: '21000',
*   // send token from shardID
*   shardID: 0,
*   // send token to toShardID
*   toShardID: 0,
*   // gas Price, you can use Unit class, and use Gwei, then remember to use toWei(), which will be transformed to BN
*   gasPrice: new hmy.utils.Unit('1').asGwei().toWei(),
* });
```

Recovering transaction from raw transaction hash
```javascript
* const raw = '0xf86d21843b9aca00825208808094d6ba69da5b45ec98b53e3258d7de756a567b6763880de0b6b3a76400008028a0da8887719f377401963407fc1d82d2ab52404600cf7bea37c27bd2dfd7c86aaaa03c405b0843394442b303256a804bde835821a8a77bd88a2ced9ffdc8b0a409e9';
* const tx = hmy.transactions.recover(raw);
```

Getting the RLP encoding of a transaction (rawTransaction), along with raw transaction field values that were encoded
```javascript
* const [encoded, raw] = txn.getRLPUnsigned()
```

Sign the transaction using a wallet and send the transaction, wait for confirmation and print receipt
```javascript
* // key corresponds to avax103q7qe5t2505lypvltkqtddaef5tzfxwsse4z7, only has testnet balance
* hmy.wallet.addByPrivateKey('45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e');

* hmy.wallet.signTransaction(txn).then(signedTxn => {
*   signedTxn.sendTransaction().then(([tx, hash]) => {
*     console.log('tx hash: ' + hash);
*     signedTxn.confirm(hash).then(response => {
*       console.log(response.receipt);
*     });
*   });
* });
```

Asynchronous transaction sign, send, and confirm
```javascript
* async function transfer() {
*   hmy.wallet.addByPrivateKey('45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e');

*   const signedTxn = await hmy.wallet.signTransaction(txn);
*   signedTxn
*     .observed()
*     .on('transactionHash', (txnHash) => {
*       console.log('');
*       console.log('--- hash ---');
*       console.log('');
*       console.log(txnHash);
*       console.log('');
*     })
*     .on('receipt', (receipt) => {
*       console.log('');
*       console.log('--- receipt ---');
*       console.log('');
*       console.log(receipt);
*       console.log('');
*     })
*     .on('cxReceipt', (receipt) => {
*       console.log('');
*       console.log('--- cxReceipt ---');
*       console.log('');
*       console.log(receipt);
*       console.log('');
*     })
*     .on('error', (error) => {
*       console.log('');
*       console.log('--- error ---');
*       console.log('');
*       console.log(error);
*       console.log('');
*     });

*   const [sentTxn, txnHash] = await signedTxn.sendTransaction();

*   const confiremdTxn = await sentTxn.confirm(txnHash);

*   // if the transactino is cross-shard transaction
*   if (!confiremdTxn.isCrossShard()) {
*     if (confiremdTxn.isConfirmed()) {
*       console.log('--- Result ---');
*       console.log('');
*       console.log('Normal transaction');
*       console.log(`${txnHash} is confirmed`);
*       console.log('');
*       console.log('please see detail in explorer:');
*       console.log('');
*       console.log('https://explorer.testnet.avalanche.avax/#/tx/' + txnHash);
*       console.log('');
*       process.exit();
*     }
*   }
*   if (confiremdTxn.isConfirmed() && confiremdTxn.isCxConfirmed()) {
*     console.log('--- Result ---');
*     console.log('');
*     console.log('Cross-Shard transaction');
*     console.log(`${txnHash} is confirmed`);
*     console.log('');
*     console.log('please see detail in explorer:');
*     console.log('');
*     console.log('https://explorer.testnet.avalanche.avax/#/tx/' + txnHash);
*     console.log('');
*     process.exit();
*   }
* }
* transfer();
```
 *
 * @packageDocumentation
 * @module avalanche-transaction
 */

(function (TxStatus) {
  TxStatus["NONE"] = "NONE";
  TxStatus["INTIALIZED"] = "INITIALIZED";
  TxStatus["SIGNED"] = "SIGNED";
  TxStatus["PENDING"] = "PENDING";
  TxStatus["CONFIRMED"] = "CONFIRMED";
  TxStatus["REJECTED"] = "REJECTED";
})(exports.TxStatus || (exports.TxStatus = {}));

var transactionFields = [{
  name: 'nonce',
  length: 32,
  fix: false
}, {
  name: 'gasPrice',
  length: 32,
  fix: false,
  transform: 'hex'
}, {
  name: 'gasLimit',
  length: 32,
  fix: false,
  transform: 'hex'
}, {
  name: 'shardID',
  length: 16,
  fix: false
}, // recover it after main repo fix
{
  name: 'toShardID',
  length: 16,
  fix: false
}, {
  name: 'to',
  length: 20,
  fix: true
}, {
  name: 'value',
  length: 32,
  fix: false,
  transform: 'hex'
}, {
  name: 'data',
  fix: false
}];
var transactionFieldsETH = [{
  name: 'nonce',
  length: 32,
  fix: false
}, {
  name: 'gasPrice',
  length: 32,
  fix: false,
  transform: 'hex'
}, {
  name: 'gasLimit',
  length: 32,
  fix: false,
  transform: 'hex'
}, {
  name: 'to',
  length: 20,
  fix: true
}, {
  name: 'value',
  length: 32,
  fix: false,
  transform: 'hex'
}, {
  name: 'data',
  fix: false
}];
var handleNumber = function handleNumber(value) {
  if (avalancheJsUtils.isHex(value) && value === '0x') {
    return avalancheJsUtils.hexToNumber('0x00');
  } else if (avalancheJsUtils.isHex(value) && value !== '0x') {
    return avalancheJsUtils.hexToNumber(value);
  } else {
    return value;
  }
};
var handleAddress = function handleAddress(value) {
  if (value === '0x') {
    return '0x';
  } else if (avalancheJsUtils.isAddress(value)) {
    return value;
  } else {
    return '0x';
  }
};
var recover = function recover(rawTransaction) {
  var transaction = avalancheJsCrypto.decode(rawTransaction);

  if (transaction.length !== 11 && transaction.length !== 8) {
    throw new Error('invalid rawTransaction');
  }

  var tx = {
    id: '0x',
    from: '0x',
    rawTransaction: '0x',
    unsignedRawTransaction: '0x',
    nonce: new avalancheJsCrypto.BN(avalancheJsUtils.strip0x(handleNumber(transaction[0]))).toNumber(),
    gasPrice: new avalancheJsCrypto.BN(avalancheJsUtils.strip0x(handleNumber(transaction[1]))),
    gasLimit: new avalancheJsCrypto.BN(avalancheJsUtils.strip0x(handleNumber(transaction[2]))),
    shardID: new avalancheJsCrypto.BN(avalancheJsUtils.strip0x(handleNumber(transaction[3]))).toNumber(),
    toShardID: new avalancheJsCrypto.BN(avalancheJsUtils.strip0x(handleNumber(transaction[4]))).toNumber(),
    to: handleAddress(transaction[5]) !== '0x' ? avalancheJsCrypto.getAddress(handleAddress(transaction[5])).checksum : '0x',
    value: new avalancheJsCrypto.BN(avalancheJsUtils.strip0x(handleNumber(transaction[6]))),
    data: transaction[7],
    chainId: 0,
    signature: {
      r: '',
      s: '',
      recoveryParam: 0,
      v: 0
    }
  }; // Legacy unsigned transaction

  if (transaction.length === 8) {
    tx.unsignedRawTransaction = rawTransaction;
    return tx;
  }

  try {
    tx.signature.v = new avalancheJsCrypto.BN(avalancheJsUtils.strip0x(handleNumber(transaction[8]))).toNumber();
  } catch (error) {
    throw error;
  }

  tx.signature.r = avalancheJsCrypto.hexZeroPad(transaction[9], 32);
  tx.signature.s = avalancheJsCrypto.hexZeroPad(transaction[10], 32);

  if (new avalancheJsCrypto.BN(avalancheJsUtils.strip0x(handleNumber(tx.signature.r))).isZero() && new avalancheJsCrypto.BN(avalancheJsUtils.strip0x(handleNumber(tx.signature.s))).isZero()) {
    // EIP-155 unsigned transaction
    tx.chainId = tx.signature.v;
    tx.signature.v = 0;
  } else {
    // Signed Tranasaction
    tx.chainId = Math.floor((tx.signature.v - 35) / 2);

    if (tx.chainId < 0) {
      tx.chainId = 0;
    }

    var recoveryParam = tx.signature.v - 27;
    var raw = transaction.slice(0, 8);

    if (tx.chainId !== 0) {
      raw.push(avalancheJsCrypto.hexlify(tx.chainId));
      raw.push('0x');
      raw.push('0x');
      recoveryParam -= tx.chainId * 2 + 8;
    }

    var digest = avalancheJsCrypto.keccak256(avalancheJsCrypto.encode(raw));

    try {
      var recoveredFrom = avalancheJsCrypto.recoverAddress(digest, {
        r: avalancheJsCrypto.hexlify(tx.signature.r),
        s: avalancheJsCrypto.hexlify(tx.signature.s),
        recoveryParam: recoveryParam
      });
      tx.from = recoveredFrom === '0x' ? '0x' : avalancheJsCrypto.getAddress(recoveredFrom).checksum;
    } catch (error) {
      throw error;
    }

    tx.rawTransaction = rawTransaction;
    tx.id = avalancheJsCrypto.keccak256(rawTransaction);
  }

  return tx;
};
var recoverETH = function recoverETH(rawTransaction) {
  var transaction = avalancheJsCrypto.decode(rawTransaction);

  if (transaction.length !== 9 && transaction.length !== 6) {
    throw new Error('invalid rawTransaction');
  }

  var tx = {
    id: '0x',
    from: '0x',
    rawTransaction: '0x',
    unsignedRawTransaction: '0x',
    nonce: new avalancheJsCrypto.BN(avalancheJsUtils.strip0x(handleNumber(transaction[0]))).toNumber(),
    gasPrice: new avalancheJsCrypto.BN(avalancheJsUtils.strip0x(handleNumber(transaction[1]))),
    gasLimit: new avalancheJsCrypto.BN(avalancheJsUtils.strip0x(handleNumber(transaction[2]))),
    shardID: 0,
    toShardID: 0,
    to: handleAddress(transaction[3]) !== '0x' ? avalancheJsCrypto.getAddress(handleAddress(transaction[3])).checksum : '0x',
    value: new avalancheJsCrypto.BN(avalancheJsUtils.strip0x(handleNumber(transaction[4]))),
    data: transaction[5],
    chainId: 0,
    signature: {
      r: '',
      s: '',
      recoveryParam: 0,
      v: 0
    }
  }; // Legacy unsigned transaction

  if (transaction.length === 6) {
    tx.unsignedRawTransaction = rawTransaction;
    return tx;
  }

  try {
    tx.signature.v = new avalancheJsCrypto.BN(avalancheJsUtils.strip0x(handleNumber(transaction[6]))).toNumber();
  } catch (error) {
    throw error;
  }

  tx.signature.r = avalancheJsCrypto.hexZeroPad(transaction[7], 32);
  tx.signature.s = avalancheJsCrypto.hexZeroPad(transaction[8], 32);

  if (new avalancheJsCrypto.BN(avalancheJsUtils.strip0x(handleNumber(tx.signature.r))).isZero() && new avalancheJsCrypto.BN(avalancheJsUtils.strip0x(handleNumber(tx.signature.s))).isZero()) {
    // EIP-155 unsigned transaction
    tx.chainId = tx.signature.v;
    tx.signature.v = 0;
  } else {
    // Signed Tranasaction
    tx.chainId = Math.floor((tx.signature.v - 35) / 2);

    if (tx.chainId < 0) {
      tx.chainId = 0;
    }

    var recoveryParam = tx.signature.v - 27;
    var raw = transaction.slice(0, 6);

    if (tx.chainId !== 0) {
      raw.push(avalancheJsCrypto.hexlify(tx.chainId));
      raw.push('0x');
      raw.push('0x');
      recoveryParam -= tx.chainId * 2 + 8;
    }

    var digest = avalancheJsCrypto.keccak256(avalancheJsCrypto.encode(raw));

    try {
      var recoveredFrom = avalancheJsCrypto.recoverAddress(digest, {
        r: avalancheJsCrypto.hexlify(tx.signature.r),
        s: avalancheJsCrypto.hexlify(tx.signature.s),
        recoveryParam: recoveryParam
      });
      tx.from = recoveredFrom === '0x' ? '0x' : avalancheJsCrypto.getAddress(recoveredFrom).checksum;
    } catch (error) {
      throw error;
    }

    tx.rawTransaction = rawTransaction;
    tx.id = avalancheJsCrypto.keccak256(rawTransaction);
  }

  return tx;
};
var sleep = /*#__PURE__*/function () {
  var _ref = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(ms) {
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", new Promise(function (resolve) {
              setTimeout(function () {
                return resolve();
              }, ms);
            }));

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function sleep(_x) {
    return _ref.apply(this, arguments);
  };
}();

(function (TransactionEvents) {
  TransactionEvents["transactionHash"] = "transactionHash";
  TransactionEvents["error"] = "error";
  TransactionEvents["confirmation"] = "confirmation";
  TransactionEvents["receipt"] = "receipt";
  TransactionEvents["track"] = "track";
  TransactionEvents["cxConfirmation"] = "cxConfirmation";
  TransactionEvents["cxReceipt"] = "cxReceipt";
  TransactionEvents["cxTrack"] = "cxTrack";
})(exports.TransactionEvents || (exports.TransactionEvents = {}));

var defaultMessenger = /*#__PURE__*/new avalancheJsNetwork.Messenger( /*#__PURE__*/new avalancheJsNetwork.HttpProvider('http://localhost:9500'), avalancheJsUtils.ChainType.Avalanche);
var RLPSign = function RLPSign(transaction, prv) {
  var _transaction$getRLPUn = transaction.getRLPUnsigned(),
      unsignedRawTransaction = _transaction$getRLPUn[0],
      raw = _transaction$getRLPUn[1];

  var regroup = _extends({}, transaction.txParams, {
    unsignedRawTransaction: unsignedRawTransaction
  });

  transaction.setParams(regroup);
  var signature = avalancheJsCrypto.sign(avalancheJsCrypto.keccak256(unsignedRawTransaction), prv);
  var signed = transaction.getRLPSigned(raw, signature);
  return [signature, signed];
};

var TransactionBase = /*#__PURE__*/function () {
  function TransactionBase(messenger, txStatus) {
    this.blockNumbers = [];
    this.confirmations = 0;
    this.confirmationCheck = 0;
    this.cxStatus = exports.TxStatus.INTIALIZED;
    this.cxBlockNumbers = [];
    this.cxConfirmations = 0;
    this.cxConfirmationCheck = 0;
    this.messenger = messenger;
    this.txStatus = txStatus;
    this.emitter = new avalancheJsNetwork.Emitter();
    this.id = '0x';
    this.shardID = this.messenger.currentShard;
  }

  TransactionBase.normalizeAddress = function normalizeAddress(address) {
    if (address === '0x') {
      return '0x';
    } else if (avalancheJsCrypto.AvalancheAddress.isValidChecksum(address) || avalancheJsCrypto.AvalancheAddress.isValidBech32(address) || avalancheJsCrypto.AvalancheAddress.isValidBech32TestNet(address)) {
      return avalancheJsCrypto.getAddress(address).checksum;
    } else {
      throw new Error("Address format is not supported");
    }
  };

  var _proto = TransactionBase.prototype;

  _proto.setMessenger = function setMessenger(messenger) {
    this.messenger = messenger;
  };

  _proto.setTxStatus = function setTxStatus(txStatus) {
    this.txStatus = txStatus;
  };

  _proto.getTxStatus = function getTxStatus() {
    return this.txStatus;
  };

  _proto.setCxStatus = function setCxStatus(cxStatus) {
    this.cxStatus = cxStatus;
  };

  _proto.getCxStatus = function getCxStatus() {
    return this.cxStatus;
  } // get status
  ;

  _proto.isInitialized = function isInitialized() {
    return this.getTxStatus() === exports.TxStatus.INTIALIZED;
  };

  _proto.isSigned = function isSigned() {
    return this.getTxStatus() === exports.TxStatus.SIGNED;
  };

  _proto.isPending = function isPending() {
    return this.getTxStatus() === exports.TxStatus.PENDING;
  };

  _proto.isRejected = function isRejected() {
    return this.getTxStatus() === exports.TxStatus.REJECTED;
  };

  _proto.isConfirmed = function isConfirmed() {
    return this.getTxStatus() === exports.TxStatus.CONFIRMED;
  };

  _proto.isCxPending = function isCxPending() {
    return this.getCxStatus() === exports.TxStatus.PENDING;
  };

  _proto.isCxRejected = function isCxRejected() {
    return this.getCxStatus() === exports.TxStatus.REJECTED;
  };

  _proto.isCxConfirmed = function isCxConfirmed() {
    return this.getCxStatus() === exports.TxStatus.CONFIRMED;
  };

  _proto.observed = function observed() {
    return this.emitter;
  };

  _proto.trackTx = /*#__PURE__*/function () {
    var _trackTx = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(txHash, shardID) {
      var res, currentBlock, _currentBlock;

      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (this.messenger) {
                _context.next = 2;
                break;
              }

              throw new Error('Messenger not found');

            case 2:
              _context.next = 4;
              return this.messenger.send(avalancheJsNetwork.RPCMethod.GetTransactionReceipt, txHash, this.messenger.chainType, typeof shardID === 'string' ? Number.parseInt(shardID, 10) : shardID);

            case 4:
              res = _context.sent;

              if (!(res.isResult() && res.result !== null)) {
                _context.next = 24;
                break;
              }

              this.receipt = res.result;
              this.emitReceipt(this.receipt);
              this.id = res.result.transactionHash;
              this.confirmations += 1;

              if (!this.receipt) {
                _context.next = 15;
                break;
              }

              if (this.receipt.status && this.receipt.status === '0x1') {
                this.receipt.byzantium = true;
                this.txStatus = exports.TxStatus.CONFIRMED;
              } else if (this.receipt.status && this.receipt.status === '0x0') {
                this.receipt.byzantium = true;
                this.txStatus = exports.TxStatus.REJECTED;
              } else if (this.receipt.status === undefined && this.receipt.root) {
                this.receipt.byzantium = false;
                this.txStatus = exports.TxStatus.CONFIRMED;
              }

              return _context.abrupt("return", true);

            case 15:
              this.txStatus = exports.TxStatus.PENDING;
              _context.next = 18;
              return this.getBlockNumber(shardID);

            case 18:
              currentBlock = _context.sent;
              this.blockNumbers.push('0x' + currentBlock.toString('hex'));
              this.confirmationCheck += 1;
              return _context.abrupt("return", false);

            case 22:
              _context.next = 31;
              break;

            case 24:
              this.txStatus = exports.TxStatus.PENDING;
              _context.next = 27;
              return this.getBlockNumber(shardID);

            case 27:
              _currentBlock = _context.sent;
              this.blockNumbers.push('0x' + _currentBlock.toString('hex'));
              this.confirmationCheck += 1;
              return _context.abrupt("return", false);

            case 31:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function trackTx(_x, _x2) {
      return _trackTx.apply(this, arguments);
    }

    return trackTx;
  }();

  _proto.txConfirm = /*#__PURE__*/function () {
    var _txConfirm = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(txHash, maxAttempts, interval, shardID) {
      var oldBlock, checkBlock, attempt, newBlock, nextBlock, result;
      return _regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (maxAttempts === void 0) {
                maxAttempts = 20;
              }

              if (interval === void 0) {
                interval = 1000;
              }

              if (!(this.messenger.provider instanceof avalancheJsNetwork.HttpProvider)) {
                _context2.next = 44;
                break;
              }

              this.txStatus = exports.TxStatus.PENDING;
              _context2.next = 6;
              return this.getBlockNumber(shardID);

            case 6:
              oldBlock = _context2.sent;
              checkBlock = oldBlock;
              attempt = 0;

            case 9:
              if (!(attempt < maxAttempts)) {
                _context2.next = 39;
                break;
              }

              _context2.prev = 10;
              _context2.next = 13;
              return this.getBlockNumber(shardID);

            case 13:
              newBlock = _context2.sent;
              // TODO: this is super ugly, must be a better way doing this
              nextBlock = checkBlock.add(new avalancheJsCrypto.BN(attempt === 0 ? attempt : 1));

              if (!newBlock.gte(nextBlock)) {
                _context2.next = 25;
                break;
              }

              checkBlock = newBlock;
              this.emitTrack({
                txHash: txHash,
                attempt: attempt,
                currentBlock: checkBlock.toString(),
                shardID: shardID
              });
              _context2.next = 20;
              return this.trackTx(txHash, shardID);

            case 20:
              if (!_context2.sent) {
                _context2.next = 23;
                break;
              }

              this.emitConfirm(this.txStatus);
              return _context2.abrupt("return", this);

            case 23:
              _context2.next = 26;
              break;

            case 25:
              attempt = attempt - 1 >= 0 ? attempt - 1 : 0;

            case 26:
              _context2.next = 33;
              break;

            case 28:
              _context2.prev = 28;
              _context2.t0 = _context2["catch"](10);
              this.txStatus = exports.TxStatus.REJECTED;
              this.emitConfirm(this.txStatus);
              throw _context2.t0;

            case 33:
              if (!(attempt + 1 < maxAttempts)) {
                _context2.next = 36;
                break;
              }

              _context2.next = 36;
              return sleep(interval);

            case 36:
              attempt += 1;
              _context2.next = 9;
              break;

            case 39:
              this.txStatus = exports.TxStatus.REJECTED;
              this.emitConfirm(this.txStatus);
              throw new Error("The transaction is still not confirmed after " + maxAttempts + " attempts.");

            case 44:
              _context2.prev = 44;
              _context2.next = 47;
              return this.trackTx(txHash, shardID);

            case 47:
              if (!_context2.sent) {
                _context2.next = 52;
                break;
              }

              this.emitConfirm(this.txStatus);
              return _context2.abrupt("return", this);

            case 52:
              _context2.next = 54;
              return this.socketConfirm(txHash, maxAttempts, shardID);

            case 54:
              result = _context2.sent;
              return _context2.abrupt("return", result);

            case 56:
              _context2.next = 63;
              break;

            case 58:
              _context2.prev = 58;
              _context2.t1 = _context2["catch"](44);
              this.txStatus = exports.TxStatus.REJECTED;
              this.emitConfirm(this.txStatus);
              throw new Error("The transaction is still not confirmed after " + maxAttempts * interval + " mil seconds.");

            case 63:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this, [[10, 28], [44, 58]]);
    }));

    function txConfirm(_x3, _x4, _x5, _x6) {
      return _txConfirm.apply(this, arguments);
    }

    return txConfirm;
  }();

  _proto.socketConfirm = function socketConfirm(txHash, maxAttempts, shardID) {
    var _this = this;

    if (maxAttempts === void 0) {
      maxAttempts = 20;
    }

    return new Promise(function (resolve, reject) {
      var newHeads = Promise.resolve(new avalancheJsNetwork.NewHeaders(_this.messenger, typeof shardID === 'string' ? Number.parseInt(shardID, 10) : shardID));
      newHeads.then(function (p) {
        p.onData( /*#__PURE__*/function () {
          var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3(data) {
            var blockNumber;
            return _regeneratorRuntime.wrap(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    blockNumber = _this.messenger.chainPrefix === 'hmy' ? data.params.result.Header.number : data.params.result.number;

                    _this.emitTrack({
                      txHash: txHash,
                      attempt: _this.confirmationCheck,
                      currentBlock: avalancheJsUtils.hexToNumber(blockNumber),
                      shardID: shardID
                    });

                    if (_this.blockNumbers.includes(blockNumber)) {
                      _context3.next = 18;
                      break;
                    }

                    _context3.next = 5;
                    return _this.trackTx(txHash, shardID);

                  case 5:
                    if (!_context3.sent) {
                      _context3.next = 12;
                      break;
                    }

                    _this.emitConfirm(_this.txStatus);

                    _context3.next = 9;
                    return p.unsubscribe();

                  case 9:
                    resolve(_this);
                    _context3.next = 18;
                    break;

                  case 12:
                    if (!(_this.confirmationCheck === maxAttempts)) {
                      _context3.next = 18;
                      break;
                    }

                    _this.txStatus = exports.TxStatus.REJECTED;

                    _this.emitConfirm(_this.txStatus);

                    _context3.next = 17;
                    return p.unsubscribe();

                  case 17:
                    resolve(_this);

                  case 18:
                  case "end":
                    return _context3.stop();
                }
              }
            }, _callee3);
          }));

          return function (_x7) {
            return _ref.apply(this, arguments);
          };
        }()).onError( /*#__PURE__*/function () {
          var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee4(error) {
            return _regeneratorRuntime.wrap(function _callee4$(_context4) {
              while (1) {
                switch (_context4.prev = _context4.next) {
                  case 0:
                    _this.txStatus = exports.TxStatus.REJECTED;

                    _this.emitConfirm(_this.txStatus);

                    _this.emitError(error);

                    _context4.next = 5;
                    return p.unsubscribe();

                  case 5:
                    reject(error);

                  case 6:
                  case "end":
                    return _context4.stop();
                }
              }
            }, _callee4);
          }));

          return function (_x8) {
            return _ref2.apply(this, arguments);
          };
        }());
      });
    });
  };

  _proto.emitTransactionHash = function emitTransactionHash(transactionHash) {
    this.emitter.emit(exports.TransactionEvents.transactionHash, transactionHash);
  };

  _proto.emitReceipt = function emitReceipt(receipt) {
    this.emitter.emit(exports.TransactionEvents.receipt, receipt);
  };

  _proto.emitError = function emitError(error) {
    this.emitter.emit(exports.TransactionEvents.error, error);
  };

  _proto.emitConfirm = function emitConfirm(data) {
    this.emitter.emit(exports.TransactionEvents.confirmation, data);
  };

  _proto.emitTrack = function emitTrack(data) {
    this.emitter.emit(exports.TransactionEvents.track, data);
  };

  _proto.emitCxReceipt = function emitCxReceipt(receipt) {
    this.emitter.emit(exports.TransactionEvents.cxReceipt, receipt);
  };

  _proto.emitCxConfirm = function emitCxConfirm(data) {
    this.emitter.emit(exports.TransactionEvents.cxConfirmation, data);
  };

  _proto.emitCxTrack = function emitCxTrack(data) {
    this.emitter.emit(exports.TransactionEvents.cxTrack, data);
  };

  _proto.getBlockNumber = /*#__PURE__*/function () {
    var _getBlockNumber = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee5(shardID) {
      var currentBlock;
      return _regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.prev = 0;
              _context5.next = 3;
              return this.messenger.send(avalancheJsNetwork.RPCMethod.BlockNumber, [], this.messenger.chainPrefix, typeof shardID === 'string' ? Number.parseInt(shardID, 10) : shardID);

            case 3:
              currentBlock = _context5.sent;

              if (!currentBlock.isError()) {
                _context5.next = 6;
                break;
              }

              throw currentBlock.message;

            case 6:
              return _context5.abrupt("return", new avalancheJsCrypto.BN(currentBlock.result.replace('0x', ''), 'hex'));

            case 9:
              _context5.prev = 9;
              _context5.t0 = _context5["catch"](0);
              throw _context5.t0;

            case 12:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, this, [[0, 9]]);
    }));

    function getBlockNumber(_x9) {
      return _getBlockNumber.apply(this, arguments);
    }

    return getBlockNumber;
  }();

  _proto.getBlockByNumber = /*#__PURE__*/function () {
    var _getBlockByNumber = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee6(blockNumber) {
      var block;
      return _regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.prev = 0;
              _context6.next = 3;
              return this.messenger.send(avalancheJsNetwork.RPCMethod.GetBlockByNumber, [blockNumber, true], this.messenger.chainPrefix, typeof this.shardID === 'string' ? Number.parseInt(this.shardID, 10) : this.shardID);

            case 3:
              block = _context6.sent;

              if (!block.isError()) {
                _context6.next = 6;
                break;
              }

              throw block.message;

            case 6:
              return _context6.abrupt("return", block.result);

            case 9:
              _context6.prev = 9;
              _context6.t0 = _context6["catch"](0);
              throw _context6.t0;

            case 12:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6, this, [[0, 9]]);
    }));

    function getBlockByNumber(_x10) {
      return _getBlockByNumber.apply(this, arguments);
    }

    return getBlockByNumber;
  }();

  _proto.cxConfirm = /*#__PURE__*/function () {
    var _cxConfirm = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee7(txHash, maxAttempts, interval, toShardID) {
      var oldBlock, checkBlock, attempt, newBlock, nextBlock, result;
      return _regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              if (maxAttempts === void 0) {
                maxAttempts = 20;
              }

              if (interval === void 0) {
                interval = 1000;
              }

              if (!(this.messenger.provider instanceof avalancheJsNetwork.HttpProvider)) {
                _context7.next = 43;
                break;
              }

              _context7.next = 5;
              return this.getBlockNumber(toShardID);

            case 5:
              oldBlock = _context7.sent;
              checkBlock = oldBlock;
              attempt = 0;

            case 8:
              if (!(attempt < maxAttempts)) {
                _context7.next = 38;
                break;
              }

              _context7.prev = 9;
              _context7.next = 12;
              return this.getBlockNumber(toShardID);

            case 12:
              newBlock = _context7.sent;
              // TODO: this is super ugly, must be a better way doing this
              nextBlock = checkBlock.add(new avalancheJsCrypto.BN(attempt === 0 ? attempt : 1));

              if (!newBlock.gte(nextBlock)) {
                _context7.next = 24;
                break;
              }

              checkBlock = newBlock;
              this.emitCxTrack({
                txHash: txHash,
                attempt: attempt,
                currentBlock: checkBlock.toString(),
                toShardID: toShardID
              });
              _context7.next = 19;
              return this.trackCx(txHash, toShardID);

            case 19:
              if (!_context7.sent) {
                _context7.next = 22;
                break;
              }

              this.emitCxConfirm(this.cxStatus);
              return _context7.abrupt("return", this);

            case 22:
              _context7.next = 25;
              break;

            case 24:
              attempt = attempt - 1 >= 0 ? attempt - 1 : 0;

            case 25:
              _context7.next = 32;
              break;

            case 27:
              _context7.prev = 27;
              _context7.t0 = _context7["catch"](9);
              this.cxStatus = exports.TxStatus.REJECTED;
              this.emitCxConfirm(this.cxStatus);
              throw _context7.t0;

            case 32:
              if (!(attempt + 1 < maxAttempts)) {
                _context7.next = 35;
                break;
              }

              _context7.next = 35;
              return sleep(interval);

            case 35:
              attempt += 1;
              _context7.next = 8;
              break;

            case 38:
              this.cxStatus = exports.TxStatus.REJECTED;
              this.emitCxConfirm(this.cxStatus);
              throw new Error("The transaction is still not confirmed after " + maxAttempts + " attempts.");

            case 43:
              _context7.prev = 43;
              _context7.next = 46;
              return this.trackCx(txHash, toShardID);

            case 46:
              if (!_context7.sent) {
                _context7.next = 51;
                break;
              }

              this.emitCxConfirm(this.cxStatus);
              return _context7.abrupt("return", this);

            case 51:
              _context7.next = 53;
              return this.socketCxConfirm(txHash, maxAttempts, toShardID);

            case 53:
              result = _context7.sent;
              return _context7.abrupt("return", result);

            case 55:
              _context7.next = 62;
              break;

            case 57:
              _context7.prev = 57;
              _context7.t1 = _context7["catch"](43);
              this.cxStatus = exports.TxStatus.REJECTED;
              this.emitCxConfirm(this.cxStatus);
              throw new Error("The transaction is still not confirmed after " + maxAttempts * interval + " mil seconds.");

            case 62:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7, this, [[9, 27], [43, 57]]);
    }));

    function cxConfirm(_x11, _x12, _x13, _x14) {
      return _cxConfirm.apply(this, arguments);
    }

    return cxConfirm;
  }();

  _proto.trackCx = /*#__PURE__*/function () {
    var _trackCx = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee8(txHash, toShardID) {
      var res, currentBlock;
      return _regeneratorRuntime.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              if (this.messenger) {
                _context8.next = 2;
                break;
              }

              throw new Error('Messenger not found');

            case 2:
              _context8.next = 4;
              return this.messenger.send(avalancheJsNetwork.RPCMethod.GetCXReceiptByHash, txHash, this.messenger.chainPrefix, typeof toShardID === 'string' ? Number.parseInt(toShardID, 10) : toShardID);

            case 4:
              res = _context8.sent;

              if (!(res.isResult() && res.result !== null)) {
                _context8.next = 11;
                break;
              }

              this.emitCxReceipt(res.result);
              this.cxStatus = exports.TxStatus.CONFIRMED;
              return _context8.abrupt("return", true);

            case 11:
              _context8.next = 13;
              return this.getBlockNumber(toShardID);

            case 13:
              currentBlock = _context8.sent;
              this.cxBlockNumbers.push('0x' + currentBlock.toString('hex'));
              this.cxConfirmationCheck += 1;
              this.cxStatus = exports.TxStatus.PENDING;
              return _context8.abrupt("return", false);

            case 18:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee8, this);
    }));

    function trackCx(_x15, _x16) {
      return _trackCx.apply(this, arguments);
    }

    return trackCx;
  }();

  _proto.socketCxConfirm = function socketCxConfirm(txHash, maxAttempts, toShardID) {
    var _this2 = this;

    if (maxAttempts === void 0) {
      maxAttempts = 20;
    }

    return new Promise(function (resolve, reject) {
      var newHeads = Promise.resolve(new avalancheJsNetwork.NewHeaders(_this2.messenger, typeof toShardID === 'string' ? Number.parseInt(toShardID, 10) : toShardID));
      newHeads.then(function (p) {
        p.onData( /*#__PURE__*/function () {
          var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee9(data) {
            var blockNumber;
            return _regeneratorRuntime.wrap(function _callee9$(_context9) {
              while (1) {
                switch (_context9.prev = _context9.next) {
                  case 0:
                    blockNumber = _this2.messenger.chainPrefix === 'hmy' ? data.params.result.Header.number : data.params.result.number;

                    _this2.emitCxTrack({
                      txHash: txHash,
                      attempt: _this2.cxConfirmationCheck,
                      currentBlock: avalancheJsUtils.hexToNumber(blockNumber),
                      toShardID: toShardID
                    });

                    if (_this2.blockNumbers.includes(blockNumber)) {
                      _context9.next = 18;
                      break;
                    }

                    _context9.next = 5;
                    return _this2.trackCx(txHash, toShardID);

                  case 5:
                    if (!_context9.sent) {
                      _context9.next = 12;
                      break;
                    }

                    _this2.emitCxConfirm(_this2.cxStatus);

                    _context9.next = 9;
                    return p.unsubscribe();

                  case 9:
                    resolve(_this2);
                    _context9.next = 18;
                    break;

                  case 12:
                    if (!(_this2.cxConfirmationCheck === maxAttempts)) {
                      _context9.next = 18;
                      break;
                    }

                    _this2.cxStatus = exports.TxStatus.REJECTED;

                    _this2.emitCxConfirm(_this2.cxStatus);

                    _context9.next = 17;
                    return p.unsubscribe();

                  case 17:
                    resolve(_this2);

                  case 18:
                  case "end":
                    return _context9.stop();
                }
              }
            }, _callee9);
          }));

          return function (_x17) {
            return _ref3.apply(this, arguments);
          };
        }()).onError( /*#__PURE__*/function () {
          var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee10(error) {
            return _regeneratorRuntime.wrap(function _callee10$(_context10) {
              while (1) {
                switch (_context10.prev = _context10.next) {
                  case 0:
                    _this2.cxStatus = exports.TxStatus.REJECTED;

                    _this2.emitCxConfirm(_this2.cxStatus);

                    _this2.emitError(error);

                    _context10.next = 5;
                    return p.unsubscribe();

                  case 5:
                    reject(error);

                  case 6:
                  case "end":
                    return _context10.stop();
                }
              }
            }, _callee10);
          }));

          return function (_x18) {
            return _ref4.apply(this, arguments);
          };
        }());
      });
    });
  };

  return TransactionBase;
}();

var Transaction = /*#__PURE__*/function (_TransactionBase) {
  _inheritsLoose(Transaction, _TransactionBase);

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
  function Transaction(params, messenger, txStatus) {
    var _this;

    if (messenger === void 0) {
      messenger = defaultMessenger;
    }

    if (txStatus === void 0) {
      txStatus = exports.TxStatus.INTIALIZED;
    }

    _this = _TransactionBase.call(this, messenger, txStatus) || this; // intialize transaction

    _this.id = params && params.id ? params.id : '0x';
    _this.from = params && params.from ? params.from : '0x';
    _this.nonce = params && params.nonce ? params.nonce : 0;
    _this.gasPrice = params && params.gasPrice ? new avalancheJsUtils.Unit(params.gasPrice).asWei().toWei() : new avalancheJsUtils.Unit(0).asWei().toWei();
    _this.gasLimit = params && params.gasLimit ? new avalancheJsUtils.Unit(params.gasLimit).asWei().toWei() : new avalancheJsUtils.Unit(0).asWei().toWei();
    _this.shardID = params && params.shardID !== undefined ? params.shardID : _this.messenger.currentShard;
    _this.toShardID = params && params.toShardID !== undefined ? params.toShardID : _this.messenger.currentShard;
    _this.to = params && params.to ? Transaction.normalizeAddress(params.to) : '0x';
    _this.value = params && params.value ? new avalancheJsUtils.Unit(params.value).asWei().toWei() : new avalancheJsUtils.Unit(0).asWei().toWei();
    _this.data = params && params.data ? params.data : '0x'; // chainid should change with different network settings

    _this.chainId = params && params.chainId ? params.chainId : _this.messenger.chainId;
    _this.rawTransaction = params && params.rawTransaction ? params.rawTransaction : '0x';
    _this.unsignedRawTransaction = params && params.unsignedRawTransaction ? params.unsignedRawTransaction : '0x';
    _this.signature = params && params.signature ? params.signature : {
      r: '',
      s: '',
      recoveryParam: 0,
      v: 0
    };
    _this.receipt = params && params.receipt ? params.receipt : undefined;
    _this.cxStatus = _this.isCrossShard() ? exports.TxStatus.INTIALIZED : exports.TxStatus.NONE;
    return _this;
  }
  /**
   *
   * @example
   * ```javascript
   * const unsigned = txn.getRLPUnsigned(txn);
   * console.log(unsigned);
   * ```
   */


  var _proto = Transaction.prototype;

  _proto.getRLPUnsigned = function getRLPUnsigned() {
    var _this2 = this;

    var raw = []; // temp setting to be compatible with eth

    var fields = this.messenger.chainType === avalancheJsUtils.ChainType.Avalanche ? transactionFields : transactionFieldsETH;
    fields.forEach(function (field) {
      var value = _this2.txParams[field.name] || [];
      value = avalancheJsCrypto.arrayify(avalancheJsCrypto.hexlify(field.transform === 'hex' ? avalancheJsUtils.add0xToString(value.toString(16)) : value)); // Fixed-width field

      if (field.fix === true && field.length && value.length !== field.length && value.length > 0) {
        throw new Error("invalid length for " + field.name);
      } // Variable-width (with a maximum)


      if (field.fix === false && field.length) {
        value = avalancheJsCrypto.stripZeros(value);

        if (value.length > field.length) {
          throw new Error("invalid length for " + field.name);
        }
      }

      raw.push(avalancheJsCrypto.hexlify(value));
    });

    if (this.txParams.chainId != null && this.txParams.chainId !== 0) {
      raw.push(avalancheJsCrypto.hexlify(this.txParams.chainId));
      raw.push('0x');
      raw.push('0x');
    }

    return [avalancheJsCrypto.encode(raw), raw];
  };

  _proto.getRLPSigned = function getRLPSigned(raw, signature) {
    // temp setting to be compatible with eth
    var rawLength = this.messenger.chainType === avalancheJsUtils.ChainType.Avalanche ? 11 : 9;
    var sig = avalancheJsCrypto.splitSignature(signature);
    var v = 27 + (sig.recoveryParam || 0);

    if (raw.length === rawLength) {
      raw.pop();
      raw.pop();
      raw.pop();
      v += this.chainId * 2 + 8;
    }

    raw.push(avalancheJsCrypto.hexlify(v));
    raw.push(avalancheJsCrypto.stripZeros(avalancheJsCrypto.arrayify(sig.r) || []));
    raw.push(avalancheJsCrypto.stripZeros(avalancheJsCrypto.arrayify(sig.s) || []));
    return avalancheJsCrypto.encode(raw);
  }
  /**
   * @example
   * ```javascript
   * console.log(txn.getRawTransaction());
   * ```
   */
  ;

  _proto.getRawTransaction = function getRawTransaction() {
    return this.rawTransaction;
  }
  /** @hidden */
  ;

  _proto.recover = function recover$1(rawTransaction) {
    // temp setting to be compatible with eth
    var recovered = this.messenger.chainType === avalancheJsUtils.ChainType.Avalanche ? recover(rawTransaction) : recoverETH(rawTransaction);
    this.setParams(recovered);
    return this;
  }
  /**
   * get the payload of transaction
   *
   * @example
   * ```
   * const payload = txn.txPayload;
   * console.log(payload);
   * ```
   */
  ;

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
  _proto.setParams = function setParams(params) {
    this.id = params && params.id ? params.id : '0x';
    this.from = params && params.from ? params.from : '0x';
    this.nonce = params && params.nonce ? params.nonce : 0;
    this.gasPrice = params && params.gasPrice ? new avalancheJsUtils.Unit(params.gasPrice).asWei().toWei() : new avalancheJsUtils.Unit(0).asWei().toWei();
    this.gasLimit = params && params.gasLimit ? new avalancheJsUtils.Unit(params.gasLimit).asWei().toWei() : new avalancheJsUtils.Unit(0).asWei().toWei();
    this.shardID = params && params.shardID !== undefined ? params.shardID : this.messenger.currentShard;
    this.toShardID = params && params.toShardID !== undefined ? params.toShardID : this.messenger.currentShard;
    this.to = params && params.to ? Transaction.normalizeAddress(params.to) : '0x';
    this.value = params && params.value ? new avalancheJsUtils.Unit(params.value).asWei().toWei() : new avalancheJsUtils.Unit(0).asWei().toWei();
    this.data = params && params.data ? params.data : '0x';
    this.chainId = params && params.chainId ? params.chainId : 0;
    this.rawTransaction = params && params.rawTransaction ? params.rawTransaction : '0x';
    this.unsignedRawTransaction = params && params.unsignedRawTransaction ? params.unsignedRawTransaction : '0x';
    this.signature = params && params.signature ? params.signature : {
      r: '',
      s: '',
      recoveryParam: 0,
      v: 0
    };

    if (this.rawTransaction !== '0x') {
      this.setTxStatus(exports.TxStatus.SIGNED);
    } else {
      this.setTxStatus(exports.TxStatus.INTIALIZED);
    }
  }
  /** @hidden */
  ;

  _proto.map = function map(fn) {
    var newParams = fn(this.txParams);
    this.setParams(newParams);
    return this;
  }
  /**
   * Check whether the transaction is cross shard
   *
   * @example
   * ```javascript
   * console.log(txn.isCrossShard());
   * ```
   */
  ;

  _proto.isCrossShard = function isCrossShard() {
    return new avalancheJsCrypto.BN(this.txParams.shardID).toString() !== new avalancheJsCrypto.BN(this.txParams.toShardID).toString();
  }
  /**
   *
   * @example
   * ```
   * txn.sendTransaction().then((value) => {
   *   console.log(value);
   * });
   * ```
   */
  ;

  _proto.sendTransaction =
  /*#__PURE__*/
  function () {
    var _sendTransaction = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
      var res;
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!(this.rawTransaction === 'tx' || this.rawTransaction === undefined)) {
                _context.next = 2;
                break;
              }

              throw new Error('Transaction not signed');

            case 2:
              if (this.messenger) {
                _context.next = 4;
                break;
              }

              throw new Error('Messenger not found');

            case 4:
              _context.next = 6;
              return this.messenger.send(avalancheJsNetwork.RPCMethod.SendRawTransaction, this.rawTransaction, this.messenger.chainType, typeof this.shardID === 'string' ? Number.parseInt(this.shardID, 10) : this.shardID);

            case 6:
              res = _context.sent;

              if (!res.isResult()) {
                _context.next = 14;
                break;
              }

              this.id = res.result;
              this.emitTransactionHash(this.id);
              this.setTxStatus(exports.TxStatus.PENDING); // await this.confirm(this.id, 20, 1000);

              return _context.abrupt("return", [this, res.result]);

            case 14:
              if (!res.isError()) {
                _context.next = 20;
                break;
              }

              this.emitConfirm("transaction failed:" + res.error.message);
              this.setTxStatus(exports.TxStatus.REJECTED);
              return _context.abrupt("return", [this, "transaction failed:" + res.error.message]);

            case 20:
              this.emitError('transaction failed');
              throw new Error('transaction failed');

            case 22:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function sendTransaction() {
      return _sendTransaction.apply(this, arguments);
    }

    return sendTransaction;
  }();

  _proto.confirm = /*#__PURE__*/function () {
    var _confirm = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(txHash, maxAttempts, interval, shardID, toShardID) {
      var txConfirmed, cxConfirmed;
      return _regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (maxAttempts === void 0) {
                maxAttempts = 20;
              }

              if (interval === void 0) {
                interval = 1000;
              }

              if (shardID === void 0) {
                shardID = this.txParams.shardID;
              }

              if (toShardID === void 0) {
                toShardID = this.txParams.toShardID;
              }

              _context2.next = 6;
              return this.txConfirm(txHash, maxAttempts, interval, shardID);

            case 6:
              txConfirmed = _context2.sent;

              if (this.isCrossShard()) {
                _context2.next = 9;
                break;
              }

              return _context2.abrupt("return", txConfirmed);

            case 9:
              if (!txConfirmed.isConfirmed()) {
                _context2.next = 16;
                break;
              }

              _context2.next = 12;
              return this.cxConfirm(txHash, maxAttempts, interval, toShardID);

            case 12:
              cxConfirmed = _context2.sent;
              return _context2.abrupt("return", cxConfirmed);

            case 16:
              return _context2.abrupt("return", txConfirmed);

            case 17:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function confirm(_x, _x2, _x3, _x4, _x5) {
      return _confirm.apply(this, arguments);
    }

    return confirm;
  }();

  _createClass(Transaction, [{
    key: "txPayload",
    get: function get() {
      return {
        from: this.txParams.from || '0x',
        to: this.txParams.to || '0x',
        shardID: this.txParams.shardID ? avalancheJsUtils.numberToHex(this.shardID) : '0x',
        toShardID: this.txParams.toShardID ? avalancheJsUtils.numberToHex(this.toShardID) : '0x',
        gas: this.txParams.gasLimit ? avalancheJsUtils.numberToHex(this.txParams.gasLimit) : '0x',
        gasPrice: this.txParams.gasPrice ? avalancheJsUtils.numberToHex(this.txParams.gasPrice) : '0x',
        value: this.txParams.value ? avalancheJsUtils.numberToHex(this.txParams.value) : '0x',
        data: this.txParams.data || '0x',
        nonce: this.txParams.nonce ? avalancheJsUtils.numberToHex(this.nonce) : '0x'
      };
    }
    /**
     * get transaction params
     *
     * @example
     * ```
     * const txParams = txn.txParams;
     * console.log(txParams)
     * ```
     */

  }, {
    key: "txParams",
    get: function get() {
      return {
        id: this.id || '0x',
        from: this.from || '',
        nonce: this.nonce || 0,
        gasPrice: this.gasPrice || new avalancheJsUtils.Unit(0).asWei().toWei(),
        gasLimit: this.gasLimit || new avalancheJsUtils.Unit(0).asWei().toWei(),
        shardID: this.shardID !== undefined ? this.shardID : this.messenger.currentShard,
        toShardID: this.toShardID !== undefined ? this.toShardID : this.messenger.currentShard,
        to: Transaction.normalizeAddress(this.to) || '0x',
        value: this.value || new avalancheJsUtils.Unit(0).asWei().toWei(),
        data: this.data || '0x',
        chainId: this.chainId || 0,
        rawTransaction: this.rawTransaction || '0x',
        unsignedRawTransaction: this.unsignedRawTransaction || '0x',
        signature: this.signature || {
          r: '',
          s: '',
          recoveryParam: 0,
          v: 0
        }
      };
    }
  }]);

  return Transaction;
}(TransactionBase);

var ShardingTransaction = /*#__PURE__*/function (_Transaction) {
  _inheritsLoose(ShardingTransaction, _Transaction);

  function ShardingTransaction(params, messenger, txStatus) {
    if (messenger === void 0) {
      messenger = defaultMessenger;
    }

    if (txStatus === void 0) {
      txStatus = exports.TxStatus.INTIALIZED;
    }

    var fromAddress = params.from;
    var toAddress = params.to;
    var fromExtraction = fromAddress !== undefined ? fromAddress.split(avalancheJsUtils.AddressSuffix) : ['0x', undefined];
    var toExtraction = toAddress !== undefined ? toAddress.split(avalancheJsUtils.AddressSuffix) : ['0x', undefined];
    var from = fromExtraction[0];
    var shardID = fromExtraction[1] !== undefined ? Number.parseInt(fromExtraction[1], 10) : params.shardID !== undefined ? params.shardID : 0;
    var to = toExtraction[0];
    var toShardID = toExtraction[1] !== undefined ? Number.parseInt(toExtraction[1], 10) : params.toShardID !== undefined ? params.toShardID : 0;

    var reParams = _extends({}, params, {
      from: from,
      to: to,
      shardID: shardID,
      toShardID: toShardID
    });

    return _Transaction.call(this, reParams, messenger, txStatus) || this;
  }

  return ShardingTransaction;
}(Transaction);

/**
 * ## hhahaha
 *
 * @packageDocumentation
 * @module avalanche-transaction
 */
var TransactionFactory = /*#__PURE__*/function () {
  function TransactionFactory(messenger) {
    this.messenger = messenger;
  }

  TransactionFactory.getContractAddress = function getContractAddress(tx) {
    var _tx$txParams = tx.txParams,
        from = _tx$txParams.from,
        nonce = _tx$txParams.nonce;
    return avalancheJsCrypto.getAddress(avalancheJsCrypto.getContractAddress(avalancheJsCrypto.getAddress(from).checksum, Number.parseInt("" + nonce, 10))).checksum;
  };

  var _proto = TransactionFactory.prototype;

  _proto.setMessenger = function setMessenger(messenger) {
    this.messenger = messenger;
  }
  /**
   * Create a new Transaction
   * @params
   * ```
   * // to: Address of the receiver
   * // value: value transferred in wei
   * // gasLimit: the maximum gas would pay, can use string
   * // shardID: send token from shardID
   * // toShardId: send token to shardID
   * // gasPrice: you can use Unit class, and use Gwei, then remember to use toWei(), which will be transformed to BN
   * ```
   *
   * @example
   * ```javascript
   * const txn = hmy.transactions.newTx({
   *   to: 'avax166axnkjmghkf3df7xfvd0hn4dft8kemrza4cd2',
   *   value: '10000',
   *   gasLimit: '210000',
   *   shardID: 0,
   *   toShardID: 0,
   *   gasPrice: new hmy.utils.Unit('100').asGwei().toWei(),
   * });
   * ```
   */
  ;

  _proto.newTx = function newTx(txParams, sharding) {
    if (sharding === void 0) {
      sharding = false;
    }

    if (!sharding) {
      return new Transaction(txParams, this.messenger, exports.TxStatus.INTIALIZED);
    }

    return new ShardingTransaction(txParams, this.messenger, exports.TxStatus.INTIALIZED);
  }
  /**
   * clone the transaction
   *
   * @param transaction
   *
   * @example
   * ```javascript
   * const cloneTxn = hmy.transactions.clone(txn);
   * console.log(cloneTxn)
   * ```
   */
  ;

  _proto.clone = function clone(transaction) {
    return new Transaction(transaction.txParams, this.messenger, exports.TxStatus.INTIALIZED);
  }
  /**
   *
   * @example
   * ```javascript
   * txHash = '0xf8698085174876e8008252088080949d72989b68777a1f3ffd6f1db079f1928373ee52830186a08027a0ab8229ff5d5240948098f26372eaed9ab2e9be23e8594b08e358ca56a47f8ae9a0084e5c4d1fec496af444423d8a714f65c079260ff01a1be1de7005dd424adf44'
   *
   * const recoverTx = hmy.transactions.recover(txHash);
   * console.log(recoverTx);
   * ```
   */
  ;

  _proto.recover = function recover(txHash) {
    var newTxn = new Transaction({}, this.messenger, exports.TxStatus.INTIALIZED);
    newTxn.recover(txHash);
    return newTxn;
  };

  return TransactionFactory;
}();

/**
 * @packageDocumentation
 * @module avalanche-transaction
 * @hidden
 */
var AbstractTransaction = function AbstractTransaction() {};

exports.AbstractTransaction = AbstractTransaction;
exports.RLPSign = RLPSign;
exports.ShardingTransaction = ShardingTransaction;
exports.Transaction = Transaction;
exports.TransactionBase = TransactionBase;
exports.TransactionFactory = TransactionFactory;
exports.defaultMessenger = defaultMessenger;
exports.handleAddress = handleAddress;
exports.handleNumber = handleNumber;
exports.recover = recover;
exports.recoverETH = recoverETH;
exports.sleep = sleep;
exports.transactionFields = transactionFields;
exports.transactionFieldsETH = transactionFieldsETH;
//# sourceMappingURL=avalanche-js-transaction.cjs.development.js.map
