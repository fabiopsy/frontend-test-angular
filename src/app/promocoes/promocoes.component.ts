import { Component, OnInit } from '@angular/core';
import { Promocoes } from './formulario/formulario-interface';

import { registerLocaleData } from '@angular/common';
import localePT from '@angular/common/locales/pt';
registerLocaleData(localePT);


@Component({
  selector: 'app-promocoes',
  templateUrl: './promocoes.component.html',
  styleUrls: ['./promocoes.component.css']
})

export class PromocoesComponent implements OnInit {

  blnToggleForm: boolean = true;
  promocoes: Promocoes[];
  promocaoId: string = null;
  ordemFiltro: boolean = false;
  colunaFiltro: boolean = false;

  constructor() { }

  ngOnInit() {
    this.ListaProdutos();
  }

  ListaProdutos(): void {
    if (localStorage.getItem("DB")) {
      this.promocoes = JSON.parse(localStorage.getItem('DB'));
    } else {
      this.promocoes = [];
    }
  }


  onClickEditar(promocaoId: string): void {
    this.promocaoId = promocaoId;
    this.blnToggleForm = !this.blnToggleForm;
  }

  onClickExcluir(id: string): void {
    const i: number = this.promocoes.findIndex((p) => p.id === id);
    this.promocoes[i] = null;

    this.promocoes.splice(i, 1);
    localStorage.setItem('DB', JSON.stringify(this.promocoes));

    this.ListaProdutos();
  }

  toggleForm() {
    this.blnToggleForm = !this.blnToggleForm;
    this.promocaoId = null;
    this.ListaProdutos();
  }

  verificaData(dataFinalTemp: Date) {
    let hoje: Date = new Date();
    let dataFinal: Date = new Date(dataFinalTemp);
    return (dataFinal.getTime() < hoje.getTime()) ? true : false;
  }


}
