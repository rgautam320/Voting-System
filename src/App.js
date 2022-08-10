import React, { useCallback } from "react";
import { useEffect } from "react";
import { useState } from "react";
import Web3 from "web3";
import { Routes, Route } from "react-router-dom";
import { Backdrop, Box, CircularProgress } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";

import { ABI } from "./data/Data";

import Create from "./pages/Create";
import Voting from "./pages/Voting";
import Result from "./pages/Result";
import Home from "./pages/Home";
import Appbar from "./components/Appbar";

import "./App.css";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
    const [loading, setLoading] = useState(false);
    const [account, setAccount] = useState("");
    const [voting, setVoting] = useState();
    const [contract, setContract] = useState("");
    const [choices, setChoices] = useState([]);
    const [disable, setDisable] = useState(false);
    const [totalVoters, setTotalVoters] = useState(0);
    const [state, setState] = useState(-1);
    const [ballot, setBallot] = useState({
        name: "",
        proposal: "",
        address: "",
    });
    const [isAlreadyCreated, setIsAlreadyCreated] = useState(false);
    const [visible, setVisible] = useState(false);
    const [ended, setEnded] = useState(false);
    const [totalVote, setTotalVote] = useState(0);
    const [isVoter, setIsVoter] = useState(false);
    const [hasVoted, setHasVoted] = useState(false);

    const loadBlockchainData = useCallback(async () => {
        setLoading(true);
        const web3 = new Web3(Web3.givenProvider || window.ethereum);

        if (!web3) {
            return toast.error("Please install MetaMask.");
        }

        const accounts = await web3.eth.requestAccounts();
        setAccount(accounts[0]);

        let votingContract;
        if (contract) {
            votingContract = new web3.eth.Contract(ABI, contract);
        } else {
            votingContract = new web3.eth.Contract(ABI);
        }
        setVoting(votingContract);
        setLoading(false);
    }, [contract]);

    const getChoices = useCallback(async () => {
        setLoading(true);
        const choiceCount = await voting.methods.choiceCount().call();
        let fetchedChoices = [];
        for (let i = 0; i < choiceCount; i++) {
            const fetchedChoice = await voting.methods.choices(i).call();
            fetchedChoices.push(fetchedChoice);
        }
        setChoices(fetchedChoices);
        setLoading(false);
    }, [voting, setLoading]);

    const startVoting = async (e) => {
        e.preventDefault();
        setLoading(true);

        await voting.methods
            .startVote()
            .send({ from: account })
            .once("receipt", () => {
                toast.success("Voting Started");
                setDisable(true);
            });
        setLoading(false);
    };

    const getVoters = useCallback(async () => {
        setLoading(true);
        const totalVoter = await voting.methods.totalVoter().call();

        setTotalVoters(parseInt(totalVoter));
        setLoading(false);
    }, [voting, setLoading]);

    const getCurrentState = useCallback(async () => {
        setLoading(true);
        const state = await voting.methods.state().call();
        setState(parseInt(state));
        setEnded(parseInt(state) === 2);
        setLoading(false);
    }, [setLoading, voting]);

    const getBallotDetails = useCallback(
        async (e) => {
            e?.preventDefault();
            setLoading(true);
            const ballotName = await voting.methods.ballotOfficialName().call();
            const ballotAddress = await voting.methods.ballotOfficialAddress().call();
            const proposal = await voting.methods.proposal().call();
            if (ballotName && proposal) {
                setBallot({ proposal: proposal, name: ballotName, address: ballotAddress });
                setIsAlreadyCreated(true);
            }
            setState(parseInt(state));
            setLoading(false);
            setVisible(true);
        },
        [voting, state, setLoading]
    );

    const checkIsVoter = useCallback(async () => {
        setLoading(true);
        const result = await voting.methods.voterRegister(account).call();
        if (result?.voterName) {
            setIsVoter(true);
            setHasVoted(result?.voted);
        }
        setLoading(false);
    }, [setLoading, voting, account]);

    const endVoting = async () => {
        setLoading(true);

        await voting.methods
            .endVote()
            .send({ from: account })
            .on("error", (error) => {
                toast.error(error.message);
                setLoading(false);
            })
            .on("receipt", (receipt) => {
                toast.success("Voting ended successfully.");
                setEnded(receipt.status);
                console.log(receipt);
            });
        setLoading(false);
    };

    const getTotalVotes = useCallback(async () => {
        setLoading(true);

        const totalVotes = await voting.methods.totalVote().call();

        setTotalVote(parseInt(totalVotes));

        setLoading(false);
    }, [setLoading, voting]);

    useEffect(() => {
        if (localStorage.getItem("CONTRACT")) {
            setContract(localStorage.getItem("CONTRACT"));
        }
        loadBlockchainData();
    }, [loadBlockchainData]);

    return (
        <Box>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <Appbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route
                    path="/ballot"
                    element={
                        <Create
                            voting={voting}
                            account={account}
                            contract={contract}
                            setContract={setContract}
                            setLoading={setLoading}
                            // Choices
                            getChoices={getChoices}
                            choices={choices}
                            // Voting
                            disable={disable}
                            setDisable={setDisable}
                            startVoting={startVoting}
                            // Voters
                            totalVoters={totalVoters}
                            getVoters={getVoters}
                            // Get State
                            state={state}
                            getCurrentState={getCurrentState}
                            // Get Ballot
                            ballot={ballot}
                            setBallot={setBallot}
                            getBallotDetails={getBallotDetails}
                            isAlreadyCreated={isAlreadyCreated}
                            setIsAlreadyCreated={setIsAlreadyCreated}
                        />
                    }
                />
                <Route
                    path="/voting"
                    element={
                        <Voting
                            account={account}
                            voting={voting}
                            setLoading={setLoading}
                            setContract={setContract}
                            contract={contract}
                            // Choices
                            getChoices={getChoices}
                            choices={choices}
                            // Get State
                            state={state}
                            ended={ended}
                            getCurrentState={getCurrentState}
                            // Get Ballot
                            ballot={ballot}
                            setBallot={setBallot}
                            visible={visible}
                            getBallotDetails={getBallotDetails}
                            // End Voting
                            endVoting={endVoting}
                            // Total Votes
                            totalVote={totalVote}
                            getTotalVotes={getTotalVotes}
                            getVoters={getVoters}
                            totalVoters={totalVoters}
                            // Check
                            checkIsVoter={checkIsVoter}
                            isVoter={isVoter}
                            hasVoted={hasVoted}
                        />
                    }
                />
                <Route
                    path="/result"
                    element={
                        <Result
                            setLoading={setLoading}
                            getBallotDetails={getBallotDetails}
                            state={state}
                            ballot={ballot}
                            setContract={setContract}
                            contract={contract}
                            // Voting
                            voting={voting}
                            // Choices
                            choices={choices}
                            getChoices={getChoices}
                            getCurrentState={getCurrentState}
                        />
                    }
                />
            </Routes>
            <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </Box>
    );
};

export default App;
