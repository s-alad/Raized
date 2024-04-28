import { AppConfig, openSignatureRequestPopup, showConnect, UserSession } from "@stacks/connect";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";
import { StacksTestnet } from '@stacks/network';
import provesign from "@/utils/sign";
import { CVAR } from "@/utils/constant";

const appConfig = new AppConfig(["store_write", "publish_data"]);
const userSession = new UserSession({ appConfig });

interface Raiser {
    email?: string;
    name?: string;
    onboarded: boolean;
    publickey?: string;
    stacksaddress?: string;
    signature?: string;
    user: UserSession | null | undefined;
}

interface IAuthContext {
    raiser: Raiser | null | undefined;
    user: UserSession | null | undefined;
    loading: boolean;
    askToRefresh: () => void;
    connect: () => void;
    disconnect: () => void;
}

const AuthContext = createContext<IAuthContext>({
    raiser: null,
    user: null,
    loading: false,
    askToRefresh: () => {},
    connect: () => {},
    disconnect: () => {}
});

export function useAuth() {
    return useContext(AuthContext);
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    const [raiser, setRaiser] = useState<Raiser | null>(null);
    const [user, setUser] = useState<UserSession | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    async function askToRefresh() {
        const res = await fetch(`${CVAR}/users/get-user`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "publickey": `${raiser?.publickey}`,
                "signature": `${raiser?.signature}`
            },
            body: JSON.stringify({
                publickey: raiser?.publickey,
            }),
        });

        const resuser = await res.json();

       // only update the onboarded, name and email fields
        const nraiser: Raiser = {
            publickey: raiser?.publickey,
            signature: raiser?.signature,
            stacksaddress: raiser?.stacksaddress,
            user: raiser?.user,
            onboarded: resuser.user.onboarded,
            name: resuser.user.name,
            email: resuser.user.email,
        }
        console.log("NRAISER", nraiser)
        setRaiser(nraiser);
        localStorage.setItem("raiser", JSON.stringify(nraiser));
    }

    function connect() {
        showConnect({
            appDetails: {
                name: "Rheo",
                icon: window.location.origin + "/logo512.png",
            },
            redirectTo: "/",
            onFinish: async (data) => {

                const mainnetstacks = userSession.loadUserData().profile.stxAddress.mainnet;
                const testnetstacks = userSession.loadUserData().profile.stxAddress.testnet;

                const {pub, sig} = await provesign();

                const res = await fetch(`${CVAR}/users/add-user-if-not-exists`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "publickey": `${pub}`,
                        "signature": `${sig}`
                    },
                    body: JSON.stringify({
                        stacksaddress: mainnetstacks,
                        message: "prove you own your wallet",
                    }),
                })
                
                const resuser = await res.json()

                setUser(userSession);
                const raiser = {
                    onboarded: resuser.user.onboarded,
                    email: resuser.user.email,
                    name: resuser.user.name,
                    stacksaddress: mainnetstacks,
                    user: userSession,
                    publickey: pub,
                    signature: sig,
                }
                console.log("RAISER", raiser)
                setRaiser(raiser);
                localStorage.setItem("raiser", JSON.stringify(raiser));

                /* window.location.reload(); */
            },
            userSession,
        });
    }

    function disconnect() {
        userSession.signUserOut("/");
        setUser(null);
        setRaiser(null);
        localStorage.removeItem("raiser");
    }

    useEffect(() => {
        setLoading(true);
        if (userSession.isUserSignedIn()) {
            setUser(userSession);
            const raiser = localStorage.getItem("raiser");
            setRaiser(raiser ? JSON.parse(raiser) : null);
            // Additional logic to manage 'raiser' state or other user details can be handled here
        } else {
            setUser(null);
            setRaiser(null);
        }
        setLoading(false);
    }, []);

    return (
        <AuthContext.Provider value={{ user, raiser, loading, askToRefresh, connect, disconnect }}>
            {loading ? <div>Loading...</div> : children}
        </AuthContext.Provider>
    );
};
