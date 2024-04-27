import { SignatureData, SignatureRequestOptions, useConnect } from "@stacks/connect-react";

const { sign } = useConnect();
const signmessage = async () => {
    const options: SignatureRequestOptions = {
        message: "authentication",
        appDetails: {
            name: "rheo",
            icon: window.location.origin + "/logo512.png",
        },
        onFinish(data: SignatureData) {
            console.log('Signature of the message', data.signature);
            console.log('User public key:', data.publicKey);
        },
    };
    await sign(options);
};