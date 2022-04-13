export const connectWallet = async () => {
    if (window.ethereum) {
        try {
            await window.ethereum.enable();
            const addressArray = await window.ethereum.request({
                method: "eth_accounts",
            });
            const networkId = window.ethereum.networkVersion;
            if (networkId !== "137") { //Polygon Network
                return {
                    address: "",
                    status: "Switch to Polygon Network.",
                    isUserLoggedIn: false
                }
            }
            if (addressArray.length > 0) {
                return {
                    address: addressArray[0],
                    status: "👆🏽 Logged into Metamask account.",
                    isUserLoggedIn: true
                };
            } else {
                return {
                    address: "",
                    status: "🦊 Connect to Metamask using the top right button.",
                    isUserLoggedIn: false
                };
            }
        } catch (err) {
            return {
                address: "",
                status: "😥 " + err.message,
                isUserLoggedIn: false
            };
        }
    } else {
        return {
            address: "",
            isUserLoggedIn: false,
            status: (
                <span>
          <p>
            {" "}
              🦊{" "}
              <a target="_blank" href={`https://metamask.io/download.html`}>
              You must install Metamask, a virtual Ethereum wallet, in your
              browser.
            </a>
          </p>
        </span>
            )
        };
    }
};
