"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var oasis = require("@oasisprotocol/client");
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
global.XMLHttpRequest = XMLHttpRequest;
var ROCKX_ADDRESS = 'oasis1qpjuke27se2wnmvx6e8uc4l5h44yjp9h7g2clqfq';
var getOasisClient = function () { return new oasis.client.NodeInternal('https://testnet.grpc.oasis.dev'); };
// const getOasisClient = () => new oasis.client.NodeInternal('https://grpc-mainnet.oasisscan.com');
/*
const a = ()=>{
    
    const addEscrow = oasis.staking.addEscrowWrapper()
    addEscrow.setNonce(sendNonce)

    let lastFeeAmount = sendFeeAmount
    addEscrow.setFeeAmount(oasis.quantity.fromBigInt(BigInt(lastFeeAmount)))

    addEscrow.setBody({
      account: vaildatorAddress,
      amount: addEscrowAmount,
    })
    let feeGas = await addEscrow.estimateGas(oasisClient, publicKey)
    let sendFeeGas = feeGas
    addEscrow.setFeeGas(sendFeeGas)

    let chainContext = await oasisClient.consensusGetChainContext()
    await addEscrow.sign(signer, chainContext)

    try {
      await addEscrow.submit(oasisClient);
    } catch (e) {
      console.error('submit failed', e);
      throw e;
    }
    const tw = oasis.staking.transferWrapper()
    addEscrow.setNonce(sendNonce)
}
*/
/**
 * use grpc get nonce
 * @param {*} address
 */
function getUserBalance(address) {
    return __awaiter(this, void 0, void 0, function () {
        var oasisClient, shortKey, height, res, gen, account, balance, nonce;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    oasisClient = getOasisClient();
                    return [4 /*yield*/, oasis.staking.addressFromBech32(address)
                        // oasisClient.getla()
                    ];
                case 1:
                    shortKey = _a.sent();
                    height = 0;
                    console.log('latest height=', height);
                    console.log('shortKey=', shortKey);
                    oasisClient.beaconGetEpoch(height);
                    oasisClient.consensusGetBlock(height).then(function (res) { return console.log("res=", res); })["catch"](function (reason) { return console.log("error=", reason); });
                    return [4 /*yield*/, oasisClient.consensusGetBlock(height)];
                case 2:
                    res = _a.sent();
                    console.log(res);
                    return [4 /*yield*/, oasisClient.consensusGetGenesisDocument()];
                case 3:
                    gen = _a.sent();
                    console.log("genesis=", gen);
                    return [4 /*yield*/, oasisClient.stakingAccount({ height: height, owner: shortKey })];
                case 4:
                    account = _a.sent();
                    console.log(account);
                    balance = account && account.general && account.general.balance || 0;
                    nonce = account && account.general && account.general.nonce || 0;
                    return [2 /*return*/, { balance: balance, nonce: nonce }];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, balance, nonce;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, getUserBalance('oasis1qpuq6rwrcm9d9khw3nksw9akmcdpc0futukaltxu')];
                case 1:
                    _a = _b.sent(), balance = _a.balance, nonce = _a.nonce;
                    console.log(balance);
                    console.log(nonce);
                    return [2 /*return*/];
            }
        });
    });
}
(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, main()];
        case 1:
            _a.sent();
            return [2 /*return*/];
    }
}); }); })();
