# Unit tests for 'Voting' contract (exercise n°2) [Alyra](https://alyra.fr/)

***

## Notes :

For this exercise, I decided to do it sequentially for v1 then I saw that it was a bad practice to do all my tests on a single contract deployment, that's why I made a v2 that starts at line 372. This way, the tests follow the normal way of working of the contract, which led me to make some round trips when the workflow state changes. (maybe an optimization to do with that, because I have redundancies in the tests, but it's a bias, and at least everything is tested). 

I could also detect a bug in the for loop of the tallyVotes() function because the loop should be set to 1 instead of 0 to bypass the GENESIS proposal which is originally set to not take into account people who didn't vote. 

If the intention of GENESIS was to ignore people who did not vote, there is also a requirement missing in the setVote() function to prevent people from voting for the GENESIS proposal.


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
* Open the folder in VSC, then open the terminal and run the command above to install the dependencies.
* Then compile the contract with the command :```$ truffle compile``` 
* Then to run the test on the voting contract, run the command : ``$ truffle test``
* Note : 
    
    ##### Compiler configuration "0.8.13"

    ##### Using network 'development'.

    ##### My testing script is located in test/testVoting.js

    ##### The script is testing 51 cases
---

## result obtained :

```
    Contract: Voting
    Complete test v2 (good pratique):
      Smart contract owner test :
        ✓ should define the owner of the smart contract (38ms)
        ✓ should define that the user is not the owner of the smartcontract (41ms)
      Add Voters test :
        tallyVotes() before addVoter() test :
          ✓ should define that the user is not allowed to interact with the function (731ms)
          ✓ should revert because the proposal phase tally Votes is not open (137ms)
        addVoter() test :
          ✓ should define that the user is not allowed to interact with the function (57ms)
          ✓ should test voter registration emit the proper event (842ms, 188080 gas)
          addVoter votertwice and ProposalsRegistrationStarted :
            ✓ should not add a voter twice (40ms)
            ✓ should must verify that the Workflow Status is ProposalsRegistrationStarted (30ms)
      getVoter() test :
        ✓ should check only voters (53ms)
        ✓ should properly register a voter (52ms)
      Proposals Registering test :
        addProposal() before startProposalsRegistering() test :
          ✓ should revert because the proposal phase is not yet open (49ms)
        startProposalsRegistering() test :
          ✓ should define that the user is not allowed to interact with the function (35ms)
          ✓ should must verify that the Workflow Status Change (185ms, 89132 gas)
        getOneProposal() GENESIS test :
          ✓ should check only voters (35ms)
          ✓ should must verify that the GENESIS proposal has been inserted into the proposal table was entered at the time of the state change (47ms)
        addProposal() test :
          ✓ should check only voters (43ms)
          ✓ should check that the proposal sent is not empty (47ms)
          ✓ should check that the proposal has been sent (198ms, 55480 gas)
          getOneProposal() test :
            ✓ should must verify that the proposal has been inserted in the proposal table (47ms)
        startVotingSession() before endProposalsRegistering() test :
          ✓ should define that the user is not allowed to interact with the function (38ms)
          ✓ should revert because the roposals phase is not finished (34ms)
        endProposalsRegistering() test :
          ✓ should define that the user is not allowed to interact with the function (36ms)
          ✓ should must verify that the Workflow Status Change (159ms, 30799 gas)
        startVotingSession() after endProposalsRegistering() test :
          ✓ should must verify that the Workflow Status is endProposalsRegistering (83ms)
          ✓ should define that the user is not allowed to interact with the function (41ms)
          ✓ should revert because the roposals phase is finished (97ms)
      Voting Session test :
        setVote() before startVotingSession() test :
          ✓ should check only voters (49ms)
          ✓ should revert because the vote phase is not yet open (37ms)
        startVotingSession() test :
          ✓ should define that the user is not allowed to interact with the function (60ms)
          ✓ should must verify that the Workflow Status Change (131ms, 30754 gas)
        setVote() test :
          ✓ should must verify that the Workflow Status is VotingSessionStarted (34ms)
          ✓ should check only voters (37ms)
          ✓ should must verify that the vote corresponds to an existing proposal (43ms)
          ✓ should must verify that the vote has been taken into account (368ms, 74913 gas)
          setVote() already vote test :
            ✓ should must verify that you have not already voted (44ms)
        tallyVotes() before endVotingSession() test :
          ✓ should define that the user is not allowed to interact with the function (30ms)
          ✓ should revert because the roposals phase is not finished (37ms)
        endVotingSession() test :
          ✓ should define that the user is not allowed to interact with the function (38ms)
          ✓ should must verify that the Workflow Status Change (132ms, 30733 gas)
        startVotingSession() after endVotingSession() test :
          ✓ should must verify that the Workflow Status is VotingSessionEnded (52ms)
          ✓ should define that the user is not allowed to interact with the function (40ms)
          ✓ should revert because the roposals phase is finished (45ms)
      tally Votes test :
        addVoter() before tallyVotes() test :
          ✓ should define that the user is not allowed to interact with the function (40ms)
          ✓ should revert because the addVoter phase is not yet open (74ms)
        tallyVotes() test :
          ✓ should define that the user is not allowed to interact with the function (99ms)
          ✓ should must verify that the Workflow Status Change (156ms, 60461 gas)
          Workflow test :
            ✓ should must verify that the Workflow Status is VotesTallied (42ms)
          endVotingSession() after tallyVotes() test :
            ✓ should define that the user is not allowed to interact with the function (31ms)
            ✓ should revert because the roposals phase is finished (30ms)
      winningProposalID test :
        ✓ should must verify that the winning proposition is equal to 1 (32ms)
        winningProposalID test bug in the for loop in the tallyVotes() function :
          ✓ should must check that the winning proposal is equal to 0 because the people who did not vote make win the proposal GENESIS which originally is to correct this problem (35ms)
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
|  Voting    ·  addProposal                ·           -  ·          -  ·      55480  ·          55  ·          -  │
·············|·····························|··············|·············|·············|··············|··············
|  Voting    ·  addVoter                   ·           -  ·          -  ·      47020  ·          94  ·          -  │
·············|·····························|··············|·············|·············|··············|··············
|  Voting    ·  endProposalsRegistering    ·           -  ·          -  ·      30799  ·          51  ·          -  │
·············|·····························|··············|·············|·············|··············|··············
|  Voting    ·  endVotingSession           ·           -  ·          -  ·      30733  ·          24  ·          -  │
·············|·····························|··············|·············|·············|··············|··············
|  Voting    ·  setVote                    ·           -  ·          -  ·      74913  ·          20  ·          -  │
·············|·····························|··············|·············|·············|··············|··············
|  Voting    ·  startProposalsRegistering  ·           -  ·          -  ·      89132  ·          58  ·          -  │
·············|·····························|··············|·············|·············|··············|··············
|  Voting    ·  startVotingSession         ·           -  ·          -  ·      30754  ·          27  ·          -  │
·············|·····························|··············|·············|·············|··············|··············
|  Voting    ·  tallyVotes                 ·       54465  ·      60461  ·      59712  ·           8  ·          -  │
·············|·····························|··············|·············|·············|··············|··············
|  Deployments                             ·                                          ·  % of limit  ·             │
···········································|··············|·············|·············|··············|··············
|  Voting                                  ·           -  ·          -  ·    2076814  ·      30.9 %  ·          -  │
·------------------------------------------|--------------|-------------|-------------|--------------|-------------·

  51 passing (2m)
```
---
## License :
* [MIT License](https://choosealicense.com/licenses/mit/)

---
