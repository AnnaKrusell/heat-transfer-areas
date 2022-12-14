import { Injectable } from '@angular/core';
import { ComunicaService } from 'src/app/3rdparty/comunica/comunica.service';
import { lastValueFrom } from 'rxjs';
import { Properties } from '../models';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root',
})
export class ElementsService {
  public queryResult?: any;
  public queryComplete: boolean = false;

  constructor(
    private _comunica: ComunicaService,
  ) {}

 
  async getProps(ifcTypeName: any): Promise<Properties[]> {
    const query = `PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX ex: <https://example.com/>
    PREFIX ifc: <http://ifcowl.openbimstandards.org/IFC2X3_Final#>
    SELECT DISTINCT ?inst ?p ?o
    WHERE { 
        ?inst a ifc:${ifcTypeName} .
        ?inst ?p ?o .
    }`;

    const spaces = await lastValueFrom(this._comunica.selectQuery(query));
    return spaces.map((item: any) => {
      const instanceWithURI = item.inst.value;
      const propertyWithURI = item.p.value;
      const value = item.o.value;

      var instance = instanceWithURI.split('/').pop();
      var property = propertyWithURI.split('/').pop();

      return { instance, property, value, ifcTypeName };
    });
  }
}
