const Voting = artifacts.require("./Voting.sol");
const { BN, expectRevert, expectEvent } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
 
contract("Voting", accounts => {
    /**
     * @dev declarations of variables used for the unit test of the conrat
     */

    const _owner = accounts[0];
    const _user1 = accounts[1];
    const _user2 = accounts[2];
    const _user3 = accounts[3];
    const _user4 = accounts[4];
    const _user5NotVoters = accounts[5];

    const proposal1 = "proposal-1";
    const proposal2 = "proposal-2";
    const proposal3 = "proposal-3";
    const proposal4 = "proposal-4";

    let votingInstance;

    /// -----------------------------------------------------------------------------------------------------------
    /// @dev I left my first version as a comment because my way of iterating on a single contract deployment was not a good practice. Direction line 357 for the beginning of my tests 
    /// -----------------------------------------------------------------------------------------------------------
/*
    describe.skip("Complete test v1 (not good pratique):", function () {

        /// @dev creation of an instance of the contract to iterate on it. I chose to use "before" instead of "beforeEach".
        before(async function () {
            votingInstance = await Voting.deployed({from:_owner});
        });

        /// @dev first phase for owner verification
        describe("Smart contract owner test :", function () {

            it("should define the owner of the smart contract", async () => {
                // const contractOwner = await votingInstance.owner();
                expect(await votingInstance.owner()).to.be.equal(_owner);
            });
    
            it("should define that the user is not the owner of the smartcontract", async () => {
                expect(await votingInstance.owner()).to.not.equal(_user1);
            });
        });

        /// @dev second phase for the verification of the function addVoter()
        describe("Add Voters test :", function () {

            describe("tallyVotes() before addVoter() test :", function () {

                it("should define that the user is not allowed to interact with the function", async () => {
                    await expectRevert(votingInstance.tallyVotes({from:_user1}), "Ownable: caller is not the owner");
                });

                it("should revert because the proposal phase tally Votes is not open", async () => {
                    await expectRevert(votingInstance.tallyVotes(), "Current status is not voting session ended");
                });
            });

            describe("addVoter() test :", function () {
                let votingInstance;
                before(async function () {
                    votingInstance = await Voting.deployed({from:_owner});
                });
                it("should define that the user is not allowed to interact with the function", async () => {
                    await expectRevert(votingInstance.addVoter(_user1,{from:_user1}), "Ownable: caller is not the owner");
                });

                it("should test voter registration emit the proper event", async () => {
                    expectEvent(await votingInstance.addVoter(_user1), "VoterRegistered", {voterAddress: _user1});
                });

                it("should not add a voter twice", async () => {
                    await expectRevert(votingInstance.addVoter(_user1), 'Already registered');
                });

                it("should must verify that the Workflow Status is ProposalsRegistrationStarted", async () => {
                    expect(await votingInstance.workflowStatus.call()).to.be.bignumber.equal(BN(0));
                });

            });
        });

        /// @dev third phase for the verification of the function getVoter()
        describe("getVoter() test :", function () {

            it("should check only voters", async () => {
                await expectRevert(votingInstance.getVoter(_user5NotVoters), "You're not a voter");
            });

            it("should properly register a voter", async () => {
                result = await votingInstance.getVoter(_user1,{from:_user1});
                expect(result.isRegistered).to.equal(true);
            });
        });

        /// @dev fourth phase for the verification of the proposal stage
        describe("Proposals Registering test :", function () {

            describe("addProposal() before startProposalsRegistering() test :", function () {

                it("should revert because the proposal phase is not yet open", async () => {
                    await expectRevert(votingInstance.addProposal("Proposal-1",{from:_user1}), "Proposals are not allowed yet");
                });
            });

            describe("startProposalsRegistering() test :", function () {

                it("should define that the user is not allowed to interact with the function", async () => {
                    await expectRevert(votingInstance.startProposalsRegistering({from:_user1}), "Ownable: caller is not the owner");
                });

                it("should must verify that the Workflow Status Change", async () => {
                    expectEvent(await votingInstance.startProposalsRegistering(), "WorkflowStatusChange", {
                        previousStatus: BN(0),
                        newStatus: BN(1)
                    });
                });
            });

            describe("getOneProposal() GENESIS test :", function () {

                it("should check only voters", async () => {
                    await expectRevert(votingInstance.getOneProposal(BN(0),{from:_user5NotVoters}), "You're not a voter");
                });

                it("should must verify that the GENESIS proposal has been inserted into the proposal table was entered at the time of the state change", async () => {
                    result = await votingInstance.getOneProposal(BN(0),{from:_user1});
                    expect(result.description).to.equal("GENESIS");
                });
            });

            describe("addProposal() test :", function () {

                it("should check only voters", async () => {
                    await expectRevert(votingInstance.addProposal("Proposal-1",{from:_user5NotVoters}), "You're not a voter");
                });

                it("should check that the proposal sent is not empty", async () => {
                    await expectRevert(votingInstance.addProposal("",{from:_user1}), "Vous ne pouvez pas ne rien proposer");
                });

                it("should check that the proposal has been sent", async () => {
                    expectEvent(await votingInstance.addProposal("Proposal-1",{from:_user1}), "ProposalRegistered",{
                        proposalId:BN(1)
                    });
                    await votingInstance.addProposal("Proposal-2",{from:_user2})
                    await votingInstance.addProposal("Proposal-3",{from:_user3})
                    await votingInstance.addProposal("Proposal-4",{from:_user4})
                });

                describe("getOneProposal() test :", function () {

                    it("should must verify that the proposal has been inserted in the proposal table", async () => {
                        result = await votingInstance.getOneProposal(BN(1),{from:_user1});
                        expect(result.description).to.equal("Proposal-1");
                    });
                });
            });

            describe("startVotingSession() before endProposalsRegistering() test :", function () {

                it("should define that the user is not allowed to interact with the function", async () => {
                    await expectRevert(votingInstance.startVotingSession({from:_user1}), "Ownable: caller is not the owner");
                });

                it("should revert because the roposals phase is not finished", async () => {
                    await expectRevert(votingInstance.startVotingSession(), "Registering proposals phase is not finished");
                });
            });

            describe("endProposalsRegistering() test :", function () {

                it("should define that the user is not allowed to interact with the function", async () => {
                    await expectRevert(votingInstance.endProposalsRegistering({from:_user1}), "Ownable: caller is not the owner");
                });

                it("should must verify that the Workflow Status Change", async () => {
                    expectEvent(await votingInstance.endProposalsRegistering(), "WorkflowStatusChange", {
                        previousStatus: BN(1),
                        newStatus: BN(2)
                    });
                });

                it("should must verify that the Workflow Status is endProposalsRegistering", async () => {
                    expect(await votingInstance.workflowStatus.call()).to.be.bignumber.equal(BN(2));
                });
            });

            describe("startVotingSession() after endProposalsRegistering() test :", function () {

                it("should define that the user is not allowed to interact with the function", async () => {
                    await expectRevert(votingInstance.startProposalsRegistering({from:_user1}), "Ownable: caller is not the owner");
                });

                it("should revert because the roposals phase is finished", async () => {
                    await expectRevert(votingInstance.startProposalsRegistering(), "Registering proposals cant be started now");
                });
            });
        });

        /// @dev fifth phase for the verification of the voting stage
        describe("Voting Session test :", function () {

            describe("setVote() before startVotingSession() test :", function () {

                it("should check only voters", async () => {
                    await expectRevert(votingInstance.setVote(BN(1),{from:_user5NotVoters}), "You're not a voter");
                });

                it("should revert because the vote phase is not yet open", async () => {
                    await expectRevert(votingInstance.setVote(BN(1),{from:_user1}), "Voting session havent started yet");
                });
            });

            describe("startVotingSession() test :", function () {

                it("should define that the user is not allowed to interact with the function", async () => {
                    await expectRevert(votingInstance.startVotingSession({from:_user1}), "Ownable: caller is not the owner");
                });

                it("should must verify that the Workflow Status Change", async () => {
                    expectEvent(await votingInstance.startVotingSession(), "WorkflowStatusChange", {
                        previousStatus: BN(2),
                        newStatus: BN(3)
                    });
                });

                it("should must verify that the Workflow Status is VotingSessionStarted", async () => {
                    expect(await votingInstance.workflowStatus.call()).to.be.bignumber.equal(BN(3));
                });
            });

            describe("setVote() test :", function () {

                it("should check only voters", async () => {
                    await expectRevert(votingInstance.setVote(BN(1),{from:_user5NotVoters}), "You're not a voter");
                });

                it("should must verify that the vote corresponds to an existing proposal", async () => {
                    await expectRevert(votingInstance.setVote(BN(6),{from:_user1}), "Proposal not found");
                });

                it("should must verify that the vote has been taken into account", async () => {
                    expectEvent(await votingInstance.setVote(BN(1),{from:_user1}), "Voted", {
                        voter: _user1,
                        proposalId: BN(1)
                    });
                });

                it("should must verify that you have not already voted", async () => {
                    await expectRevert(votingInstance.setVote(BN(1),{from:_user1}), "You have already voted");
                    votingInstance.setVote(BN(1),{from:_user2});
                    votingInstance.setVote(BN(2),{from:_user3});
                    votingInstance.setVote(BN(4),{from:_user4});
                });
            });

            describe("tallyVotes() before endVotingSession() test :", function () {

                it("should define that the user is not allowed to interact with the function", async () => {
                    await expectRevert(votingInstance.tallyVotes({from:_user1}), "Ownable: caller is not the owner");
                });

                it("should revert because the roposals phase is not finished", async () => {
                    await expectRevert(votingInstance.tallyVotes(), "Current status is not voting session ended");
                });
            });

            describe("endVotingSession() test :", function () {

                it("should define that the user is not allowed to interact with the function", async () => {
                    await expectRevert(votingInstance.endVotingSession({from:_user1}), "Ownable: caller is not the owner");
                });

                it("should must verify that the Workflow Status Change", async () => {
                    expectEvent(await votingInstance.endVotingSession(), "WorkflowStatusChange", {
                        previousStatus: BN(3),
                        newStatus: BN(4)
                    });
                });
                
                it("should must verify that the Workflow Status is VotingSessionEnded", async () => {
                    expect(await votingInstance.workflowStatus.call()).to.be.bignumber.equal(BN(4));
                });
            });

            describe("startVotingSession() after endVotingSession() test :", function () {

                it("should define that the user is not allowed to interact with the function", async () => {
                    await expectRevert(votingInstance.startVotingSession({from:_user1}), "Ownable: caller is not the owner");
                });

                it("should revert because the roposals phase is finished", async () => {
                    await expectRevert(votingInstance.startVotingSession(), "Registering proposals phase is not finished");
                });
            });
        });

        /// @dev sixth phase for the verification of the voting results stage
        describe("tally Votes test :", function () {

            describe("addVoter() before tallyVotes() test :", function () {

                it("should define that the user is not allowed to interact with the function", async () => {
                    await expectRevert(votingInstance.addVoter(_user1,{from:_user1}), "Ownable: caller is not the owner");
                });

                it("should revert because the addVoter phase is not yet open", async () => {
                    await expectRevert(votingInstance.addVoter(_user1), "Voters registration is not open yet");
                });
            });

            describe("tallyVotes() test :", function () {

                it("should define that the user is not allowed to interact with the function", async () => {
                    await expectRevert(votingInstance.tallyVotes({from:_user1}), "Ownable: caller is not the owner");
                });

                it("should must verify that the Workflow Status Change", async () => {
                    expectEvent(await votingInstance.tallyVotes(), "WorkflowStatusChange", {
                        previousStatus: BN(4),
                        newStatus: BN(5)
                    });
                });

                it("should must verify that the Workflow Status is VotesTallied", async () => {
                    expect(await votingInstance.workflowStatus.call()).to.be.bignumber.equal(BN(5));
                });
            });

            describe("endVotingSession() after tallyVotes() test :", function () {

                it("should define that the user is not allowed to interact with the function", async () => {
                    await expectRevert(votingInstance.endVotingSession({from:_user1}), "Ownable: caller is not the owner");
                });

                it("should revert because the roposals phase is finished", async () => {
                    await expectRevert(votingInstance.endVotingSession(), "Voting session havent started yet");
                });
            });
        });

        /// @dev sixth phase for the verification of the winning Proposal ID
        describe("winningProposalID test :", function () {

            it("should must verify that the winning proposition is equal to 1", async () => {
                expect(await votingInstance.winningProposalID.call()).to.be.bignumber.equal(BN(1));
            });
        });
    });
*/
    /// -----------------------------------------------------------------------------------------------------------
    /// -----------------------------------------------------------------------------------------------------------
    describe("Complete test v2 (good pratique):", function () {

        /// @dev creation of an instance of the contract to iterate on it.
        beforeEach(async function () {
            votingInstance = await Voting.new({from:_owner});
        });

        /// @dev first phase for owner verification
        describe("Smart contract owner test :", function () {

            it("should define the owner of the smart contract", async () => {
                // const contractOwner = await votingInstance.owner();
                expect(await votingInstance.owner()).to.be.equal(_owner);
            });
    
            it("should define that the user is not the owner of the smartcontract", async () => {
                expect(await votingInstance.owner()).to.not.equal(_user1);
            });
        });

        /// @dev second phase for the verification of the function addVoter()
        describe("Add Voters test :", function () {

            describe("tallyVotes() before addVoter() test :", function () {

                it("should define that the user is not allowed to interact with the function", async () => {
                    await expectRevert(votingInstance.tallyVotes({from:_user1}), "Ownable: caller is not the owner");
                });

                it("should revert because the proposal phase tally Votes is not open", async () => {
                    await expectRevert(votingInstance.tallyVotes(), "Current status is not voting session ended");
                });
            });

            describe("addVoter() test :", function () {
                it("should define that the user is not allowed to interact with the function", async () => {
                    await expectRevert(votingInstance.addVoter(_user1,{from:_user1}), "Ownable: caller is not the owner");
                });

                it("should test voter registration emit the proper event", async () => {
                    expectEvent(await votingInstance.addVoter(_user1), "VoterRegistered", {voterAddress: _user1});
                });

                describe("addVoter votertwice and ProposalsRegistrationStarted :", function () {
                    let votingInstance;
                    before(async function () {
                        votingInstance = await Voting.deployed({from:_owner});
                        await votingInstance.addVoter(_user1);
                    });

                    it("should not add a voter twice", async () => {
                        await expectRevert(votingInstance.addVoter(_user1), 'Already registered');
                    });

                    it("should must verify that the Workflow Status is ProposalsRegistrationStarted", async () => {
                        expect(await votingInstance.workflowStatus.call()).to.be.bignumber.equal(BN(0));
                    });
                });

            });
        });

        /// @dev third phase for the verification of the function getVoter()
        describe("getVoter() test :", function () {
            let votingInstance;

            beforeEach(async function () {
                votingInstance = await Voting.new({from:_owner});
                await votingInstance.addVoter(_user1);
            });

            it("should check only voters", async () => {
                await expectRevert(votingInstance.getVoter(_user5NotVoters), "You're not a voter");
            });

            it("should properly register a voter", async () => {
                result = await votingInstance.getVoter(_user1,{from:_user1});
                expect(result.isRegistered).to.equal(true);
            });
        });

        /// @dev fourth phase for the verification of the proposal stage
        describe("Proposals Registering test :", function () {
            let votingInstance;

            beforeEach(async function () {
                votingInstance = await Voting.new({from:_owner});
                await votingInstance.addVoter(_user1);
            });

            describe("addProposal() before startProposalsRegistering() test :", function () {

                it("should revert because the proposal phase is not yet open", async () => {
                    await expectRevert(votingInstance.addProposal("Proposal-1",{from:_user1}), "Proposals are not allowed yet");
                });
            });

            describe("startProposalsRegistering() test :", function () {

                it("should define that the user is not allowed to interact with the function", async () => {
                    await expectRevert(votingInstance.startProposalsRegistering({from:_user1}), "Ownable: caller is not the owner");
                });

                it("should must verify that the Workflow Status Change", async () => {
                    expectEvent(await votingInstance.startProposalsRegistering(), "WorkflowStatusChange", {
                        previousStatus: BN(0),
                        newStatus: BN(1)
                    });
                });
            });

            describe("getOneProposal() GENESIS test :", function () {
                let votingInstance;

                beforeEach(async function () {
                    votingInstance = await Voting.new({from:_owner});
                    await votingInstance.addVoter(_user1);
                    await votingInstance.startProposalsRegistering();
                });

                it("should check only voters", async () => {
                    await expectRevert(votingInstance.getOneProposal(BN(0),{from:_user5NotVoters}), "You're not a voter");
                });

                it("should must verify that the GENESIS proposal has been inserted into the proposal table was entered at the time of the state change", async () => {
                    result = await votingInstance.getOneProposal(BN(0),{from:_user1});
                    expect(result.description).to.equal("GENESIS");
                });
            });

            describe("addProposal() test :", function () {
                let votingInstance;

                beforeEach(async function () {
                    votingInstance = await Voting.new({from:_owner});
                    await votingInstance.addVoter(_user1);
                    await votingInstance.addVoter(_user2);
                    await votingInstance.addVoter(_user3);
                    await votingInstance.addVoter(_user4);
                    await votingInstance.startProposalsRegistering();
                });

                it("should check only voters", async () => {
                    await expectRevert(votingInstance.addProposal("Proposal-1",{from:_user5NotVoters}), "You're not a voter");
                });

                it("should check that the proposal sent is not empty", async () => {
                    await expectRevert(votingInstance.addProposal("",{from:_user1}), "Vous ne pouvez pas ne rien proposer");
                });

                it("should check that the proposal has been sent", async () => {
                    expectEvent(await votingInstance.addProposal(proposal1,{from:_user1}), "ProposalRegistered",{
                        proposalId:BN(1)
                    });
                });

                describe("getOneProposal() test :", function () {
                    let votingInstance;

                    beforeEach(async function () {
                        votingInstance = await Voting.new({from:_owner});
                        await votingInstance.addVoter(_user1);
                        await votingInstance.startProposalsRegistering();
                        await votingInstance.addProposal(proposal1,{from:_user1});
                    });

                    it("should must verify that the proposal has been inserted in the proposal table", async () => {
                        result = await votingInstance.getOneProposal(BN(1),{from:_user1});
                        expect(result.description).to.equal(proposal1);
                    });
                });
            });

            describe("startVotingSession() before endProposalsRegistering() test :", function () {
                let votingInstance;

                beforeEach(async function () {
                    votingInstance = await Voting.new({from:_owner});
                    await votingInstance.addVoter(_user1);
                    await votingInstance.startProposalsRegistering();
                    await votingInstance.addProposal(proposal1,{from:_user1});
                });

                it("should define that the user is not allowed to interact with the function", async () => {
                    await expectRevert(votingInstance.startVotingSession({from:_user1}), "Ownable: caller is not the owner");
                });

                it("should revert because the roposals phase is not finished", async () => {
                    await expectRevert(votingInstance.startVotingSession(), "Registering proposals phase is not finished");
                });
            });

            describe("endProposalsRegistering() test :", function () {
                let votingInstance;

                beforeEach(async function () {
                    votingInstance = await Voting.new({from:_owner});
                    await votingInstance.addVoter(_user1);
                    await votingInstance.startProposalsRegistering();
                    await votingInstance.addProposal(proposal1,{from:_user1});
                });

                it("should define that the user is not allowed to interact with the function", async () => {
                    await expectRevert(votingInstance.endProposalsRegistering({from:_user1}), "Ownable: caller is not the owner");
                });

                it("should must verify that the Workflow Status Change", async () => {
                    expectEvent(await votingInstance.endProposalsRegistering(), "WorkflowStatusChange", {
                        previousStatus: BN(1),
                        newStatus: BN(2)
                    });
                });
            });

            describe("startVotingSession() after endProposalsRegistering() test :", function () {
                let votingInstance;

                beforeEach(async function () {
                    votingInstance = await Voting.new({from:_owner});
                    await votingInstance.addVoter(_user1);
                    await votingInstance.startProposalsRegistering();
                    await votingInstance.addProposal(proposal1,{from:_user1});
                    await votingInstance.endProposalsRegistering();
                });

                it("should must verify that the Workflow Status is endProposalsRegistering", async () => {
                    expect(await votingInstance.workflowStatus.call()).to.be.bignumber.equal(BN(2));
                });

                it("should define that the user is not allowed to interact with the function", async () => {
                    await expectRevert(votingInstance.startProposalsRegistering({from:_user1}), "Ownable: caller is not the owner");
                });

                it("should revert because the roposals phase is finished", async () => {
                    await expectRevert(votingInstance.startProposalsRegistering(), "Registering proposals cant be started now");
                });
            });
        });

        /// @dev fifth phase for the verification of the voting stage
        describe("Voting Session test :", function () {
            let votingInstance;

            beforeEach(async function () {
                votingInstance = await Voting.new({from:_owner});
                await votingInstance.addVoter(_user1);
                await votingInstance.startProposalsRegistering();
                await votingInstance.addProposal(proposal1,{from:_user1});
                await votingInstance.endProposalsRegistering();
            });

            describe("setVote() before startVotingSession() test :", function () {

                it("should check only voters", async () => {
                    await expectRevert(votingInstance.setVote(BN(1),{from:_user5NotVoters}), "You're not a voter");
                });

                it("should revert because the vote phase is not yet open", async () => {
                    await expectRevert(votingInstance.setVote(BN(1),{from:_user1}), "Voting session havent started yet");
                });
            });

            describe("startVotingSession() test :", function () {

                it("should define that the user is not allowed to interact with the function", async () => {
                    await expectRevert(votingInstance.startVotingSession({from:_user1}), "Ownable: caller is not the owner");
                });

                it("should must verify that the Workflow Status Change", async () => {
                    expectEvent(await votingInstance.startVotingSession(), "WorkflowStatusChange", {
                        previousStatus: BN(2),
                        newStatus: BN(3)
                    });
                });
            });
            
            describe("setVote() test :", function () {
                let votingInstance;

                beforeEach(async function () {
                    votingInstance = await Voting.new({from:_owner});
                    await votingInstance.addVoter(_user1);
                    await votingInstance.startProposalsRegistering();
                    await votingInstance.addProposal(proposal1,{from:_user1});
                    await votingInstance.endProposalsRegistering();
                    await votingInstance.startVotingSession();
                });

                it("should must verify that the Workflow Status is VotingSessionStarted", async () => {
                    expect(await votingInstance.workflowStatus.call()).to.be.bignumber.equal(BN(3));
                });

                it("should check only voters", async () => {
                    await expectRevert(votingInstance.setVote(BN(1),{from:_user5NotVoters}), "You're not a voter");
                });

                it("should must verify that the vote corresponds to an existing proposal", async () => {
                    await expectRevert(votingInstance.setVote(BN(6),{from:_user1}), "Proposal not found");
                });

                it("should must verify that the vote has been taken into account", async () => {
                    expectEvent(await votingInstance.setVote(BN(1),{from:_user1}), "Voted", {
                        voter: _user1,
                        proposalId: BN(1)
                    });
                });

                describe("setVote() already vote test :", function () {
                    let votingInstance;

                    beforeEach(async function () {
                        votingInstance = await Voting.new({from:_owner});
                        await votingInstance.addVoter(_user1);
                        await votingInstance.startProposalsRegistering();
                        await votingInstance.addProposal(proposal1,{from:_user1});
                        await votingInstance.endProposalsRegistering();
                        await votingInstance.startVotingSession();
                        await votingInstance.setVote(BN(1),{from:_user1});
                    });
                
                    it("should must verify that you have not already voted", async () => {
                        await expectRevert(votingInstance.setVote(BN(1),{from:_user1}), "You have already voted");
                    });
                });
            });

            describe("tallyVotes() before endVotingSession() test :", function () {

                it("should define that the user is not allowed to interact with the function", async () => {
                    await expectRevert(votingInstance.tallyVotes({from:_user1}), "Ownable: caller is not the owner");
                });

                it("should revert because the roposals phase is not finished", async () => {
                    await expectRevert(votingInstance.tallyVotes(), "Current status is not voting session ended");
                });
            });

            describe("endVotingSession() test :", function () {
                let votingInstance;

                beforeEach(async function () {
                    votingInstance = await Voting.new({from:_owner});
                    await votingInstance.addVoter(_user1);
                    await votingInstance.startProposalsRegistering();
                    await votingInstance.addProposal(proposal1,{from:_user1});
                    await votingInstance.endProposalsRegistering();
                    await votingInstance.startVotingSession();
                    await votingInstance.setVote(BN(1),{from:_user1});
                });


                it("should define that the user is not allowed to interact with the function", async () => {
                    await expectRevert(votingInstance.endVotingSession({from:_user1}), "Ownable: caller is not the owner");
                });

                it("should must verify that the Workflow Status Change", async () => {
                    expectEvent(await votingInstance.endVotingSession(), "WorkflowStatusChange", {
                        previousStatus: BN(3),
                        newStatus: BN(4)
                    });
                });
            });

            describe("startVotingSession() after endVotingSession() test :", function () {
                let votingInstance;

                beforeEach(async function () {
                    votingInstance = await Voting.new({from:_owner});
                    await votingInstance.addVoter(_user1);
                    await votingInstance.startProposalsRegistering();
                    await votingInstance.addProposal(proposal1,{from:_user1});
                    await votingInstance.endProposalsRegistering();
                    await votingInstance.startVotingSession();
                    await votingInstance.setVote(BN(1),{from:_user1});
                    await votingInstance.endVotingSession();
                });

                it("should must verify that the Workflow Status is VotingSessionEnded", async () => {
                    expect(await votingInstance.workflowStatus.call()).to.be.bignumber.equal(BN(4));
                });

                it("should define that the user is not allowed to interact with the function", async () => {
                    await expectRevert(votingInstance.startVotingSession({from:_user1}), "Ownable: caller is not the owner");
                });

                it("should revert because the roposals phase is finished", async () => {
                    await expectRevert(votingInstance.startVotingSession(), "Registering proposals phase is not finished");
                });
            });
        });

        /// @dev sixth phase for the verification of the voting results stage
        describe("tally Votes test :", function () {
            let votingInstance;

            beforeEach(async function () {
                votingInstance = await Voting.new({from:_owner});
                await votingInstance.addVoter(_user1);
                await votingInstance.startProposalsRegistering();
                await votingInstance.addProposal(proposal1,{from:_user1});
                await votingInstance.endProposalsRegistering();
                await votingInstance.startVotingSession();
                await votingInstance.setVote(BN(1),{from:_user1});
                await votingInstance.endVotingSession();
            });

            describe("addVoter() before tallyVotes() test :", function () {

                it("should define that the user is not allowed to interact with the function", async () => {
                    await expectRevert(votingInstance.addVoter(_user1,{from:_user1}), "Ownable: caller is not the owner");
                });

                it("should revert because the addVoter phase is not yet open", async () => {
                    await expectRevert(votingInstance.addVoter(_user1), "Voters registration is not open yet");
                });
            });

            describe("tallyVotes() test :", function () {

                it("should define that the user is not allowed to interact with the function", async () => {
                    await expectRevert(votingInstance.tallyVotes({from:_user1}), "Ownable: caller is not the owner");
                });
                
                it("should must verify that the Workflow Status Change", async () => {
                    expectEvent(await votingInstance.tallyVotes(), "WorkflowStatusChange", {
                        previousStatus: BN(4),
                        newStatus: BN(5)
                    });
                });

                describe("Workflow test :", function () {
                    let votingInstance;

                    beforeEach(async function () {
                        votingInstance = await Voting.new({from:_owner});
                        await votingInstance.addVoter(_user1);
                        await votingInstance.startProposalsRegistering();
                        await votingInstance.addProposal(proposal1,{from:_user1});
                        await votingInstance.endProposalsRegistering();
                        await votingInstance.startVotingSession();
                        await votingInstance.setVote(BN(1),{from:_user1});
                        await votingInstance.endVotingSession();
                        await votingInstance.tallyVotes();
                    });

                    it("should must verify that the Workflow Status is VotesTallied", async () => {
                        expect(await votingInstance.workflowStatus.call()).to.be.bignumber.equal(BN(5));
                    });
                });
                describe("endVotingSession() after tallyVotes() test :", function () {
    
                    it("should define that the user is not allowed to interact with the function", async () => {
                        await expectRevert(votingInstance.endVotingSession({from:_user1}), "Ownable: caller is not the owner");
                    });
    
                    it("should revert because the roposals phase is finished", async () => {
                        await expectRevert(votingInstance.endVotingSession(), "Voting session havent started yet");
                    });
                });
            });
        });

        /// @dev sixth phase for the verification of the winning Proposal ID
        describe("winningProposalID test :", function () {
            let votingInstance;

            beforeEach(async function () {
                votingInstance = await Voting.new({from:_owner});
                await votingInstance.addVoter(_user1);
                await votingInstance.startProposalsRegistering();
                await votingInstance.addProposal(proposal1,{from:_user1});
                await votingInstance.endProposalsRegistering();
                await votingInstance.startVotingSession();
                await votingInstance.setVote(BN(1),{from:_user1});
                await votingInstance.endVotingSession();
                await votingInstance.tallyVotes();
            });

            it("should must verify that the winning proposition is equal to 1", async () => {
                expect(await votingInstance.winningProposalID.call()).to.be.bignumber.equal(BN(1));
            });
            describe("winningProposalID test bug in the for loop in the tallyVotes() function :", function () {
                let votingInstance;

                beforeEach(async function () {
                    votingInstance = await Voting.new({from:_owner});
                    await votingInstance.addVoter(_user1);
                    await votingInstance.addVoter(_user2);
                    await votingInstance.addVoter(_user3);
                    await votingInstance.addVoter(_user4);
                    await votingInstance.startProposalsRegistering();
                    await votingInstance.addProposal(proposal1,{from:_user1});
                    await votingInstance.addProposal(proposal2,{from:_user2});
                    await votingInstance.addProposal(proposal3,{from:_user3});
                    await votingInstance.addProposal(proposal4,{from:_user4});
                    await votingInstance.endProposalsRegistering();
                    await votingInstance.startVotingSession();
                    await votingInstance.endVotingSession();
                    await votingInstance.tallyVotes();
                });

                it("should must check that the winning proposal is equal to 0 because the people who did not vote make win the proposal GENESIS which originally is to correct this problem", async () => {
                    expect(await votingInstance.winningProposalID.call()).to.be.bignumber.equal(BN(0));
                });
            });
        });
    });
});
