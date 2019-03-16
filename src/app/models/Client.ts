export interface Client {
	$key? : string;
	firstName? : string;
	lastName? : string;
	email? : string;
	password? : string;
	phone? : string;	
	fieldArray: Array<any>;
	SuperUserEmail?: string;
	SuperUserPassword?: string;
}
