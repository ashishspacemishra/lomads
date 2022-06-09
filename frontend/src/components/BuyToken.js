import React, { useEffect, useState }  from "react";
import close from "../assets/closeModal.svg";
import buyToken from "../assets/buyToken.svg";
import OnramperWidget from "@onramper/widget";
import Web3 from "web3";
import { VENDOR_ADDRESS, VENDOR_ABI } from "../configs/vendor";
import { LOMADS_ADDRESS, LOMADS_ABI } from "../configs/lomads";
import creditCard from "../assets/cb.svg";
import wallet from "../assets/wallet.svg";
import upHandler from "../assets/upHandler.svg";
import downHandler from "../assets/downHandler.svg";
import tokenSymbol from "../assets/tokenSymbol.svg";
import euroSymbol from "../assets/euro-3129701-2603769.webp";
import tokensGroup from "../assets/tokensGroup.svg";
import maticOption from "../assets/maticOption.svg";
import "../styles/Modal.css";
import { useNewMoralisObject, useMoralisQuery } from "react-moralis";
import processMoonpayStep, { moonpayUrlRegex } from '@onramper/moonpay-adapter'

const BuyToken = ({onModalCloseClick, accountAddress}) => {

    const WIDGET = {
        BUY_OPTIONS: 1,
        WALLET: 2,
        CREDIT_CARD: 3,
        ONRAMPER_PAYMENT: 4
    };
    const [currentWidget, setCurrentWidget] = useState(WIDGET.BUY_OPTIONS);
    const [tokensToBuy, setTokensToBuy] = useState(1);
    const [maticToExchange, setMaticToExchange] = useState(1);
    const [exchangeRateDAOMATIC, setExchangeRateDAOMATIC] = useState(1);
    const [totalFeesDAOMATIC, setTotalFeesDAOMATIC] = useState(0.0);
    const [autoFocusToken, setAutoFocusToken] = useState(true);
    const [autoFocusMatic, setAutoFocusMatic] = useState(false);
    const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
    const lomads = new web3.eth.Contract(LOMADS_ABI, LOMADS_ADDRESS);
    const vendor = new web3.eth.Contract(VENDOR_ABI, VENDOR_ADDRESS);

    const API_KEY_TEST = "pk_test_4VIrv72c0WWR_hPY9Zi_309rZ5BnIZ3Mu002N5c7ZLw0";
    const API_KEY_PROD = "pk_prod_XAyalvhwBlW9zA4sBkfRXOh0xyW7e_3XT70lxlVOsTs0";
    const wallets = {
        BTC: { address: accountAddress },
        ETH: { address: accountAddress },
        MATIC: { address: accountAddress },
    };
    const [fiatCurrency, setFiatCurrency] = useState("EUR");
    const [exchangeCurrency, setExchangeCurrency] = useState("MATIC");
    const [tokensEURMATIC, setTokensEURMATIC] = useState(1);
    const [eurAmount, setEurAmount] = useState(30); //min amount for Indacoin txn
    const [exchangeRateEURMATIC, setExchangeRateEURMATIC] = useState(1.0);
    const [totalFeesEURMATIC, setTotalFeesEURMATIC] = useState(0.0);
    const [isAvailableIndConfig, setIsAvailableIndConfig] = useState(false);
    const [indacoinConfig, setIndacoinConfig] = useState({});
    const [iframe, setIframe] = useState("");
    const [nextUrl, setNextUrl] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [stepNumber, setStepNumber] = useState(1);

    const gatewayURL = "https://onramper.tech/rate/"+ fiatCurrency +"/"+ exchangeCurrency +"/creditCard/"+ eurAmount;
    const indacoinIframeURL = "https://indacoin.com/partner-widget/?partner=onramper1&cur_from="+ fiatCurrency +"&cur_to="+ exchangeCurrency +
        "&amount="+ eurAmount +"&address="+ LOMADS_ADDRESS;

    useEffect(() => {
        // POST request using fetch inside useEffect React hook

        // const response = await fetch('https://reqres.in/api/posts', requestOptions);
        // const data = await response.json();

        fetchIndacoingConfig();
        getContractDetails();

        // empty dependency array means this effect will only run once (like componentDidMount in classes)
    }, [fiatCurrency, exchangeCurrency]);

    const { save } = useNewMoralisObject("UserTokenTxn");
    const saveUserTokenTxn = async (accountAddress, maticToSend) => {
        const data = {
            daoId: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
            userId: accountAddress,
            maticValue: maticToSend,
            tokenValue: tokensToBuy,
            action: "BUY",
            txnID: "",
            tokenAddress: LOMADS_ADDRESS,
        };

        await save(data, {
            onSuccess: (txn) => {
                console.log("Buy record saved with objectId: " + txn.id);
            },
            onError: (error) => {
                console.log("Failed to record user txn, with error code: " + error.message);
            },
        });
    }

    //
    // const getUserTokenTxn = async () => {
    //
    //     const { fetch } = useMoralisQuery(
    //         "UserTokenTxn",
    //         (query) => query.equalTo("userId", accountAddress),
    //         [],
    //         { autoFetch: false }
    //     );
    //     await fetch({
    //         onSuccess: (result) => {
    //             console.log(result[0].attributes);
    //         },
    //         onError: (error) => {
    //             console.log("Failed to fetch user txn data, with error code: " + error.message);
    //         },
    //     });
    // };

    // const method = step.type === 'file' ? 'PUT' : 'POST';
    // const body = step.type === 'file' ? data as File : JSON.stringify(data);
    //
    // const nextStepType = step.url.split('/')[5]
    // let nextStep;
    // if (isMoonpayStep(step.url) && nextStepType !== "iframe") {
    //     nextStep = await processMoonpayStep(step.url, { method, headers, body });
    // } else {
    //     nextStep = await fetch(step.url, { method, headers, body })
    // }
    // return processResponse(nextStep)

    const fetchIndacoingConfig = async () => {
        const getRequestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + API_KEY_TEST
            },
            // body: JSON.stringify({ title: 'React Hooks POST Request Example' })
        };
        // fetch('https://onramper.tech/gateways', getRequestOptions)
        //     .then(response => response.json())
        //     .then(data => console.log(data));

        const response = await fetch(gatewayURL, getRequestOptions);
        const data = await response.json();
        console.log("rate:: ", data);
        if (data.length > 0) {
            data.forEach(x => {
                if (x.identifier === 'Indacoin') {
                    if (x.available) {
                        console.log("availableRATE:: ", x.rate);
                        setIsAvailableIndConfig(true);
                        // setEurAmount(tokensEURMATIC*(x.rate));
                        setTokensEURMATIC(exchangeRateDAOMATIC*eurAmount/x.rate);
                        setExchangeRateEURMATIC(x.rate);
                        setTotalFeesEURMATIC(x.fees);
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
        setEurAmount(amount);
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

        // await nextSteps3();
    }

    // const nextSteps3 = async () => {
    //     const iframe3 = 'https://indacoin.com/gw/payment_form.aspx/registerChangeV1_1';
    //     const postRequestOptions = {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization': 'Basic ' + API_KEY_TEST
    //         },
    //         body: JSON.stringify(getJSONBody())
    //     };
    //     const response = await fetch(iframe3, postRequestOptions);
    //     console.log("response: ",response);
    //     const data = await response.json();
    //     console.log("data: ",data);
    // }

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
                <iframe src={indacoinIframeURL} height={450} width={400}/>
            </div>
        );
    }

    // const TokenDetails = () => {
    //     return (
    //         <div>
    //             <div>
    //                 Account Address: {accountAddress}
    //             </div>
    //             <div>
    //                 Fiat Currency: {fiatCurrency}
    //             </div>
    //             <div>
    //                 Cryptocurrency: {exchangeCurrency}
    //             </div>
    //             <div>
    //                 Token Price (1 MATIC): {cryptoPrice} EUR
    //             </div>
    //             <div>
    //                 Fees: {fees}
    //             </div>
    //             <div>
    //                 No of Token:
    //                 <input autoFocus={true}  value={cryptoAmount} onChange={OnChangeAmount}/>
    //             </div>
    //             <div>
    //                 Total Amount: {cryptoAmount * cryptoPrice}
    //             </div>
    //             {
    //                 !isAvailableIndConfig &&
    //                 <div>
    //                     Error Message: {errorMessage}
    //                 </div>
    //             }
    //             {
    //                 isAvailableIndConfig &&
    //                 <div>
    //                     <button disabled={!isAvailableIndConfig} className="modalLoginButton" style={{padding:"20px 30px 20px 30px", color:"#C94B32"}}
    //                             onClick={AddCardDetails} >
    //                         Continue
    //                     </button>
    //                 </div>
    //             }
    //         </div>
    //     )
    // }

    const getContractDetails = async () => {
        // console.log(web3);

        const accounts = await web3.eth.getAccounts();
        console.log(accounts);
        const accountAddr = accounts[0];
        const totalSupply = await lomads.methods.totalSupply().call();
        console.log("Total Supply: ", web3.utils.fromWei(totalSupply));
        const tokensPerMATIC = await vendor.methods.tokensPerMATIC().call();
        console.log("Token per MATIC: ", tokensPerMATIC);
        setExchangeRateDAOMATIC(tokensPerMATIC);
        setTotalFeesDAOMATIC(0);
        setMaticToExchange(tokensToBuy/tokensPerMATIC);
        const balanceOfAcc = await lomads.methods.balanceOf(accountAddr).call();
        console.log("Acc Balance: ", web3.utils.fromWei(balanceOfAcc));
        const balanceOfVendor = await lomads.methods.balanceOf(VENDOR_ADDRESS).call();
        console.log("Vendor Balance: ", web3.utils.fromWei(balanceOfVendor));


        // BUYYYY
        // const maticToSend = web3.utils.toWei("10");
        // const buy = await vendor.methods.buyTokens().send({
        //     from: accountAddr,
        //     value: maticToSend,
        //     gasLimit: "210000"
        // });
        // console.log(buy);
        // const balanceOfAcc2 = await lomads.methods.balanceOf(accountAddr).call();
        // console.log("Acc Balance after buy: ", web3.utils.fromWei(balanceOfAcc2));
        // const balanceOfVendor2 = await lomads.methods.balanceOf(VENDOR_ADDRESS).call();
        // console.log("Vendor Balance after buy: ", web3.utils.fromWei(balanceOfVendor2));


        // WITHDRAWWW
        // const withdrawLimit = await vendor.methods.withdrawLimit().call();
        // console.log("Withdraw Limit: ", web3.utils.fromWei(withdrawLimit));
        // const maxWithdrawPercent = await vendor.methods.maxWithdrawPercent().call();
        // console.log("Max Withdraw Percent: ", maxWithdrawPercent);
        // await vendor.methods.updateWithdrawPercentLimit(20).send({
        //     from: accountAddr,
        //     gasLimit: "210000"
        // });
        //console.log(updateWithdrawLimi);
        // const maxWithdrawPercent2 = await vendor.methods.maxWithdrawPercent().call();
        // console.log("New Max Withdraw Percent: ", maxWithdrawPercent2);


        // SELLL
        // const tokenToSell = 1;
        // console.log(tokenToSell);
        // await lomads.methods.approve(accountAddr, tokenToSell).send({
        //     from: accountAddr,
        //     gasLimit: "2100000"
        // });
        // const sell = await vendor.methods.sellTokens(tokenToSell).send({
        //     from: accountAddr,
        //     gasLimit: "2100000"
        // });
        // console.log(sell);

        // const balanceOfAcc3 = await lomads.methods.balanceOf(accountAddr).call();
        // console.log("Acc Balance after sell: ", web3.utils.fromWei(balanceOfAcc3));
        // const balanceOfVendor3 = await lomads.methods.balanceOf(VENDOR_ADDRESS).call();
        // console.log("Vendor Balance after sell: ", web3.utils.fromWei(balanceOfVendor3));
    }

    const onClickBuyTokens = async () => {
        const maticToSend = web3.utils.toWei(maticToExchange.toString());
        console.log(maticToSend);
        const buy = await vendor.methods.buyTokens().send({
            from: accountAddress,
            value: maticToSend,
            gasLimit: "210000"
        });
        console.log(buy);
        const balanceOfAcc2 = await lomads.methods.balanceOf(accountAddress).call();
        console.log("Acc Balance after buy: ", web3.utils.fromWei(balanceOfAcc2));
        const balanceOfVendor2 = await lomads.methods.balanceOf(VENDOR_ADDRESS).call();
        console.log("Vendor Balance after buy: ", web3.utils.fromWei(balanceOfVendor2));
        saveUserTokenTxn(accountAddress, maticToSend);
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

    const WidgetOptions = () => {
        return (
            <div className="modalBackground">
                <div className="modalContainer">
                    <div className="titleCloseBtn">
                        <button onClick={onModalCloseClick}>
                            <img src={close}/>
                        </button>
                    </div>
                    {
                        // currentWidget !== WIDGET.ONRAMPER_PAYMENT &&
                        <div>
                            <img src={buyToken}/>
                        </div>
                    }
                    {
                        currentWidget === WIDGET.BUY_OPTIONS &&
                        <BuyOptionsWidget />
                    }
                    {
                        currentWidget === WIDGET.WALLET &&
                        <WalletWidgetOption />
                    }
                    {
                        currentWidget === WIDGET.CREDIT_CARD &&
                        <CreditCardWidgetOption />
                    }
                    {
                        currentWidget === WIDGET.ONRAMPER_PAYMENT &&
                        <OnRamperPaymentWidget />
                    }
                </div>
            </div>
        );
    };

    const BuyOptionsWidget = () => {
        return (
            <div className={"body"}>
                <div className="paymentOptionsText" style={{paddingTop:90, paddingBottom:60}}>
                    Select your payment method
                </div>
                <button className="modalLoginButton" onClick={() => setCurrentWidget(WIDGET.CREDIT_CARD)}>
                    <img src={creditCard} style={{padding:"20px 55px 20px 55px"}}/>
                </button>
                <button className="modalLoginButton" onClick={() => setCurrentWidget(WIDGET.WALLET)}>
                    <img src={wallet} style={{padding:"20px 40px 20px 40px"}}/>
                </button>
            </div>
        )
    };

    const updateNoOfTokensToBuyDAOMATIC = (event) => {
        const value = event.target.value;
        setTokensToBuy(value);
        setMaticToExchange(totalFeesDAOMATIC + (value/exchangeRateDAOMATIC));
        setAutoFocusToken(true);
        setAutoFocusMatic(false);
    }

    const updateTotalMaticToSpendDAOMATIC = (event) => {
        const value = event.target.value;
        setMaticToExchange(value);
        setTokensToBuy((value - totalFeesDAOMATIC)*exchangeRateDAOMATIC);
        setAutoFocusToken(false);
        setAutoFocusMatic(true);
    }

    const WalletWidgetOption = () => {
        return (
            <div>
                <div className="paymentOptionsText" style={{paddingTop:60, paddingLeft:120, paddingRight:120, paddingBottom:60}} >
                    How many tokens do you want to purchase?
                </div>
                <div> {/*    className={"buyTokensPanel"}>*/}
                    <div>
                    </div>
                    <div style={{display:"flex", paddingBottom:20, paddingLeft:150}}>
                        {/*<InputNumber*/}
                        {/*    defaultValue={1}*/}
                        {/*    min={1}*/}
                        {/*    //max={10}*/}
                        {/*    value={tokensToBuy}*/}
                        {/*    onChange={setTokensToBuy}*/}
                        {/*    style={{ width: 50, background:"#F5F5F5" }}*/}
                        {/*    // upHandler={upHandler}*/}
                        {/*    // downHandler={downHandler}*/}
                        {/*    // readOnly={this.state.readOnly}*/}
                        {/*    // disabled={this.state.disabled}*/}
                        {/*    // precision={Number(precision)}*/}
                        {/*    // decimalSeparator={decimalSeparator}*/}
                        {/*/>*/}

                        <img src={tokensGroup}/>
                        <input className={"buyTokensPanel2"}
                            autoFocus={autoFocusToken}
                            type={"number"}
                            min={0}
                            value={tokensToBuy}
                            onChange= {(event) => updateNoOfTokensToBuyDAOMATIC(event)}
                        />
                    </div>

                    <div style={{display:"flex", alignItems:"center", paddingBottom:30, paddingTop:10, paddingLeft:185}}>
                        <div className={"fontAmountFees"}>
                            {totalFeesDAOMATIC} MATIC
                        </div>
                        <div style={{height:0, width:50, border:"1px solid #76808D", transform:"rotate(90deg)"}} />
                        <div className={"fontAmountFeesText"}>
                            Total Fees
                        </div>
                    </div>

                    <div style={{display:"flex", paddingBottom:40, paddingLeft:152}}>
                        <img src={maticOption}/>
                        <input className={"buyTokensPanel2"}
                               autoFocus={autoFocusMatic}
                               type={"number"}
                               min={0}
                               value={maticToExchange}
                               onChange= {(event) => updateTotalMaticToSpendDAOMATIC(event)}
                        />
                    </div>
                </div>
                <button className="modalBuyButton" onClick={onClickBuyTokens}>
                    BUY TOKENS
                </button>
                <div className={"loginWithoutWallet"} style={{paddingTop:20}}>
                    <a onClick={() => setCurrentWidget(WIDGET.CREDIT_CARD)}
                       style={{textDecorationLine: "underline"}}>Or use your credit card</a>
                </div>
            </div>
        )
    };

    const upHandler = <div style={{ color: 'blue' }}>x</div>;
    const downHandler = <div style={{ color: 'red' }}>V</div>;
    const getHandler = (handler) => {
        return (
            <div>
                <img src={handler}/>
            </div>
        )
    }


    const updateNoOfTokensToBuyEURMATIC = (event) => {
        const value = event.target.value;
        setTokensEURMATIC(value);
        setEurAmount(totalFeesEURMATIC + ((value/exchangeRateDAOMATIC)*exchangeRateEURMATIC));
        setAutoFocusToken(true);
        setAutoFocusMatic(false);
    }

    const updateTotalMaticToSpendEURMATIC = (event) => {
        const value = event.target.value;
        setEurAmount(value);
        setTokensEURMATIC((value - totalFeesEURMATIC)*exchangeRateDAOMATIC/exchangeRateEURMATIC);
        setAutoFocusToken(false);
        setAutoFocusMatic(true);
    }

    const CreditCardWidgetOption = () => {
        return (
            <div>
                {/*<OnramperWidget*/}
                {/*    API_KEY={API_KEY_TEST}*/}
                {/*    defaultAddrs={wallets}*/}
                {/*    defaultAmount={cryptoAmount}*/}
                {/*    defaultCrypto={exchangeCurrency}*/}
                {/*    defaultFiat={fiatCurrency}*/}
                {/*    defaultFiatSoft={fiatCurrency}*/}
                {/*    defaultPaymentMethod={'creditCard'}*/}
                {/*    isAddressEditable={false}*/}
                {/*    filters={{*/}
                {/*        onlyCryptos: [exchangeCurrency]*/}
                {/*    }}*/}
                {/*    darkMode={true}*/}
                {/*    color={"#C94B32"}*/}
                {/*/>*/}


                <div className="paymentOptionsText" style={{paddingTop:60, paddingLeft:120, paddingRight:120, paddingBottom:60}} >
                    How many tokens do you want to purchase?
                </div>
                <div> {/*    className={"buyTokensPanel"}>*/}
                    <div>
                    </div>
                    <div style={{display:"flex", paddingBottom:20, paddingLeft:150}}>
                        <img src={tokensGroup}/>
                        <input className={"buyTokensPanel2"}
                               autoFocus={autoFocusToken}
                               type={"number"}
                               min={0}
                               value={tokensEURMATIC}
                               onChange= {(event) => updateNoOfTokensToBuyEURMATIC(event)}
                        />
                    </div>

                    <div style={{display:"flex", alignItems:"center", paddingBottom:30, paddingTop:10, paddingLeft:185}}>
                        <div className={"fontAmountFees"}>
                            {totalFeesEURMATIC} EUR
                        </div>
                        <div style={{height:0, width:50, border:"1px solid #76808D", transform:"rotate(90deg)"}} />
                        <div className={"fontAmountFeesText"}>
                            Total Fees
                        </div>
                    </div>

                    <div style={{display:"flex", paddingBottom:40, paddingLeft:230}}>
                        {/*<img src={euroSymbol}/>*/}
                        <input className={"buyTokensPanel2"} style={{borderRadius:10}}
                               autoFocus={autoFocusMatic}
                               type={"number"}
                               min={0}
                               value={eurAmount}
                               onChange= {(event) => updateTotalMaticToSpendEURMATIC(event)}
                        />
                    </div>
                </div>
                <button className="modalBuyButton" onClick={() => setCurrentWidget(WIDGET.ONRAMPER_PAYMENT)}
                        disabled={eurAmount<30}>
                    CONTINUE
                </button>

                <div className={"loginWithoutWallet"} style={{paddingTop:20}}>
                    <a onClick={() => setCurrentWidget(WIDGET.WALLET)}
                       style={{textDecorationLine: "underline"}}>Or use your crypto wallet</a>
                </div>
            </div>
        )
    };

    const OnRamperPaymentWidget = () => {
        return (
            <div>
                <IFrame />
                <div className={"loginWithoutWallet"} style={{paddingTop:10, paddingLeft:50, paddingRight:50}}>
                    <a>NOTE: The MATIC purchased here will be automatically converted to DAO token and added to user wallet.</a>
                </div>
            </div>
        );
    };

    return (
        <div>
            <WidgetOptions />
        </div>
    );
};

export default BuyToken;