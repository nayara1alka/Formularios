import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators'
import { of } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class ConsultaCepService {

  constructor(private http: HttpClient) { }

  consultaCEP(cep: string){
    // nova variavel cep somente com digitos
    cep = cep.replace(/\D/g, '');

    //verifica se o campo de cep possui valor informado
    if(cep != " "){
      //expressao regular pra validar cep
      var validacep = /^[0-9]{8}/;

      //valida o formato do cep
      if(validacep.test(cep)){
        return this.http.get(`//viacep.com.br/ws/${cep}/json`)
        .pipe(map(dados => dados))
      }
    }

    return of({});
    
  }
}
