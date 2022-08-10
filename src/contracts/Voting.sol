// SPDX-License-Identifier: Unlicensed

pragma solidity >=0.7.0 <0.9.0;

contract Voting {
    struct Vote {
        address voterAddress;
        string choice;
    }

    struct Voter {
        string voterName;
        bool voted;
    }

    uint256 public totalVoter = 0;
    uint256 public totalVote = 0;
    uint256 public choiceCount = 0;

    address public ballotOfficialAddress;
    string public ballotOfficialName;
    string public proposal;

    mapping(uint256 => string) public choices;
    mapping(uint256 => Vote) private votes;
    mapping(address => Voter) public voterRegister;
    mapping(uint256 => string) public result;

    enum State {
        Created,
        Voting,
        Ended
    }
    State public state;

    constructor(string memory _ballotOfficialName, string memory _proposal) {
        ballotOfficialAddress = msg.sender;
        ballotOfficialName = _ballotOfficialName;
        proposal = _proposal;

        state = State.Created;
    }

    modifier condition(bool _condition) {
        require(_condition);
        _;
    }

    modifier onlyOfficial() {
        require(msg.sender == ballotOfficialAddress);
        _;
    }

    modifier inState(State _state) {
        require(state == _state);
        _;
    }

    event voterAdded(address voter);
    event choiceAdded(string choice);
    event voteStarted();
    event voteEnded();
    event voteDone(address voter);

    // Add Choice
    function addChoice(string memory _choice)
        public
        inState(State.Created)
        onlyOfficial
    {
        choices[choiceCount] = _choice;
        choiceCount++;
        emit choiceAdded(_choice);
    }

    // Add Voter
    function addVoter(address _voterAddress, string memory _voterName)
        public
        inState(State.Created)
        onlyOfficial
    {
        Voter memory v;
        v.voterName = _voterName;
        v.voted = false;
        voterRegister[_voterAddress] = v;
        totalVoter++;
        emit voterAdded(_voterAddress);
    }

    // Declare voting starts now
    function startVote() public inState(State.Created) onlyOfficial {
        state = State.Voting;
        emit voteStarted();
    }

    // Voters vote by indicating their choice
    function doVote(string memory _choice)
        public
        inState(State.Voting)
        returns (bool voted)
    {
        bool found = false;

        if (
            bytes(voterRegister[msg.sender].voterName).length != 0 &&
            !voterRegister[msg.sender].voted
        ) {
            voterRegister[msg.sender].voted = true;
            Vote memory v;
            v.voterAddress = msg.sender;
            v.choice = _choice;

            votes[totalVote] = v;
            totalVote++;

            found = true;
        }
        emit voteDone(msg.sender);
        return found;
    }

    // End Votes
    function endVote() public inState(State.Voting) onlyOfficial {
        state = State.Ended;

        for (uint256 i = 0; i < totalVote; i++) {
            result[i] = votes[i].choice;
        }

        emit voteEnded();
    }

    // Get Votes
    function getVote(string memory _choice)
        public
        view
        inState(State.Ended)
        returns (uint256 voteCount)
    {
        uint256 count = 0;

        for (uint256 i = 0; i < totalVote; i++) {
            if (
                keccak256(bytes(votes[i].choice)) == keccak256(bytes(_choice))
            ) {
                count++;
            }
        }

        return count;
    }
}
