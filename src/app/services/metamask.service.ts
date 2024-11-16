import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import Web3 from 'web3';
import type { MetaMaskInpageProvider } from '@metamask/providers';

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}

@Injectable({
  providedIn: 'root'
})
export class MetamaskService {
  private web3: Web3;
  private account = new BehaviorSubject<string | null>(null);
  public account$ = this.account.asObservable();

  constructor() {
    if (window.ethereum) {
      this.web3 = new Web3(window.ethereum as any);
      this.setupEventListeners();
    }
  }

  async getAccount(): Promise<string | null> {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask no está instalado');
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      }) as string[];

      if (accounts.length > 0) {
        this.account.next(accounts[0]);
        return accounts[0];
      }

      return null;
    } catch (error) {
      console.error('Error al obtener la cuenta:', error);
      throw error;
    }
  }

  private setupEventListeners() {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        this.account.next(accounts[0] || null);
      });

      window.ethereum.on('chainChanged', (_chainId: string) => {
        window.location.reload();
      });
    }
  }

  async connectWallet(): Promise<string | null> {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask no está instalado');
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      }) as string[];

      if (accounts.length > 0) {
        this.account.next(accounts[0]);
        return accounts[0];
      }

      return null;
    } catch (error) {
      console.error('Error al conectar con MetaMask:', error);
      throw error;
    }
  }

  async getBalance(address: string): Promise<string> {
    try {
      const balance = await this.web3.eth.getBalance(address);
      return Web3.utils.fromWei(balance, 'ether');
    } catch (error) {
      console.error('Error al obtener el balance:', error);
      throw error;
    }
  }

  async sendTransaction(to: string, amount: string): Promise<string> {
    try {
      const fromAddress = this.account.getValue();
      if (!fromAddress) throw new Error('No hay cuenta conectada');

      const amountInWei = Web3.utils.toWei(amount, 'ether');
      
      const transaction = await window.ethereum?.request({
        method: 'eth_sendTransaction',
        params: [{
          from: fromAddress,
          to: to,
          value: Web3.utils.toHex(amountInWei)
        }]
      });

      return transaction as string;
    } catch (error) {
      console.error('Error al enviar la transacción:', error);
      throw error;
    }
  }
}