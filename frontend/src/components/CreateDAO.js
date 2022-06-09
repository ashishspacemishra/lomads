import React, {useEffect, useState} from "react";
import "../styles/Dashboard.css";
import "../styles/CreateDao.css";
import createDao from "../assets/createDao.svg";
import metamask2 from "../assets/metamask2.svg";
import {useMoralis} from "react-moralis";
import LoginBar from "./LoginBar";
import rectImage from "../assets/rect.svg";
import rightArrow from "../assets/rightArrow.svg";
import vertLine from "../assets/vertLine.svg";
import vertLineOptional from "../assets/vertLineOptional.svg";
import CreateDaoSidebar from "./CreateDaoSidebar";


export const STEP_NUMBER = {
    GUIDE: 0,
    BASICS: 1,
    SETTINGS: 2,
    TOKEN: 3,
    GO_LIVE: 4
}

const CreateDAO = () => {

    const PAGE = {
        LANDING: 1,
        LOGIN: 2,
        START_DAO: 3
    };

    const [currentWidget, setCurrentWidget] = useState(PAGE.LANDING);
    const [currentStep, setCurrentStep] = useState(STEP_NUMBER.GUIDE);
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
    const [desc, setDesc] = useState("");
    const [file, setFile] = useState("");

    const { authenticate, isAuthenticated, isAuthenticating, user, account, chainId, logout } = useMoralis();

    useEffect(() => {
        // Moralis.enableWeb3();
        if (isAuthenticated) {
            // add your logic here
            console.log("useEffect isAuthenticated");
            // setIsUserLoggedIn(true);
        } else {
            console.log("useEffect !isAuthenticated");
        }
    }, [isAuthenticated]);

    const updateCurrentStepNo = (stepNumber) => {
        console.log(stepNumber);
        setCurrentStep(stepNumber);
    }

    const moralisLogin = async () => {
        console.log("in login");
        if (!isAuthenticated) {
            console.log("authenticate");
            await authenticate({signingMessage: "Log into Lomads Dapp to create a DAO" })
                .then(function (user) {
                    console.log("logged in user:", user);
                    console.log(user.get("ethAddress"));
                    console.log(account);
                    setIsUserLoggedIn(true);
                    setCurrentWidget(PAGE.START_DAO);
                })
                .catch(function (error) {
                    console.log(error);
                });
        } else {
            setIsUserLoggedIn(true);
            setCurrentWidget(PAGE.START_DAO);
            console.log("already authenticated");
        }
    }

    const moralisLogout = async () => {
        await logout();
        setIsUserLoggedIn(false);
        setCurrentWidget(PAGE.LOGIN);
        console.log("logged out");
    }

    const getDisplayAddress = () => {
        if (!isAuthenticated) {
            return "";
        }
        const address = account.toString();
        console.log(address);
        if (address === null || address === undefined || address === "") {return "";}
        return (address.substring(0, 5) + "..." +
            address.substr(address.length - 3, 3)).toUpperCase();
    }

    const LandingPage = () => {
        return (
            <div>
                <button id="buyToken" className={"page-button"} onClick={() => setCurrentWidget(PAGE.LOGIN)}
                        style={{width:140, marginLeft:250, position:"absolute", top:30, right:80}}>
                    CREATE A DAO
                </button>
            </div>
        );
    }

    const LoginPage = () => {
        return (
            <div className={"createDaoLogin"}>
                <div>
                    <div className="title">
                        <img src={createDao}/>
                    </div>
                    <div className="welcomeText1">
                        Hello there!
                    </div>
                    <div className="welcomeText2">
                        Connect to create a DAO
                    </div>
                    <div className={"body"}>
                        {/*onClick={() => loginWeb3auth("metamask")}*/}
                        <button className="modalLoginButton" onClick={moralisLogin}>
                            <img src={metamask2} style={{padding:20}}/>
                        </button>
                        <div className={"loginWithoutWallet"}>
                            <a onClick={moralisLogout}
                               style={{textDecorationLine: "underline"}}>login without crypto wallet </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // const getPage = () => {
    //     return currentStep === STEP_NUMBER.GUIDE ? (<StartDao />) : (<DAOCreateSteps />);
    // }

    const StartDao = () => {
        return (
            <div>
                <div className={"createDaoLogin"}>
                    <div className={"welcomeText2"} style={{paddingTop:100}}>
                        Start Your DAO
                    </div>
                    <div className={"welcomeText1"}>
                        Rally support, fund your project, and reward your backers by launching a crowdfund. All it takes is a name and a funding goal.
                    </div>
                    <div className={"body"} style={{paddingBottom:100}}>
                        {/*<StepBlock blockTitle={"Creation guide"} onClickGoToStep={STEP_NUMBER.BASICS} blockDescription={"Read all the tips on how to succesfully create and run a DAO."}/>*/}
                        <StepBlock blockTitle={"Basics"} onClickGoToStep={STEP_NUMBER.BASICS}  blockDescription={"Name your project, upload an image, and set the details."}/>
                        <StepBlock blockTitle={"Templates & Configurations"} onClickGoToStep={STEP_NUMBER.SETTINGS} blockDescription={"Choose your template and set the ... for your DAO."}/>
                        <StepBlockOptional blockTitle={"Create your Token"} blockDescription={"Name your token, upload image and set the details."}/>
                        <StepBlock blockTitle={"Go live!"} onClickGoToStep={STEP_NUMBER.GO_LIVE} blockDescription={"Take your DAO public by completing the final checklist, cross-checking the values, and ensuring there aren’t any mis-spellings."}/>
                    </div>
                </div>
            </div>
        );
    }

    const StepBlock = ({ blockTitle, blockDescription, onClickGoToStep=STEP_NUMBER.GUIDE }) => {
        return (
            <div className={"stepBlock"}>
                <div className={"rect1"}>
                    <img src={rectImage} style={{paddingTop:20}}/>
                </div>
                <div>
                    <div style={{display:"flex"}}>
                        <div className={"title"}>
                            {blockTitle}
                        </div>
                        <div className={"rect2"}>
                            <div className={"reqText"}>
                                Required
                            </div>
                        </div>
                    </div>
                    <div className={"description"}>
                        {blockDescription}
                    </div>
                </div>
                <div style={{marginTop:-10, paddingLeft:20}}> {/* className={"arrow"}*/}
                    <img src={vertLine}/>
                </div>
                <div>
                    <button className={"button1"} onClick={() => updateCurrentStepNo(onClickGoToStep)}>
                        <img src={rightArrow}/>
                    </button>
                </div>
            </div>
        );
    }

    const StepBlockOptional = ({blockTitle, blockDescription}) => {
        return (
            <div className={"stepBlock"} id={"stepBlockOptional"}>
                <div className={"rect1"} style={{background: "#FFFFFF"}}>
                    <img src={rectImage} style={{paddingTop:20}}/>
                </div>
                <div>
                    <div style={{display:"flex"}}>
                        <div className={"title"} style={{color: "#76808D"}}>
                            {blockTitle}
                        </div>
                        <div className={"rect2"} style={{background:"#FFFFFF"}}>
                            <div className={"reqText"} style={{color: "rgba(118, 128, 141, 0.5)"}}>
                                Optional
                            </div>
                        </div>
                    </div>
                    <div className={"description"} style={{color: "#76808D"}}>
                        {blockDescription}
                    </div>
                </div>
                <div style={{marginTop:-10, paddingLeft:20}}> {/* className={"arrow"}*/}
                    <img src={vertLineOptional}/>
                </div>
                <div>
                    <button className={"button1"} style={{background: "#F0F0F0"}} onClick={() => updateCurrentStepNo(STEP_NUMBER.TOKEN)}>
                        <img src={rightArrow}/>
                    </button>
                </div>
            </div>
        );
    }

    // const getLoginBar = () => {
    //     return (
    //             <LoginBar isUserLoggedIn={isAuthenticated} onLoginButtonClick={moralisLogin}
    //                       onLogoutButtonClick={moralisLogout} displayAddress={getDisplayAddress()}
    //                       showStatus={false} status={""}
    //             />
    //     );
    // }

    function handleUpload(event) {
        setFile(event.target.files[0]);

        // Add code here to upload file to server
        // ...
    }

    const ImageThumb = ({ image }) => {
        return <img src={URL.createObjectURL(image)} alt={image.name} />;
    };

    const DAOCreateSteps = () => {
        return (
            <div>
                <CreateDaoSidebar currentStepNo={currentStep} updateCurrentStep={updateCurrentStepNo}/>
                {renderPage()}
                {/*{*/}
                {/*    currentStep === STEP_NUMBER.BASICS &&*/}
                {/*    <BasicsPage />*/}
                {/*}*/}
                {/*{*/}
                {/*    currentStep === STEP_NUMBER.SETTINGS &&*/}
                {/*    <SettingsPage />*/}
                {/*}*/}
                {/*{*/}
                {/*    currentStep === STEP_NUMBER.TOKEN &&*/}
                {/*    <TokenPage />*/}
                {/*}*/}
                {/*{*/}
                {/*    currentStep === STEP_NUMBER.GO_LIVE &&*/}
                {/*    <GoLivePage />*/}
                {/*}*/}
            </div>
        );
    }

    const handleDescValueChange = () => {
        console.log(desc);
    }

    const BasicsPage = () => {
        return (
            <div className={"something"} style={{paddingLeft:480, paddingTop:100}}>
                <div className={"pageTitle"}>
                    Basics
                </div>
                <div className={"pageDescription"}>
                    Name your project, upload an image, and set the details.
                </div>
                <div className={"titleBar"}>
                    <div className={"titleTile"} style={{width:380}}>
                        <div className={"pageItemHeader"}>
                            Title
                        </div>
                        <input className={"inputField"} type="title" name="title" value={desc} style={{height:40, width:340}}
                               autoFocus placeholder="Name your DAO" onChange={handleDescValueChange} />
                    </div>
                    <div className={"titleTile"} style={{width:280}}>
                        <div className={"pageItemHeader"}>
                            Purpose
                        </div>
                        <input className={"inputField"} type="title" name="title" value={desc} style={{height:40, width:240}}
                               placeholder="Choose Purpose" onChange={handleDescValueChange} />
                    </div>
                </div>
                <div className={"pageItemHeader"}>
                    Short description
                </div>
                <input className={"inputField"} type="shortDesc" name="shortDesc" value={desc}
                       placeholder="In a few words" onChange={handleDescValueChange} />
                <div className={"pageItemHeader"}>
                    Long description
                </div>
                <input className={"inputField"} type="longDesc" name="longDesc" value={desc} style={{height:150}}
                       placeholder="Explain in detail" onChange={handleDescValueChange} />
                <div className={"pageItemHeader"}>
                    Cover image
                    <div className={"fieldDesc"}>
                        The cover image is similar to album artwork, or a movie poster. It should visually summarize your project in an artistic way
                        , and will be surfaced at the top of your entry and as the preview card across social media platforms. Images must be 2:1 ratio. Suggested dimensions 3000x1500.
                    </div>
                    <div id="upload-box">
                        <input type="file" onChange={handleUpload} />
                        <p>Filename: {file.name}</p>
                        <p>File type: {file.type}</p>
                        <p>File size: {file.size} bytes</p>
                        {file && <ImageThumb image={file} />}
                    </div>
                </div>
                <div className={"pageItemHeader"}>
                    Tags
                </div>
                <div className={"pageItemHeader"}>
                    Community links
                </div>
                <div>
                    <button id="nextButtonBasics" className={"nextButton"} onClick={() => updateCurrentStepNo(STEP_NUMBER.SETTINGS)}>
                        NEXT STEP
                    </button>
                </div>
            </div>
        );
    }

    const SettingsPage = () => {
        return (
            <div className={"something"} style={{paddingLeft:480, paddingTop:100}}>
                <div className={"pageTitle"}>
                    Settings
                </div>
                <div className={"pageDescription"}>
                    Choose your template and more
                </div>
                <div className={"pageItemHeader"}>
                    Select a template
                    <div className={"fieldDesc"}>
                        Create your organisation with our pre-configured templates.
                    </div>
                </div>
                <div className={"pageItemHeader"}>
                    Voting
                    <div className={"fieldDesc"}>
                        Choose your voting application settings.
                    </div>
                </div>
                <div>
                    <button id="nextButtonSettings" className={"nextButton"} onClick={() => updateCurrentStepNo(STEP_NUMBER.TOKEN)}>
                        NEXT STEP
                    </button>
                </div>
            </div>
        );
    }

    const TokenPage = () => {
        return (
            <div className={"something"} style={{paddingLeft:480, paddingTop:100}}>
                <div className={"pageTitle"}>
                    Token
                </div>
                <div className={"pageDescription"}>
                    Mint ERC20 tokens to create new communities and distribute ownership. Learn more
                </div>
                <div className={"pageItemHeader"}>
                    Description
                    <div className={"fieldDesc"}>
                        Briefly describe your token for use on Mirror and social sharing.
                    </div>
                </div>
                <input className={"inputField"} type="tokenDesc" name="tokenDesc" value={desc} style={{height:150}}
                       autoFocus placeholder="Explain in detail" onChange={handleDescValueChange} />
                <div className={"pageItemHeader"}>
                    Supply
                    <div className={"fieldDesc"}>
                        Define the initial token supply.
                    </div>
                </div>
                <input className={"inputField"} type="supply" name="supply" value={desc} style={{height:50}}
                       autoFocus placeholder="100,000,000" onChange={handleDescValueChange} />
                <div className={"pageItemHeader"}>
                    Holder
                    <div className={"fieldDesc"}>
                        Enter the address that controls the token. This should probably be a multi-sig. Make sure to enter the Ethereum address, not the ENS name.
                    </div>
                </div>
                <input className={"inputField"} type="holder" name="holder" value={desc} style={{height:50}}
                       autoFocus placeholder="0x3429…" onChange={handleDescValueChange} />
                <div className={"pageItemHeader"}>
                    Icon image
                    <div className={"fieldDesc"}>
                        Brand your token by uploading an icon image.
                    </div>
                </div>
                <div>
                    <button id="nextButtonToken" className={"nextButton"} onClick={() => updateCurrentStepNo(STEP_NUMBER.GO_LIVE)}>
                        NEXT STEP
                    </button>
                </div>
            </div>
        );
    }

    const GoLivePage = () => {
        return (
            <div className={"something"} style={{paddingLeft:480, paddingTop:100}}>
                <div className={"pageTitle"}>
                    Go live
                </div>
                <div className={"pageDescription"}>
                    Take your crowdfund public by completing the final checklist, cross-checking the values, and ensuring there aren’t any mis-spellings.
                </div>

                <div>
                    <button id="buttonDeploy" className={"nextButton"} onClick={() => updateCurrentStepNo(STEP_NUMBER.BASICS)}>
                        DEPLOY
                    </button>
                </div>
            </div>
        );
    }

    const renderPage = () => {
        console.log(currentStep);

        if (currentStep === STEP_NUMBER.BASICS) {
            return (
                <div>
                    <BasicsPage />
                </div>
            );
        } else if (currentStep === STEP_NUMBER.SETTINGS) {
            return (
                <div>
                    <SettingsPage />
                </div>
            );
        } else if (currentStep === STEP_NUMBER.TOKEN) {
            return (
                <div>
                    <TokenPage />
                </div>
            );
        } else if (currentStep === STEP_NUMBER.GO_LIVE) {
            return (
                <div>
                    <GoLivePage />
                </div>
            );
        }
        return (
            <div></div>
        );
    }

    return (
        <div className={"createDaoPage"}>
            {
                currentWidget === PAGE.LANDING &&
                <LandingPage />
            }
            {
                currentWidget === PAGE.LOGIN &&
                <LoginPage />
            }
            {
                currentWidget === PAGE.START_DAO && //getLoginBar()
                <LoginBar isUserLoggedIn={isAuthenticated} onLoginButtonClick={moralisLogin}
                onLogoutButtonClick={moralisLogout} displayAddress={getDisplayAddress()}
                showStatus={false} status={""}
                />
            }
            {
                currentWidget === PAGE.START_DAO && currentStep === STEP_NUMBER.GUIDE &&
                <StartDao />
            }
            {
                currentWidget === PAGE.START_DAO && currentStep !== STEP_NUMBER.GUIDE &&
                <DAOCreateSteps />
            }
        </div>
    );
};

export default CreateDAO;