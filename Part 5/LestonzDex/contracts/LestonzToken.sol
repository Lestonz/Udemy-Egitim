// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract LestonzToken is ERC20 {
    constructor() ERC20("LestonzToken", "LEST") {
        _mint(msg.sender, 5000000 * 10 ** 18);
    }
}