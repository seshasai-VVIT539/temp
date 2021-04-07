export interface IListItem {
    id: number | undefined;
    title: string | undefined;
    lastName: string | undefined;
    certifications: string | undefined;
    department: string | undefined;
    age: number;
    familyIncome: number;
    dOB: Date;
    married: "Yes" | "No";
    linkedIn: string;
    photo: File;
}

export enum Keys {
    ID = "id",
    Title = "title",
    LastName = "lastName",
    Certifications = "certifications",
    Department = "department",
    Age = "age",
    FamilyIncome = "familyIncome",
    DOB = "dOB",
    Married = "married",
    LinkedIn = "linkedIn",
    Photo = "photo"
}