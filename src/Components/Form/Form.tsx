import * as React from "react";
import {
    createItem,
    updateItem
} from "../../Contracts/Services";
import { IListItem, Keys } from "../../Concerns/IListItem";
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



const dropdownStyles: Partial<IDropdownStyles> = {
    dropdown: { width: 300 },
};
const controlClass = mergeStyleSets({
    control: {
        margin: '0 0 15px 0',
        maxWidth: '300px',
    }
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
                    id: undefined,
                    certifications: undefined,
                    lastName: undefined,
                    department: undefined,
                    age: undefined,
                    familyIncome: undefined,
                    dOB: undefined,
                    married: "No",
                    linkedIn: undefined,
                    photo: undefined
                },
            display: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.back = this.back.bind(this);
        this.handleIntegerInputChange = this.handleIntegerInputChange.bind(this);
    }

    handleChange(key: string, value: string | IDropdownOption) {
        let newItem: IListItem = {
            ...this.state.item,
        };
        if (typeof value == "string") {
            newItem[key] = value;
        } else {
            newItem[key] = (value as IDropdownOption).text;
        }
        this.setState({
            item: newItem,
            display: false
        })
    }

    handleIntegerInputChange(key: string, value: string) {
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
                                onChange={(event: any, selectedOption: IDropdownOption) => {
                                    this.handleChange(Keys.Department, selectedOption);
                                }}
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
                                    this.state.item.familyIncome === undefined ? "" :
                                        String(this.state.item.familyIncome)}
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
                                    this.state.item.dOB === undefined &&
                                    this.state.item.dOB.toDateString()
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
                                    this.state.item === undefined ? '' :
                                        this.state.item.married === undefined ? "" :
                                            maritalOptions[0].key === this.state.item.married ?
                                                maritalOptions[0].text : maritalOptions[1].text
                                }
                                onChange={(event: any, selectedOption: IDropdownOption) => {
                                    this.handleChange(Keys.Married, selectedOption);
                                }}
                                styles={dropdownStyles}
                            />
                        </div>
                        <div>
                            <TextField label="Linkedin Profile"
                                placeholder="Enter a URL"
                                defaultValue={this.state.item === undefined ? "" :
                                    this.state.item.linkedIn === undefined ? "" :
                                        this.state.item.linkedIn}
                                onChange={(event: any) => {
                                    this.handleChange(Keys.LinkedIn, event.target.value);
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
                        <br />
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