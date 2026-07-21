/*=========================================================
                    ERC20 ABI
=========================================================*/

const ERC20_ABI = [

    // Balance

    "function balanceOf(address owner) view returns (uint256)",

    // Approve

    "function approve(address spender,uint256 amount) returns (bool)",

    // Allowance

    "function allowance(address owner,address spender) view returns (uint256)",

    // Transfer

    "function transfer(address to,uint256 amount) returns (bool)",

    // Transfer From

    "function transferFrom(address from,address to,uint256 amount) returns (bool)",

    // Decimals

    "function decimals() view returns (uint8)",

    // Name

    "function name() view returns (string)",

    // Symbol

    "function symbol() view returns (string)",

    // Total Supply

    "function totalSupply() view returns (uint256)",

    // Events

    "event Transfer(address indexed from,address indexed to,uint256 value)",

    "event Approval(address indexed owner,address indexed spender,uint256 value)"

];
Object.freeze(ERC20_ABI);