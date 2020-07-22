import { Component, OnInit, ɵConsole } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArrayName } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { map, tap, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { CampoControlErroComponent } from '../shared/campo-control-erro/campo-control-erro.component';
import { DropdownService } from './../shared/services/dropdown.service';
import { EstadoBr} from './../shared/models/estado-br'
import { ConsultaCepService } from './../shared/services/consulta-cep.service';
import { Observable, pipe, empty } from 'rxjs';
import { FormValidations } from './../shared/form.validations';
import { VerificaEmailService } from './services/verifica-email.service';
import { BaseFormComponent } from './../shared/base-form/base-form.component';
import { Cidade } from '../shared/models/cidade';

@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.css']
})
export class DataFormComponent extends BaseFormComponent implements OnInit {

  //formulario: FormGroup;
  estados: EstadoBr[];
  //estados: Observable<EstadoBr[]>;
  cidades: Cidade[];
  cargos: any[];
  tecnologias: any[];
  newsletterOp: any[];
  frameworks: ['Angular', 'React', 'Vue', 'Sencha'];

  constructor(private formBuilder: FormBuilder,
    private http: HttpClient,
    private dropdownService: DropdownService,
    private cepService: ConsultaCepService,
    private verficaEmailService: VerificaEmailService ) {
      super();
     }

  ngOnInit(): void {

    //this.verficaEmailService.verificarEmail('email@email.com').subscribe();

    //this.estados = this.dropdownService.getEstadosBr();
    this.dropdownService.getEstadosBr().subscribe(dados => this.estados = dados)

    this.cargos = this.dropdownService.getCargos();

    this.tecnologias = this.dropdownService.getTecnologias();

    this.newsletterOp = this.dropdownService.getNewsletter();

    /*
    this.dropdownService. getEstadosBr() 
    .subscribe((dados: EstadoBr[]) => {
      this.estados = dados;console.log(dados);
    });
     */

    this.formulario = this.formBuilder.group({
      nome:[null, [Validators.required, Validators.minLength(3)]],
      email:[null, [Validators.required, Validators.email], this.validarEmail.bind(this)],
      confirmarEmail:[null, [FormValidations.equalsTo('email')]],

      endereco : this.formBuilder.group({
        cep:[null, [Validators.required, FormValidations.cepValidator]],
        numero:[null, Validators.required],
        complemento:[null],
        rua:[null, Validators.required],
        bairro:[null, Validators.required],
        cidade:[null,Validators.required],
        estado:[null, Validators.required]
      }),
      
      cargo:[null],
      tecnologias:[null],
      newsletter:['s'],
      termos:[null,Validators.pattern('true')],
    
    });

    this.formulario.get('endereco.cep').statusChanges
    .pipe(
      distinctUntilChanged(),
      tap(value => console.log('status CEP:', value)),
      switchMap(status => status === 'VALID' ? 
      this.cepService.consultaCEP(this.formulario.get('endereco.cep').value)
      : empty())
    )
    .subscribe(dados => dados ? this.populaDadosForm(dados) : {});

    this.formulario.get('endereco.estado').valueChanges
    .pipe(
      tap(estado => console.log('Novo estado:', estado)),
      map(estado => this.estados.filter(e => e.sigla === estado)),
      map(estados => estados && estados.length > 0 ? estados[0].id : empty()),
      switchMap((estadoId: number )=> this.dropdownService.getCidades(estadoId)),
      tap(console.log)
    )
    .subscribe(cidades => this.cidades = cidades);

    //this.dropdownService.getCidades(8).subscribe(console.log);
  }

 submit(){
  console.log(this.formulario.value);

  let valueSubmit = Object.assign({}, this.formulario.value)

  if(this.formulario.valid){
    this.http.post('https://httpbin.org/post' , JSON.stringify(valueSubmit))
    .pipe(map(res => res))
    .subscribe(dados => {console.log(dados);
    //Reseta o formulario
    //this.formulario.reset();
    this.resetar();
},
(error: any) => alert('erro'));
  }else{
    console.log('formulario invalido');
      this.verificaValidacoesForm(this.formulario);
  } 
 }

  consultaCEP(){

    const cep = this.formulario.get('endereco.cep').value;

    if(cep != null && cep !== ''){
       this.cepService.consultaCEP(cep)
       .subscribe(dados => this.populaDadosForm(dados))

    }    
  }

 populaDadosForm(dados){
  this.formulario.patchValue({
    endereco: {
      rua: dados.logradouro ,
      complemento: dados.complemento,
      bairro: dados.bairro,
      cidade: dados.localidade ,
      estado: dados.uf
  }
})
 }

 resetaDadosForm(){
  this.formulario.patchValue({
    endereco: {
      rua: null ,
      complemento: null,
      bairro: null,
      cidade: null ,
      estado: null
  }
})
}

setarCargo(){
      
  const cargo = {nome: 'Dev', nivel: 'Pleno', desc:'Dev Pl'}
      
   this.formulario.get('cargo').setValue(cargo);
}

compararCargos(obj1, obj2){
  return obj1 && obj2 ? (obj1.nome === obj2.nome && obj1.nivel === obj2.nivel) : obj1 === obj2;
}

setarTecnologias(){
  this.formulario.get('tecnologias').setValue(['java', 'javascript', 'php'])
}

validarEmail(formControl: FormControl){
    return this.verficaEmailService.verificarEmail(formControl.value)
    .pipe(map(emailExiste => emailExiste ? {emailInvalido: true} : null));
}

}
