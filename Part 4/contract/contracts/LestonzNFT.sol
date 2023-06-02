// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract LestonzNFT is ERC721A, Ownable, ReentrancyGuard {
    using Strings for uint256;

    string public uri = "ipfs://QmdxuFiDrCjc9TZycroxpiYjHeKWXMrJmZwHQ2HS3TbnWW/";
    string public uriUzantisi = ".json";

    uint256 public fiyat = 20000000000000000;
    uint256 public maxArz  = 5;
    uint256 public maxMintPerTX = 2; // bir adres max kaç adet mint yapabilir

    TokenOwnership[] private _ownerships;
    uint256 private _currentIndex;

    constructor() ERC721A("LestonzNFT", "LSTNFT") {}

    modifier mintKontrol (uint256 _mintMiktari) {
        require(_mintMiktari > 0 && _mintMiktari <= maxMintPerTX, "Gecersiz sayi adedi.");
        require(totalSupply() + _mintMiktari <= maxArz, "Max arzi gecti.");
        _;
    }

    modifier mintFiyatKontrol(uint256 _mintMiktari) {
        if( msg.sender != owner() ) {
            require(msg.value >= fiyat *_mintMiktari, "Yetersiz Bakiye!" );
        }
        _;
    }

    function mint(uint256 _mintMiktari) public payable mintKontrol(_mintMiktari) mintFiyatKontrol(_mintMiktari) {
        _safeMint(_msgSender(), _mintMiktari);
    }

    function MintIcinOwner(uint256 _mintMiktari, address _alici) public mintKontrol(_mintMiktari) onlyOwner {
        _safeMint(_alici, _mintMiktari);
    }

    function cuzdanKontrolu(address _owner) public view returns(uint256[] memory) {
        uint256 ownerTokenCount = balanceOf(_owner); // Hangi hesapta ne kadar NFT var
        uint256[] memory ownedTokenIds = new uint256[](ownerTokenCount);
        uint256 currentTokenId = _startTokenId();
        uint256 ownedTokenIndex = 0;
        address latestOwnerAddress;

        while (ownedTokenIndex < ownerTokenCount && currentTokenId < _currentIndex) {
            TokenOwnership memory ownership = _ownerships[currentTokenId];

            if(!ownership.burned) {
                if(ownership.addr != address(0) ) {
                    latestOwnerAddress = ownership.addr;
                }

                if(latestOwnerAddress == _owner) {
                    ownedTokenIds[ownedTokenIndex] = currentTokenId;

                    ownedTokenIndex ++;
                }
            }
            currentTokenId ++;
        }
        return ownedTokenIds;
    }


    function _startTokenId() internal view virtual override returns (uint256) {
        return 1;
    }

    function tokenURI (uint256 _tokenId) public view virtual override returns(string memory) {
        require(_exists(_tokenId), "ERC721 Metadata: bu token icin tanimli degil!");

        string memory currentBaseURI = _baseURI();
        return bytes(currentBaseURI).length > 0 
            ? string(abi.encodePacked(currentBaseURI, _tokenId.toString(), uriUzantisi)) 
            : " ";
    }

    function fiyatGuncelle(uint256 _fiyat) public onlyOwner {
        fiyat = _fiyat;
    }

    function maxMintPerTXGuncelle(uint256 _miktar) public onlyOwner {
        maxMintPerTX = _miktar;
    }

    function URIGuncelle(string memory _uri) public onlyOwner {
        uri = _uri;
    }

    function URIUzantiGuncelle(string memory _uzanti) public onlyOwner {
        uriUzantisi = _uzanti;
    }

    function _baseURI() internal view virtual override returns(string memory) {
        return uri;
    }

    function ETHCekme() public onlyOwner nonReentrant{
        (bool os, ) = payable(owner()).call{value: address(this).balance}('');
        require(os, "ETH cekmede bir hata alindi!");
    }
}
