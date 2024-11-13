import { Injectable } from '@angular/core';
import { MetamaskService } from './metamask.service';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import * as NFTContractABI from '../../Contracts/CISI.json';

@Injectable({
  providedIn: 'root'
})
export class NFTContractService {
  private web3: Web3;
  private contract: any;
  private readonly CONTRACT_ADDRESS = 'TU_DIRECCIÓN_DEL_CONTRATO'; // Reemplaza con la dirección real

  constructor(private metamaskService: MetamaskService) {
    if (window.ethereum) {
      this.web3 = new Web3(window.ethereum as any);
      this.contract = new this.web3.eth.Contract(
        NFTContractABI as AbiItem[],
        this.CONTRACT_ADDRESS
      );
    }
  }

  // Crear un nuevo NFT
  async createNFT(price: number) {
    const account = await this.metamaskService.getAccount();
    const priceWei = this.web3.utils.toWei(price.toString(), 'ether');
    
    return this.contract.methods.createNFT(priceWei).send({
      from: account
    });
  }

  // Listar NFT para venta
  async listNFTForSale(nftId: number, price: number) {
    const account = await this.metamaskService.getAccount();
    const priceWei = this.web3.utils.toWei(price.toString(), 'ether');
    
    return this.contract.methods.listNFTForSale(nftId, priceWei).send({
      from: account
    });
  }

  // Retirar NFT de la venta
  async withdrawNFTFromSale(nftId: number) {
    const account = await this.metamaskService.getAccount();
    
    return this.contract.methods.withdrawNFTFromSale(nftId).send({
      from: account
    });
  }

  // Comprar un NFT
  async purchaseNFT(nftId: number, price: number) {
    const account = await this.metamaskService.getAccount();
    const priceWei = this.web3.utils.toWei(price.toString(), 'ether');
    
    return this.contract.methods.purchaseNFT(nftId).send({
      from: account,
      value: priceWei
    });
  }

  // Retirar fondos
  async withdrawFunds() {
    const account = await this.metamaskService.getAccount();
    
    return this.contract.methods.withdrawFunds().send({
      from: account
    });
  }

  // Obtener NFTs de un usuario
  async getUserNFTs(address: string) {
    return this.contract.methods.getUserNFTs(address).call();
  }

  // Obtener detalles de un NFT
  async getNFTDetails(nftId: number) {
    return this.contract.methods.nfts(nftId).call();
  }

  // Obtener balance de un usuario
  async getBalance(address: string) {
    return this.contract.methods.balances(address).call();
  }
}
