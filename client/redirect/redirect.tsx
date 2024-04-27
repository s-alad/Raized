import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { /* userSession */ } from "@/authentication/authentication";
import { useAuth } from "@/authentication/authcontext";
// these are the protected routes that you need token verification
// add routes that you want to have it protected
// also only these routes can get the decoded jwt token data
// Many of these routes do not exits yet. That's okay (:
const protectedRoutes = [
    "/profile",
    "/onboarding",
];

export default function RedirectBasedOnAuth({ children }: { children: React.ReactNode }) {
    /**
     * This is a higher level component who's job it is to redirect the user to the home page if they are not authenticated but attempt to navigate to a protected route.
     */

    const { user, loading, raiser } = useAuth();

    const [calledPush, setCalledPush] = useState(false);
    const router = useRouter();
    const currentRoute = router.asPath; // this shows the route you are currently in

    useEffect(() => {

        /* console.log("REDI SIGN", user?.isUserSignedIn()); */

        if (loading) {
            return;
        } else {}

        if (protectedRoutes.includes(currentRoute)) {
            if ((!user?.isUserSignedIn() && !calledPush)) {
                setCalledPush(true);
                router.push("/");
                return;
            }

            if (raiser && !raiser.onboarded && currentRoute !== "/onboarding") {
                console.log("pushing to onboarding");
                setCalledPush(true);
                router.push("/onboarding");
                return;
            } else if (raiser && raiser.onboarded && currentRoute === "/onboarding") {
                console.log("pushing to /");
                setCalledPush(true);
                router.push("/");
                return;
            }


        } else if (currentRoute === "/") {
            console.log("current route is /");

            if (user) {
                if (raiser && !raiser.onboarded) {
                    console.log("pushing to onboarding");
                    setCalledPush(true);
                    router.push("/onboarding");
                    return;
                } 
            }

        }

    }, [calledPush, currentRoute, router, raiser, user, loading]);

    return children;
};
