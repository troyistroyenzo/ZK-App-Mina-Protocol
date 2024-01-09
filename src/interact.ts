import {
  Mina, PrivateKey, PublicKey, fetchAccount

} from 'o1js'

import { Add } from './Add.js';

const Network = Mina.Network('https://proxy.berkeley.minaexplorer.com/graphql');

Mina.setActiveInstance(Network);

const appKey = PublicKey.fromBase58('B62qk1urAXt4yFwmR8a2humZs8fezTJPNs4XPji4co6NXMS75BVeXFS');

const zkApp = new Add(appKey);
await fetchAccount({ publicKey: appKey });
console.log(zkApp.num.get().toString());

const accountPrivateKey = PrivateKey.fromBase58('EKEaYk75qnLSCcrTvbWGWPBrqdnA8oqz5XCcMMbtczutcG6GPLV4');
const accountPublicKey = accountPrivateKey.toPublicKey();

console.log(accountPublicKey.toBase58());
console.log('compile');
await Add.compile();

const tx = await Mina.transaction({sender: accountPublicKey, fee: 0.1e9}, 
  () => {
    zkApp.update();
  }
);

console.log('proving...');

await tx.prove();

const sentTx = await tx.sign([accountPrivateKey]).send();

console.log('Transaction Hash:', sentTx.hash());
console.log('Explorer URL:', `https://proxy.berkeley.minaexplorer.com/transaction/${sentTx.hash()}`);