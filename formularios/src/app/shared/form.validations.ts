import { FormControl, FormArray, FormGroup} from '@angular/forms';

export class FormValidations {
    static cepValidator(control: FormControl ){

        const cep = control.value;
        if(cep && cep !== ''){
            var validacep = /^[0-9]{8}/;
            return validacep.test(cep) ? null : {cepInvalido : true};      
        }

        return null;
    }

    static equalsTo(otherfield: string){
       const validator = (formControl: FormControl) => {
           if(otherfield == null){
               throw new  Error('É necessário informar um campo.')
           }
           
           if(!formControl.root || !(<FormGroup>formControl.root).controls){
                return null;
           }

           const field = (<FormGroup>formControl.root).get(otherfield);

           if(!field){
            throw new  Error('É necessário informar um campo válido.')
           }

           if(field.value !== formControl.value){
               return { equalsTo : otherfield }
           }
           return null;
       };
       return validator;
    }

    static getErrorMsg(fieldName: string, validatorName: string, validatorValue?: any){
        const config = {
           'required': `${fieldName} é obrigatório`,
           'minlength' : `${fieldName} precisa ter no minimo ${validatorValue.requiredLength} caracteres.`,
           'cepInvalido': 'CEP inválido'
        };
        return config[validatorName];
    }

}