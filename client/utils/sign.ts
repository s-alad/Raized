import { openSignatureRequestPopup } from '@stacks/connect';
import { StacksTestnet } from '@stacks/network';

export default async function provesign() {
    const message = 'prove you own your wallet';

    let sig;
    let pub;

    await openSignatureRequestPopup({
        message,
        network: new StacksTestnet(), // for mainnet, `new StacksMainnet()`
        appDetails: {
            name: 'My App',
            icon: window.location.origin + '/my-app-logo.svg',
        },
        onFinish(data) {
            console.log('Signature of the message', data.signature);
            console.log('Use public key:', data.publicKey);

            sig = data.signature;
            pub = data.publicKey;
        },
    });

    return { sig, pub };
}