# Unit tests for 'Voting' contract (exercise n°2) [Alyra](https://alyra.fr/)

***

## Notes :

For this exercise, I decided to do it sequentially. Therefore, the tests follow the normal way of working of the contract, that led me to make some back and forth at the time of the changes of state of the workflow. (maybe an optimization to do with this, because I have redundancies in the tests, but it's a bias, and at least, everything is tested).


Otherwise I think I have tested all the possibilities of interaction and functionalization with the contract.

---

## Install dependencies :
```
    npm install --prefix . @openzeppelin/contracts
    npm install --prefix . @openzeppelin/test-helpers
    npm install --prefix . eth-gas-reporter
```    
#### Or
```
    npm install --prefix . @openzeppelin/contracts @openzeppelin/test-helpers eth-gas-reporter
```
---

## Usage :
* Open the folder in VSC and then open the terminal and execute the command ```$ truffle compile``` to compile the contract. 
* Then to run the test on the voting contract, run the command : ``$ truffle test``
* Note : 
    
    ##### Compiler configuration "0.8.17"

    ##### Using network 'development'.

    ##### My testing script is located in test/testVoting.js

    ##### The script is testing 50 cases
---

## result obtained :

```
  Contract: Voting
    Complete test :
      Smart contract owner test :
        ✓ should define the owner of the smart contract (33ms)
        ✓ should define that the user is not the owner of the smartcontract (26ms)
      Add Voters test :
        tallyVotes() before addVoter() test :
          ✓ should define that the user is not allowed to interact with the function (692ms)
          ✓ should revert because the proposal phase tally Votes is not open (40ms)
        addVoter() test :
          ✓ should define that the user is not allowed to interact with the function (40ms)
          ✓ should test voter registration emit the proper event (761ms, 188080 gas)
          ✓ should not add a voter twice (51ms)
          ✓ should must verify that the Workflow Status is ProposalsRegistrationStarted (81ms)
      getVoter() test :
        ✓ should check only voters (39ms)
        ✓ should properly register a voter (88ms)
      Proposals Registering test :
        addProposal() before startProposalsRegistering() test :
          ✓ should revert because the proposal phase is not yet open (43ms)
        startProposalsRegistering() test :
          ✓ should define that the user is not allowed to interact with the function (41ms)
          ✓ should must verify that the Workflow Status Change (230ms, 89132 gas)
        getOneProposal() GENESIS test :
          ✓ should check only voters (27ms)
          ✓ should must verify that the GENESIS proposal has been inserted into the proposal table was entered at the time of the state change (36ms)
        addProposal() test :
          ✓ should check only voters (47ms)
          ✓ should check that the proposal sent is not empty (36ms)
          ✓ should check that the proposal has been sent (1022ms, 221920 gas)
          getOneProposal() test :
            ✓ should must verify that the proposal has been inserted in the proposal table (30ms)
        startVotingSession() before endProposalsRegistering() test :
          ✓ should define that the user is not allowed to interact with the function (31ms)
          ✓ should revert because the roposals phase is not finished (25ms)
        endProposalsRegistering() test :
          ✓ should define that the user is not allowed to interact with the function (33ms)
          ✓ should must verify that the Workflow Status Change (143ms, 30799 gas)
          ✓ should must verify that the Workflow Status is endProposalsRegistering (24ms)
        startVotingSession() after endProposalsRegistering() test :
          ✓ should define that the user is not allowed to interact with the function (28ms)
          ✓ should revert because the roposals phase is finished (28ms)
      Voting Session test :
        setVote() before startVotingSession() test :
          ✓ should check only voters (80ms)
          ✓ should revert because the vote phase is not yet open (38ms)
        startVotingSession() test :
          ✓ should define that the user is not allowed to interact with the function (55ms)
          ✓ should must verify that the Workflow Status Change (134ms, 30754 gas)
          ✓ should must verify that the Workflow Status is VotingSessionStarted (29ms)
        setVote() test :
          ✓ should check only voters (35ms)
          ✓ should must verify that the vote corresponds to an existing proposal (34ms)
          ✓ should must verify that the vote has been taken into account (151ms, 74913 gas)
          ✓ should must verify that you have not already voted (37ms)
        tallyVotes() before endVotingSession() test :
          ✓ should define that the user is not allowed to interact with the function (92ms)
          ✓ should revert because the roposals phase is not finished (27ms)
        endVotingSession() test :
          ✓ should define that the user is not allowed to interact with the function (32ms)
          ✓ should must verify that the Workflow Status Change (122ms, 30733 gas)
          ✓ should must verify that the Workflow Status is VotingSessionEnded (23ms)
        startVotingSession() after endVotingSession() test :
          ✓ should define that the user is not allowed to interact with the function (27ms)
          ✓ should revert because the roposals phase is finished (31ms)
      tally Votes test :
        addVoter() before tallyVotes() test :
          ✓ should define that the user is not allowed to interact with the function (46ms)
          ✓ should revert because the addVoter phase is not yet open (28ms)
        tallyVotes() test :
          ✓ should define that the user is not allowed to interact with the function (29ms)
          ✓ should must verify that the Workflow Status Change (229ms, 73673 gas)
          ✓ should must verify that the Workflow Status is VotesTallied (28ms)
        endVotingSession() after tallyVotes() test :
          ✓ should define that the user is not allowed to interact with the function (370ms)
          ✓ should revert because the roposals phase is finished (28ms)
      winningProposalID test :
        ✓ should must verify that the winning proposition is equal to 1 (24ms)
```

---

```bash
·------------------------------------------|----------------------------|-------------|----------------------------·
|   Solc version: 0.8.17+commit.8df45f5f   ·  Optimizer enabled: false  ·  Runs: 200  ·  Block limit: 6718946 gas  │
···········································|····························|·············|·····························
|  Methods                                                                                                         │
·············|·····························|··············|·············|·············|··············|··············
|  Contract  ·  Method                     ·  Min         ·  Max        ·  Avg        ·  # calls     ·  eur (avg)  │
·············|·····························|··············|·············|·············|··············|··············
|  Voting    ·  addProposal                ·           -  ·          -  ·      55480  ·           9  ·          -  │
·············|·····························|··············|·············|·············|··············|··············
|  Voting    ·  addVoter                   ·           -  ·          -  ·      47020  ·          13  ·          -  │
·············|·····························|··············|·············|·············|··············|··············
|  Voting    ·  endProposalsRegistering    ·           -  ·          -  ·      30799  ·           8  ·          -  │
·············|·····························|··············|·············|·············|··············|··············
|  Voting    ·  endVotingSession           ·           -  ·          -  ·      30733  ·           8  ·          -  │
·············|·····························|··············|·············|·············|··············|··············
|  Voting    ·  setVote                    ·       59913  ·      74913  ·      73246  ·           9  ·          -  │
·············|·····························|··············|·············|·············|··············|··············
|  Voting    ·  startProposalsRegistering  ·           -  ·          -  ·      89132  ·           6  ·          -  │
·············|·····························|··············|·············|·············|··············|··············
|  Voting    ·  startVotingSession         ·           -  ·          -  ·      30754  ·           5  ·          -  │
·············|·····························|··············|·············|·············|··············|··············
|  Voting    ·  tallyVotes                 ·           -  ·          -  ·      73673  ·           5  ·          -  │
·············|·····························|··············|·············|·············|··············|··············
|  Deployments                             ·                                          ·  % of limit  ·             │
···········································|··············|·············|·············|··············|··············
|  Voting                                  ·           -  ·          -  ·    2076814  ·      30.9 %  ·          -  │
·------------------------------------------|--------------|-------------|-------------|--------------|-------------·

  50 passing (18s)
```
---
## License :
* [MIT License](https://choosealicense.com/licenses/mit/)

---