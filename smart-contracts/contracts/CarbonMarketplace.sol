// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./CarbonCreditToken.sol";

contract CarbonMarketplace {

    CarbonCreditToken public carbonToken;
    address public admin;
    uint256 public nextListingId;

    struct Listing {
        uint256 id;
        address seller;
        uint256 amount;
        uint256 price;
        bool isActive;
    }

    mapping(uint256 => Listing) public listings;

    event ListingCreated(uint256 id, address seller, uint256 amount, uint256 price);
    event CreditsPurchased(uint256 id, address buyer, uint256 amount, uint256 price);
    event ListingCancelled(uint256 id, address seller);

    constructor(address _token) {
        carbonToken = CarbonCreditToken(_token);
        admin = msg.sender;
    }

    function listCreditsForSale(uint256 amount, uint256 price) external {
        require(amount > 0, "Amount must be > 0");
        require(price > 0, "Price must be > 0");
        require(carbonToken.balances(msg.sender) >= amount, "Not enough credits");

        listings[nextListingId] = Listing({
            id: nextListingId,
            seller: msg.sender,
            amount: amount,
            price: price,
            isActive: true
        });

        emit ListingCreated(nextListingId, msg.sender, amount, price);
        nextListingId++;
    }

    function buyCredits(uint256 listingId) external payable {
        Listing storage listing = listings[listingId];
        require(listing.isActive, "Listing not active");
        require(msg.value == listing.price, "Wrong ETH amount");

        listing.isActive = false;

        carbonToken.transferFrom(listing.seller, msg.sender, listing.amount);

        (bool sent, ) = payable(listing.seller).call{value: msg.value}("");
        require(sent, "ETH transfer failed");

        emit CreditsPurchased(listingId, msg.sender, listing.amount, listing.price);
    }

    function cancelListing(uint256 listingId) external {
        Listing storage listing = listings[listingId];
        require(listing.isActive, "Already inactive");
        require(listing.seller == msg.sender || msg.sender == admin, "Not allowed");
        listing.isActive = false;
        emit ListingCancelled(listingId, listing.seller);
    }

    function getAllListings() external view returns (Listing[] memory) {
        Listing[] memory result = new Listing[](nextListingId);
        for (uint256 i = 0; i < nextListingId; i++) {
            result[i] = listings[i];
        }
        return result;
    }
}
