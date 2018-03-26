export class Exhibit {
    exhibit_id: number;
    po_full_name: string;
    po_ic_no: string;
    acceptance: string;    
    floor_plan_path: string;
    floor_plan_URI: string;
    premise_location_path: string;
    premise_location_URI: string;


    constructor();
    constructor(exhibit_id: number, po_full_name: string, po_ic_no: string, acceptance: string,
        floor_plan_path: string, floor_plan_URI: string, premise_location_path: string, premise_location_URI: string)
    
    constructor(exhibit_id?: number, po_full_name?: string, po_ic_no?: string, acceptance?: string,
        floor_plan_path?: string, floor_plan_URI?: string, premise_location_path?: string, premise_location_URI?: string){
        
        this.exhibit_id             = exhibit_id;
        this.po_full_name           = po_full_name;
        this.po_ic_no               = po_ic_no;
        this.acceptance             = acceptance;
        this.floor_plan_path        = floor_plan_path;
        this.floor_plan_URI         = floor_plan_URI;
        this.premise_location_path  = premise_location_path;
        this.premise_location_URI   = premise_location_URI;
    }
}