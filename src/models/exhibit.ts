export class Exhibit {
    exhibit_id: number;
    po_full_name: string;
    po_ic_no: string;
    acceptance: string;    

    constructor();
    constructor(exhibit_id: number, po_full_name: string, po_ic_no: string, acceptance: string)
    constructor(exhibit_id?: number, po_full_name?: string, po_ic_no?: string, acceptance?: string){
        this.exhibit_id = exhibit_id;
        this.po_full_name = po_full_name;
        this.po_ic_no = po_ic_no;
        this.acceptance = acceptance;
    }
}