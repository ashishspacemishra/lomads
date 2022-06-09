import React, { useEffect } from "react";
import { useMoralis } from "react-moralis";

const MoralisMetamask = ({ isUserAuthenticated, onLoginButtonClick, onLogoutButtonClick, getUserInfo, getAccountInfo}) => {

    const { authenticate, isAuthenticated, isAuthenticating, user, account, logout } = useMoralis();
    useEffect(() => {
        if (isAuthenticated) {
            // add your logic here
            console.log("useEffect isAuthenticated");
            // LoginMetamask(user.get("ethAddress"));
        } else {
            console.log("useEffect !isAuthenticated");
        }
    }, [isAuthenticated]);

    const moralisLogin = async () => {
        console.log("in login");
        if (!isAuthenticated) {
            console.log("authenticate");

            await authenticate({signingMessage: "Log into Lomads Dapp" })
                .then(function (user) {
                    console.log("logged in user:", user);
                    console.log(user.get("ethAddress"));
                    console.log(account);
                })
                .catch(function (error) {
                    console.log(error);
                });
        } else {
            console.log("already authenticated");
        }
    }

    const moralisLogout = async () => {
        await logout();
        console.log("logged out");
    }

    onLoginButtonClick = async () => {
        await moralisLogin();
    }

    onLogoutButtonClick = async () => {
        await moralisLogout();
    }

    isUserAuthenticated = () => {
        return isAuthenticated;
    }

    getUserInfo = () => {
        return user;
    }

    getAccountInfo = () => {
        return account;
    }

    return (<div></div>);
};

const MoralisLoginX = async () => {

}

// const { authenticate, isAuthenticated, isAuthenticating, user, account, logout } = useMoralis();
// useEffect(() => {
//     if (isAuthenticated) {
//         // add your logic here
//         console.log("useEffect isAuthenticated");
//         // LoginMetamask(user.get("ethAddress"));
//     } else {
//         console.log("useEffect !isAuthenticated");
//     }
// }, [isAuthenticated]);
//
// export const moralisLogin = async () => {
//     console.log("in login");
//     if (!isAuthenticated) {
//         console.log("authenticate");
//
//         await authenticate({signingMessage: "Log into Lomads Dapp" })
//             .then(function (user) {
//                 console.log("logged in user:", user);
//                 console.log(user.get("ethAddress"));
//                 console.log(account);
//             })
//             .catch(function (error) {
//                 console.log(error);
//             });
//     } else {
//         console.log("already authenticated");
//     }
// }
//
// export const moralisLogout = async () => {
//     await logout();
//     console.log("logged out");
// }

// export default moralisLogin;
// export {moralisLogout};