//SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

contract IlacTakipSistemi {
    address public devlet;

    mapping(address => bool) public eczaneler;
    mapping(address => bool) public doktorlar;
    mapping(address => bool) public hastalar;

    mapping(uint256 => Ilac) private ilaclar;

    mapping(address => mapping(uint256 => uint256)) private hasaIlacAdedi;

    mapping(uint256 => uint256) private ilacStok;

    struct Ilac {
        string ad;
        string bilgi;
    }

    modifier sadeceDevlet() {
        require(msg.sender == devlet, "Sadece Devlet erisebilir.");
        _;
    }

    modifier sadeceEczane() {
        require(eczaneler[msg.sender] == true, "Sadece Eczane erisebilir.");
        _;
    }

    modifier sadeceDoktor() {
        require(doktorlar[msg.sender] == true, "Sadece Doktor erisebilir.");
        _;
    }

    modifier sadeceHastalar() {
        require(hastalar[msg.sender] == true, "Sadece hasta olanlar erisebilir.");
        _;
    }

    constructor() {
        devlet = msg.sender;
    }

    function eczaneEkle(address _eczaneAdres) external sadeceDevlet {
        eczaneler[_eczaneAdres] = true;
    }

    function doktorEkle(address _doktorAdres) external sadeceDevlet {
        doktorlar[_doktorAdres] = true;
    }
    
    function hastaEkle(address _hastaAdresi, uint256 _ilacId, uint256 _adet) external sadeceDoktor {
        hastalar[_hastaAdresi] = true;
        hasaIlacAdedi[_hastaAdresi][_ilacId] = _adet;
    }

    function ilacEkle(uint256 _ilacId, string memory _ad, string memory _bilgi, uint256 _stokMiktari) external sadeceEczane {
        Ilac storage ilac = ilaclar[_ilacId];

        ilac.ad = _ad;
        ilac.bilgi = _bilgi;
        ilacStok[_ilacId] = _stokMiktari;
    } 

    function ilacAl(uint256 _ilacId, uint256 _adet) external sadeceHastalar {
        require(hasaIlacAdedi[msg.sender][_ilacId] > 0, "Bu ilaci daha once zaten alinmis." );
        require(ilacStok[_ilacId] >= _adet, "Belirtilen miktarda ilac stokta yok." );

        ilacStok[_ilacId] -= _adet;
        hasaIlacAdedi[msg.sender][_ilacId] -= _adet;
    }

    function ilacBilgisi(uint256 _ilacId) external view returns(string memory, string memory, uint256) {
        Ilac memory ilac = ilaclar[_ilacId];

        return (ilac.ad, ilac.bilgi, ilacStok[_ilacId]);
    }
}