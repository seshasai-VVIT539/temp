import * as React from "react";
import {
    createItem,
    getLatestItem,
    updateItem
} from "../../Contracts/Services";
import { IListItem, Keys } from "../../Concerns/IListItem";
import "./Form.scss";
import { SPHttpClient } from '@microsoft/sp-http';
import { Display } from "../Display/Display";
import {
    DatePicker,
    DefaultButton,
    Dialog,
    DialogFooter,
    Dropdown,
    IDropdownOption,
    IDropdownStyles,
    mergeStyleSets,
    PrimaryButton,
    TextField
} from 'office-ui-fabric-react';
import { DialogBox, IDialogBoxProps } from "../DialogBox";

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
    display: boolean,
    dialogProps: IDialogBoxProps,
    dialogVisibility: boolean
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
            display: false,
            dialogProps: undefined,
            dialogVisibility: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.back = this.back.bind(this);
        this.handleIntegerInputChange = this.handleIntegerInputChange.bind(this);
        this.updateItem = this.updateItem.bind(this);
        this.createItem = this.createItem.bind(this);
    }

    handleChange(key: string, value: string | IDropdownOption | Date) {
        let newItem: IListItem = {
            ...this.state.item,
        };
        if (key == "dOB") {
            newItem[key] = (value as Date);
        } else if (typeof value == "string") {
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
        const age = parseInt(value);
        let newItem: IListItem = {
            ...this.state.item,
        };
        if (age) {
            newItem[key] = Number(value);
        }
        this.setState({
            item: newItem,
            display: false
        })

    }

    back() {
        this.props.cancel();
    }

    createItem() {
        createItem(this.state.item, this.props.spHttpClient,
            this.props.siteUrl, this.props.listName)
            .then((response) => {
                // alert(response);
                getLatestItem(this.props.spHttpClient, this.props.siteUrl, this.props.listName)
                    .then((resultedItem) => {
                        this.setState({
                            display: true,
                            dialogProps: undefined,
                            dialogVisibility: false,
                            item: resultedItem
                        })
                    })
            })
    }

    updateItem() {
        updateItem(this.state.item, this.props.spHttpClient,
            this.props.siteUrl, this.props.listName)
            .then((response) => {
                // alert(response);
                getLatestItem(this.props.spHttpClient, this.props.siteUrl, this.props.listName)
                    .then((resultedItem) => {
                        this.setState({
                            display: true,
                            dialogProps: undefined,
                            dialogVisibility: false,
                            item: resultedItem
                        })
                    })
            });
    }

    onSubmit() {

        // this.props.operation == "Create" ?
        //     createItem(this.state.item, this.props.spHttpClient,
        //         this.props.siteUrl, this.props.listName)
        //         .then((response) => {
        //             alert(response);
        //             this.setState({ display: true, dialogProps: undefined, dialogVisibility: false })
        //         })
        //     :
        //     updateItem(this.state.item, this.props.spHttpClient,
        //         this.props.siteUrl, this.props.listName)
        //         .then((response) => {
        //             alert(response);
        //             this.setState({ display: true, dialogProps: undefined, dialogVisibility: false })
        //         });
        if (this.props.operation == "Create") {
            let dialogBoxProps: IDialogBoxProps = {
                title: "Create Item",
                subText: "Are you sure to create item ?",
                ok: this.createItem,
                cancel: this.back
            };
            this.setState({
                dialogProps: dialogBoxProps,
                dialogVisibility: true
            });
        } else {
            let dialogBoxProps: IDialogBoxProps = {
                title: "Update Item",
                subText: "Are you sure to update item ?",
                ok: this.updateItem,
                cancel: this.back
            };
            this.setState({
                dialogProps: dialogBoxProps,
                dialogVisibility: true
            });
        }
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
                                selectedKey={this.state.item.department}
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
                                    this.state.item.age ?
                                        String(this.state.item.age) : ""
                                }
                                value={this.state.item.age ? String(this.state.item.age) : ""}
                                onChange={(event: any) => {
                                    this.handleIntegerInputChange(Keys.Age, event.target.value);
                                }}
                            />
                        </div>
                        <div>
                            <TextField label="Family Income"
                                defaultValue={this.state.item === undefined ? "" :
                                    this.state.item.familyIncome ?
                                        String(this.state.item.familyIncome) : ""
                                }
                                value={this.state.item.familyIncome ?
                                    String(this.state.item.familyIncome) : ""
                                }
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
                                value={this.state.item.dOB}
                                defaultValue={
                                    this.state.item === undefined &&
                                    this.state.item.dOB === undefined &&
                                    this.state.item.dOB.toDateString()
                                }
                                onSelectDate={(selectedDate: Date) => {
                                    this.handleChange(Keys.DOB, selectedDate);
                                }}
                            />
                        </div>
                        <div>
                            <Dropdown
                                placeholder="Is married?"
                                label="Married ?"
                                options={maritalOptions}
                                defaultSelectedKeys={["No"]}
                                selectedKey={this.state.item.married}
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
                {
                    this.state.dialogVisibility &&
                    <DialogBox
                        title={this.state.dialogProps.title}
                        subText={this.state.dialogProps.subText}
                        ok={this.state.dialogProps.ok}
                        cancel={this.state.dialogProps.cancel}
                    />
                }
            </div>
        );
    }
}