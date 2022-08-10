import React, { useState, useEffect } from "react";
import { Alert, Box, Button, Container, Divider, Paper, TextField, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";

import { BYTE_CODE } from "../data/Data";

const Create = ({
    account,
    setLoading,
    contract,
    setContract,
    getChoices,
    choices,
    disable,
    setDisable,
    startVoting,
    totalVoters,
    getVoters,
    getCurrentState,
    state,
    getBallotDetails,
    ballot,
    setIsAlreadyCreated,
    isAlreadyCreated,
    setBallot,
    voting,
}) => {
    const [choice, setChoice] = useState("");

    const [voter, setVoter] = useState({
        name: "",
        address: "",
    });

    const onCreateBallot = async (e) => {
        e.preventDefault();
        setLoading(true);

        await voting
            .deploy({
                data: BYTE_CODE.object,
                arguments: [ballot.name, ballot.proposal],
            })
            .send({ from: account })
            .on("error", (error) => {
                toast.error(error.message);
                setLoading(false);
            })
            .on("receipt", (receipt) => {
                toast.success("Contract deployed successfully.");
                localStorage.setItem("CONTRACT", receipt.contractAddress);
                setContract(receipt.contractAddress);
                setIsAlreadyCreated(true);
            });
        setLoading(false);
    };

    const onAddChoice = async (e) => {
        e.preventDefault();
        setLoading(true);

        await voting.methods
            .addChoice(choice)
            .send({ from: account })
            .on("error", (error) => {
                toast.error(error.message);
                setLoading(false);
            })
            .on("receipt", (_) => {
                toast.success("Choice Added");
                setChoice("");
                getChoices();
            });
        setLoading(false);
    };

    const onAddVoter = async (e) => {
        e.preventDefault();
        setLoading(true);

        await voting.methods
            .addVoter(voter.address, voter.name)
            .send({ from: account })
            .on("error", (error) => {
                toast.error(error.message);
                setLoading(false);
            })
            .on("receipt", () => {
                toast.success("Voter Added");
                setVoter({ name: "", address: "" });
                getVoters();
            });
        setLoading(false);
    };

    useEffect(() => {
        if (contract && voting?._address) {
            getBallotDetails();
            getChoices();
            getVoters();
            getCurrentState();
        }
        setDisable(state === 1);
    }, [contract, state, voting?._address, setDisable, getBallotDetails, getChoices, getVoters, getCurrentState]);

    return (
        <Container>
            <Box mt={4} mb={8} paddingX={6}>
                {disable && (
                    <Box my={2}>
                        <Paper sx={{ padding: "0.6rem" }}>
                            <Alert severity="success">
                                Voting has started. <NavLink to="/voting">Click here</NavLink> to vote.{" "}
                            </Alert>
                        </Paper>
                    </Box>
                )}
                <Box my={2}>
                    <Paper>
                        <Box py={1}>
                            <Typography variant="h4" fontWeight="bold" textAlign="center">
                                Create Ballot
                            </Typography>
                        </Box>
                        <Divider />
                        <Box margin={2} paddingY={2}>
                            {isAlreadyCreated && <Alert severity="success">Ballot already created.</Alert>}
                            <form onSubmit={onCreateBallot}>
                                <Box my={2}>
                                    <TextField
                                        value={ballot.name}
                                        name="name"
                                        id="outlined-basic"
                                        label="Ballot Name"
                                        variant="outlined"
                                        onChange={(e) => setBallot({ ...ballot, name: e.target.value })}
                                        fullWidth
                                    />
                                </Box>
                                <Box my={2}>
                                    <TextField
                                        value={ballot.proposal}
                                        name="proposal"
                                        id="outlined-basic"
                                        label="Proposal"
                                        variant="outlined"
                                        onChange={(e) => setBallot({ ...ballot, proposal: e.target.value })}
                                        fullWidth
                                    />
                                </Box>
                                {localStorage.getItem("CONTRACT") && (
                                    <Box my={2}>
                                        <Alert>Contract Address: {localStorage.getItem("CONTRACT")}</Alert>
                                    </Box>
                                )}
                                <Box>
                                    <Button variant="contained" type="submit" fullWidth>
                                        Create Ballot
                                    </Button>
                                </Box>
                            </form>
                        </Box>
                    </Paper>
                </Box>
                {isAlreadyCreated && (
                    <Box my={2}>
                        <Paper>
                            <Box py={1}>
                                <Typography variant="h4" fontWeight="bold" textAlign="center">
                                    Add Choices
                                </Typography>
                            </Box>
                            <Divider />
                            <Box margin={2} paddingY={2}>
                                <form onSubmit={onAddChoice}>
                                    <Box my={2} display="flex" alignItems="center" sx={{ height: "3.25rem" }}>
                                        <Box mr={2} width="100%">
                                            <TextField
                                                value={choice}
                                                name="choice"
                                                id="outlined-basic"
                                                label="Enter Choice"
                                                variant="outlined"
                                                disabled={disable || state === 1}
                                                onChange={(e) => setChoice(e.target.value)}
                                                fullWidth
                                                sx={{ height: "100%" }}
                                            />
                                        </Box>
                                        <Button
                                            variant="contained"
                                            type="submit"
                                            disabled={disable || state === 1}
                                            sx={{ minWidth: "16rem", height: "100%" }}
                                        >
                                            Add Choice
                                        </Button>
                                    </Box>
                                </form>
                                {choices?.length !== 0 && (
                                    <>
                                        <Divider />
                                        <Box my={2}>
                                            {choices?.map((val, ind) => {
                                                return (
                                                    <Paper
                                                        key={ind}
                                                        sx={{
                                                            paddingX: "0.75rem",
                                                            paddingY: "0.6rem",
                                                            marginY: "0.8rem",
                                                        }}
                                                    >
                                                        <Typography variant="h6">{val}</Typography>
                                                    </Paper>
                                                );
                                            })}
                                        </Box>
                                    </>
                                )}
                            </Box>
                        </Paper>
                    </Box>
                )}

                {isAlreadyCreated && (
                    <Box my={2}>
                        <Paper>
                            <Box py={1}>
                                <Typography variant="h4" fontWeight="bold" textAlign="center">
                                    Add Voters
                                </Typography>
                            </Box>
                            <Divider />
                            <Box margin={2} paddingY={2}>
                                <Box my={2}>
                                    {totalVoters !== 0 ? (
                                        <Alert severity="success">{totalVoters} are already registered.</Alert>
                                    ) : (
                                        <Alert severity="warning">No voter has been added.</Alert>
                                    )}
                                </Box>
                                <Divider />
                                <form onSubmit={onAddVoter}>
                                    <Box my={2}>
                                        <TextField
                                            value={voter.address}
                                            name="address"
                                            id="outlined-basic"
                                            label="Voter Address"
                                            variant="outlined"
                                            onChange={(e) => setVoter({ ...voter, address: e.target.value })}
                                            disabled={disable || state === 1}
                                            fullWidth
                                        />
                                    </Box>
                                    <Box my={2}>
                                        <TextField
                                            value={voter.name}
                                            name="Name"
                                            id="outlined-basic"
                                            label="Voter's Name"
                                            variant="outlined"
                                            onChange={(e) => setVoter({ ...voter, name: e.target.value })}
                                            disabled={disable || state === 1}
                                            fullWidth
                                        />
                                    </Box>

                                    <Button
                                        disabled={disable || state === 1}
                                        variant="contained"
                                        type="submit"
                                        fullWidth
                                    >
                                        Add Voter
                                    </Button>
                                </form>
                            </Box>
                        </Paper>
                    </Box>
                )}
                {isAlreadyCreated && (
                    <Box my={2}>
                        <Paper sx={{ padding: "0.5rem" }}>
                            <Button
                                variant="contained"
                                color="secondary"
                                fullWidth
                                disabled={totalVoters === 0 || disable || state === 1 || choices.length === 0}
                                onClick={startVoting}
                            >
                                Start Voting
                            </Button>
                        </Paper>
                    </Box>
                )}
            </Box>
        </Container>
    );
};

export default Create;
