export class ExhibitItem {
    exhibit_item_id: number;
    exhibit_id: number;
    code: string;
    type: string;
    s3_path: string;
    local_path: string;
    fileName: string;

    constructor();
    constructor(exhibit_item_id: number, exhibit_id: number, code: string, type: string, s3_path: string, local_path: string, fileName: string)
    constructor(exhibit_item_id?: number, exhibit_id?: number, code?: string, type?: string, s3_path?: string, local_path?: string, fileName?: string){
        
        this.exhibit_item_id    = exhibit_item_id;
        this.exhibit_id         = exhibit_id;
        this.code               = code;
        this.type               = type;
        this.s3_path            = s3_path;
        this.local_path         = local_path
        this.fileName           = fileName;
    }
}