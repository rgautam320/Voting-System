# Voting Application using web3.0

## Technologies or Frameworks or Languages Used

1. Smart Contract
2. React
3. Truffle
4. Ganache
5. Metamask
6. Roptsten
7. Remix

## [Live URL](https://web3-voting-app.netlify.app)

## Project Preview

Voting is one of the most popular example to illustrate the potentials of Blockchain and Smart Contracts. Voting is a use case that is well aligned to the unique propositions of Blockchain technology.

### Basic Principle of Voting

According to the Equal Justice Foundation, the 6 principles of voting are as follows.

-   **Secret Ballot**: Your vote is secret. Nobody should be able to link your vote back to your race, gender, age and personal profile.
-   **One man, one vote**: Every voter votes once and the voting system must be able to reconcile the total number of votes to the total number of voters and those who did not vote.
-   **Voter eligibility**: Only eligible voters are allowed to vote.
-   **Transparency**: The vote counting process is fixed, rules are well established,known to voters and withstands public scrutiny.
-   **Votes accurately recorded and counted**: Vote counting is consistent. Rules are cast in stone. Vote counts are audit-able.
-   **Reliability**: Voting system must be accurate and verifiable. Safeguards are in place to prevent frauds, accidents and security breeches.

This application is covers all these principles. It is fully a Web3.0 Application where anyone can create a Poll or Voting and share `contract address` with others.

## How does the Ballot contract implement the principles of voting?

### Secret Ballot

In the ballot contract, only wallet addresses and names are recorded. Every voter is identified by their MetaMask wallet address. Other than the manager who was the person who created the new instance of the ballot contract, no one else can tell who voted yes or no. For the technical folks among us, I meant to say that the votes array is declared private so no one can read the contents of the votes array.

### One man one vote

The voters array stores a list of voters who have voted. It ensures that no one can vote the second time. Once a voter votes, his status changes to “voted” and the ballot contract checks to ensure that he does not vote again.

### Voter eligibility

Voter eligibility is determined by assembling a voters’ array of wallet address before voting begins. You need to vote with your MetaMask Wallet whose address matches the one that the manager registers before voting begins.

### Transparency

This is one of the things that Blockchain does extremely well. Every action taken and every record etched on the Blockchain is immutable. On a public Blockchain, collusion is close to impossible as described here.

### Votes accurately recorded and counted

In the ballot smart contract, the ballot goes through several states, from the point it is created, open for voting to the point where ballot is closed and votes are counted.

### Reliability

There is no single point of failure on a Blockchain as every node in the chain participates in keeping the Blockchain running.

## Application Preview

1.  Home Page
    This is the landing page of the application. At the left top corner, you can see a hamburger icon which is used to open menu.

    ![image](https://user-images.githubusercontent.com/71542496/183929649-e721add2-0fff-4868-ade1-cbd91ab29c51.png)

2.  Create Ballot
    This asks for the Ballot name and proposal of voting. Once you fill in the form, you need to deploy your contract. The app will open up your MetaMask.

    ![image](https://user-images.githubusercontent.com/71542496/183930441-6845d9c9-9403-489e-8ff8-869551484089.png)

    ![image](https://user-images.githubusercontent.com/71542496/183930669-d27fc9b7-2643-463c-90e4-3315d91555dc.png)

    Once you complete the transaction, you will get toast as well as more fields to fill in.

    ![image](https://user-images.githubusercontent.com/71542496/183930994-0aff8c61-27d1-4b34-ad34-2893c3ccd3f8.png)

    You need to add multiple choices and also need to add voters. Only added voters can vote. Once choices and voters are filled in, `Start Voting` button gets activated. After adding choices and voters, you can see the screen like this.

    ![image](https://user-images.githubusercontent.com/71542496/183932795-fae9701f-1d44-4df8-b160-1788d60759f7.png)

    Once you click on `Start Voting`, it can't be modified.

    ![image](https://user-images.githubusercontent.com/71542496/183933495-0935ab05-be98-4734-b273-f5ecb2da6d86.png)

3.  Voting Page
    If you're the creator, you can't vote. You will get option to end vote.

    ![image](https://user-images.githubusercontent.com/71542496/183934198-6e064b23-dcd5-4a4c-8557-ee475b593bdd.png)

    You require a `contract address` to access the voting as well as you need to be added as Voters by the Voting creator. Once you fill in the contract address and click on `Get Ballot`, you will get option to vote, if you already haven't voted.

    ![image](https://user-images.githubusercontent.com/71542496/183934984-56681271-24ef-4a88-8509-e0ae30b885ae.png)

    Once you vote, you can't revert and vote again. You can still come and see how many have voted.

    ![image](https://user-images.githubusercontent.com/71542496/183935585-31d9fb36-6809-4c70-ba1f-aeca3e0cfa74.png)

    Manager can see how many have voted and end the voting at any time.

    ![image](https://user-images.githubusercontent.com/71542496/183937177-eafe8b23-ad90-46aa-a9da-0d1ba6a5c40d.png)

4.  Result Page
    If voting's ended, you can go to result page and see the result. You need to pass contract address.

    ![image](https://user-images.githubusercontent.com/71542496/183946265-c8e41e97-bbe2-4805-84df-b0871e884bfe.png)

    You need to click on `Get Result` to get the final result.

    ![image](https://user-images.githubusercontent.com/71542496/183938260-c58b2652-9b34-448b-b090-48543d1b3910.png)

### Thank You

### Rajan Gautam
