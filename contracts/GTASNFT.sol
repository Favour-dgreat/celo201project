// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract GTASNFT is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("GTAS NFT", "GNFT") {
    }

    uint256 owners = 0;

    struct Image {
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
    }

    mapping(uint256 => Image) private images;

//    mint an NFt
    function safeMint(string memory uri, uint256 price)
        public
        payable
        returns (uint256)
    {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _mint(msg.sender, tokenId);

        _setTokenURI(tokenId, uri);
        createImage(tokenId, price);
        // setApprovalForAll(msg.sender, true);

        return tokenId;
    }

    function makeTransfer
    (address from, address to, uint256 tokenId)public{
        _transfer(from, to, tokenId);
        images[tokenId].owner = payable(to);
        owners++;
    }

    function createImage(uint256 tokenId, uint256 price) private {
        require(price > 0, "Price must be at least 1 wei");
        images[tokenId] = Image(
            tokenId,
            payable(msg.sender),
            payable(address(this)),
            price,
            false
        );

        _transfer(msg.sender, address(this), tokenId);
    }
    function buyImage(uint256 tokenId) public payable {
        uint256 price = images[tokenId].price;
        address seller = images[tokenId].seller;
        require(
            msg.value >= price,
            "Please submit the asking price in order to complete the purchase"
        );
        images[tokenId].owner = payable(msg.sender);
        images[tokenId].sold = true;
        images[tokenId].seller = payable(address(0));
        _transfer(address(this), msg.sender, tokenId);

        payable(seller).transfer(msg.value);
    }


    function sellImage(uint256 tokenId) public payable {
        require(
            images[tokenId].owner == msg.sender,
            "Only the owner of this NFT can perform this operation"
        );
        images[tokenId].sold = false;
        images[tokenId].seller = payable(msg.sender);
        images[tokenId].owner = payable(address(this));

        _transfer(msg.sender, address(this), tokenId);
    }

    function getImage(uint256 tokenId) public view returns (Image memory) {
        return images[tokenId];
    }

    function getImageLength() public view returns (uint256) {
        return _tokenIdCounter.current();
    }

    function getOwners() public view returns (uint256) {
        return owners;
    }

   function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
