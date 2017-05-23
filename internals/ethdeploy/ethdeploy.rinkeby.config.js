const TestRPC = require('ethereumjs-testrpc'); // eslint-disable-line
const SignerProvider = require('ethjs-provider-signer'); // eslint-disable-line
const sign = require('ethjs-signer').sign; // eslint-disable-line
const account = require('../../../../rinkeby.account.json');

module.exports = (options) => ({ // eslint-disable-line
  entry: [
    './src/contracts/lib/environments.json',
    './src/contracts',
  ],
  output: {
    path: './src/contracts/lib/',
    filename: 'environments.json',
    safe: true,
  },
  module: {
    environment: {
      name: 'rinkeby',
      provider: new SignerProvider('https://rinkeby.infura.io', {
        signTransaction: (rawTx, cb) => {
          cb(null, sign(rawTx, account.privateKey));
        },
        accounts: cb => cb(null, [account.address]),
      }),
      defaultTxObject: {
        from: 0,
        gas: 4500000,
      },
    },
    preLoaders: [
      { test: /(environments)\.(json)$/, loader: 'ethdeploy-environment-loader', build: true },
    ],
    loaders: [
      { test: /\.(sol)$/, exclude: /(test\.)/, loader: 'ethdeploy-solc-loader' },
    ],
    deployment: (deploy, contracts, done) => {
      done();
    },
  },
  plugins: [
    new options.plugins.IncludeContracts(['BoardRoom', 'Board', 'Rules', 'Proxy', 'Token']),
    new options.plugins.JSONFilter(),
    new options.plugins.JSONExpander(),
  ],
});
