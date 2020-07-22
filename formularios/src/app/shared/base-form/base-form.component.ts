import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms'

@Component({
  selector: 'app-base-form',
  template: '<div><div>'
})
export abstract  class BaseFormComponent implements OnInit {

  formulario: FormGroup;

  constructor() { }

  ngOnInit(): void {
  }

  abstract submit();


  onSubmit(){
    if(this.formulario){
      this.submit();
   }else{
    console.log('formulario invalido');
      this.verificaValidacoesForm(this.formulario);
  } 
  }

  verificaValidacoesForm(formGroup: FormGroup | FormArray){
    Object.keys(formGroup.controls).forEach(campo => {
      console.log(campo);
      const controle = formGroup.get(campo);
      controle.markAsDirty();
      controle.markAsTouched();
      if(controle instanceof FormGroup || controle instanceof FormArray){
           this.verificaValidacoesForm(controle)
      }
   })
  }

  resetar(){
    this.formulario.reset();
  }

  verficaValidTouched(campo: string){
    return !this.formulario.get(campo).valid && (this.formulario.get(campo).touched || this.formulario.get(campo).dirty);
  }

  verificaEmailInvalido(){
    let campoEmail = this.formulario.get('email');
    if(campoEmail.errors){
      return campoEmail.errors['email'] && campoEmail.touched;
    }
  }

  aplicaCssErro(campo:string){
    return{
      'has-error': this.verficaValidTouched(campo),
      'has-feedback': this.verficaValidTouched(campo)
    }
  }




}
