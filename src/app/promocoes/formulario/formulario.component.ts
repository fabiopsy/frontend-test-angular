import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Guid } from 'guid-typescript';
import { Promocoes } from './formulario-interface';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css'],
  providers: [DatePipe]
})
export class FormularioComponent implements OnInit {

  @Input()
  promocaoId?: string;

  @Output() fechaFormulario: EventEmitter<any> = new EventEmitter<any>();

  formulario: FormGroup;
  maxLengthDescricao: number = 100;
  promocoes: Promocoes[];
  maskDatas = 'd0/M0/0000';

  exibeErroPreco: boolean = false;
  exibeErroData: boolean = false;
  exibeErroRetroativa: boolean = false;

  constructor(private formBuilder: FormBuilder, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.formulario = this.formBuilder.group({
      gtin: [null, [Validators.required, Validators.maxLength(14)]],
      descricao: [null, [Validators.required, Validators.maxLength(100)]],
      categoria: [0, [Validators.required, Validators.min(1)]],
      precoRegular: [null, Validators.required],
      precoPromocional: [null, Validators.required],
      dataInicial: [null, [Validators.required, Validators.minLength(8)]],
      dataFinal: [null, [Validators.required, Validators.minLength(8)]],
    });
  }

  async ngAfterContentInit() {
    this.inicializaPromocoes();
  }


  inicializaPromocoes(): void {
    if (localStorage.getItem("DB")) {
      this.promocoes = JSON.parse(localStorage.getItem('DB'));

      if (this.promocaoId != null) {
        const i: number = this.promocoes.findIndex((p) => p.id === this.promocaoId);

        this.promocoes[i].dataInicial = this.datePipe.transform(this.promocoes[i].dataInicial, 'dd/MM/yyyy', 'pt-BR');
        this.promocoes[i].dataFinal = this.datePipe.transform(this.promocoes[i].dataFinal, 'dd/MM/yyyy', 'pt-BR');

        this.formulario.patchValue(this.promocoes[i]);
      }
    } else {
      this.promocoes = [];
    }
  }

  voltar() {
    this.fechaFormulario.emit();
    this.formulario.reset();
  }

  verificaInvalidTouched(campo) {
    return !this.formulario.get(campo).valid && this.formulario.get(campo).touched;
  }
  verificaValidTouched(campo) {
    return this.formulario.get(campo).valid && this.formulario.get(campo).touched;
  }

  aplicaCssErro(campo) {
    return {
      'is-invalid': this.verificaInvalidTouched(campo),
      'is-valid': this.verificaValidTouched(campo)
    }
  }

  onSavePromocao(): void {
    if (this.formulario.valid) {
      this.formulario.value.id = Guid.create().toString();

      const promocao: Promocoes = this.formulario.value;

      let hoje: Date = new Date();

      let tempDataInicial = promocao.dataInicial.toString().replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$2/$1/$3")
      promocao.dataInicial = new Date(this.datePipe.transform(tempDataInicial, 'MM-dd-yyyy', 'pt-BR'));

      let tempDataFinal = promocao.dataFinal.toString().replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$2/$1/$3")
      promocao.dataFinal = new Date(this.datePipe.transform(tempDataFinal, 'MM-dd-yyyy', 'pt-BR'));

      (this.formulario.value.precoPromocional > this.formulario.value.precoRegular) ? this.exibeErroPreco = true : this.exibeErroPreco = false;
      (promocao.dataFinal.getTime() < promocao.dataInicial.getTime()) ? this.exibeErroData = true : this.exibeErroData = false;
      (promocao.dataFinal.getTime() < hoje.getTime()) ? this.exibeErroRetroativa = true : this.exibeErroRetroativa = false;

      if (this.exibeErroData === false && this.exibeErroPreco === false && this.exibeErroRetroativa === false) {

        if (this.promocaoId != null) {
          const i: number = this.promocoes.findIndex((p) => p.id === this.promocaoId);
          this.promocoes[i].gtin = promocao.gtin;
          this.promocoes[i].descricao = promocao.descricao;
          this.promocoes[i].categoria = promocao.categoria;
          this.promocoes[i].precoRegular = promocao.precoRegular;
          this.promocoes[i].precoPromocional = promocao.precoPromocional;
          this.promocoes[i].dataInicial = promocao.dataInicial;
          this.promocoes[i].dataFinal = promocao.dataFinal;
        } else {
          this.promocoes.push(promocao);
        }
        localStorage.setItem('DB', JSON.stringify(this.promocoes));
        this.voltar();

      }

    } else {
      Object.keys(this.formulario.controls).forEach(campo => {
        const controle = this.formulario.get(campo);
        controle.markAsTouched();
      });
    }
  }

}
