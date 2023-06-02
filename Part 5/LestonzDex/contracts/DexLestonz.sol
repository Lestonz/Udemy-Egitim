// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DexLestonz {

    // Variables
    address public sahip;
    address public odulToken;

    uint256 public zaman; // periyot
    uint256 public odul;

    uint256 public zamanBasla; // başlangıc zamanı
    uint256 public sonOdulZaman; 
    uint256 public kumulatifMarketHacmi;
    // 100$ para yatırma 50$ geri çekme kumulatif market hacmi 150$ oluyor.

    address[] internal traders;

    // Mappings
    mapping(address => uint256) public kumulatifTraderHacmi;
    mapping(address => uint256) public traderHacmi;
    mapping(address => uint256) public totalOdul;

    // Events
    event pozisyonAcildi(address indexed trader, uint256 token);
    event pozisyonKapandi(address indexed trader, uint256 token);
    event odulTalepEdildi(address indexed trader, uint256 token);

    // Constructor
    constructor(address _odulToken, uint256 _zaman, uint256 _odul) {
        sahip = msg.sender;
        odulToken = _odulToken;
        zaman = _zaman;
        odul = _odul;
        zamanBasla = block.timestamp;
        sonOdulZaman = block.timestamp - 1;
    }


    // Zaman Kontrolü
    function zamanKontrol() internal {
        if(block.timestamp >= zamanBasla + zaman) {
            uint256 modZaman = block.timestamp % zaman;
            zamanBasla = block.timestamp - modZaman;
            sonOdulZaman = block.timestamp -1;
            traders = new address[](0); // listeyi sıfırlamak için
            kumulatifTraderHacmi[msg.sender] = 0;
            kumulatifMarketHacmi = 0;
        }
    }

    // Odul hesaplama
    function odulHesapla(uint256 _gecenSure, address _trader) internal{
        totalOdul[_trader] += ((_gecenSure * kumulatifTraderHacmi[_trader] * odul) / kumulatifMarketHacmi );
    } 

    // Poziyon acma
    function pozisyonAc(uint256 _token) external payable {
        require(_token > 0, "Token 0'dan buyuk olmali.");
        ERC20(odulToken).approve(address(this), _token);
        require(ERC20(odulToken).balanceOf(msg.sender) >= _token, "Yetersiz bakiye!");
        require(ERC20(odulToken).allowance(msg.sender, address(this)) >= _token, "Bu pozisyon icin yeterli miktarda approve vermelisiniz!" );
        require(ERC20(odulToken).transferFrom(msg.sender, address(this), _token), "Token transferinde bir hata olustu.");

        zamanKontrol();
        
        // İlk kez sisteme yada yeni periyot başaladıysa
        if (kumulatifTraderHacmi[msg.sender] == 0) {
            traders.push(msg.sender);
        }

        uint256 gecenSure = block.timestamp - sonOdulZaman;

        traderHacmi[msg.sender] += _token;
        kumulatifTraderHacmi[msg.sender] += _token;
        kumulatifMarketHacmi += _token;

        emit pozisyonAcildi(msg.sender, _token);

        odulHesapla(gecenSure, msg.sender);
        sonOdulZaman = block.timestamp;
    }

    // Pozisyon kapatma
    function pozisyonKapat(uint256 _token) external payable {
        require(_token > 0, "Token 0'dan buyuk olmali.");
        require(traderHacmi[msg.sender] >= _token, "Token miktari hacimden esit veya az olmali");
        require(ERC20(odulToken).transfer(msg.sender, _token), "Odul tokeni transfer edilirken bir hata alindi." );

        zamanKontrol();

        // İlk kez sisteme yada yeni periyot başaladıysa
        if (kumulatifTraderHacmi[msg.sender] == 0) {
            traders.push(msg.sender);
        }

         uint256 gecenSure = block.timestamp - sonOdulZaman;

        traderHacmi[msg.sender] -= _token;
        kumulatifTraderHacmi[msg.sender] += _token;
        kumulatifMarketHacmi += _token;

        emit pozisyonKapandi(msg.sender, _token);

        odulHesapla(gecenSure, msg.sender);
        sonOdulZaman = block.timestamp;
    }

    //Odul Cekme
    function odulCekme() external payable {
        require(totalOdul[msg.sender] > 0, "Odul miktari 0'dan buyuk olmali.");
        require(ERC20(odulToken).transfer(msg.sender, totalOdul[msg.sender]), "Transferde bir hata oldu.");

        emit odulTalepEdildi(msg.sender, totalOdul[msg.sender]);
        totalOdul[msg.sender] = 0;
    }

    //Zaman bitimi kontrolü
    function ZamanBitimi() external view returns (uint256) {
        return (zamanBasla + zaman) - block.timestamp;
    } 

    // Sistemdeli Odul miktarı
    function totalOdulTokeni() external view returns (uint256) {
        return ERC20(odulToken).balanceOf(address(this));
    }

}