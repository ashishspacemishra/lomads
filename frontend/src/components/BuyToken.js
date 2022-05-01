import React, { useEffect, useState }  from "react";
import close from "../assets/closeModal.svg";
import buyToken from "../assets/buyToken.svg";
import OnramperWidget from "@onramper/widget";
import Vendor from "../contracts/Vendor.sol/Vendor.json";
import LomadsToken from "../contracts/LomadsToken.sol/LomadsToken.json";
import Web3 from "web3";
import { VENDOR_ADDRESS, VENDOR_ABI} from "../configs/vendor";
import { LOMADS_ADDRESS, LOMADS_ABI} from "../configs/lomads";

const BuyToken = ({onModalCloseClick, accountAddress}) => {

    const API_KEY_TEST = "pk_test_4VIrv72c0WWR_hPY9Zi_309rZ5BnIZ3Mu002N5c7ZLw0";
    const API_KEY_PROD = "pk_prod_XAyalvhwBlW9zA4sBkfRXOh0xyW7e_3XT70lxlVOsTs0";
    const wallets = {
        BTC: { address: accountAddress },
        ETH: { address: accountAddress },
        MATIC: { address: accountAddress },
    };
    const [fiatCurrency, setFiatCurrency] = useState("EUR");
    const [exchangeCurrency, setExchangeCurrency] = useState("MATIC");
    const [cryptoAmount, setCryptoAmount] = useState(30);
    const [cryptoPrice, setCryptoPrice] = useState(1.0);
    const [fees, setFees] = useState(1.0);
    const [isAvailableIndConfig, setIsAvailableIndConfig] = useState(false);
    const [indacoinConfig, setIndacoinConfig] = useState({});
    const [iframe, setIframe] = useState("");
    const [nextUrl, setNextUrl] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [stepNumber, setStepNumber] = useState(1);

    useEffect(() => {
        // POST request using fetch inside useEffect React hook

        // const response = await fetch('https://reqres.in/api/posts', requestOptions);
        // const data = await response.json();

        //fetchIndacoingConfig();
        contract();

// empty dependency array means this effect will only run once (like componentDidMount in classes)
    }, [fiatCurrency, exchangeCurrency, cryptoAmount]);

    const fetchIndacoingConfig = async () => {

        const getRequestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + API_KEY_TEST
            },
            // body: JSON.stringify({ title: 'React Hooks POST Request Example' })
        };
        fetch('https://onramper.tech/gateways', getRequestOptions)
            .then(response => response.json())
            .then(data => console.log(data));

        const response = await fetch('https://onramper.tech/rate/'+ fiatCurrency +'/'+ exchangeCurrency +'/creditCard/'+ cryptoAmount*cryptoPrice, getRequestOptions);
        const data = await response.json();
        console.log("rate:: ", data);
        if (data.length > 0) {
            data.forEach(x => {
                if (x.identifier === 'Indacoin') {
                    if (x.available) {
                        setIsAvailableIndConfig(true);
                        setCryptoPrice(x.rate);
                        setFees(x.fees);
                        setIframe(x.nextStep.url);
                        nextSteps();
                    } else {
                        setIsAvailableIndConfig(false);
                        setErrorMessage(x.error.message);
                    }
                    setIndacoinConfig(x);
                }
            })
        }
    }

    const OnChangeAmount = (value) => {
        const amount = value.target.value;
        setCryptoAmount(amount);
    }

    const AddCardDetails = () => {
        // setCryptoAmount(amount);
        setStepNumber(2);
    }

    const nextSteps = async () => {
        const iframe2 = 'https://indacoin.com/partner-widget/?partner=onramper1&cur_from=EUR&cur_to=INTT&amount=29&address=0x9d1A9cDC740Aed6b1336B05Ca06B58f3dffC1592&extra_info=qGxLZGTrUYrnrtZQo5alDQ--';
        if (iframe === "" || iframe === undefined || iframe === null) {
            return;
        }
        const postRequestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + API_KEY_TEST,
                'Access-Control-Allow-Origin': 'http://localhost:3001',
                'Access-Control-Allow-Credentials': 'true'
            },
            body: JSON.stringify({ cryptocurrencyAddress: accountAddress })
        };
        const response = await fetch(iframe2, postRequestOptions);
        console.log(response);
        const data = await response.json();
        console.log(data);

        await nextSteps3();
    }

    const nextSteps3 = async () => {
        const iframe3 = 'https://indacoin.com/gw/payment_form.aspx/registerChangeV1_1';
        const postRequestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + API_KEY_TEST
            },
            body: JSON.stringify(getJSONBody())
        };
        const response = await fetch(iframe3, postRequestOptions);
        console.log("response: ",response);
        const data = await response.json();
        console.log("data: ",data);
    }

    const getJSONBody = () => {
        return {
            "addInfo": {
                "tag":null,
                "cryptoAddress":"0x9d1A9cDC740Aed6b1336B05Ca06B58f3dffC1592",
                "userId":"ashishspacemishra@gmail.com",
                "email":"ashishspacemishra@gmail.com",
                "cur_from":"EUR",
                "cur_to":"INTT",
                "send.amount":29
            },
            "amountOut": 29,
            "cashinAddInfo": {
                "full_name":"ashish",
                "cardholder_name":"ashish",
                "card_data":{
                    "card":"4111 1111 1111 1111",
                    "expiryDate":"03 / 23",
                    "cvc":"123"
                },
                "phone":"+91 96465 39867"
            },
            "cnfhash": null,
            "couponCode": "",
            "fp": "",
            "fp2": "",
            "fullAddInfo": {},
            "getParams": "?partner=onramper1&cur_from=EUR&cur_to=INTT&amount=29&address=0x9d1A9cDC740Aed6b1336B05Ca06B58f3dffC1592",
            "localAddress": "",
            "partner": "onramper1",
            "referer": "https://indacoin.com/partner-widget/?partner=onramper1&cur_from=EUR&cur_to=INTT&amount=29&address=0x9d1A9cDC740Aed6b1336B05Ca06B58f3dffC1592",
            "socialfp": "",
            "transaction_id": 0

        }
    }

    const IFrame = () => {
        return (
            <div>
                <iframe src={"https://indacoin.com/partner-widget/?partner=onramper1&cur_from=EUR&cur_to=INTT&amount=29&address=0x9d1A9cDC740Aed6b1336B05Ca06B58f3dffC1592"} height={450} width={400}/>
            </div>
        );
    }

    const TokenDetails = () => {
        return (
            <div>
                <div>
                    Account Address: {accountAddress}
                </div>
                <div>
                    Fiat Currency: {fiatCurrency}
                </div>
                <div>
                    Cryptocurrency: {exchangeCurrency}
                </div>
                <div>
                    Token Price (1 MATIC): {cryptoPrice} EUR
                </div>
                <div>
                    Fees: {fees}
                </div>
                <div>
                    No of Token:
                    <input autoFocus={true}  value={cryptoAmount} onChange={OnChangeAmount}/>
                </div>
                <div>
                    Total Amount: {cryptoAmount * cryptoPrice}
                </div>
                {
                    !isAvailableIndConfig &&
                    <div>
                        Error Message: {errorMessage}
                    </div>
                }
                {
                    isAvailableIndConfig &&
                    <div>
                        <button disabled={!isAvailableIndConfig} className="modalLoginButton" style={{padding:"20px 30px 20px 30px", color:"#C94B32"}}
                                onClick={AddCardDetails} >
                            Continue
                        </button>
                    </div>
                }
            </div>
        )
    }

    const contract = async () => {
        const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
        console.log(web3);

        const accounts = await web3.eth.getAccounts();
        console.log(accounts);
        const accountAddr = accounts[0];

        const lomads = new web3.eth.Contract(LOMADS_ABI, LOMADS_ADDRESS);
        console.log(lomads);
        const totalSupply = await lomads.methods.totalSupply().call();
        console.log(totalSupply);
        const vendor = new web3.eth.Contract(VENDOR_ABI, VENDOR_ADDRESS);
        const tokensPerEth = await vendor.methods.tokensPerEth().call();
        console.log(tokensPerEth);
        const balanceOfAcc = await lomads.methods.balanceOf(accountAddr).call();
        console.log(balanceOfAcc);
        const balanceOfVendor = await lomads.methods.balanceOf(VENDOR_ADDRESS).call();
        console.log(balanceOfVendor);
        // const buy = await vendor.methods.buyTokens().send({
        //     from: accountAddr,
        //     value: "10000000000000000",
        //     gasLimit: "210000"
        // });
        // console.log(buy);

        const balanceOfAcc2 = await lomads.methods.balanceOf(accountAddr).call();
        console.log(balanceOfAcc2);
        const balanceOfVendor2 = await lomads.methods.balanceOf(VENDOR_ADDRESS).call();
        console.log(balanceOfVendor2);

        //await lomads.methods.approve(accountAddr, 10).call();
        await lomads.methods.approve(accountAddr, 2).send({
            from: accountAddr,
            gasLimit: "210000"
        });
        const sell = await vendor.methods.sellTokens(2).send({
            from: accountAddr,
            gasLimit: "210000"
        });
        console.log(sell);



        const balanceOfAcc3 = await lomads.methods.balanceOf(accountAddr).call();
        console.log(balanceOfAcc3);
        const balanceOfVendor3 = await lomads.methods.balanceOf(VENDOR_ADDRESS).call();
        console.log(balanceOfVendor3);

    }

    // {
    //     from: accountAddr,
    //     to: VENDOR_ADDRESS,
    //     gasLimit: "21000",
    //     maxFeePerGas: "300",
    //     maxPriorityFeePerGas: "10",
    //     nonce: "0",
    //     value: "10000000000"
    // }

    const BuyToken1 = () => {
        return (
            <div className="modalBackground">
                <div className="modalContainer">
                    <div className="titleCloseBtn">
                        <button onClick={onModalCloseClick}>
                            <img src={close}/>
                        </button>
                    </div>
                    <div className="title">
                        <img src={buyToken}/>
                    </div>
                    {/*{*/}
                    {/*    stepNumber === 1 ? <TokenDetails /> : <IFrame />*/}
                    {/*}*/}
                    <div>
                        <OnramperWidgetView />
                    </div>
                </div>
            </div>
        );
    }

    const OnramperWidgetView = () => {
        return (
            <div style={{width: "440px", height: "550px", paddingLeft:50}}>
                <OnramperWidget
                    API_KEY={API_KEY_TEST}
                    defaultAddrs={wallets}
                    defaultAmount={cryptoAmount}
                    defaultCrypto={exchangeCurrency}
                    defaultFiat={fiatCurrency}
                    defaultFiatSoft={fiatCurrency}
                    defaultPaymentMethod={'creditCard'}
                    isAddressEditable={false}
                    filters={{
                        onlyCryptos: [exchangeCurrency]
                    }}
                    darkMode={true}
                    color={"#C94B32"}
                />
            </div>
        )
    }

    return (
        <div>
            <BuyToken1 />
        </div>
    );
};

export default BuyToken;