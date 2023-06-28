import {NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PromocoesComponent } from './promocoes.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormularioComponent } from './formulario/formulario.component';
import { CurrencyMaskConfig, CurrencyMaskModule, CURRENCY_MASK_CONFIG } from 'ng2-currency-mask';
import { FiltraPromocoesPipe } from './filtra-promocoes.pipe';
import { NgxMaskModule } from 'ngx-mask';
import { SobreComponent } from './sobre/sobre.component';

export const CustomCurrencyMaskConfig: CurrencyMaskConfig = {
  align: "left",
  allowNegative: false,
  decimal: ",",
  precision: 2,
  prefix: "R$ ",
  suffix: "",
  thousands: "."
};

@NgModule({
  declarations: [
    PromocoesComponent,
    FormularioComponent,
    FiltraPromocoesPipe,
    SobreComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CurrencyMaskModule,
    NgxMaskModule.forRoot()
  ],
  exports: [
    PromocoesComponent
  ],
  providers:[
    { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig }
   ]
})
export class PromocoesModule { }
