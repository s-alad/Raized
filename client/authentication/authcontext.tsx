import { AppConfig, openSignatureRequestPopup, showConnect, UserSession } from "@stacks/connect";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";
import { StacksTestnet } from '@stacks/network';

const appConfig = new AppConfig(["store_write", "publish_data"]);
const userSession = new UserSession({ appConfig });

interface Raiser {
    onboarded: boolean;
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

                console.log("US", userSession.loadUserData().profile.stxAddress)

                setUser(userSession);
                setRaiser({ onboarded: true, user: userSession });
                window.location.reload();
            },
            userSession,
        });
    }

    function disconnect() {
        userSession.signUserOut("/");
        setUser(null);
        setRaiser(null);
    }

    useEffect(() => {
        setLoading(true);
        if (userSession.isUserSignedIn()) {
            setUser(userSession);
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
