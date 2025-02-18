import {Injectable} from '@angular/core';
import {FormGroup, ValidationErrors} from '@angular/forms';


@Injectable({
  providedIn: 'root',
})
export class ValidatorService {


  public isNotValidField(form: FormGroup, field: string) {
    return form.controls[field].getError('required') && form.controls[field].touched;
  }

  public hasMaxError(form: FormGroup, field: string) {
    return form.controls[field].getError('max')
  }

  public isCostoFewerPrecio(field1: string, field2: string) {

    return (form: FormGroup): ValidationErrors | null => {
      const precio = form.get(field1)?.value;
      const costo = form.get(field2)?.value;
      if(costo > precio) {
        form.get(field2)?.setErrors({isHigher: true})
        return {isHigher: true};
      }
      if(!costo){
        form.get(field2)?.setErrors({isNull: true})
        return {isNull: true};
      }


      form.get(field2)?.setErrors(null)
      return null;
    }
  }


}
