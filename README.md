# SurvivorDAO
Survivor DAO brings to life a simple concept: create web3's first hostile DAO.

Members of Survivor DAO do not experience harmony. Rather, they compete with each other for a prize by voting off other members. Members vote each other off by nominating a member they'd like to remove in the form of a proposal, and then voting on those proposals.

The front-end can be found here: [survivorDAO-ui](https://github.com/rolias4031/survivorDAO-ui)

# Technology
Survivor DAO implements the [OpenZeppelin](https://github.com/OpenZeppelin/openzeppelin-contracts) ERC-721 and Governor standards.

Survivor DAO uses [Tally](https://www.withtally.com/governance/eip155:4:0x21D335b2bc4f57CF3C81DE438D7384b3dBd20849) to create, vote on, and execute proposals.

# Tests
Tests are written with the [Waffle SDK](https://ethereum-waffle.readthedocs.io/en/latest/).
To run the tests, run `npm run test`.
