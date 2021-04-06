import * as React from "react";
import {
    createItem,
    updateItem
} from "../../Services/Services";
import { IListItem } from "../../Concerns/IListItem";
import "./Form.scss";
import { SPHttpClient } from '@microsoft/sp-http';
import { Display } from "../Display/Display";
import {
    DatePicker,
    Dropdown,
    IDropdownOption,
    IDropdownStyles,
    mergeStyleSets,
    PrimaryButton,
    TextField
} from 'office-ui-fabric-react';

interface IFormProps {
    item: IListItem | undefined,
    operation: string,
    cancel: () => void,
    spHttpClient: SPHttpClient,
    siteUrl: string,
    listName: string
}
interface IFormState {
    item: IListItem,
    display: boolean
}

enum Keys {
    Title = "Title",
    LastName = "LastName",
    Certifications = "Certifications",
    Department = "Department",
    Age = "Age",
    FamilyIncome = "FamilyIncome",
    DOB = "DOB",
    Married = "Married",
    LinkedIn = "LinkedIn",
    Photo = "Photo"
}

const dropdownStyles: Partial<IDropdownStyles> = {
    dropdown: { width: 300 },
};
const controlClass = mergeStyleSets({
    control: {
        margin: '0 0 15px 0',
        maxWidth: '300px',
    },
});


const deptOptions: IDropdownOption[] = [
    { key: 'Intern', text: 'Intern' },
    { key: 'HR', text: 'HR' },
    { key: 'Finance', text: 'Finance' },
    { key: 'Junior Developer', text: 'Junior Developer' },
];
const maritalOptions: IDropdownOption[] = [
    { key: 'Yes', text: 'Yes' },
    { key: 'No', text: 'No' }
];



export class Form extends React.Component<IFormProps, IFormState> {
    constructor(props: IFormProps) {
        super(props);
        this.state = {
            item: this.props.item !== undefined ? this.props.item :
                {
                    title: undefined,
                    ID: undefined,
                    certifications: undefined,
                    lastName: undefined,
                    department: undefined,
                    age: undefined,
                    FamilyIncome: undefined,
                    DOB: undefined,
                    Married: "No",
                    LinkedIn: undefined,
                    Photo: undefined
                },
            display: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.back = this.back.bind(this);
        this.handleIntegerInputChange = this.handleIntegerInputChange.bind(this);
    }

    handleChange(key: Keys, value: string) {
        let newItem: IListItem = {
            ...this.state.item,
        };
        newItem[key] = (value as any);
        this.setState({
            item: newItem,
            display: false
        })
    }

    handleIntegerInputChange(key: Keys, value: string) {
        const onlyNums = value.replace(/[^0-9]/g, '');
        const age = Number(value);
        let newItem: IListItem = {
            ...this.state.item,
        };
        newItem[key] = Number(value);
        this.setState({
            item: newItem,
            display: false
        })

    }

    back() {
        this.props.cancel();
    }

    onSubmit() {
        this.props.operation == "Create" ?

            createItem(this.state.item, this.props.spHttpClient,
                this.props.siteUrl, this.props.listName)
                .then((response) => {
                    alert(response);
                    this.setState({ display: true })
                })
            :

            updateItem(this.state.item, this.props.spHttpClient,
                this.props.siteUrl, this.props.listName)
                .then((response) => {
                    alert(response);
                    this.setState({ display: true })
                });

    }

    render() {
        return (
            <div>
                {!this.state.display &&
                    <div className="ms-Grid">
                        {/* {this.props.item !== undefined &&
                            <div className="ms-Grid-row">
                                <Label>ID : {this.props.item === undefined ? "" : this.props.item.ID}</Label>
                                <div className="cell">
                                    ID
                        </div>
                                <div className="cell">
                                    {this.props.item === undefined ? "" : this.props.item.ID}
                                </div>
                            </div>
                        } */}
                        <div>
                            <TextField label="Name"
                                defaultValue={this.state.item === undefined ? "" :
                                    this.state.item.title === undefined ? "" :
                                        this.state.item.title}
                                onChange={(event: any) => {
                                    this.handleChange(Keys.Title, event.target.value);
                                }}
                            />
                        </div>
                        <div>
                            <TextField label="Last Name"
                                defaultValue={this.state.item === undefined ? "" :
                                    this.state.item.lastName === undefined ? "" :
                                        this.state.item.lastName}
                                onChange={(event: any) => {
                                    this.handleChange(Keys.LastName, event.target.value);
                                }}
                            />
                        </div>
                        <div>
                            <TextField label="Certifications"
                                multiline rows={3}
                                defaultValue={
                                    this.state.item === undefined ? "" :
                                        this.state.item.certifications === undefined ? "" :
                                            this.state.item.certifications
                                }
                                onChange={(event: any) => {
                                    this.handleChange(Keys.Certifications, event.target.value);
                                }}
                            />
                        </div>
                        <div>
                            <Dropdown
                                placeholder="Select Department"
                                label="Department"
                                options={deptOptions}
                                styles={dropdownStyles}
                            />
                        </div>
                        <div>
                            <TextField label="Age"
                                defaultValue={this.state.item === undefined ? "" :
                                    this.state.item.age === undefined ? "" :
                                        String(this.state.item.age)}
                                onChange={(event: any) => {
                                    this.handleIntegerInputChange(Keys.Age, event.target.value);
                                }}
                            />
                        </div>
                        <div>
                            <TextField label="Family Income"
                                defaultValue={this.state.item === undefined ? "" :
                                    this.state.item.FamilyIncome === undefined ? "" :
                                        String(this.state.item.FamilyIncome)}
                                onChange={(event: any) => {
                                    this.handleIntegerInputChange(Keys.FamilyIncome, event.target.value);
                                }}
                            />
                        </div>
                        <div>
                            <DatePicker
                                className={controlClass.control}
                                placeholder="Select Date of Birth"
                                label="Date of Birth"
                                ariaLabel="Date of Birth"
                                defaultValue={
                                    this.state.item === undefined &&
                                    this.state.item.DOB === undefined &&
                                    this.state.item.DOB.toDateString()
                                }
                                onChange={(event: any) => {
                                    this.handleChange(Keys.DOB, event.target.value);
                                }}
                            />
                        </div>
                        <div>
                            <Dropdown
                                placeholder="Is married?"
                                label="Married ?"
                                options={maritalOptions}
                                defaultValue={
                                    this.state.item === undefined ? 'No' :
                                        this.state.item.Married === undefined ? "" :
                                            this.state.item.Married
                                }
                                styles={dropdownStyles}
                            />
                        </div>
                        <div>
                            <TextField label="Linkedin Profile"
                                placeholder="Enter a URL"
                                defaultValue={this.state.item === undefined ? "" :
                                    this.state.item.LinkedIn === undefined ? "" :
                                        this.state.item.LinkedIn}
                                onChange={(event: any) => {
                                    this.handleIntegerInputChange(Keys.LinkedIn, event.target.value);
                                }}
                            />
                        </div>
                        <br />
                        <div>
                            <PrimaryButton
                                text={this.props.operation}
                                onClick={this.onSubmit}
                            />
                            <PrimaryButton
                                text="Cancel"
                                onClick={this.back}
                            />
                        </div>
                        <br/>
                    </div>
                }
                {
                    this.state.display &&
                    <Display item={this.state.item}
                        back={this.back}
                    />
                }
            </div>
        );
    }
}