export interface IListItem {
    ID: number | undefined;
    title: string | undefined;
    lastName: string | undefined;
    certifications: string | undefined;
    department: string | undefined;
    age: number;
    FamilyIncome: number;
    DOB: Date;
    Married: "Yes" | "No";
    LinkedIn: string;
    Photo: File;
}