// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract NFTMarketplace {
    // Definir estructura del NFT
    struct NFT {
        uint256 id;
        address owner;
        uint256 price;
        bool forSale;
    }

    // Variables
    uint256 private nextNFTId = 1;
    mapping(uint256 => NFT) public nfts;
    mapping(address => uint256) public balances;
    mapping(address => uint256[]) public userNFTs;

    // Eventos
    event NFTCreated(uint256 indexed id, address indexed owner, uint256 price);
    event NFTPurchased(uint256 indexed id, address indexed buyer, address indexed seller, uint256 price);
    event NFTListedForSale(uint256 indexed id, uint256 price);
    event NFTWithdrawnFromSale(uint256 indexed id);

    // Función para crear un nuevo NFT
    function createNFT(uint256 _price) public {
        require(_price > 0, "El precio debe ser mayor a cero");
        
        nfts[nextNFTId] = NFT(nextNFTId, msg.sender, _price, false);
        userNFTs[msg.sender].push(nextNFTId);
        
        emit NFTCreated(nextNFTId, msg.sender, _price);
        nextNFTId++;
    }

    // Función para listar un NFT a la venta
    function listNFTForSale(uint256 _nftId, uint256 _price) public {
        NFT storage nft = nfts[_nftId];
        require(nft.owner == msg.sender, "Solo el propietario puede listar el NFT a la venta");
        require(_price > 0, "El precio debe ser mayor a cero");

        nft.price = _price;
        nft.forSale = true;

        emit NFTListedForSale(_nftId, _price);
    }

    // Función para retirar un NFT de la venta
    function withdrawNFTFromSale(uint256 _nftId) public {
        NFT storage nft = nfts[_nftId];
        require(nft.owner == msg.sender, "Solo el propietario puede retirar el NFT de la venta");
        require(nft.forSale == true, "El NFT no esta listado a la venta");

        nft.forSale = false;

        emit NFTWithdrawnFromSale(_nftId);
    }

    // Función para comprar un NFT
    function purchaseNFT(uint256 _nftId) public payable {
        NFT storage nft = nfts[_nftId];
        require(nft.forSale, "El NFT no esta a la venta");
        require(msg.value >= nft.price, "Fondos insuficientes para la compra");
        require(msg.sender != nft.owner, "El propietario no puede comprar su propio NFT");

        address seller = nft.owner;
        nft.owner = msg.sender;
        nft.forSale = false;
        balances[seller] += msg.value;

        // Actualizar la lista de NFTs del comprador y del vendedor
        _removeUserNFT(seller, _nftId);
        userNFTs[msg.sender].push(_nftId);

        emit NFTPurchased(_nftId, msg.sender, seller, nft.price);
    }

    // Función para retirar fondos
    function withdrawFunds() public {
        uint256 amount = balances[msg.sender];
        require(amount > 0, "No hay fondos para retirar");

        balances[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
    }

    // Función auxiliar para eliminar un NFT de la lista de un usuario
    function _removeUserNFT(address _user, uint256 _nftId) internal {
        uint256[] storage nftsOwned = userNFTs[_user];
        for (uint256 i = 0; i < nftsOwned.length; i++) {
            if (nftsOwned[i] == _nftId) {
                nftsOwned[i] = nftsOwned[nftsOwned.length - 1];
                nftsOwned.pop();
                break;
            }
        }
    }

    // Función para obtener la lista de NFTs de un usuario
    function getUserNFTs(address _user) public view returns (uint256[] memory) {
        return userNFTs[_user];
    }
}
