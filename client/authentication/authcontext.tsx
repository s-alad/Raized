import { AppConfig, openSignatureRequestPopup, showConnect, UserSession } from "@stacks/connect";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";
import { StacksTestnet } from '@stacks/network';
import provesign from "@/utils/sign";

const appConfig = new AppConfig(["store_write", "publish_data"]);
const userSession = new UserSession({ appConfig });

interface Raiser {
    email?: string;
    name?: string;
    onboarded: boolean;
    publickey?: string;
    stacksaddress?: string;
    signature?: string;
    user: UserSession | null;
}

interface IAuthContext {
    raiser: Raiser | null;
    user: UserSession | null;
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

    function askToRefresh() {
        setUser(userSession.isUserSignedIn() ? userSession : null);
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

                const res = await fetch("http://localhost:5000/users/add-user-if-not-exists", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        stacksaddress: mainnetstacks,
                        publickey: pub,
                        signature: sig,
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
